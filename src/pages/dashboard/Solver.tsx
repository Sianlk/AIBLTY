import { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/apiClient';
import { useToast } from '@/hooks/use-toast';
import { Brain, Send, Loader2, Sparkles, Copy, Check, RefreshCw } from 'lucide-react';

export default function SolverPage() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!prompt.trim()) {
      toast({ title: 'Error', description: 'Please enter a problem to solve', variant: 'destructive' });
      return;
    }

    setLoading(true);
    setResponse(null);

    try {
      // For now, we'll create a temporary project for the solver
      const projectRes = await api.createProject('Problem Solver Session', 'Auto-generated for problem solving');
      const result = await api.ai.solveProblem(projectRes.data.id, prompt);
      setResponse(result.data?.response || 'No response received');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to solve problem',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (response) {
      navigator.clipboard.writeText(response);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({ title: 'Copied', description: 'Response copied to clipboard' });
    }
  };

  const handleReset = () => {
    setPrompt('');
    setResponse(null);
  };

  const examples = [
    'How can I improve customer retention for my SaaS product?',
    'What are the best strategies for entering a new market?',
    'How do I optimize my supply chain for faster delivery?',
    'What pricing model would work best for a B2B software product?',
  ];

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Brain className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Intelligence Workspace</h1>
          <p className="text-muted-foreground">
            Describe your problem and let AI analyze it with comprehensive solutions
          </p>
        </motion.div>

        {/* Input Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-panel p-6"
        >
          <Textarea
            placeholder="Describe your problem or challenge in detail..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={6}
            className="bg-muted/50 border-border resize-none mb-4"
            disabled={loading}
          />
          
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <div className="flex gap-2">
              <Button onClick={handleSubmit} variant="glow" disabled={loading || !prompt.trim()}>
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <Send className="w-4 h-4 mr-2" />
                )}
                {loading ? 'Analyzing...' : 'Solve Problem'}
              </Button>
              {response && (
                <Button onClick={handleReset} variant="outline">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  New Problem
                </Button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Example Prompts */}
        {!response && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <p className="text-sm text-muted-foreground mb-3">Try these examples:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {examples.map((example, i) => (
                <button
                  key={i}
                  onClick={() => setPrompt(example)}
                  className="text-left p-4 glass-panel-hover text-sm"
                >
                  <Sparkles className="w-4 h-4 text-primary inline mr-2" />
                  {example}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Response Section */}
        <AnimatePresence>
          {(loading || response) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="glass-panel p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Brain className="w-4 h-4 text-primary" />
                  </div>
                  <span className="font-semibold">AI Analysis</span>
                </div>
                {response && (
                  <Button variant="ghost" size="sm" onClick={handleCopy}>
                    {copied ? (
                      <Check className="w-4 h-4 mr-1" />
                    ) : (
                      <Copy className="w-4 h-4 mr-1" />
                    )}
                    {copied ? 'Copied' : 'Copy'}
                  </Button>
                )}
              </div>

              {loading ? (
                <div className="space-y-3">
                  <div className="h-4 bg-muted rounded animate-pulse w-full"></div>
                  <div className="h-4 bg-muted rounded animate-pulse w-5/6"></div>
                  <div className="h-4 bg-muted rounded animate-pulse w-4/6"></div>
                  <div className="h-4 bg-muted rounded animate-pulse w-full"></div>
                  <div className="h-4 bg-muted rounded animate-pulse w-3/4"></div>
                </div>
              ) : (
                <div className="prose prose-invert max-w-none">
                  <div className="whitespace-pre-wrap text-foreground/90 leading-relaxed">
                    {response}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}
