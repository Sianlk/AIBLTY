import { GridBackground } from "@/components/atlas/GridBackground";
import { Header } from "@/components/aiblty/Header";
import { Footer } from "@/components/aiblty/Footer";
import { CommandInput } from "@/components/atlas/CommandInput";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { 
  Brain, Zap, TrendingUp, Settings, BarChart3, Rocket,
  Building2, Search, Sparkles, DollarSign, Plug, Shield,
  Cpu, Globe, Users, Lock, Server, Terminal, Code, Database,
  Atom, Layers, Network, LineChart, Bot, Wand2, ArrowRight,
  Check, ChevronRight, Blocks, ShoppingCart, LayoutDashboard, PieChart,
  Phone, MessageSquare, Mic, Video, Cloud, Workflow, Crown, Star
} from "lucide-react";

const modules = [
  { icon: Rocket, title: "App Generator", description: "One-click full-stack apps with complete architecture and deployment", status: "active", href: "/dashboard/builder" },
  { icon: Brain, title: "Intelligence Workspace", description: "Universal problem analysis with AI-powered solutions", status: "active", href: "/dashboard/solver" },
  { icon: Building2, title: "Business Builder", description: "Complete business models, pricing, and go-to-market strategies", status: "active", href: "/dashboard/builder" },
  { icon: Search, title: "Research Engine", description: "Deep research across science, tech, economics, and more", status: "active", href: "/dashboard/research" },
  { icon: DollarSign, title: "Revenue Suite", description: "Automated monetisation, pricing strategies, and revenue optimisation", status: "active", href: "/dashboard/revenue" },
  { icon: Zap, title: "Automation Engine", description: "Intelligent workflow automation and process optimisation", status: "active", href: "/dashboard/automation" },
  { icon: Plug, title: "Integration Hub", description: "Pre-built connections to Stripe, Google, Notion, and 100+ services", status: "active", href: "/dashboard/integrations" },
  { icon: Bot, title: "AI Workforce", description: "Autonomous agents for research, writing, SEO, and operations", status: "active", href: "/dashboard/ai-workforce" },
  { icon: Atom, title: "Quantum Engine", description: "Advanced computational algorithms and quantum-inspired optimisation", status: "active", href: "/dashboard/quantum" },
  { icon: Shield, title: "Security Layer", description: "Blockchain-style ledger, document hashing, and IP validation", status: "active", href: "/dashboard/security" },
  { icon: Sparkles, title: "Evolution Layer", description: "Self-learning system that adapts to your patterns", status: "active", href: "/dashboard/evolution" },
  { icon: Network, title: "Global Network", description: "Distributed infrastructure for worldwide deployment", status: "active", href: "/dashboard/network" },
];

const buildCapabilities = [
  { icon: Cloud, title: "SaaS Platforms", desc: "Full subscription-based software with multi-tenancy" },
  { icon: Phone, title: "VoIP Systems", desc: "Complete voice & video communication platforms" },
  { icon: MessageSquare, title: "CaaS Solutions", desc: "Communication-as-a-Service infrastructure" },
  { icon: Brain, title: "Custom GPTs", desc: "AI models surpassing all existing systems combined" },
  { icon: Workflow, title: "Enterprise Automation", desc: "End-to-end business process automation" },
  { icon: Globe, title: "Global Platforms", desc: "Multi-region, multi-language deployments" },
];

const capabilities = [
  { icon: Code, title: "Production-Ready Code", desc: "Complete, modular, scalable codebases" },
  { icon: Database, title: "Data Architecture", desc: "Optimised schemas and relationships" },
  { icon: Server, title: "Backend Systems", desc: "APIs, auth, and server logic" },
  { icon: Layers, title: "Frontend UI/UX", desc: "Beautiful, responsive interfaces" },
  { icon: LineChart, title: "Business Strategy", desc: "Monetisation and growth plans" },
  { icon: Globe, title: "Deploy Anywhere", desc: "One-click to production" },
];

const stats = [
  { value: "∞", label: "App Templates" },
  { value: "100%", label: "Code Ownership" },
  { value: "0", label: "Config Required" },
  { value: "<60s", label: "To Production" },
];

const pricingPlans = [
  {
    name: "Free",
    price: "£0",
    period: "/month",
    description: "Get started with core AI tools",
    features: ["5 AI queries/day", "1 Project", "Basic Problem Solver", "Community support"],
    cta: "Start Free",
    popular: false,
    tier: "free",
  },
  {
    name: "Pro",
    price: "£49",
    period: "/month",
    description: "For serious builders and entrepreneurs",
    features: ["Unlimited AI queries", "10 Projects", "All AI Tools", "Business Builder", "Automation Engine", "Priority support"],
    cta: "Upgrade to Pro",
    popular: true,
    tier: "pro",
  },
  {
    name: "Elite",
    price: "£199",
    period: "/month",
    description: "Maximum power for scaling ventures",
    features: ["Everything in Pro", "Unlimited Projects", "AI Workforce", "Quantum Engine", "White-label exports", "Dedicated support", "API access"],
    cta: "Go Elite",
    popular: false,
    tier: "elite",
  },
];

const terminalLines = [
  { type: "command", text: "> aiblty.genesis()" },
  { type: "success", text: "★ QUANTUM CORE ACTIVATED" },
  { type: "info", text: "→ Scanning requirements..." },
  { type: "success", text: "✓ AI Architecture synthesized" },
  { type: "info", text: "→ Generating full-stack blueprint..." },
  { type: "success", text: "✓ Database schema optimized" },
  { type: "success", text: "✓ API endpoints configured" },
  { type: "success", text: "✓ Authentication & security ready" },
  { type: "info", text: "→ Building premium UI/UX..." },
  { type: "success", text: "✓ Frontend components generated" },
  { type: "success", text: "✓ Backend services deployed" },
  { type: "success", text: "✓ Monetization engine integrated" },
  { type: "output", text: "" },
  { type: "success", text: "★★★ APPLICATION READY FOR LAUNCH ★★★" },
];

const examplePrompts = [
  "Build a SaaS platform with AI-powered analytics",
  "Create a VoIP system rivaling Twilio",
  "Generate a custom GPT that outperforms ChatGPT",
  "Design an enterprise CRM with full automation",
  "Build a marketplace with Stripe Connect",
];

const testimonials = [
  { quote: "AIBLTY built my entire SaaS in hours, not months.", author: "Tech Founder", company: "Stealth Startup" },
  { quote: "The AI Workforce replaced my entire dev team's grunt work.", author: "CTO", company: "Series B Company" },
  { quote: "Revenue went from £0 to £50k/month using their automation.", author: "Solo Entrepreneur", company: "Digital Agency" },
];

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [visibleLines, setVisibleLines] = useState(0);
  const [currentExample, setCurrentExample] = useState(0);

  useEffect(() => {
    if (visibleLines < terminalLines.length) {
      const timer = setTimeout(() => setVisibleLines(prev => prev + 1), 250);
      return () => clearTimeout(timer);
    }
  }, [visibleLines]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentExample(prev => (prev + 1) % examplePrompts.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const handleCommand = async (command: string) => {
    setIsProcessing(true);
    toast({ title: "Command Received", description: `Processing: "${command}"` });
    await new Promise(r => setTimeout(r, 1500));
    toast({ title: "Intelligence Protocol Initiated", description: "Redirecting to dashboard..." });
    setIsProcessing(false);
    navigate('/auth');
  };

  const getLineColor = (type: string) => {
    switch (type) {
      case "command": return "text-champagne";
      case "success": return "text-glow-success";
      case "info": return "text-platinum-dark";
      default: return "text-foreground";
    }
  };

  return (
    <div className="relative min-h-screen bg-background overflow-x-hidden">
      <GridBackground />
      <Header />
      
      <main>
        {/* Hero Section - Ultra Premium */}
        <section className="min-h-screen flex flex-col items-center justify-center px-6 pt-24 pb-12 relative">
          {/* Premium gold ambient effects */}
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-gold/10 rounded-full blur-[150px] pointer-events-none" />
          <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] bg-gold-light/8 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gold-dark/5 rounded-full blur-[200px] pointer-events-none" />
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12 relative z-10"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-8"
            >
              <span className="inline-flex items-center gap-2 elite-badge mb-6 shimmer">
                <Crown className="w-3.5 h-3.5" />
                Autonomous Intelligence Platform
                <Crown className="w-3.5 h-3.5" />
              </span>
            </motion.div>
            
            <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-bold mb-8 font-display tracking-wide leading-[1.1]">
              <span className="gradient-text-premium glow-text-strong">One Command.</span>
              <br />
              <span className="text-foreground">Infinite Possibilities.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-platinum max-w-3xl mx-auto leading-relaxed font-elegant">
              Transform ideas into production-ready SaaS, VoIP, CaaS, GPTs, and complete enterprises.
              <br />
              <span className="text-champagne font-semibold"> AIBLTY</span> — the ultimate AI ability — 
              <span className="text-gold-light"> surpassing all AI systems combined.</span>
            </p>
          </motion.div>

          {/* Example Prompts Rotation */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mb-8 text-center"
          >
            <p className="text-sm text-platinum-dark mb-3 font-elegant italic">Build the impossible...</p>
            <motion.p
              key={currentExample}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-champagne font-medium text-lg"
            >
              "{examplePrompts[currentExample]}"
            </motion.p>
          </motion.div>

          <CommandInput onSubmit={handleCommand} isProcessing={isProcessing} placeholder="Build an AI-powered business that..." />

          {/* Stats - Ultra Premium Style */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16"
          >
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 + i * 0.1 }}
                className="text-center relative group"
              >
                <div className="text-4xl md:text-5xl font-bold text-primary glow-text font-display mb-2 group-hover:scale-110 transition-transform">
                  {stat.value}
                </div>
                <div className="text-xs font-mono text-platinum-dark uppercase tracking-[0.2em]">{stat.label}</div>
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-16 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent" />
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* What We Build Section */}
        <section className="px-6 py-24 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gold/[0.02] to-transparent pointer-events-none" />
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <span className="inline-flex items-center gap-2 text-xs font-mono text-gold-light tracking-[0.3em] uppercase mb-4">
                <Star className="w-3 h-3" />
                Supreme Capabilities
                <Star className="w-3 h-3" />
              </span>
              <h2 className="text-3xl md:text-5xl font-bold mb-4 font-display">
                Build <span className="gradient-text-premium">Anything</span>
              </h2>
              <p className="text-platinum max-w-2xl mx-auto text-lg">
                From SaaS to VoIP, from custom GPTs to enterprise automation — 
                capabilities that surpass every AI system combined.
              </p>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {buildCapabilities.map((cap, i) => (
                <motion.div
                  key={cap.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="premium-card p-5 text-center group cursor-pointer"
                >
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gold/20 via-gold-dark/10 to-gold/20 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform border border-gold/20">
                    <cap.icon className="w-7 h-7 text-gold-light" />
                  </div>
                  <h3 className="text-sm font-bold mb-1 text-champagne">{cap.title}</h3>
                  <p className="text-xs text-platinum-dark">{cap.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Terminal Demo - Enhanced */}
        <section className="px-6 py-24">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="premium-card overflow-hidden"
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-gold/20 bg-gradient-to-r from-muted/50 via-gold/5 to-muted/50">
                <div className="flex items-center gap-4">
                  <div className="flex gap-2">
                    <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-br from-red-400 to-red-600 shadow-lg shadow-red-500/30" />
                    <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 shadow-lg shadow-amber-500/30" />
                    <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-500/30" />
                  </div>
                  <div className="flex items-center gap-2 text-sm font-mono text-champagne-dark">
                    <Terminal className="w-4 h-4" />
                    <span>aiblty-quantum-core</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="status-online" />
                  <span className="text-xs text-glow-success font-mono">ONLINE</span>
                </div>
              </div>
              <div className="p-6 font-mono text-sm space-y-2 min-h-[400px] bg-gradient-to-b from-background to-obsidian">
                {terminalLines.slice(0, visibleLines).map((line, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`${getLineColor(line.type)} ${line.type === 'success' ? 'font-semibold' : ''}`}
                  >
                    {line.text}
                  </motion.div>
                ))}
                {visibleLines < terminalLines.length && (
                  <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                    className="inline-block w-3 h-5 bg-gold ml-1 rounded-sm"
                  />
                )}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Capabilities */}
        <section className="px-6 py-24 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-gold/[0.02] via-transparent to-gold/[0.02] pointer-events-none" />
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <span className="text-xs font-mono text-gold-light tracking-[0.3em] uppercase mb-4 block">
                Complete Output
              </span>
              <h2 className="text-3xl md:text-5xl font-bold mb-4 font-display">
                Production-Ready <span className="gradient-text-premium">Everything</span>
              </h2>
              <p className="text-platinum max-w-xl mx-auto">
                Every output is complete, documented, and ready for deployment.
              </p>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {capabilities.map((cap, i) => (
                <motion.div
                  key={cap.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-panel-hover p-5 text-center"
                >
                  <cap.icon className="w-8 h-8 text-gold mx-auto mb-3" />
                  <h3 className="text-sm font-semibold mb-1 text-champagne">{cap.title}</h3>
                  <p className="text-xs text-platinum-dark">{cap.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Modules Grid */}
        <section className="px-6 py-24" id="features">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <span className="text-xs font-mono text-gold-light tracking-[0.3em] uppercase mb-4 block">
                System Modules
              </span>
              <h2 className="text-3xl md:text-5xl font-bold mb-4 font-display">
                Capability <span className="gradient-text-premium">Matrix</span>
              </h2>
              <p className="text-platinum max-w-xl mx-auto">
                Twelve interconnected modules working in harmony to transform your ideas into reality.
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {modules.map((module, i) => (
                <motion.div
                  key={module.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link to={module.href} className="block premium-card p-6 relative group h-full">
                    <div className="absolute inset-0 bg-gradient-to-br from-gold/0 via-gold/5 to-gold/0 opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl" />
                    <div className="relative z-10">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gold/20 to-gold-dark/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform border border-gold/20">
                        <module.icon className="w-6 h-6 text-gold-light" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2 text-champagne">{module.title}</h3>
                      <p className="text-sm text-platinum-dark mb-4">{module.description}</p>
                      <span className="inline-block text-xs px-3 py-1.5 rounded-full bg-gold/10 text-gold-light border border-gold/20">
                        Available
                      </span>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gold absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1" />
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="px-6 py-24 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-glow-elite/[0.02] to-transparent pointer-events-none" />
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <span className="text-xs font-mono text-gold-light tracking-[0.3em] uppercase mb-4 block">
                Success Stories
              </span>
              <h2 className="text-3xl md:text-5xl font-bold mb-4 font-display">
                Trusted by <span className="gradient-text-premium">Visionaries</span>
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((t, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="premium-card p-6"
                >
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} className="w-4 h-4 text-gold fill-gold" />
                    ))}
                  </div>
                  <p className="text-platinum mb-4 font-elegant text-lg italic">"{t.quote}"</p>
                  <div>
                    <p className="font-semibold text-champagne">{t.author}</p>
                    <p className="text-xs text-platinum-dark">{t.company}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="px-6 py-24" id="pricing">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <span className="text-xs font-mono text-gold-light tracking-[0.3em] uppercase mb-4 block">
                Investment Tiers
              </span>
              <h2 className="text-3xl md:text-5xl font-bold mb-4 font-display">
                Choose Your <span className="gradient-text-premium">Power Level</span>
              </h2>
              <p className="text-platinum max-w-xl mx-auto">
                Start free, scale infinitely. All plans include core AI capabilities.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {pricingPlans.map((plan, i) => (
                <motion.div
                  key={plan.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={`relative ${plan.popular ? 'md:-mt-4 md:mb-4' : ''}`}
                >
                  {plan.popular && (
                    <div className="absolute -top-5 left-1/2 -translate-x-1/2 z-20">
                      <span className="elite-badge flex items-center gap-2">
                        <Crown className="w-3.5 h-3.5" />
                        Most Popular
                      </span>
                    </div>
                  )}
                  <div className={`h-full ${plan.popular ? 'premium-card' : 'glass-panel'} p-8 relative overflow-hidden`}>
                    {plan.popular && (
                      <div className="absolute inset-0 bg-gradient-to-br from-gold/10 via-transparent to-glow-elite/10 pointer-events-none" />
                    )}
                    <div className="relative z-10">
                      <h3 className="text-xl font-bold font-display text-champagne mb-2">{plan.name}</h3>
                      <div className="flex items-baseline gap-1 mb-4">
                        <span className="text-4xl font-bold gradient-text-premium">{plan.price}</span>
                        <span className="text-platinum-dark">{plan.period}</span>
                      </div>
                      <p className="text-sm text-platinum-dark mb-6">{plan.description}</p>
                      
                      <ul className="space-y-3 mb-8">
                        {plan.features.map((feature, j) => (
                          <li key={j} className="flex items-center gap-3 text-sm text-platinum">
                            <div className="w-5 h-5 rounded-full bg-gold/20 flex items-center justify-center flex-shrink-0">
                              <Check className="w-3 h-3 text-gold" />
                            </div>
                            {feature}
                          </li>
                        ))}
                      </ul>
                      
                      <Link to="/auth">
                        <Button 
                          className={`w-full ${plan.popular ? 'gradient-gold' : 'bg-muted hover:bg-muted/80 border border-gold/20'}`}
                          size="lg"
                        >
                          {plan.cta}
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-6 py-32 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gold/[0.03] to-transparent pointer-events-none" />
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="inline-flex items-center gap-2 elite-badge mb-8 shimmer">
                <Sparkles className="w-3.5 h-3.5" />
                Begin Your Journey
                <Sparkles className="w-3.5 h-3.5" />
              </span>
              <h2 className="text-4xl md:text-6xl font-bold mb-6 font-display">
                Ready to Build the
                <br />
                <span className="gradient-text-premium">Impossible?</span>
              </h2>
              <p className="text-xl text-platinum mb-10 max-w-2xl mx-auto">
                Join the elite builders using AIBLTY to create world-class products, 
                generate unprecedented revenue, and redefine what's possible.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/auth">
                  <Button size="lg" className="gradient-gold text-lg px-10 py-6 h-auto">
                    Start Building Free
                    <Rocket className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Link to="/docs">
                  <Button size="lg" variant="outline" className="text-lg px-10 py-6 h-auto border-gold/30 hover:border-gold/50 hover:bg-gold/5">
                    Explore Documentation
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
