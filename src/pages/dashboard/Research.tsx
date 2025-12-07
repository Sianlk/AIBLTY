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
  Search, Send, Loader2, Sparkles, Copy, Check, RefreshCw,
  BookOpen, FileText, Globe, TrendingUp, Database,
  Microscope, GraduationCap, BarChart3, Lightbulb
} from 'lucide-react';

const researchDomains = [
  { id: 'science', label: 'Science & Technology', icon: Microscope },
  { id: 'business', label: 'Business & Economics', icon: TrendingUp },
  { id: 'academic', label: 'Academic Research', icon: GraduationCap },
  { id: 'market', label: 'Market Analysis', icon: BarChart3 },
];

const recentSearches = [
  { query: 'AI trends in healthcare 2024', domain: 'science', time: '2 hours ago' },
  { query: 'Sustainable business models', domain: 'business', time: 'Yesterday' },
  { query: 'Consumer behavior post-pandemic', domain: 'market', time: '3 days ago' },
];

export default function ResearchPage() {
  const [query, setQuery] = useState('');
  const [depth, setDepth] = useState<'quick' | 'standard' | 'deep'>('standard');
  const [selectedDomain, setSelectedDomain] = useState('science');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleResearch = async () => {
    if (!query.trim()) {
      toast({ title: 'Error', description: 'Please enter a research query', variant: 'destructive' });
      return;
    }

    const domain = researchDomains.find(d => d.id === selectedDomain);
    const fullPrompt = `
RESEARCH REQUEST
Domain: ${domain?.label || 'General'}
Depth: ${depth}
Query: ${query}

Please provide a comprehensive research report including:
1. Executive Summary
2. Background & Context
3. Key Findings (with citations where applicable)
4. Data & Statistics
5. Expert Opinions & Analysis
6. Trends & Predictions
7. Implications & Recommendations
8. Further Research Directions

IMPORTANT: Include a disclaimer that this is AI-generated research and should be verified with primary sources.
    `.trim();

    setLoading(true);
    setResult(null);

    try {
      const projectRes = await api.createProject('Research Query', query.slice(0, 100));
      const response = await api.ai.solveProblem(projectRes.data.id, fullPrompt);
      setResult(response.data?.message || 'Research complete. No detailed response available.');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to complete research',
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
      toast({ title: 'Copied', description: 'Research copied to clipboard' });
    }
  };

  const handleReset = () => {
    setQuery('');
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
          <div className="w-16 h-16 rounded-2xl bg-blue-500/20 flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-blue-400" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Research Engine</h1>
          <p className="text-muted-foreground">
            Deep research across science, technology, economics, and more
          </p>
        </motion.div>

        {/* Domain Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap justify-center gap-3"
        >
          {researchDomains.map((domain) => (
            <button
              key={domain.id}
              onClick={() => setSelectedDomain(domain.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
                selectedDomain === domain.id
                  ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                  : 'border-border bg-muted/50 hover:border-muted-foreground'
              }`}
            >
              <domain.icon className="w-4 h-4" />
              <span className="text-sm">{domain.label}</span>
            </button>
          ))}
        </motion.div>

        <Tabs defaultValue="research" className="space-y-6">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3">
            <TabsTrigger value="research">Research</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="saved">Saved</TabsTrigger>
          </TabsList>

          <TabsContent value="research">
            <div className="max-w-4xl mx-auto space-y-6">
              {/* Search Input */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="glass-panel p-6 space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="query" className="flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-blue-400" />
                    Research Query
                  </Label>
                  <Textarea
                    id="query"
                    placeholder="What would you like to research? Be as specific as possible..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    rows={4}
                    className="bg-muted/50 border-border resize-none"
                    disabled={loading}
                  />
                </div>

                {/* Depth Selection */}
                <div className="space-y-2">
                  <Label>Research Depth</Label>
                  <div className="flex gap-3">
                    {[
                      { id: 'quick', label: 'Quick', desc: '~30 sec' },
                      { id: 'standard', label: 'Standard', desc: '~1 min' },
                      { id: 'deep', label: 'Deep Dive', desc: '~3 min' },
                    ].map((option) => (
                      <button
                        key={option.id}
                        onClick={() => setDepth(option.id as typeof depth)}
                        className={`flex-1 p-3 rounded-lg border text-center transition-all ${
                          depth === option.id
                            ? 'border-blue-500 bg-blue-500/10'
                            : 'border-border bg-muted/50 hover:border-muted-foreground'
                        }`}
                      >
                        <p className="font-medium text-sm">{option.label}</p>
                        <p className="text-xs text-muted-foreground">{option.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4 pt-2">
                  <Button 
                    className="bg-blue-600 hover:bg-blue-700" 
                    onClick={handleResearch}
                    disabled={loading || !query.trim()}
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                      <Search className="w-4 h-4 mr-2" />
                    )}
                    {loading ? 'Researching...' : 'Start Research'}
                  </Button>
                  {result && (
                    <Button onClick={handleReset} variant="outline">
                      <RefreshCw className="w-4 h-4 mr-2" />
                      New Research
                    </Button>
                  )}
                </div>
              </motion.div>

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
                        <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                          <BookOpen className="w-4 h-4 text-blue-400" />
                        </div>
                        <span className="font-semibold">Research Report</span>
                      </div>
                      {result && (
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" onClick={handleCopy}>
                            {copied ? <Check className="w-4 h-4 mr-1" /> : <Copy className="w-4 h-4 mr-1" />}
                            {copied ? 'Copied' : 'Copy'}
                          </Button>
                          <Button variant="ghost" size="sm">
                            <FileText className="w-4 h-4 mr-1" />
                            Export
                          </Button>
                        </div>
                      )}
                    </div>

                    {loading ? (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Analyzing sources and compiling research...
                        </div>
                        <div className="h-4 bg-blue-500/10 rounded animate-pulse w-full"></div>
                        <div className="h-4 bg-blue-500/10 rounded animate-pulse w-5/6"></div>
                        <div className="h-4 bg-blue-500/10 rounded animate-pulse w-4/6"></div>
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
            </div>
          </TabsContent>

          <TabsContent value="history">
            <div className="max-w-4xl mx-auto glass-panel p-6">
              <h3 className="font-semibold mb-4">Recent Searches</h3>
              <div className="space-y-3">
                {recentSearches.map((search, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 cursor-pointer"
                    onClick={() => setQuery(search.query)}
                  >
                    <div className="flex items-center gap-4">
                      <Search className="w-5 h-5 text-blue-400" />
                      <div>
                        <p className="font-medium">{search.query}</p>
                        <p className="text-xs text-muted-foreground capitalize">{search.domain}</p>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">{search.time}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="saved">
            <div className="max-w-4xl mx-auto glass-panel p-8 text-center">
              <Database className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Saved Research</h3>
              <p className="text-muted-foreground mb-6">
                Save important research findings for future reference
              </p>
              <Button variant="outline">Browse Library</Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
