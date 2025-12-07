import { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { motion, AnimatePresence } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import api from '@/lib/apiClient';
import { useToast } from '@/hooks/use-toast';
import { 
  Rocket, Send, Loader2, Sparkles, Copy, Check, RefreshCw,
  DollarSign, Users, Target, TrendingUp, Lightbulb, Code,
  Palette, Database, Server, Globe, Smartphone, Shield,
  Zap, CheckCircle, ArrowRight, Crown, Lock, Package,
  Layers, GitBranch, Cloud, Terminal
} from 'lucide-react';

const stackOptions = [
  { id: 'frontend', name: 'Frontend', icon: Palette, desc: 'React, Vue, Angular', enabled: true },
  { id: 'backend', name: 'Backend', icon: Server, desc: 'Node.js, Python, Go', enabled: true },
  { id: 'database', name: 'Database', icon: Database, desc: 'PostgreSQL, MongoDB', enabled: true },
  { id: 'api', name: 'API Layer', icon: Globe, desc: 'REST, GraphQL', enabled: true },
  { id: 'mobile', name: 'Mobile App', icon: Smartphone, desc: 'React Native, Flutter', enabled: false },
  { id: 'auth', name: 'Authentication', icon: Shield, desc: 'OAuth, JWT', enabled: true },
];

const appTypes = [
  { id: 'saas', name: 'SaaS Platform', icon: Cloud, desc: 'Subscription-based software' },
  { id: 'marketplace', name: 'Marketplace', icon: Package, desc: 'Two-sided marketplace' },
  { id: 'ecommerce', name: 'E-Commerce', icon: DollarSign, desc: 'Online store with payments' },
  { id: 'social', name: 'Social Platform', icon: Users, desc: 'Community & social features' },
  { id: 'productivity', name: 'Productivity Tool', icon: Zap, desc: 'Business automation' },
  { id: 'ai-app', name: 'AI Application', icon: Sparkles, desc: 'AI-powered solution' },
];

export default function BuilderPage() {
  const [businessIdea, setBusinessIdea] = useState('');
  const [targetMarket, setTargetMarket] = useState('');
  const [budget, setBudget] = useState('');
  const [appType, setAppType] = useState('saas');
  const [selectedStack, setSelectedStack] = useState(stackOptions.filter(s => s.enabled).map(s => s.id));
  const [includeMonetization, setIncludeMonetization] = useState(true);
  const [includeMarketing, setIncludeMarketing] = useState(true);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('idea');
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!businessIdea.trim()) {
      toast({ title: 'Error', description: 'Please describe your business idea', variant: 'destructive' });
      return;
    }

    const selectedType = appTypes.find(t => t.id === appType);
    const stackList = selectedStack.join(', ');

    const fullPrompt = `
AIBLTY FULL-STACK BUSINESS & APPLICATION GENERATOR
═══════════════════════════════════════════════════

BUSINESS CONCEPT
----------------
Idea: ${businessIdea}
Target Market: ${targetMarket || 'To be determined based on analysis'}
Budget: ${budget || 'Flexible - optimize for ROI'}
Application Type: ${selectedType?.name} (${selectedType?.desc})
Technology Stack: ${stackList}

GENERATION REQUIREMENTS
-----------------------
${includeMonetization ? '✓ Include monetization strategy with pricing tiers and payment integration' : ''}
${includeMarketing ? '✓ Include auto-marketing strategy with viral growth mechanics' : ''}
✓ Full-stack implementation ready for deployment
✓ Premium UI/UX design specifications
✓ Scalable architecture diagram
✓ Security best practices
✓ Revenue share integration (10% platform commission built-in)

DELIVERABLES REQUIRED
---------------------
1. EXECUTIVE SUMMARY
   - Business model canvas
   - Unique value proposition
   - Competitive advantages

2. TECHNICAL ARCHITECTURE
   - System design with diagrams
   - Database schema
   - API endpoints specification
   - Component hierarchy

3. FRONTEND SPECIFICATION
   - UI/UX wireframes description
   - Page structure and navigation
   - Component library requirements
   - Responsive design guidelines

4. BACKEND SPECIFICATION
   - Server architecture
   - Database models
   - Authentication flow
   - API documentation

5. MONETIZATION ENGINE
   - Pricing strategy (GBP)
   - Subscription tiers
   - Payment gateway integration (Stripe)
   - Revenue optimization tactics
   - Platform commission handling (10% on transactions)

6. MARKETING & GROWTH
   - Go-to-market strategy
   - Viral loop mechanics
   - SEO optimization plan
   - Social media automation
   - Referral program design

7. DEPLOYMENT ROADMAP
   - Infrastructure requirements
   - CI/CD pipeline
   - Monitoring and analytics
   - Scaling strategy

8. FINANCIAL PROJECTIONS
   - Revenue forecasts (12 months)
   - Cost structure
   - Break-even analysis
   - ROI projections

9. COMPLETE CODE STRUCTURE
   - File/folder structure
   - Key implementation patterns
   - Integration points

Generate a comprehensive, production-ready specification that can be immediately implemented.
Output must be premium quality, suitable for enterprise deployment.
    `.trim();

    setLoading(true);
    setResponse(null);

    try {
      const projectRes = await api.createProject('Full-Stack Build', businessIdea.slice(0, 100));
      const result = await api.ai.buildBusiness(projectRes.data.id, fullPrompt);
      setResponse(result.data?.response || result.data?.message || 'Build specification generated successfully.');
      toast({ title: 'Build Complete', description: 'Your full-stack specification is ready' });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to generate build specification',
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
    }
  };

  const toggleStack = (id: string) => {
    setSelectedStack(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
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
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/30 via-secondary/20 to-primary/30 flex items-center justify-center mx-auto mb-4 border border-primary/30 shadow-lg shadow-primary/10">
            <Rocket className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-3xl font-bold mb-2 gradient-text">Full-Stack Business Builder</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Transform your idea into a complete, production-ready application with 
            frontend, backend, database, monetization, and marketing - all in one click.
          </p>
        </motion.div>

        {/* Platform Commission Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="max-w-4xl mx-auto"
        >
          <div className="premium-card p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                <Crown className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-sm">Revenue Share Program</p>
                <p className="text-xs text-muted-foreground">10% platform commission on all transactions - automatic Stripe integration</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-glow-success">90% to you</p>
              <p className="text-xs text-muted-foreground">10% platform fee</p>
            </div>
          </div>
        </motion.div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="max-w-4xl mx-auto space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="idea">1. Describe Idea</TabsTrigger>
            <TabsTrigger value="stack">2. Choose Stack</TabsTrigger>
            <TabsTrigger value="features">3. Features</TabsTrigger>
          </TabsList>

          <TabsContent value="idea">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-panel p-6 space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="idea" className="flex items-center gap-2 text-lg">
                  <Lightbulb className="w-5 h-5 text-primary" />
                  Your Business Idea
                </Label>
                <Textarea
                  id="idea"
                  placeholder="Describe your application or business idea in detail. Include what problem it solves, who it's for, and any key features you want..."
                  value={businessIdea}
                  onChange={(e) => setBusinessIdea(e.target.value)}
                  rows={5}
                  className="bg-muted/50 border-border resize-none text-base"
                  disabled={loading}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="market" className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-primary" />
                    Target Market
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
                    Budget (optional)
                  </Label>
                  <Input
                    id="budget"
                    placeholder="e.g., £10,000 - £50,000"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="bg-muted/50 border-border"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm">Application Type</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {appTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setAppType(type.id)}
                      className={`p-4 rounded-xl border text-left transition-all ${
                        appType === type.id
                          ? 'border-primary bg-primary/10 shadow-lg shadow-primary/10'
                          : 'border-border bg-muted/30 hover:border-primary/50'
                      }`}
                    >
                      <type.icon className={`w-6 h-6 mb-2 ${appType === type.id ? 'text-primary' : 'text-muted-foreground'}`} />
                      <p className="font-medium text-sm">{type.name}</p>
                      <p className="text-xs text-muted-foreground">{type.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              <Button onClick={() => setActiveTab('stack')} className="w-full" disabled={!businessIdea.trim()}>
                Next: Choose Stack <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </motion.div>
          </TabsContent>

          <TabsContent value="stack">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-panel p-6 space-y-4"
            >
              <Label className="text-lg flex items-center gap-2">
                <Layers className="w-5 h-5 text-primary" />
                Technology Stack
              </Label>
              <p className="text-sm text-muted-foreground">Select the components for your full-stack application</p>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {stackOptions.map((stack) => (
                  <button
                    key={stack.id}
                    onClick={() => toggleStack(stack.id)}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      selectedStack.includes(stack.id)
                        ? 'border-glow-success bg-glow-success/10'
                        : 'border-border bg-muted/30 hover:border-glow-success/50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <stack.icon className={`w-6 h-6 ${selectedStack.includes(stack.id) ? 'text-glow-success' : 'text-muted-foreground'}`} />
                      {selectedStack.includes(stack.id) && <CheckCircle className="w-4 h-4 text-glow-success" />}
                    </div>
                    <p className="font-medium text-sm">{stack.name}</p>
                    <p className="text-xs text-muted-foreground">{stack.desc}</p>
                  </button>
                ))}
              </div>

              <div className="flex gap-4">
                <Button variant="outline" onClick={() => setActiveTab('idea')}>
                  Back
                </Button>
                <Button onClick={() => setActiveTab('features')} className="flex-1">
                  Next: Features <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </motion.div>
          </TabsContent>

          <TabsContent value="features">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-panel p-6 space-y-6"
            >
              <div>
                <Label className="text-lg flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-primary" />
                  Built-in Features
                </Label>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl">
                    <div className="flex items-center gap-4">
                      <DollarSign className="w-6 h-6 text-glow-success" />
                      <div>
                        <p className="font-medium">Monetization Engine</p>
                        <p className="text-xs text-muted-foreground">Stripe integration, subscription tiers, payment processing</p>
                      </div>
                    </div>
                    <Switch checked={includeMonetization} onCheckedChange={setIncludeMonetization} />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl">
                    <div className="flex items-center gap-4">
                      <TrendingUp className="w-6 h-6 text-primary" />
                      <div>
                        <p className="font-medium">Auto-Marketing System</p>
                        <p className="text-xs text-muted-foreground">Viral loops, referral program, SEO, social automation</p>
                      </div>
                    </div>
                    <Switch checked={includeMarketing} onCheckedChange={setIncludeMarketing} />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-primary/10 border border-primary/30 rounded-xl">
                    <div className="flex items-center gap-4">
                      <Crown className="w-6 h-6 text-primary" />
                      <div>
                        <p className="font-medium">Revenue Share (10%)</p>
                        <p className="text-xs text-muted-foreground">Automatic commission collection via Stripe Connect</p>
                      </div>
                    </div>
                    <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">Required</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <Button variant="outline" onClick={() => setActiveTab('stack')}>
                  Back
                </Button>
                <Button 
                  onClick={handleSubmit} 
                  variant="glow" 
                  className="flex-1"
                  disabled={loading || !businessIdea.trim()}
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  ) : (
                    <Rocket className="w-5 h-5 mr-2" />
                  )}
                  {loading ? 'Building Full-Stack Application...' : 'Generate Complete Application'}
                </Button>
              </div>
            </motion.div>
          </TabsContent>
        </Tabs>

        {/* Response Section */}
        <AnimatePresence>
          {(loading || response) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-4xl mx-auto glass-panel p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                    <Terminal className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <span className="font-semibold">Full-Stack Build Specification</span>
                    <p className="text-xs text-muted-foreground">{appTypes.find(t => t.id === appType)?.name}</p>
                  </div>
                </div>
                {response && (
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={handleCopy}>
                      {copied ? <Check className="w-4 h-4 mr-1" /> : <Copy className="w-4 h-4 mr-1" />}
                      {copied ? 'Copied' : 'Copy'}
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => { setResponse(null); setActiveTab('idea'); }}>
                      <RefreshCw className="w-4 h-4 mr-1" />
                      New Build
                    </Button>
                  </div>
                )}
              </div>

              {loading ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-sm text-primary">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Generating complete full-stack specification...</span>
                  </div>
                  <div className="space-y-2">
                    {['Analyzing business model...', 'Designing architecture...', 'Creating database schema...', 'Building API specification...', 'Generating UI components...', 'Setting up monetization...'].map((step, i) => (
                      <div 
                        key={i} 
                        className="h-4 bg-primary/10 rounded animate-pulse" 
                        style={{ width: `${100 - i * 10}%`, animationDelay: `${i * 0.15}s` }}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="prose prose-invert max-w-none">
                  <div className="whitespace-pre-wrap text-foreground/90 leading-relaxed text-sm">
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
