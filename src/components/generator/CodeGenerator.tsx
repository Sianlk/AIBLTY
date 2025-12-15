import { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { MarkdownRenderer } from '@/components/ui/markdown-renderer';
import { supabase } from '@/integrations/supabase/client';
import { createJob, updateJob, createArtifact, logEvent } from '@/lib/database';
import { 
  ArrowLeft, Loader2, CheckCircle2, XCircle, 
  Copy, Download, Sparkles, FileCode, FolderTree,
  Package, Terminal, Rocket, ChevronRight,
  File, Folder, Eye, Code2, ExternalLink, Github,
  Zap, Shield, DollarSign, Search, Atom, Globe,
  Smartphone, Database, Server, ShoppingCart, Bot
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type ProjectType = 'react' | 'nextjs' | 'express' | 'fullstack' | 'mobile' | 'saas' | 'ecommerce' | 'gpt';

const PROJECT_TYPES: { value: ProjectType; label: string; description: string; icon: React.ReactNode; features: string[] }[] = [
  { 
    value: 'saas', 
    label: 'SaaS Platform', 
    description: 'Complete SaaS with auth, billing, dashboard', 
    icon: <Sparkles className="w-5 h-5" />,
    features: ['User Auth', 'Stripe Billing', 'Admin Panel', 'Analytics']
  },
  { 
    value: 'ecommerce', 
    label: 'E-Commerce Store', 
    description: 'Full shop with cart, checkout, payments', 
    icon: <ShoppingCart className="w-5 h-5" />,
    features: ['Product Catalog', 'Shopping Cart', 'Stripe Checkout', 'Orders']
  },
  { 
    value: 'gpt', 
    label: 'AI/GPT Application', 
    description: 'AI-powered app with chat interface', 
    icon: <Bot className="w-5 h-5" />,
    features: ['AI Chat', 'Streaming', 'Token Tracking', 'History']
  },
  { 
    value: 'fullstack', 
    label: 'Full-Stack App', 
    description: 'React Frontend + Express Backend', 
    icon: <Server className="w-5 h-5" />,
    features: ['React UI', 'REST API', 'Database', 'Auth']
  },
  { 
    value: 'react', 
    label: 'React Web App', 
    description: 'Vite + React + TypeScript + Tailwind', 
    icon: <Code2 className="w-5 h-5" />,
    features: ['Modern React', 'TypeScript', 'Tailwind CSS', 'Routing']
  },
  { 
    value: 'nextjs', 
    label: 'Next.js App', 
    description: 'Next.js 14 + App Router + API Routes', 
    icon: <FileCode className="w-5 h-5" />,
    features: ['SSR/SSG', 'API Routes', 'SEO Ready', 'Edge Functions']
  },
  { 
    value: 'express', 
    label: 'Backend API', 
    description: 'Express + TypeScript + Prisma', 
    icon: <Database className="w-5 h-5" />,
    features: ['REST API', 'Prisma ORM', 'JWT Auth', 'Validation']
  },
  { 
    value: 'mobile', 
    label: 'Mobile App', 
    description: 'React Native / Capacitor', 
    icon: <Smartphone className="w-5 h-5" />,
    features: ['iOS Ready', 'Android Ready', 'Native Features', 'Push Notifications']
  },
];

const STATUS_MESSAGES = [
  '⚡ Initializing quantum generator...',
  '🧠 Analyzing requirements with AI...',
  '📐 Designing optimal architecture...',
  '🏗️ Generating component structure...',
  '💾 Building database schema...',
  '🔌 Creating API endpoints...',
  '🎨 Applying premium styling...',
  '🔒 Adding security layers...',
  '💰 Configuring monetization...',
  '🔍 Optimizing for SEO...',
  '🚀 Preparing deployment configs...',
  '✨ Finalizing production code...',
];

function getLanguageFromPath(path: string): string {
  const ext = path.split('.').pop()?.toLowerCase();
  const langMap: Record<string, string> = {
    ts: 'typescript', tsx: 'typescript', js: 'javascript', jsx: 'javascript',
    json: 'json', css: 'css', scss: 'scss', html: 'html', md: 'markdown',
    yml: 'yaml', yaml: 'yaml', sql: 'sql', prisma: 'prisma', env: 'bash',
    sh: 'bash', dockerfile: 'dockerfile', py: 'python',
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
  const [searchParams] = useSearchParams();
  
  const [step, setStep] = useState<'input' | 'processing' | 'results'>('input');
  const [prompt, setPrompt] = useState('');
  const [projectName, setProjectName] = useState('');
  const [projectType, setProjectType] = useState<ProjectType>(() => {
    const urlType = searchParams.get('type');
    if (urlType && ['saas', 'ecommerce', 'gpt', 'react', 'nextjs', 'express', 'fullstack', 'mobile'].includes(urlType)) {
      return urlType as ProjectType;
    }
    return 'saas';
  });
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  // Feature toggles
  const [enableSEO, setEnableSEO] = useState(true);
  const [enableAuth, setEnableAuth] = useState(true);
  const [enablePayments, setEnablePayments] = useState(true);
  const [enableAnalytics, setEnableAnalytics] = useState(true);
  
  const [generatedFiles, setGeneratedFiles] = useState<Record<string, string>>({});
  const [rawOutput, setRawOutput] = useState('');
  const [deploymentInstructions, setDeploymentInstructions] = useState('');
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'files' | 'preview' | 'deploy' | 'github'>('files');
  const [generationTime, setGenerationTime] = useState<number>(0);
  const [showGithubDialog, setShowGithubDialog] = useState(false);
  
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

    let jobId: string | null = null;
    try {
      const job = await createJob('app-generator', { prompt, projectType, projectName });
      jobId = job.id;
      await updateJob(job.id, { status: 'running', started_at: new Date().toISOString() });
    } catch (err) {
      console.error('Failed to create job:', err);
    }

    let statusIndex = 0;
    setStatusMessage(STATUS_MESSAGES[0]);
    statusIntervalRef.current = setInterval(() => {
      statusIndex = (statusIndex + 1) % STATUS_MESSAGES.length;
      setStatusMessage(STATUS_MESSAGES[statusIndex]);
      setProgress(prev => Math.min(prev + 6, 92));
    }, 2000);

    const startTime = Date.now();

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const features = [];
      if (enableSEO) features.push('SEO optimization');
      if (enableAuth) features.push('User authentication');
      if (enablePayments) features.push('Payment processing with Stripe');
      if (enableAnalytics) features.push('Analytics integration');

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
          features,
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

      const elapsed = Date.now() - startTime;
      setGenerationTime(elapsed);
      setProgress(100);
      setStatusMessage('✅ Generation complete!');
      setGeneratedFiles(data.files || {});
      setRawOutput(data.content || '');
      setDeploymentInstructions(data.deploymentInstructions || '');
      
      const fileKeys = Object.keys(data.files || {});
      if (fileKeys.length > 0) {
        setSelectedFile(fileKeys[0]);
      }

      if (jobId) {
        await updateJob(jobId, { status: 'completed', finished_at: new Date().toISOString(), progress: 100 });
        await createArtifact(
          'code',
          `${projectName || 'Generated'} - ${projectType}`,
          JSON.stringify(data.files),
          { projectType, fileCount: Object.keys(data.files || {}).length, generationTime: elapsed },
          jobId
        );
      }

      logEvent('generator', `Code generated: ${Object.keys(data.files || {}).length} files in ${elapsed}ms`, 'info');
      toast({ title: `Generated ${Object.keys(data.files || {}).length} files`, description: `Completed in ${(elapsed / 1000).toFixed(1)}s` });

      setTimeout(() => setStep('results'), 500);

    } catch (err) {
      if (statusIntervalRef.current) {
        clearInterval(statusIntervalRef.current);
      }
      
      const errorMsg = err instanceof Error ? err.message : 'Generation failed';
      setError(errorMsg);
      setStep('input');
      
      if (jobId) {
        await updateJob(jobId, { status: 'failed', error: errorMsg, finished_at: new Date().toISOString() });
      }
      
      toast({ title: 'Generation Failed', description: errorMsg, variant: 'destructive' });
    }
  };

  const copyToClipboard = (content: string, label: string) => {
    navigator.clipboard.writeText(content);
    toast({ title: `${label} copied` });
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
    let combined = `# ${projectName || 'Generated Project'}\n\n`;
    combined += `**Project Type:** ${projectType}\n`;
    combined += `**Files:** ${Object.keys(generatedFiles).length}\n`;
    combined += `**Generated in:** ${(generationTime / 1000).toFixed(1)}s\n\n`;
    combined += `---\n\n`;
    
    Object.entries(generatedFiles).forEach(([path, content]) => {
      combined += `## 📄 ${path}\n\n\`\`\`${getLanguageFromPath(path)}\n${content}\n\`\`\`\n\n`;
    });
    
    combined += `\n---\n\n${deploymentInstructions}`;
    
    downloadFile(combined, `${projectName || 'project'}-complete.md`);
    toast({ title: 'All files downloaded' });
  };

  const downloadAsZip = async () => {
    // Create individual file downloads with structure
    let index = 0;
    for (const [path, content] of Object.entries(generatedFiles)) {
      setTimeout(() => {
        downloadFile(content, path.replace(/\//g, '_'));
      }, index * 100);
      index++;
    }
    toast({ title: 'Downloading files...', description: `${Object.keys(generatedFiles).length} files` });
  };

  const exportToGithub = () => {
    setShowGithubDialog(true);
  };

  const fileTree = buildFileTree(generatedFiles);

  const renderFileTree = (nodes: any[], depth = 0) => (
    <div style={{ marginLeft: depth * 16 }}>
      {nodes.map((node) => (
        <div key={node.path}>
          {node.isFolder ? (
            <div className="flex items-center gap-2 py-1.5 text-muted-foreground">
              <Folder className="w-4 h-4 text-primary/60" />
              <span className="text-sm font-medium">{node.name}</span>
            </div>
          ) : (
            <button
              onClick={() => setSelectedFile(node.path)}
              className={`flex items-center gap-2 py-1.5 w-full text-left hover:bg-primary/10 rounded-md px-2 transition-all ${
                selectedFile === node.path ? 'bg-primary/20 text-primary border-l-2 border-primary' : 'text-foreground'
              }`}
            >
              <File className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm truncate">{node.name}</span>
            </button>
          )}
          {node.children && renderFileTree(node.children, depth + 1)}
        </div>
      ))}
    </div>
  );

  const selectedProjectType = PROJECT_TYPES.find(t => t.value === projectType);

  return (
    <div className="min-h-[80vh] p-4 md:p-6">
      <AnimatePresence mode="wait">
        {/* INPUT STEP */}
        {step === 'input' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-5xl mx-auto space-y-8"
          >
            {/* Hero */}
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-primary/30 to-secondary/20 border border-primary/40 shadow-lg shadow-primary/20">
                <Atom className="w-10 h-10 text-primary animate-pulse" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                Quantum Code Generator
              </h1>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Generate complete, production-ready applications with SEO optimization, 
                monetization, and enterprise-grade architecture in seconds.
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                <Badge variant="outline" className="gap-1"><Zap className="w-3 h-3" /> 10x Speed</Badge>
                <Badge variant="outline" className="gap-1"><Shield className="w-3 h-3" /> Enterprise Security</Badge>
                <Badge variant="outline" className="gap-1"><Search className="w-3 h-3" /> SEO Optimized</Badge>
                <Badge variant="outline" className="gap-1"><DollarSign className="w-3 h-3" /> Monetization Ready</Badge>
              </div>
            </div>

            {/* Project Config */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Project Name</label>
                <Input
                  placeholder="my-awesome-app"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="h-12 bg-background/50 border-border/50"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Project Type</label>
                <Select value={projectType} onValueChange={(v) => setProjectType(v as ProjectType)}>
                  <SelectTrigger className="h-12 bg-background/50 border-border/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PROJECT_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-center gap-3">
                          {type.icon}
                          <div>
                            <span className="font-medium">{type.label}</span>
                            <span className="text-muted-foreground ml-2 text-xs">{type.description}</span>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Project Type Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {PROJECT_TYPES.slice(0, 4).map((type) => (
                <button
                  key={type.value}
                  onClick={() => setProjectType(type.value)}
                  className={`p-4 rounded-xl border text-left transition-all hover:scale-[1.02] ${
                    projectType === type.value
                      ? 'border-primary bg-primary/10 shadow-lg shadow-primary/10'
                      : 'border-border/50 hover:border-primary/50 hover:bg-primary/5'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`p-2 rounded-lg ${projectType === type.value ? 'bg-primary/20' : 'bg-muted'}`}>
                      {type.icon}
                    </div>
                  </div>
                  <span className="font-semibold text-sm block">{type.label}</span>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {type.features.slice(0, 2).map((f, i) => (
                      <span key={i} className="text-[10px] px-1.5 py-0.5 bg-muted rounded">{f}</span>
                    ))}
                  </div>
                </button>
              ))}
            </div>

            {/* Prompt Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Describe Your Application</label>
              <Textarea
                placeholder={`Describe the ${selectedProjectType?.label || 'application'} you want to build in detail...

Example: "Create a ${projectType === 'saas' ? 'project management SaaS with team collaboration, task boards, time tracking, and subscription billing' : projectType === 'ecommerce' ? 'luxury watch e-commerce store with product catalog, reviews, wishlist, and international shipping' : projectType === 'gpt' ? 'AI writing assistant with document editing, style customization, and export features' : 'modern web application with user authentication and a dashboard'}"`}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="min-h-[160px] bg-background/50 border-border/50 resize-y text-base"
              />
            </div>

            {/* Feature Toggles */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-xl bg-muted/30 border border-border/50">
              <label className="flex items-center justify-between gap-2 cursor-pointer">
                <div className="flex items-center gap-2">
                  <Search className="w-4 h-4 text-primary" />
                  <span className="text-sm">SEO Optimization</span>
                </div>
                <Switch checked={enableSEO} onCheckedChange={setEnableSEO} />
              </label>
              <label className="flex items-center justify-between gap-2 cursor-pointer">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-primary" />
                  <span className="text-sm">Authentication</span>
                </div>
                <Switch checked={enableAuth} onCheckedChange={setEnableAuth} />
              </label>
              <label className="flex items-center justify-between gap-2 cursor-pointer">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-primary" />
                  <span className="text-sm">Payments</span>
                </div>
                <Switch checked={enablePayments} onCheckedChange={setEnablePayments} />
              </label>
              <label className="flex items-center justify-between gap-2 cursor-pointer">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-primary" />
                  <span className="text-sm">Analytics</span>
                </div>
                <Switch checked={enableAnalytics} onCheckedChange={setEnableAnalytics} />
              </label>
            </div>

            {error && (
              <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive flex items-center gap-3">
                <XCircle className="w-5 h-5 flex-shrink-0" />
                <p>{error}</p>
              </div>
            )}

            <Button
              onClick={handleGenerate}
              size="lg"
              className="w-full h-16 text-lg gap-3 bg-gradient-to-r from-primary to-secondary hover:opacity-90 shadow-lg shadow-primary/20"
              disabled={!prompt.trim()}
            >
              <Atom className="w-6 h-6" />
              Generate {selectedProjectType?.label || 'Application'}
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
              <div className="w-32 h-32 mx-auto rounded-3xl bg-gradient-to-br from-primary/30 to-secondary/20 border border-primary/40 flex items-center justify-center">
                <Atom className="w-16 h-16 text-primary animate-spin" style={{ animationDuration: '3s' }} />
              </div>
              <motion.div
                className="absolute inset-0 rounded-3xl border-2 border-primary/50 mx-auto w-32 h-32"
                animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
            
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">{statusMessage}</h2>
              <div className="space-y-2">
                <Progress value={progress} className="h-4" />
                <p className="text-muted-foreground text-lg">{progress}% complete</p>
              </div>
              <p className="text-sm text-muted-foreground">
                Generating production-ready code with quantum-optimized algorithms...
              </p>
            </div>
          </motion.div>
        )}

        {/* RESULTS STEP */}
        {step === 'results' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => setStep('input')}>
                  <ArrowLeft className="w-5 h-5" />
                </Button>
                <div>
                  <h1 className="text-2xl font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-6 h-6 text-green-500" />
                    {projectName || 'Generated Project'}
                  </h1>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <span>{Object.keys(generatedFiles).length} files</span>
                    <span>•</span>
                    <span>{selectedProjectType?.label}</span>
                    <span>•</span>
                    <span>{(generationTime / 1000).toFixed(1)}s</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" onClick={downloadAllFiles}>
                  <Download className="w-4 h-4 mr-2" />
                  Download All
                </Button>
                <Button variant="outline" onClick={exportToGithub}>
                  <Github className="w-4 h-4 mr-2" />
                  GitHub Export
                </Button>
                <Button onClick={() => setStep('input')}>
                  <Sparkles className="w-4 h-4 mr-2" />
                  New Project
                </Button>
              </div>
            </div>

            {/* Capabilities Badges */}
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                <CheckCircle2 className="w-3 h-3 mr-1" /> SEO Optimized
              </Badge>
              {['saas', 'ecommerce'].includes(projectType) && (
                <Badge className="bg-primary/20 text-primary border-primary/30">
                  <DollarSign className="w-3 h-3 mr-1" /> Monetization Ready
                </Badge>
              )}
              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                <Smartphone className="w-3 h-3 mr-1" /> Mobile Ready
              </Badge>
              <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                <Rocket className="w-3 h-3 mr-1" /> Deploy Ready
              </Badge>
            </div>

            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
              <TabsList className="grid w-full max-w-lg grid-cols-4">
                <TabsTrigger value="files" className="gap-2">
                  <FolderTree className="w-4 h-4" />
                  <span className="hidden sm:inline">Files</span>
                </TabsTrigger>
                <TabsTrigger value="preview" className="gap-2">
                  <Eye className="w-4 h-4" />
                  <span className="hidden sm:inline">Preview</span>
                </TabsTrigger>
                <TabsTrigger value="deploy" className="gap-2">
                  <Rocket className="w-4 h-4" />
                  <span className="hidden sm:inline">Deploy</span>
                </TabsTrigger>
                <TabsTrigger value="github" className="gap-2">
                  <Github className="w-4 h-4" />
                  <span className="hidden sm:inline">GitHub</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="files" className="mt-6">
                <div className="grid md:grid-cols-[300px_1fr] gap-6">
                  <div className="bg-card rounded-xl border p-4 h-[600px] overflow-auto">
                    <h3 className="font-semibold mb-4 flex items-center gap-2 pb-2 border-b">
                      <FolderTree className="w-4 h-4 text-primary" />
                      Project Structure
                      <Badge variant="secondary" className="ml-auto">{Object.keys(generatedFiles).length}</Badge>
                    </h3>
                    {renderFileTree(fileTree)}
                  </div>

                  <div className="bg-card rounded-xl border overflow-hidden">
                    {selectedFile ? (
                      <>
                        <div className="flex items-center justify-between p-3 border-b bg-muted/30">
                          <div className="flex items-center gap-2">
                            <FileCode className="w-4 h-4 text-primary" />
                            <span className="font-mono text-sm">{selectedFile}</span>
                          </div>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm" onClick={() => copyToClipboard(generatedFiles[selectedFile], 'Code')}>
                              <Copy className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => downloadFile(generatedFiles[selectedFile], selectedFile.split('/').pop() || 'file')}>
                              <Download className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        <pre className="p-4 overflow-auto h-[530px] text-sm font-mono bg-background/50 leading-relaxed">
                          <code>{generatedFiles[selectedFile]}</code>
                        </pre>
                      </>
                    ) : (
                      <div className="h-[580px] flex items-center justify-center text-muted-foreground">
                        Select a file to view its contents
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="preview" className="mt-6">
                <div className="bg-card rounded-xl border p-6 min-h-[600px] overflow-auto">
                  <h3 className="font-semibold mb-4">Full Generation Output</h3>
                  <div className="prose prose-invert max-w-none">
                    <MarkdownRenderer content={rawOutput} />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="deploy" className="mt-6">
                <div className="bg-card rounded-xl border p-6 max-h-[600px] overflow-auto">
                  <div className="prose prose-invert max-w-none">
                    <MarkdownRenderer content={deploymentInstructions} />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="github" className="mt-6">
                <div className="bg-card rounded-xl border p-6 space-y-6">
                  <div className="text-center space-y-4">
                    <div className="w-20 h-20 mx-auto rounded-full bg-muted flex items-center justify-center">
                      <Github className="w-10 h-10" />
                    </div>
                    <h3 className="text-2xl font-bold">Export to GitHub</h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      Push your generated code directly to a GitHub repository for version control and collaboration.
                    </p>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                    <div className="p-6 rounded-xl border border-border/50 hover:border-primary/50 transition-colors">
                      <h4 className="font-semibold mb-2">Option 1: Manual Export</h4>
                      <p className="text-sm text-muted-foreground mb-4">
                        Download all files and push to your own repository.
                      </p>
                      <Button variant="outline" className="w-full" onClick={downloadAllFiles}>
                        <Download className="w-4 h-4 mr-2" />
                        Download Files
                      </Button>
                    </div>
                    
                    <div className="p-6 rounded-xl border border-border/50 hover:border-primary/50 transition-colors">
                      <h4 className="font-semibold mb-2">Option 2: GitHub Integration</h4>
                      <p className="text-sm text-muted-foreground mb-4">
                        Connect your GitHub account for one-click export.
                      </p>
                      <Button variant="outline" className="w-full" asChild>
                        <a href="https://github.com/new" target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Create Repository
                        </a>
                      </Button>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-muted/30 border border-border/50 max-w-2xl mx-auto">
                    <h4 className="font-semibold mb-2">Quick Start with Git</h4>
                    <pre className="text-sm font-mono bg-background rounded p-4 overflow-x-auto">
{`# Initialize repository
git init

# Add your files
git add .

# Commit
git commit -m "Initial commit from AIBLTY Generator"

# Add remote and push
git remote add origin https://github.com/YOUR_USERNAME/${projectName || 'my-project'}.git
git push -u origin main`}
                    </pre>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>
        )}
      </AnimatePresence>

      {/* GitHub Dialog */}
      <Dialog open={showGithubDialog} onOpenChange={setShowGithubDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Github className="w-5 h-5" />
              Export to GitHub
            </DialogTitle>
            <DialogDescription>
              Your generated code is ready to be pushed to GitHub.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              1. Download the code files<br/>
              2. Create a new GitHub repository<br/>
              3. Push the code using Git commands
            </p>
            <div className="flex gap-2">
              <Button className="flex-1" onClick={downloadAllFiles}>
                <Download className="w-4 h-4 mr-2" />
                Download Files
              </Button>
              <Button variant="outline" asChild>
                <a href="https://github.com/new" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  New Repo
                </a>
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
