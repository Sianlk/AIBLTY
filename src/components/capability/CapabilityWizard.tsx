import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { MarkdownRenderer } from '@/components/ui/markdown-renderer';
import { runCapabilityJob, type CapabilityType } from '@/lib/jobRunner';
import { 
  ArrowLeft, ArrowRight, Loader2, CheckCircle2, XCircle, 
  Copy, Download, Sparkles, Wand2, FileText, AlertCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface CapabilityWizardProps {
  capability: CapabilityType;
  title: string;
  description: string;
  placeholder?: string;
  icon?: React.ReactNode;
  projectId?: string;
}

type WizardStep = 'input' | 'processing' | 'results';

interface ArtifactResult {
  type: string;
  title: string;
  content: string;
}

export function CapabilityWizard({
  capability,
  title,
  description,
  placeholder = 'Describe what you want to create or solve...',
  icon,
  projectId,
}: CapabilityWizardProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [step, setStep] = useState<WizardStep>('input');
  const [prompt, setPrompt] = useState('');
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');
  const [artifacts, setArtifacts] = useState<ArtifactResult[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleRun = async () => {
    if (!user) {
      toast({
        title: 'Sign in required',
        description: 'Please sign in to use this capability',
        variant: 'destructive',
      });
      return;
    }

    if (!prompt.trim()) {
      toast({
        title: 'Input required',
        description: 'Please describe what you want to create',
        variant: 'destructive',
      });
      return;
    }

    setStep('processing');
    setProgress(0);
    setError(null);

    try {
      const result = await runCapabilityJob(
        capability,
        prompt,
        projectId,
        (prog, status) => {
          setProgress(prog);
          setStatusMessage(status);
        }
      );

      setArtifacts(result.artifacts);
      setStep('results');
      
      toast({
        title: 'Success!',
        description: `Generated ${result.artifacts.length} artifact(s)`,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      setStep('results');
      
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    toast({ title: 'Copied to clipboard' });
  };

  const handleDownload = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: 'Downloaded' });
  };

  const handleReset = () => {
    setStep('input');
    setPrompt('');
    setProgress(0);
    setStatusMessage('');
    setArtifacts([]);
    setError(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-panel p-6">
        <div className="flex items-center gap-4 mb-4">
          {icon && (
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              {icon}
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold">{title}</h1>
            <p className="text-muted-foreground">{description}</p>
          </div>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-2 text-sm">
          <span className={step === 'input' ? 'text-primary font-medium' : 'text-muted-foreground'}>
            1. Describe
          </span>
          <ArrowRight className="w-4 h-4 text-muted-foreground" />
          <span className={step === 'processing' ? 'text-primary font-medium' : 'text-muted-foreground'}>
            2. Process
          </span>
          <ArrowRight className="w-4 h-4 text-muted-foreground" />
          <span className={step === 'results' ? 'text-primary font-medium' : 'text-muted-foreground'}>
            3. Results
          </span>
        </div>
      </div>

      {/* Auth check */}
      {!user && (
        <div className="glass-panel p-6 text-center">
          <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Sign in Required</h3>
          <p className="text-muted-foreground mb-4">
            Please sign in to use AIBLTY capabilities
          </p>
          <Link to="/auth">
            <Button variant="glow">Sign In</Button>
          </Link>
        </div>
      )}

      {/* Step Content */}
      {user && (
        <AnimatePresence mode="wait">
          {step === 'input' && (
            <motion.div
              key="input"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="glass-panel p-6 space-y-4"
            >
              <div className="flex items-center gap-2 mb-4">
                <Wand2 className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold">Describe Your Request</h2>
              </div>
              
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={placeholder}
                rows={6}
                className="resize-none"
              />
              
              <div className="flex justify-end">
                <Button
                  variant="glow"
                  onClick={handleRun}
                  disabled={!prompt.trim()}
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate
                </Button>
              </div>
            </motion.div>
          )}

          {step === 'processing' && (
            <motion.div
              key="processing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="glass-panel p-8 text-center space-y-6"
            >
              <div className="relative w-20 h-20 mx-auto">
                <div className="absolute inset-0 rounded-full border-4 border-primary/20" />
                <div 
                  className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"
                />
                <Loader2 className="w-8 h-8 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2">Processing...</h3>
                <p className="text-muted-foreground">{statusMessage || 'Please wait...'}</p>
              </div>
              
              <Progress value={progress} className="max-w-md mx-auto" />
              <p className="text-sm text-muted-foreground">{progress}% complete</p>
            </motion.div>
          )}

          {step === 'results' && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              {error ? (
                <div className="glass-panel p-6 border-destructive/50">
                  <div className="flex items-center gap-3 mb-4">
                    <XCircle className="w-6 h-6 text-destructive" />
                    <h3 className="text-lg font-semibold">Error</h3>
                  </div>
                  <p className="text-muted-foreground mb-4">{error}</p>
                  <Button onClick={handleReset} variant="outline">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Try Again
                  </Button>
                </div>
              ) : (
                <>
                  <div className="glass-panel p-4 border-primary/30">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="w-6 h-6 text-primary" />
                        <span className="font-medium">
                          Generated {artifacts.length} artifact(s)
                        </span>
                      </div>
                      <Button onClick={handleReset} variant="outline" size="sm">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        New Request
                      </Button>
                    </div>
                  </div>

                  {artifacts.map((artifact, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="glass-panel overflow-hidden"
                    >
                      <div className="flex items-center justify-between p-4 border-b border-border/50">
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-primary" />
                          <h3 className="font-semibold">{artifact.title}</h3>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCopy(artifact.content)}
                          >
                            <Copy className="w-4 h-4 mr-1" />
                            Copy
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDownload(
                              artifact.content,
                              `${artifact.title.toLowerCase().replace(/\s+/g, '-')}.md`
                            )}
                          >
                            <Download className="w-4 h-4 mr-1" />
                            Download
                          </Button>
                        </div>
                      </div>
                      <div className="p-6 max-h-[600px] overflow-y-auto">
                        <MarkdownRenderer content={artifact.content} />
                      </div>
                    </motion.div>
                  ))}
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}
