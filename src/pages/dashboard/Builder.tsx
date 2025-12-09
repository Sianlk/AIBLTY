import { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { motion, AnimatePresence } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { sendAIMessage } from '@/lib/aiService';
import { useToast } from '@/hooks/use-toast';
import { 
  Rocket, Send, Loader2, Sparkles, Copy, Check, RefreshCw,
  DollarSign, Users, Target, TrendingUp, Lightbulb, Code,
  Palette, Database, Server, Globe, Smartphone, Shield,
  Zap, CheckCircle, ArrowRight, Crown, Lock, Package,
  Layers, GitBranch, Cloud, Terminal, Phone, MessageSquare,
  Brain, Mic, Video, Bot, Workflow, Network, Atom, Star
} from 'lucide-react';

const stackOptions = [
  { id: 'frontend', name: 'Frontend', icon: Palette, desc: 'React, Vue, Next.js, Angular', enabled: true },
  { id: 'backend', name: 'Backend', icon: Server, desc: 'Node.js, Python, Go, Rust', enabled: true },
  { id: 'database', name: 'Database', icon: Database, desc: 'PostgreSQL, MongoDB, Redis', enabled: true },
  { id: 'api', name: 'API Layer', icon: Globe, desc: 'REST, GraphQL, WebSocket', enabled: true },
  { id: 'mobile', name: 'Mobile App', icon: Smartphone, desc: 'React Native, Flutter', enabled: true },
  { id: 'auth', name: 'Authentication', icon: Shield, desc: 'OAuth, JWT, SSO, MFA', enabled: true },
  { id: 'ai', name: 'AI/ML Layer', icon: Brain, desc: 'Custom models, GPT, embeddings', enabled: true },
  { id: 'realtime', name: 'Real-time', icon: Zap, desc: 'WebSocket, Pub/Sub, Streaming', enabled: true },
];

const appTypes = [
  { id: 'saas', name: 'SaaS Platform', icon: Cloud, desc: 'Multi-tenant subscription software', premium: false },
  { id: 'caas', name: 'CaaS Solution', icon: MessageSquare, desc: 'Communication-as-a-Service', premium: true },
  { id: 'voip', name: 'VoIP System', icon: Phone, desc: 'Voice & video platform like Twilio', premium: true },
  { id: 'gpt', name: 'Custom GPT', icon: Brain, desc: 'AI model surpassing ChatGPT', premium: true },
  { id: 'marketplace', name: 'Marketplace', icon: Package, desc: 'Two-sided marketplace platform', premium: false },
  { id: 'ecommerce', name: 'E-Commerce', icon: DollarSign, desc: 'Online store with Stripe', premium: false },
  { id: 'social', name: 'Social Platform', icon: Users, desc: 'Community & social features', premium: false },
  { id: 'enterprise', name: 'Enterprise Suite', icon: Workflow, desc: 'Full business automation', premium: true },
  { id: 'ai-app', name: 'AI Application', icon: Sparkles, desc: 'AI-powered solution', premium: false },
  { id: 'fintech', name: 'FinTech Platform', icon: TrendingUp, desc: 'Financial services app', premium: true },
  { id: 'healthcare', name: 'HealthTech', icon: Atom, desc: 'Medical & health solutions', premium: true },
  { id: 'iot', name: 'IoT Platform', icon: Network, desc: 'Connected devices ecosystem', premium: true },
];

export default function BuilderPage() {
  const [businessIdea, setBusinessIdea] = useState('');
  const [targetMarket, setTargetMarket] = useState('');
  const [budget, setBudget] = useState('');
  const [appType, setAppType] = useState('saas');
  const [selectedStack, setSelectedStack] = useState(stackOptions.filter(s => s.enabled).map(s => s.id));
  const [includeMonetization, setIncludeMonetization] = useState(true);
  const [includeMarketing, setIncludeMarketing] = useState(true);
  const [includeAI, setIncludeAI] = useState(true);
  const [includeScaling, setIncludeScaling] = useState(true);
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
AIBLTY QUANTUM GENESIS ENGINE — ULTRA FULL-STACK BUILDER
═══════════════════════════════════════════════════════════════════════════════

MISSION: Build a ${selectedType?.name} that SURPASSES all existing solutions combined

BUSINESS CONCEPT
────────────────────────────────────────────────────────────────────────────────
Idea: ${businessIdea}
Target Market: ${targetMarket || 'Analyze and determine optimal market segments'}
Budget: ${budget || 'Optimize for maximum ROI with minimal initial investment'}
Application Type: ${selectedType?.name} (${selectedType?.desc})
Technology Stack: ${stackList}

${appType === 'voip' ? `
VOIP-SPECIFIC REQUIREMENTS (Surpass Twilio/Vonage/RingCentral)
────────────────────────────────────────────────────────────────────────────────
- WebRTC implementation for browser-based calls
- SIP trunking integration
- Voice synthesis and recognition
- Call routing and IVR systems
- Video conferencing with screen sharing
- SMS/MMS gateway integration
- Call recording and analytics
- Webhook callbacks for all events
- Multi-region redundancy
- Carrier-grade scalability (millions of concurrent calls)
` : ''}

${appType === 'caas' ? `
CAAS-SPECIFIC REQUIREMENTS (Surpass Twilio/SendGrid/Intercom)
────────────────────────────────────────────────────────────────────────────────
- Omnichannel messaging (SMS, Email, Chat, Voice, Video)
- Programmable APIs for all channels
- Webhook-driven event architecture
- Message queuing with guaranteed delivery
- Template management system
- Analytics and deliverability tracking
- Sender reputation management
- Multi-tenant architecture
- Enterprise-grade security
- Global edge network deployment
` : ''}

${appType === 'gpt' ? `
CUSTOM GPT REQUIREMENTS (Surpass ChatGPT/Claude/Gemini Combined)
────────────────────────────────────────────────────────────────────────────────
- Multi-modal capability (text, image, audio, video)
- Custom training pipeline with fine-tuning
- RAG (Retrieval Augmented Generation) integration
- Real-time web access and tool use
- Code execution sandbox
- Multi-agent orchestration
- Persistent memory across sessions
- Custom personality and expertise domains
- Streaming responses with low latency
- Enterprise security and compliance
- Seamless API for embedding
- Self-improvement and evolution capabilities
` : ''}

${appType === 'saas' ? `
SAAS-SPECIFIC REQUIREMENTS (Premium Multi-Tenant Platform)
────────────────────────────────────────────────────────────────────────────────
- Multi-tenant architecture with data isolation
- Subscription billing (Stripe integration)
- Usage-based pricing options
- White-labeling capabilities
- Admin dashboard for all tenants
- API with rate limiting
- Webhook system
- SSO/SAML integration
- Audit logging
- GDPR/SOC2 compliance built-in
` : ''}

GENERATION REQUIREMENTS (HIGHEST QUALITY)
────────────────────────────────────────────────────────────────────────────────
${includeMonetization ? '✓ MONETIZATION ENGINE - Complete revenue system with Stripe Connect, subscription tiers, usage billing, platform commission (10%)' : ''}
${includeMarketing ? '✓ AUTO-MARKETING SYSTEM - Viral loops, referral programs, SEO, social automation, growth hacking' : ''}
${includeAI ? '✓ AI INTEGRATION - Custom GPT capabilities, automation bots, intelligent features throughout' : ''}
${includeScaling ? '✓ INFINITE SCALING - Kubernetes configs, auto-scaling, global CDN, multi-region deployment' : ''}
✓ PREMIUM UI/UX - World-class design that converts
✓ SECURITY FORTRESS - Enterprise-grade security, encryption, compliance
✓ 10% PLATFORM REVENUE SHARE - Automatic commission via Stripe Connect

COMPLETE DELIVERABLES REQUIRED
────────────────────────────────────────────────────────────────────────────────

1. EXECUTIVE BLUEPRINT
   - Complete business model canvas
   - Unique value proposition that dominates market
   - Competitive moat analysis
   - 5-year vision and milestones

2. TECHNICAL ARCHITECTURE
   - Full system design diagrams (ASCII art)
   - Microservices architecture
   - Database schema with indexes
   - API specification (OpenAPI 3.0)
   - Event-driven architecture patterns
   - Caching strategy

3. FRONTEND SPECIFICATION
   - Complete UI/UX wireframes (detailed descriptions)
   - Component library (atomic design)
   - Responsive breakpoints
   - Animation and interaction patterns
   - Accessibility (WCAG 2.1 AAA)
   - Performance optimization (Core Web Vitals)

4. BACKEND SPECIFICATION
   - Complete API endpoints
   - Authentication & authorization flows
   - Database migrations
   - Background job processors
   - Rate limiting & throttling
   - Error handling patterns

5. AI/ML INTEGRATION
   - Custom model architecture
   - Training pipeline
   - Inference optimization
   - Prompt engineering templates
   - Embedding strategies
   - Agent orchestration

6. MONETIZATION ENGINE
   - Pricing strategy (GBP) with psychology
   - Subscription tier details
   - Stripe integration code
   - Platform commission handling (10% automatic)
   - Usage tracking and billing
   - Revenue forecasting models

7. MARKETING & GROWTH
   - Go-to-market strategy (90-day plan)
   - Viral coefficient optimization
   - SEO keyword strategy
   - Content calendar
   - Social automation scripts
   - Referral program mechanics
   - Influencer outreach templates

8. DEPLOYMENT & DEVOPS
   - Docker configurations
   - Kubernetes manifests
   - CI/CD pipeline (GitHub Actions)
   - Multi-environment setup
   - Monitoring & alerting
   - Disaster recovery plan

9. SECURITY & COMPLIANCE
   - Security architecture
   - GDPR compliance checklist
   - SOC 2 preparation
   - Penetration test scenarios
   - Encryption specifications
   - Access control matrix

10. FINANCIAL PROJECTIONS
    - 12-month revenue forecast
    - Unit economics
    - CAC/LTV analysis
    - Break-even timeline
    - Funding requirements (if applicable)
    - Exit strategy options

11. COMPLETE CODEBASE STRUCTURE
    - Directory tree
    - Key file contents
    - Integration patterns
    - Testing strategy
    - Documentation standards

12. LAUNCH CHECKLIST
    - Pre-launch verification
    - Launch day operations
    - Post-launch monitoring
    - Week 1 priorities

OUTPUT FORMAT: Production-ready specification that can be immediately implemented.
QUALITY STANDARD: Enterprise-grade, investor-ready, market-dominating.
    `.trim();

    setLoading(true);
    setResponse(null);
    
    // Show immediate feedback
    toast({
      title: 'Genesis Initiated',
      description: 'Building your full-stack specification...',
    });

    try {
      const aiResponse = await sendAIMessage(
        [{ role: 'user', content: fullPrompt }],
        'builder'
      );
      
      if (aiResponse.success) {
        setResponse(aiResponse.content);
        toast({ 
          title: 'Genesis Complete', 
          description: 'Your full-stack specification is ready!' 
        });
      } else {
        if (aiResponse.upgrade_required) {
          toast({
            title: 'Upgrade Required',
            description: aiResponse.error || 'Daily limit reached. Upgrade for more AI queries.',
            variant: 'destructive',
          });
        } else {
          toast({
            title: 'Error',
            description: aiResponse.error || 'Failed to generate. Please try again.',
            variant: 'destructive',
          });
        }
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to generate build specification. Please try again.',
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
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-gold/30 via-glow-elite/20 to-gold/30 flex items-center justify-center mx-auto mb-4 border border-gold/30 shadow-lg shadow-gold/20">
            <Rocket className="w-10 h-10 text-gold" />
          </div>
          <h1 className="text-3xl font-bold mb-2 gradient-text-premium font-display">Quantum Genesis Builder</h1>
          <p className="text-platinum max-w-2xl mx-auto">
            Build SaaS, VoIP, CaaS, Custom GPTs, and complete enterprises that 
            <span className="text-gold-light font-semibold"> surpass all existing solutions combined</span>.
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
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold/30 to-glow-elite/20 flex items-center justify-center border border-gold/20">
                <Crown className="w-5 h-5 text-gold" />
              </div>
              <div>
                <p className="font-semibold text-sm text-champagne">Revenue Share Program</p>
                <p className="text-xs text-platinum-dark">10% platform commission on all transactions — automatic Stripe Connect integration</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-glow-success">90% to you</p>
              <p className="text-xs text-platinum-dark">10% platform fee</p>
            </div>
          </div>
        </motion.div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="max-w-4xl mx-auto space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-muted/30 border border-gold/20">
            <TabsTrigger value="idea" className="data-[state=active]:bg-gold/20 data-[state=active]:text-champagne">1. Describe Idea</TabsTrigger>
            <TabsTrigger value="stack" className="data-[state=active]:bg-gold/20 data-[state=active]:text-champagne">2. Choose Stack</TabsTrigger>
            <TabsTrigger value="features" className="data-[state=active]:bg-gold/20 data-[state=active]:text-champagne">3. Features</TabsTrigger>
          </TabsList>

          <TabsContent value="idea">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="premium-card p-6 space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="idea" className="flex items-center gap-2 text-lg text-champagne">
                  <Lightbulb className="w-5 h-5 text-gold" />
                  Your Vision
                </Label>
                <Textarea
                  id="idea"
                  placeholder="Describe what you want to build in detail. Examples: 'A VoIP system that rivals Twilio', 'A custom GPT that outperforms ChatGPT', 'A SaaS platform for...'..."
                  value={businessIdea}
                  onChange={(e) => setBusinessIdea(e.target.value)}
                  rows={5}
                  className="bg-muted/30 border-gold/20 resize-none text-base focus:border-gold/50"
                  disabled={loading}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="market" className="flex items-center gap-2 text-champagne-dark">
                    <Users className="w-4 h-4 text-gold" />
                    Target Market
                  </Label>
                  <Input
                    id="market"
                    placeholder="e.g., Enterprise SaaS companies, Startups"
                    value={targetMarket}
                    onChange={(e) => setTargetMarket(e.target.value)}
                    className="bg-muted/30 border-gold/20 focus:border-gold/50"
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="budget" className="flex items-center gap-2 text-champagne-dark">
                    <DollarSign className="w-4 h-4 text-gold" />
                    Budget (optional)
                  </Label>
                  <Input
                    id="budget"
                    placeholder="e.g., £10,000 - £100,000"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="bg-muted/30 border-gold/20 focus:border-gold/50"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm text-champagne">Application Type</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {appTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setAppType(type.id)}
                      className={`p-4 rounded-xl border text-left transition-all relative ${
                        appType === type.id
                          ? 'border-gold bg-gold/10 shadow-lg shadow-gold/10'
                          : 'border-gold/20 bg-muted/20 hover:border-gold/40'
                      }`}
                    >
                      {type.premium && (
                        <div className="absolute -top-2 -right-2">
                          <Crown className="w-4 h-4 text-gold" />
                        </div>
                      )}
                      <type.icon className={`w-6 h-6 mb-2 ${appType === type.id ? 'text-gold' : 'text-platinum-dark'}`} />
                      <p className="font-medium text-sm text-champagne">{type.name}</p>
                      <p className="text-xs text-platinum-dark">{type.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              <Button onClick={() => setActiveTab('stack')} className="w-full gradient-gold" disabled={!businessIdea.trim()}>
                Next: Choose Stack <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </motion.div>
          </TabsContent>

          <TabsContent value="stack">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="premium-card p-6 space-y-4"
            >
              <Label className="text-lg flex items-center gap-2 text-champagne">
                <Layers className="w-5 h-5 text-gold" />
                Technology Stack
              </Label>
              <p className="text-sm text-platinum-dark">Select all components for your enterprise-grade application</p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {stackOptions.map((stack) => (
                  <button
                    key={stack.id}
                    onClick={() => toggleStack(stack.id)}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      selectedStack.includes(stack.id)
                        ? 'border-glow-success bg-glow-success/10'
                        : 'border-gold/20 bg-muted/20 hover:border-glow-success/50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <stack.icon className={`w-6 h-6 ${selectedStack.includes(stack.id) ? 'text-glow-success' : 'text-platinum-dark'}`} />
                      {selectedStack.includes(stack.id) && <CheckCircle className="w-4 h-4 text-glow-success" />}
                    </div>
                    <p className="font-medium text-sm text-champagne">{stack.name}</p>
                    <p className="text-xs text-platinum-dark">{stack.desc}</p>
                  </button>
                ))}
              </div>

              <div className="flex gap-4">
                <Button variant="outline" onClick={() => setActiveTab('idea')} className="border-gold/20 hover:bg-gold/5">
                  Back
                </Button>
                <Button onClick={() => setActiveTab('features')} className="flex-1 gradient-gold">
                  Next: Features <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </motion.div>
          </TabsContent>

          <TabsContent value="features">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="premium-card p-6 space-y-6"
            >
              <div>
                <Label className="text-lg flex items-center gap-2 mb-4 text-champagne">
                  <Sparkles className="w-5 h-5 text-gold" />
                  Enterprise Features
                </Label>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-muted/20 rounded-xl border border-gold/10">
                    <div className="flex items-center gap-4">
                      <DollarSign className="w-6 h-6 text-glow-success" />
                      <div>
                        <p className="font-medium text-champagne">Monetization Engine</p>
                        <p className="text-xs text-platinum-dark">Stripe Connect, subscriptions, usage billing, revenue optimization</p>
                      </div>
                    </div>
                    <Switch checked={includeMonetization} onCheckedChange={setIncludeMonetization} />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-muted/20 rounded-xl border border-gold/10">
                    <div className="flex items-center gap-4">
                      <TrendingUp className="w-6 h-6 text-gold" />
                      <div>
                        <p className="font-medium text-champagne">Auto-Marketing System</p>
                        <p className="text-xs text-platinum-dark">Viral loops, referral programs, SEO, social automation</p>
                      </div>
                    </div>
                    <Switch checked={includeMarketing} onCheckedChange={setIncludeMarketing} />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-muted/20 rounded-xl border border-gold/10">
                    <div className="flex items-center gap-4">
                      <Brain className="w-6 h-6 text-glow-elite" />
                      <div>
                        <p className="font-medium text-champagne">AI/GPT Integration</p>
                        <p className="text-xs text-platinum-dark">Custom models, intelligent automation, AI-powered features</p>
                      </div>
                    </div>
                    <Switch checked={includeAI} onCheckedChange={setIncludeAI} />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-muted/20 rounded-xl border border-gold/10">
                    <div className="flex items-center gap-4">
                      <Network className="w-6 h-6 text-glow-quantum" />
                      <div>
                        <p className="font-medium text-champagne">Infinite Scaling</p>
                        <p className="text-xs text-platinum-dark">Kubernetes, auto-scaling, global CDN, multi-region deployment</p>
                      </div>
                    </div>
                    <Switch checked={includeScaling} onCheckedChange={setIncludeScaling} />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gold/10 border border-gold/30 rounded-xl">
                    <div className="flex items-center gap-4">
                      <Crown className="w-6 h-6 text-gold" />
                      <div>
                        <p className="font-medium text-champagne">Revenue Share (10%)</p>
                        <p className="text-xs text-platinum-dark">Automatic commission collection via Stripe Connect</p>
                      </div>
                    </div>
                    <span className="text-xs bg-gold/20 text-gold px-3 py-1.5 rounded-full border border-gold/30">Required</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <Button variant="outline" onClick={() => setActiveTab('stack')} className="border-gold/20 hover:bg-gold/5">
                  Back
                </Button>
                <Button 
                  onClick={handleSubmit} 
                  className="flex-1 gradient-gold"
                  disabled={loading || !businessIdea.trim()}
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  ) : (
                    <Rocket className="w-5 h-5 mr-2" />
                  )}
                  {loading ? 'Genesis in Progress...' : 'Generate Complete Application'}
                </Button>
              </div>
            </motion.div>
          </TabsContent>
        </Tabs>

        {/* Response Area */}
        <AnimatePresence>
          {response && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-4xl mx-auto"
            >
              <div className="premium-card overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b border-gold/20 bg-gradient-to-r from-muted/50 via-gold/5 to-muted/50">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-glow-success" />
                    <span className="font-semibold text-champagne">Genesis Complete</span>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="ghost" onClick={() => setResponse(null)} className="hover:bg-gold/10">
                      <RefreshCw className="w-4 h-4 mr-1" /> New Build
                    </Button>
                    <Button size="sm" variant="ghost" onClick={handleCopy} className="hover:bg-gold/10">
                      {copied ? <Check className="w-4 h-4 mr-1" /> : <Copy className="w-4 h-4 mr-1" />}
                      {copied ? 'Copied' : 'Copy'}
                    </Button>
                  </div>
                </div>
                <div className="p-6 max-h-[600px] overflow-y-auto bg-gradient-to-b from-background to-obsidian">
                  <div className="prose prose-invert max-w-none">
                    <pre className="whitespace-pre-wrap text-sm text-platinum font-mono leading-relaxed">{response}</pre>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}
