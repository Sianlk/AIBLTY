import { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/apiClient';
import { useToast } from '@/hooks/use-toast';
import { 
  Rocket, Send, Loader2, Sparkles, Copy, Check, RefreshCw,
  DollarSign, Users, Target, TrendingUp, Lightbulb
} from 'lucide-react';

export default function BuilderPage() {
  const [businessIdea, setBusinessIdea] = useState('');
  const [targetMarket, setTargetMarket] = useState('');
  const [budget, setBudget] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!businessIdea.trim()) {
      toast({ title: 'Error', description: 'Please describe your business idea', variant: 'destructive' });
      return;
    }

    const fullPrompt = `
Business Idea: ${businessIdea}
Target Market: ${targetMarket || 'Not specified'}
Budget: ${budget || 'Not specified'}

Please provide a comprehensive business plan including:
1. Executive Summary
2. Market Analysis
3. Revenue Model
4. Marketing Strategy
5. Operational Plan
6. Financial Projections
7. Risk Assessment
8. Action Items
    `.trim();

    setLoading(true);
    setResponse(null);

    try {
      const projectRes = await api.createProject('Business Plan', businessIdea.slice(0, 100));
      const result = await api.buildBusiness(projectRes.data.id, fullPrompt);
      setResponse(result.data?.response || 'No response received');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to generate business plan',
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
      toast({ title: 'Copied', description: 'Business plan copied to clipboard' });
    }
  };

  const handleReset = () => {
    setBusinessIdea('');
    setTargetMarket('');
    setBudget('');
    setResponse(null);
  };

  const examples = [
    'AI-powered personal finance app for millennials',
    'Sustainable packaging solution for e-commerce businesses',
    'On-demand tutoring platform connecting students with experts',
    'B2B SaaS for automating HR onboarding processes',
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
          <div className="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center mx-auto mb-4">
            <Rocket className="w-8 h-8 text-secondary" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Business Builder</h1>
          <p className="text-muted-foreground">
            Transform your idea into a comprehensive business plan with AI
          </p>
        </motion.div>

        {/* Input Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-panel p-6 space-y-4"
        >
          <div className="space-y-2">
            <Label htmlFor="idea" className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-primary" />
              Business Idea
            </Label>
            <Textarea
              id="idea"
              placeholder="Describe your business idea in detail..."
              value={businessIdea}
              onChange={(e) => setBusinessIdea(e.target.value)}
              rows={4}
              className="bg-muted/50 border-border resize-none"
              disabled={loading}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="market" className="flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" />
                Target Market (optional)
              </Label>
              <Input
                id="market"
                placeholder="e.g., Small business owners, ages 25-45"
                value={targetMarket}
                onChange={(e) => setTargetMarket(e.target.value)}
                className="bg-muted/50 border-border"
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="budget" className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-primary" />
                Starting Budget (optional)
              </Label>
              <Input
                id="budget"
                placeholder="e.g., $10,000 - $50,000"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="bg-muted/50 border-border"
                disabled={loading}
              />
            </div>
          </div>
          
          <div className="flex gap-4 pt-2">
            <Button onClick={handleSubmit} variant="glow" disabled={loading || !businessIdea.trim()}>
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Rocket className="w-4 h-4 mr-2" />
              )}
              {loading ? 'Generating...' : 'Build Business Plan'}
            </Button>
            {response && (
              <Button onClick={handleReset} variant="outline">
                <RefreshCw className="w-4 h-4 mr-2" />
                Start Over
              </Button>
            )}
          </div>
        </motion.div>

        {/* Example Ideas */}
        {!response && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <p className="text-sm text-muted-foreground mb-3">Need inspiration? Try these:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {examples.map((example, i) => (
                <button
                  key={i}
                  onClick={() => setBusinessIdea(example)}
                  className="text-left p-4 glass-panel-hover text-sm"
                >
                  <Sparkles className="w-4 h-4 text-secondary inline mr-2" />
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
                  <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center">
                    <Target className="w-4 h-4 text-secondary" />
                  </div>
                  <span className="font-semibold">Your Business Plan</span>
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
                    Analyzing market opportunities...
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

        {/* Feature Highlights */}
        {!response && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {[
              { icon: Target, label: 'Market Analysis' },
              { icon: DollarSign, label: 'Revenue Models' },
              { icon: TrendingUp, label: 'Growth Strategy' },
              { icon: Users, label: 'Customer Personas' },
            ].map((item) => (
              <div key={item.label} className="glass-panel p-4 text-center">
                <item.icon className="w-6 h-6 text-secondary mx-auto mb-2" />
                <p className="text-xs text-muted-foreground">{item.label}</p>
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
}
