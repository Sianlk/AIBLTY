import { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/apiClient';
import { useToast } from '@/hooks/use-toast';
import { 
  Brain, Send, Loader2, Sparkles, Copy, Check, RefreshCw,
  Atom, Zap, Binary, Cpu, Waves, Shield, Network
} from 'lucide-react';

const quantumModes = [
  { id: 'classical', label: 'Classical AI', icon: Brain, description: 'Standard neural network analysis' },
  { id: 'quantum', label: 'Quantum Enhanced', icon: Atom, description: 'Quantum-inspired optimization' },
  { id: 'hybrid', label: 'Hybrid Compute', icon: Cpu, description: 'Combined classical-quantum processing' },
];

const quantumFeatures = [
  { icon: Atom, label: 'Quantum Optimization', desc: 'QAOA-inspired problem solving' },
  { icon: Waves, label: 'Superposition Analysis', desc: 'Parallel solution exploration' },
  { icon: Binary, label: 'Qubit Simulation', desc: 'Quantum state modeling' },
  { icon: Shield, label: 'Quantum Encryption', desc: 'Post-quantum security ready' },
  { icon: Network, label: 'Entanglement Mapping', desc: 'Complex relationship analysis' },
  { icon: Zap, label: 'Quantum Speedup', desc: 'Exponential search acceleration' },
];

export default function SolverPage() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [quantumMode, setQuantumMode] = useState('classical');
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!prompt.trim()) {
      toast({ title: 'Error', description: 'Please enter a problem to solve', variant: 'destructive' });
      return;
    }

    setLoading(true);
    setResponse(null);

    try {
      const enhancedPrompt = quantumMode !== 'classical' 
        ? `[${quantumMode.toUpperCase()} MODE] ${prompt}\n\nApply quantum-inspired optimization techniques including superposition-based parallel exploration, entanglement-based constraint mapping, and QAOA-inspired variational analysis.`
        : prompt;
      
      const projectRes = await api.createProject('Problem Solver Session', 'Auto-generated for problem solving');
      const result = await api.ai.solveProblem(projectRes.data.id, enhancedPrompt);
      setResponse(result.data?.message || result.message || 'No response received');
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
    'Optimize supply chain logistics for 50 warehouses with quantum-inspired routing',
    'Find optimal portfolio allocation using quantum annealing simulation',
    'Solve complex scheduling problem with entanglement-based constraints',
    'Analyze market patterns using superposition-based pattern recognition',
  ];

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mx-auto mb-4 relative">
            <Brain className="w-8 h-8 text-primary" />
            <Atom className="w-4 h-4 text-accent absolute -top-1 -right-1 animate-pulse" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Intelligence Workspace</h1>
          <p className="text-muted-foreground">
            Quantum-enhanced problem solving with AI-powered analysis
          </p>
        </motion.div>

        {/* Quantum Mode Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="glass-panel p-4"
        >
          <Tabs value={quantumMode} onValueChange={setQuantumMode}>
            <TabsList className="grid grid-cols-3 w-full bg-muted/50">
              {quantumModes.map((mode) => (
                <TabsTrigger key={mode.id} value={mode.id} className="flex items-center gap-2">
                  <mode.icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{mode.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>
            {quantumModes.map((mode) => (
              <TabsContent key={mode.id} value={mode.id} className="mt-3">
                <p className="text-sm text-muted-foreground text-center">{mode.description}</p>
              </TabsContent>
            ))}
          </Tabs>
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
                ) : quantumMode !== 'classical' ? (
                  <Atom className="w-4 h-4 mr-2" />
                ) : (
                  <Send className="w-4 h-4 mr-2" />
                )}
                {loading ? 'Processing...' : quantumMode !== 'classical' ? 'Quantum Solve' : 'Solve Problem'}
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

        {/* Quantum Features Grid */}
        {!response && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <p className="text-sm text-muted-foreground mb-3">Quantum Technology Features:</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {quantumFeatures.map((feature) => (
                <div key={feature.label} className="glass-panel p-4 text-center">
                  <feature.icon className="w-6 h-6 text-accent mx-auto mb-2" />
                  <p className="text-sm font-medium">{feature.label}</p>
                  <p className="text-xs text-muted-foreground mt-1">{feature.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Example Prompts */}
        {!response && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <p className="text-sm text-muted-foreground mb-3">Try quantum-enhanced examples:</p>
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
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                    {quantumMode !== 'classical' ? (
                      <Atom className="w-4 h-4 text-accent" />
                    ) : (
                      <Brain className="w-4 h-4 text-primary" />
                    )}
                  </div>
                  <span className="font-semibold">
                    {quantumMode !== 'classical' ? 'Quantum Analysis' : 'AI Analysis'}
                  </span>
                  {quantumMode !== 'classical' && (
                    <span className="text-xs bg-accent/20 text-accent px-2 py-0.5 rounded-full">
                      {quantumMode.toUpperCase()}
                    </span>
                  )}
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
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {quantumMode !== 'classical' 
                      ? 'Running quantum-inspired optimization...' 
                      : 'Analyzing problem space...'}
                  </div>
                  <div className="h-4 bg-muted rounded animate-pulse w-full"></div>
                  <div className="h-4 bg-muted rounded animate-pulse w-5/6"></div>
                  <div className="h-4 bg-muted rounded animate-pulse w-4/6"></div>
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