import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { MarkdownRenderer } from '@/components/ui/markdown-renderer';
import { supabase } from '@/integrations/supabase/client';
import { createJob, updateJob, createArtifact, logEvent } from '@/lib/database';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, Loader2, CheckCircle2, XCircle, 
  Copy, Download, Sparkles, FileCode, FolderTree,
  Package, Terminal, Rocket, Play, ChevronRight,
  File, Folder, Eye, Code2, ExternalLink
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type ProjectType = 'react' | 'nextjs' | 'express' | 'fullstack' | 'mobile' | 'saas' | 'ecommerce' | 'gpt';

interface GeneratedFile {
  path: string;
  content: string;
  language: string;
}

const PROJECT_TYPES: { value: ProjectType; label: string; description: string; icon: React.ReactNode }[] = [
  { value: 'react', label: 'React Web App', description: 'Vite + React + TypeScript + Tailwind', icon: <Code2 className="w-4 h-4" /> },
  { value: 'nextjs', label: 'Next.js Full-Stack', description: 'Next.js 14 + App Router + API Routes', icon: <FileCode className="w-4 h-4" /> },
  { value: 'express', label: 'Backend API', description: 'Express + TypeScript + Prisma', icon: <Terminal className="w-4 h-4" /> },
  { value: 'fullstack', label: 'Full-Stack App', description: 'React Frontend + Express Backend', icon: <Package className="w-4 h-4" /> },
  { value: 'mobile', label: 'Mobile App', description: 'React Native / Capacitor', icon: <Rocket className="w-4 h-4" /> },
  { value: 'saas', label: 'SaaS Platform', description: 'Complete SaaS with auth, billing, dashboard', icon: <Sparkles className="w-4 h-4" /> },
  { value: 'ecommerce', label: 'E-Commerce', description: 'Shop with cart, checkout, payments', icon: <Package className="w-4 h-4" /> },
  { value: 'gpt', label: 'Custom GPT/AI', description: 'AI-powered application with chat', icon: <Sparkles className="w-4 h-4" /> },
];

const STATUS_MESSAGES = [
  'Initializing code generator...',
  'Analyzing requirements...',
  'Designing architecture...',
  'Generating components...',
  'Building database schema...',
  'Creating API endpoints...',
  'Adding styling and UI...',
  'Configuring deployment...',
  'Finalizing code...',
];

function getLanguageFromPath(path: string): string {
  const ext = path.split('.').pop()?.toLowerCase();
  const langMap: Record<string, string> = {
    ts: 'typescript',
    tsx: 'typescript',
    js: 'javascript',
    jsx: 'javascript',
    json: 'json',
    css: 'css',
    scss: 'scss',
    html: 'html',
    md: 'markdown',
    yml: 'yaml',
    yaml: 'yaml',
    sql: 'sql',
    prisma: 'prisma',
    env: 'bash',
    sh: 'bash',
    dockerfile: 'dockerfile',
  };
  return langMap[ext || ''] || 'text';
}

function buildFileTree(files: Record<string, string>): { name: string; path: string; isFolder: boolean; children?: any[] }[] {
  const tree: any = {};
  
  Object.keys(files).forEach(path => {
    const parts = path.split('/');
    let current = tree;
    
    parts.forEach((part, index) => {
      if (!current[part]) {
        current[part] = index === parts.length - 1 ? null : {};
      }
      if (index < parts.length - 1) {
        current = current[part];
      }
    });
  });
  
  function buildNodes(obj: any, basePath = ''): any[] {
    return Object.keys(obj).map(key => {
      const path = basePath ? `${basePath}/${key}` : key;
      const isFolder = obj[key] !== null;
      return {
        name: key,
        path,
        isFolder,
        children: isFolder ? buildNodes(obj[key], path) : undefined,
      };
    }).sort((a, b) => {
      if (a.isFolder && !b.isFolder) return -1;
      if (!a.isFolder && b.isFolder) return 1;
      return a.name.localeCompare(b.name);
    });
  }
  
  return buildNodes(tree);
}

export function CodeGenerator() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [step, setStep] = useState<'input' | 'processing' | 'results'>('input');
  const [prompt, setPrompt] = useState('');
  const [projectName, setProjectName] = useState('');
  const [projectType, setProjectType] = useState<ProjectType>('react');
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  const [generatedFiles, setGeneratedFiles] = useState<Record<string, string>>({});
  const [rawOutput, setRawOutput] = useState('');
  const [deploymentInstructions, setDeploymentInstructions] = useState('');
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'files' | 'preview' | 'deploy'>('files');
  
  const statusIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (statusIntervalRef.current) {
        clearInterval(statusIntervalRef.current);
      }
    };
  }, []);

  const handleGenerate = async () => {
    if (!user) {
      toast({ title: 'Sign in required', variant: 'destructive' });
      return;
    }

    if (!prompt.trim()) {
      toast({ title: 'Please describe your project', variant: 'destructive' });
      return;
    }

    setStep('processing');
    setProgress(0);
    setError(null);
    setGeneratedFiles({});
    setRawOutput('');

    // Create job record
    let jobId: string | null = null;
    try {
      const job = await createJob('app-generator', { prompt, projectType, projectName });
      jobId = job.id;
      await updateJob(job.id, { status: 'running', started_at: new Date().toISOString() });
    } catch (err) {
      console.error('Failed to create job:', err);
    }

    // Status rotation
    let statusIndex = 0;
    setStatusMessage(STATUS_MESSAGES[0]);
    statusIntervalRef.current = setInterval(() => {
      statusIndex = (statusIndex + 1) % STATUS_MESSAGES.length;
      setStatusMessage(STATUS_MESSAGES[statusIndex]);
      setProgress(prev => Math.min(prev + 8, 90));
    }, 2500);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          prompt,
          projectType,
          projectName: projectName || 'my-project',
        }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error || `Generation failed: ${response.status}`);
      }

      const data = await response.json();
      
      if (statusIntervalRef.current) {
        clearInterval(statusIntervalRef.current);
      }

      setProgress(100);
      setStatusMessage('Generation complete!');
      setGeneratedFiles(data.files || {});
      setRawOutput(data.content || '');
      setDeploymentInstructions(data.deploymentInstructions || '');
      
      // Select first file
      const fileKeys = Object.keys(data.files || {});
      if (fileKeys.length > 0) {
        setSelectedFile(fileKeys[0]);
      }

      // Save artifact
      if (jobId) {
        await updateJob(jobId, { status: 'completed', finished_at: new Date().toISOString(), progress: 100 });
        await createArtifact(
          'code',
          `${projectName || 'Generated'} - ${projectType}`,
          JSON.stringify(data.files),
          { projectType, fileCount: Object.keys(data.files || {}).length },
          jobId
        );
      }

      logEvent('generator', `Code generated: ${Object.keys(data.files || {}).length} files`, 'info');

      setTimeout(() => setStep('results'), 500);

    } catch (err) {
      if (statusIntervalRef.current) {
        clearInterval(statusIntervalRef.current);
      }
      
      const errorMsg = err instanceof Error ? err.message : 'Generation failed';
      setError(errorMsg);
      setProgress(0);
      setStatusMessage('');
      
      if (jobId) {
        await updateJob(jobId, { status: 'failed', error: errorMsg, finished_at: new Date().toISOString() });
      }
      
      toast({ title: 'Generation Failed', description: errorMsg, variant: 'destructive' });
    }
  };

  const copyToClipboard = (content: string, label: string) => {
    navigator.clipboard.writeText(content);
    toast({ title: `${label} copied to clipboard` });
  };

  const downloadFile = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadAllFiles = () => {
    // Create a simple text file with all code
    let combined = `# ${projectName || 'Generated Project'}\n\n`;
    combined += `Project Type: ${projectType}\n`;
    combined += `Files: ${Object.keys(generatedFiles).length}\n\n`;
    combined += `---\n\n`;
    
    Object.entries(generatedFiles).forEach(([path, content]) => {
      combined += `## ${path}\n\n\`\`\`\n${content}\n\`\`\`\n\n`;
    });
    
    combined += `\n---\n\n# Deployment Instructions\n\n${deploymentInstructions}`;
    
    downloadFile(combined, `${projectName || 'project'}-code.md`);
    toast({ title: 'All files downloaded' });
  };

  const fileTree = buildFileTree(generatedFiles);

  const renderFileTree = (nodes: any[], depth = 0) => (
    <div style={{ marginLeft: depth * 12 }}>
      {nodes.map((node) => (
        <div key={node.path}>
          {node.isFolder ? (
            <div className="flex items-center gap-2 py-1 text-muted-foreground">
              <Folder className="w-4 h-4 text-primary/60" />
              <span className="text-sm">{node.name}</span>
            </div>
          ) : (
            <button
              onClick={() => setSelectedFile(node.path)}
              className={`flex items-center gap-2 py-1 w-full text-left hover:bg-primary/10 rounded px-1 transition-colors ${
                selectedFile === node.path ? 'bg-primary/20 text-primary' : 'text-foreground'
              }`}
            >
              <File className="w-4 h-4" />
              <span className="text-sm truncate">{node.name}</span>
            </button>
          )}
          {node.children && renderFileTree(node.children, depth + 1)}
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-[80vh] p-6">
      <AnimatePresence mode="wait">
        {/* INPUT STEP */}
        {step === 'input' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-4xl mx-auto space-y-8"
          >
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/30">
                <Rocket className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-4xl font-bold tracking-tight">Code Generator</h1>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Generate complete, production-ready applications. Describe what you want and receive 
                all the code files ready to deploy.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Project Name</label>
                <Input
                  placeholder="my-awesome-app"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="bg-background/50"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Project Type</label>
                <Select value={projectType} onValueChange={(v) => setProjectType(v as ProjectType)}>
                  <SelectTrigger className="bg-background/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PROJECT_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-center gap-2">
                          {type.icon}
                          <span>{type.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Describe Your Application</label>
              <Textarea
                placeholder="Describe the application you want to build in detail. Include features, functionality, design preferences, and any specific requirements..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="min-h-[200px] bg-background/50 resize-y"
              />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {PROJECT_TYPES.map((type) => (
                <button
                  key={type.value}
                  onClick={() => setProjectType(type.value)}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    projectType === type.value
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50 hover:bg-primary/5'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    {type.icon}
                    <span className="font-medium text-sm">{type.label}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{type.description}</p>
                </button>
              ))}
            </div>

            <Button
              onClick={handleGenerate}
              size="lg"
              className="w-full h-14 text-lg gap-3"
              disabled={!prompt.trim()}
            >
              <Sparkles className="w-5 h-5" />
              Generate Application
              <ChevronRight className="w-5 h-5" />
            </Button>
          </motion.div>
        )}

        {/* PROCESSING STEP */}
        {step === 'processing' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="max-w-2xl mx-auto text-center space-y-8 py-20"
          >
            <div className="relative">
              <div className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-primary animate-spin" />
              </div>
              <motion.div
                className="absolute inset-0 rounded-3xl border-2 border-primary/50"
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
            
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">{statusMessage}</h2>
              <Progress value={progress} className="h-3" />
              <p className="text-muted-foreground">
                {progress}% complete
              </p>
            </div>

            {error && (
              <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive">
                <XCircle className="w-6 h-6 mx-auto mb-2" />
                <p>{error}</p>
                <Button variant="outline" onClick={() => setStep('input')} className="mt-4">
                  Try Again
                </Button>
              </div>
            )}
          </motion.div>
        )}

        {/* RESULTS STEP */}
        {step === 'results' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => setStep('input')}>
                  <ArrowLeft className="w-5 h-5" />
                </Button>
                <div>
                  <h1 className="text-2xl font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-6 h-6 text-green-500" />
                    {projectName || 'Generated Project'}
                  </h1>
                  <p className="text-muted-foreground">
                    {Object.keys(generatedFiles).length} files generated • {projectType}
                  </p>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" onClick={downloadAllFiles}>
                  <Download className="w-4 h-4 mr-2" />
                  Download All
                </Button>
                <Button onClick={() => setStep('input')}>
                  <Sparkles className="w-4 h-4 mr-2" />
                  New Project
                </Button>
              </div>
            </div>

            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
              <TabsList className="grid w-full max-w-md grid-cols-3">
                <TabsTrigger value="files" className="gap-2">
                  <FolderTree className="w-4 h-4" />
                  Files
                </TabsTrigger>
                <TabsTrigger value="preview" className="gap-2">
                  <Eye className="w-4 h-4" />
                  Preview
                </TabsTrigger>
                <TabsTrigger value="deploy" className="gap-2">
                  <Rocket className="w-4 h-4" />
                  Deploy
                </TabsTrigger>
              </TabsList>

              <TabsContent value="files" className="mt-6">
                <div className="grid md:grid-cols-[280px_1fr] gap-6">
                  {/* File Tree */}
                  <div className="bg-card rounded-xl border p-4 h-[600px] overflow-auto">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <FolderTree className="w-4 h-4" />
                      Project Structure
                    </h3>
                    {renderFileTree(fileTree)}
                  </div>

                  {/* Code Viewer */}
                  <div className="bg-card rounded-xl border overflow-hidden">
                    {selectedFile ? (
                      <>
                        <div className="flex items-center justify-between p-3 border-b bg-muted/30">
                          <span className="font-mono text-sm">{selectedFile}</span>
                          <div className="flex gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => copyToClipboard(generatedFiles[selectedFile], 'Code')}
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => downloadFile(generatedFiles[selectedFile], selectedFile.split('/').pop() || 'file')}
                            >
                              <Download className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        <pre className="p-4 overflow-auto h-[520px] text-sm font-mono bg-background/50">
                          <code>{generatedFiles[selectedFile]}</code>
                        </pre>
                      </>
                    ) : (
                      <div className="h-[560px] flex items-center justify-center text-muted-foreground">
                        Select a file to view
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="preview" className="mt-6">
                <div className="bg-card rounded-xl border p-6 min-h-[600px]">
                  <h3 className="font-semibold mb-4">Full Output</h3>
                  <div className="prose prose-invert max-w-none">
                    <MarkdownRenderer content={rawOutput} />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="deploy" className="mt-6">
                <div className="bg-card rounded-xl border p-6">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Rocket className="w-5 h-5 text-primary" />
                    Deployment Instructions
                  </h3>
                  
                  <div className="prose prose-invert max-w-none">
                    <MarkdownRenderer content={deploymentInstructions || `
## Quick Start

1. Download all files using the "Download All" button
2. Extract to a new folder
3. Run \`npm install\`
4. Run \`npm run dev\`

## Deploy to Production

### Vercel (Recommended)
1. Push code to GitHub
2. Import at vercel.com
3. Deploy automatically

### Docker
Build and run with Docker for any platform.

### VPS
Use PM2 or similar process manager.
`} />
                  </div>
                  
                  <div className="mt-8 p-4 rounded-xl bg-primary/10 border border-primary/30">
                    <h4 className="font-semibold mb-2">Need Help Deploying?</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Use AIBLTY's deployment assistance to get your app live in minutes.
                    </p>
                    <div className="flex gap-3">
                      <Button variant="outline" asChild>
                        <a href="https://vercel.com" target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Vercel
                        </a>
                      </Button>
                      <Button variant="outline" asChild>
                        <a href="https://railway.app" target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Railway
                        </a>
                      </Button>
                      <Button variant="outline" asChild>
                        <a href="https://netlify.com" target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Netlify
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
