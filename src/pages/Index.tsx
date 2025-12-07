import { GridBackground } from "@/components/atlas/GridBackground";
import { Header } from "@/components/aiblty/Header";
import { Footer } from "@/components/aiblty/Footer";
import { CommandInput } from "@/components/atlas/CommandInput";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { 
  Brain, Zap, TrendingUp, Settings, BarChart3, Rocket,
  Building2, Search, Sparkles, DollarSign, Plug, Shield,
  Cpu, Globe, Users, Lock, Server, Terminal, Code, Database,
  Atom, Layers, Network, LineChart, Bot, Wand2, ArrowRight,
  Check, ChevronRight, Blocks, ShoppingCart, LayoutDashboard, PieChart
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
  },
  {
    name: "Pro",
    price: "£49",
    period: "/month",
    description: "For serious builders and entrepreneurs",
    features: ["Unlimited AI queries", "10 Projects", "All AI Tools", "Business Builder", "Automation Engine", "Priority support"],
    cta: "Upgrade to Pro",
    popular: true,
  },
  {
    name: "Elite",
    price: "£199",
    period: "/month",
    description: "Maximum power for scaling ventures",
    features: ["Everything in Pro", "Unlimited Projects", "AI Workforce", "Quantum Engine", "White-label exports", "Dedicated support", "API access"],
    cta: "Go Elite",
    popular: false,
  },
];

const terminalLines = [
  { type: "command", text: "> aiblty.init()" },
  { type: "success", text: "✓ Intelligence Core activated" },
  { type: "info", text: "→ Scanning requirements..." },
  { type: "info", text: "→ Generating architecture..." },
  { type: "success", text: "✓ Database schema created" },
  { type: "success", text: "✓ API endpoints configured" },
  { type: "success", text: "✓ Authentication ready" },
  { type: "info", text: "→ Building components..." },
  { type: "success", text: "✓ UI/UX screens generated" },
  { type: "success", text: "✓ Deployment ready" },
  { type: "output", text: "" },
  { type: "success", text: "★ APPLICATION READY FOR LAUNCH" },
];

const examplePrompts = [
  "Build a task management app with AI prioritisation",
  "Create an e-commerce platform with Stripe integration",
  "Design a social media dashboard with analytics",
  "Generate a portfolio website with CMS",
];

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [visibleLines, setVisibleLines] = useState(0);
  const [currentExample, setCurrentExample] = useState(0);

  useEffect(() => {
    if (visibleLines < terminalLines.length) {
      const timer = setTimeout(() => setVisibleLines(prev => prev + 1), 300);
      return () => clearTimeout(timer);
    }
  }, [visibleLines]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentExample(prev => (prev + 1) % examplePrompts.length);
    }, 3000);
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
      case "command": return "text-primary";
      case "success": return "text-emerald-400";
      case "info": return "text-muted-foreground";
      default: return "text-foreground";
    }
  };

  return (
    <div className="relative min-h-screen bg-background overflow-x-hidden">
      <GridBackground />
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="min-h-screen flex flex-col items-center justify-center px-6 pt-24 pb-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-6"
            >
              <span className="text-xs font-mono text-primary tracking-[0.3em] uppercase">
                Autonomous Intelligence Platform
              </span>
            </motion.div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 font-display">
              <span className="text-primary glow-text">One Command.</span>
              <br />
              <span className="text-foreground">Infinite Possibilities.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Transform ideas into production-ready applications, businesses, and revenue streams.
              <span className="text-gold-light font-semibold"> AIBLTY</span> handles architecture, code, deployment, and everything in between.
            </p>
          </motion.div>

          {/* Example Prompts Rotation */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mb-6 text-center"
          >
            <p className="text-sm text-muted-foreground mb-2">Build an AI-powered business that...</p>
            <motion.p
              key={currentExample}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-primary font-medium"
            >
              "{examplePrompts[currentExample]}"
            </motion.p>
          </motion.div>

          <CommandInput onSubmit={handleCommand} isProcessing={isProcessing} placeholder="Build an AI-powered business that..." />

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 + i * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold text-gold-light glow-text mb-1">{stat.value}</div>
                <div className="text-xs font-mono text-platinum uppercase tracking-wider">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Terminal Demo */}
        <section className="px-6 py-24">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass-panel overflow-hidden"
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-border/50 bg-muted/30">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-destructive/80" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  </div>
                  <div className="flex items-center gap-2 text-sm font-mono text-muted-foreground">
                    <Terminal className="w-4 h-4" />
                    <span>aiblty-terminal</span>
                  </div>
                </div>
              </div>
              <div className="p-6 font-mono text-sm space-y-2 min-h-[350px] bg-background/50">
                {terminalLines.slice(0, visibleLines).map((line, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={getLineColor(line.type)}
                  >
                    {line.text}
                  </motion.div>
                ))}
                {visibleLines < terminalLines.length && (
                  <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                    className="inline-block w-2 h-4 bg-primary ml-1"
                  />
                )}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Capabilities */}
        <section className="px-6 py-24 bg-muted/10">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <span className="text-xs font-mono text-primary tracking-[0.3em] uppercase mb-4 block">
                Complete Output
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 font-display">
                Production-Ready <span className="text-primary">Everything</span>
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
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
                  className="glass-panel p-4 text-center"
                >
                  <cap.icon className="w-8 h-8 text-primary mx-auto mb-3" />
                  <h3 className="text-sm font-semibold mb-1">{cap.title}</h3>
                  <p className="text-xs text-muted-foreground">{cap.desc}</p>
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
              <span className="text-xs font-mono text-primary tracking-[0.3em] uppercase mb-4 block">
                System Modules
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 font-display">
                Capability <span className="text-primary">Matrix</span>
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
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
                  <Link to={module.href} className="block glass-panel-hover p-6 relative group h-full">
                    <module.icon className="w-10 h-10 text-primary mb-4" />
                    <h3 className="text-lg font-semibold mb-2">{module.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{module.description}</p>
                    <span className={`inline-block text-xs px-2 py-1 rounded ${
                      module.status === 'active' ? 'bg-primary/20 text-primary' : 
                      module.status === 'ready' ? 'bg-emerald-500/20 text-emerald-400' :
                      'bg-muted text-muted-foreground'
                    }`}>
                      {module.status === 'active' ? 'Available' : module.status === 'ready' ? 'Ready' : 'Coming Soon'}
                    </span>
                    <ArrowRight className="w-4 h-4 text-primary absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="px-6 py-24 bg-muted/10" id="pricing">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <span className="text-xs font-mono text-primary tracking-[0.3em] uppercase mb-4 block">
                Investment Tiers
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 font-display">
                Choose Your <span className="text-primary">Power Level</span>
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
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
                  className={`glass-panel p-8 relative ${plan.popular ? 'border-primary ring-2 ring-primary/20' : ''}`}
                >
                  {plan.popular && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs px-3 py-1 rounded-full font-medium">
                      Most Popular
                    </span>
                  )}
                  <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-6">{plan.description}</p>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm">
                        <Check className="w-4 h-4 text-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Link to="/pricing">
                    <Button variant={plan.popular ? "glow" : "outline"} className="w-full">
                      {plan.cta}
                    </Button>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-6 py-24">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="glass-panel p-12"
            >
              <Wand2 className="w-12 h-12 text-primary mx-auto mb-6" />
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Build the Future?
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto mb-8">
                Join thousands of entrepreneurs and developers using AIBLTY to transform ideas into reality.
              </p>
              <div className="flex gap-4 justify-center">
                <Link to="/auth">
                  <Button size="lg" variant="glow">
                    Get Started Free
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Link to="/pricing">
                  <Button size="lg" variant="outline">
                    View Pricing
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
