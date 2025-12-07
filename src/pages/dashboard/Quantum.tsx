import { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { motion, AnimatePresence } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import api from '@/lib/apiClient';
import { useToast } from '@/hooks/use-toast';
import { 
  Atom, Send, Loader2, Sparkles, Copy, Check, RefreshCw,
  Cpu, Binary, GitBranch, Layers, Network, BarChart3,
  Zap, Target, TrendingUp, Activity
} from 'lucide-react';

const quantumCapabilities = [
  { icon: Binary, title: 'Quantum Optimization', desc: 'Solve complex optimization problems with quantum-inspired algorithms' },
  { icon: GitBranch, title: 'Parallel Processing', desc: 'Explore multiple solution paths simultaneously' },
  { icon: Layers, title: 'Superposition Analysis', desc: 'Analyze all possible states of your problem space' },
  { icon: Network, title: 'Entanglement Mapping', desc: 'Discover hidden connections in complex systems' },
];

const optimizationTypes = [
  { id: 'portfolio', label: 'Portfolio Optimization', desc: 'Maximize returns while minimizing risk' },
  { id: 'logistics', label: 'Logistics & Routing', desc: 'Find optimal paths and resource allocation' },
  { id: 'scheduling', label: 'Resource Scheduling', desc: 'Optimize complex scheduling problems' },
  { id: 'ml', label: 'ML Hyperparameter', desc: 'Tune machine learning models efficiently' },
];

export default function QuantumPage() {
  const [problemDescription, setProblemDescription] = useState('');
  const [constraints, setConstraints] = useState('');
  const [optimizationType, setOptimizationType] = useState('portfolio');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleOptimize = async () => {
    if (!problemDescription.trim()) {
      toast({ title: 'Error', description: 'Please describe your optimization problem', variant: 'destructive' });
      return;
    }

    const fullPrompt = `
QUANTUM OPTIMIZATION REQUEST
Type: ${optimizationType}
Problem: ${problemDescription}
Constraints: ${constraints || 'None specified'}

Please provide:
1. Problem Analysis (quantum-suitable formulation)
2. Optimization Approach (algorithm selection)
3. Solution Space Exploration
4. Optimal Solution(s)
5. Confidence Metrics
6. Implementation Steps
7. Expected Improvements vs Classical Approach
    `.trim();

    setLoading(true);
    setResult(null);

    try {
      const projectRes = await api.createProject('Quantum Optimization', problemDescription.slice(0, 100));
      const response = await api.ai.solveProblem(projectRes.data.id, fullPrompt);
      setResult(response.data?.message || 'Optimization complete. No detailed response available.');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to run quantum optimization',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (result) {
      navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({ title: 'Copied', description: 'Results copied to clipboard' });
    }
  };

  const handleReset = () => {
    setProblemDescription('');
    setConstraints('');
    setResult(null);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500/20 to-primary/20 flex items-center justify-center mx-auto mb-4">
            <Atom className="w-8 h-8 text-violet-400" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Quantum Engine</h1>
          <p className="text-muted-foreground">
            Advanced computational algorithms powered by quantum-inspired optimization
          </p>
        </motion.div>

        {/* Capabilities */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {quantumCapabilities.map((cap, i) => (
            <motion.div
              key={cap.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              className="glass-panel p-4 text-center"
            >
              <cap.icon className="w-8 h-8 text-violet-400 mx-auto mb-2" />
              <h3 className="text-sm font-semibold mb-1">{cap.title}</h3>
              <p className="text-xs text-muted-foreground">{cap.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        <Tabs defaultValue="optimize" className="space-y-6">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3">
            <TabsTrigger value="optimize">Optimize</TabsTrigger>
            <TabsTrigger value="simulate">Simulate</TabsTrigger>
            <TabsTrigger value="analyze">Analyze</TabsTrigger>
          </TabsList>

          <TabsContent value="optimize">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl mx-auto space-y-6"
            >
              {/* Optimization Type */}
              <div className="glass-panel p-6">
                <Label className="mb-4 block">Select Optimization Type</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {optimizationTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setOptimizationType(type.id)}
                      className={`p-4 rounded-lg border text-left transition-all ${
                        optimizationType === type.id
                          ? 'border-violet-500 bg-violet-500/10'
                          : 'border-border bg-muted/50 hover:border-muted-foreground'
                      }`}
                    >
                      <p className="font-medium text-sm">{type.label}</p>
                      <p className="text-xs text-muted-foreground mt-1">{type.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Problem Input */}
              <div className="glass-panel p-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="problem" className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-violet-400" />
                    Problem Description
                  </Label>
                  <Textarea
                    id="problem"
                    placeholder="Describe your optimization problem in detail..."
                    value={problemDescription}
                    onChange={(e) => setProblemDescription(e.target.value)}
                    rows={4}
                    className="bg-muted/50 border-border resize-none"
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="constraints" className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-violet-400" />
                    Constraints (optional)
                  </Label>
                  <Input
                    id="constraints"
                    placeholder="e.g., Max budget $100K, Must complete within 30 days"
                    value={constraints}
                    onChange={(e) => setConstraints(e.target.value)}
                    className="bg-muted/50 border-border"
                    disabled={loading}
                  />
                </div>

                <div className="flex gap-4 pt-2">
                  <Button onClick={handleOptimize} className="bg-violet-600 hover:bg-violet-700" disabled={loading || !problemDescription.trim()}>
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                      <Atom className="w-4 h-4 mr-2" />
                    )}
                    {loading ? 'Computing...' : 'Run Quantum Optimization'}
                  </Button>
                  {result && (
                    <Button onClick={handleReset} variant="outline">
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Reset
                    </Button>
                  )}
                </div>
              </div>

              {/* Results */}
              <AnimatePresence>
                {(loading || result) && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="glass-panel p-6"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center">
                          <Cpu className="w-4 h-4 text-violet-400" />
                        </div>
                        <span className="font-semibold">Quantum Analysis Results</span>
                      </div>
                      {result && (
                        <Button variant="ghost" size="sm" onClick={handleCopy}>
                          {copied ? <Check className="w-4 h-4 mr-1" /> : <Copy className="w-4 h-4 mr-1" />}
                          {copied ? 'Copied' : 'Copy'}
                        </Button>
                      )}
                    </div>

                    {loading ? (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Initializing quantum state vectors...
                        </div>
                        <div className="h-4 bg-violet-500/10 rounded animate-pulse w-full"></div>
                        <div className="h-4 bg-violet-500/10 rounded animate-pulse w-5/6"></div>
                        <div className="h-4 bg-violet-500/10 rounded animate-pulse w-4/6"></div>
                      </div>
                    ) : (
                      <div className="prose prose-invert max-w-none">
                        <div className="whitespace-pre-wrap text-foreground/90 leading-relaxed">
                          {result}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </TabsContent>

          <TabsContent value="simulate">
            <div className="max-w-4xl mx-auto glass-panel p-8 text-center">
              <Layers className="w-12 h-12 text-violet-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Quantum Simulation</h3>
              <p className="text-muted-foreground mb-6">
                Run quantum circuit simulations and explore quantum states
              </p>
              <Button variant="outline" disabled>Coming Soon</Button>
            </div>
          </TabsContent>

          <TabsContent value="analyze">
            <div className="max-w-4xl mx-auto glass-panel p-8 text-center">
              <BarChart3 className="w-12 h-12 text-violet-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Quantum Analytics</h3>
              <p className="text-muted-foreground mb-6">
                Analyze complex datasets with quantum-inspired machine learning
              </p>
              <Button variant="outline" disabled>Coming Soon</Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
