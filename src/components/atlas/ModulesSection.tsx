import { motion } from "framer-motion";
import { ModuleCard } from "./ModuleCard";
import {
  Rocket,
  Brain,
  Building2,
  Search,
  Sparkles,
  DollarSign,
  Plug,
  Shield,
  Cpu,
  Globe,
  Zap,
  TrendingUp,
  Bot,
  Coins,
  Network,
  Lock,
} from "lucide-react";

const modules = [
  {
    icon: Rocket,
    title: "Genesis App Forge",
    description: "One-command full-stack deployment. Frontend, backend, APIs, auth, payments—instant production.",
    status: "premium" as const,
    stats: [{ label: "Apps Built", value: "∞" }, { label: "Deploy Time", value: "<60s" }],
  },
  {
    icon: Brain,
    title: "Quantum Intelligence",
    description: "Self-evolving neural networks that learn, adapt, and optimize beyond human capability.",
    status: "evolving" as const,
    stats: [{ label: "IQ Level", value: "∞" }, { label: "Learning", value: "24/7" }],
  },
  {
    icon: Building2,
    title: "Empire Builder",
    description: "Complete business creation with revenue models, marketing funnels, and automated scaling.",
    status: "premium" as const,
    stats: [{ label: "Businesses", value: "847" }, { label: "Success", value: "99.7%" }],
  },
  {
    icon: DollarSign,
    title: "Revenue Automaton",
    description: "Autonomous profit generation through multi-channel monetization and dynamic pricing.",
    status: "active" as const,
    stats: [{ label: "Daily Rev", value: "$2.8M" }, { label: "Growth", value: "+347%" }],
  },
  {
    icon: Bot,
    title: "Marketing Swarm",
    description: "Self-propagating viral campaigns across all platforms with autonomous optimization.",
    status: "active" as const,
    stats: [{ label: "Reach", value: "847M" }, { label: "Viral", value: "100%" }],
  },
  {
    icon: Coins,
    title: "Quantum Mining",
    description: "Next-gen blockchain mining with quantum-enhanced efficiency and zero energy waste.",
    status: "premium" as const,
    stats: [{ label: "Hash Rate", value: "∞" }, { label: "Efficiency", value: "99.9%" }],
  },
  {
    icon: Search,
    title: "Omniscient Research",
    description: "Access to all human knowledge synthesized and analyzed in real-time.",
    status: "ready" as const,
    stats: [{ label: "Sources", value: "∞" }, { label: "Accuracy", value: "100%" }],
  },
  {
    icon: Sparkles,
    title: "Self-Evolution Engine",
    description: "Continuous improvement without human intervention. Gets smarter every millisecond.",
    status: "evolving" as const,
    stats: [{ label: "Updates", value: "∞/sec" }, { label: "Version", value: "∞" }],
  },
  {
    icon: Shield,
    title: "Invincible Security",
    description: "Quantum-encrypted, self-healing defense system. Unhackable by design.",
    status: "active" as const,
    stats: [{ label: "Threats", value: "0" }, { label: "Uptime", value: "100%" }],
  },
  {
    icon: Plug,
    title: "Universal Integrator",
    description: "Instant connection to every API, service, and platform in existence.",
    status: "ready" as const,
    stats: [{ label: "APIs", value: "∞" }, { label: "Latency", value: "0ms" }],
  },
  {
    icon: Network,
    title: "Blockchain Nexus",
    description: "Multi-chain smart contracts, NFTs, DeFi protocols with autonomous optimization.",
    status: "premium" as const,
    stats: [{ label: "Chains", value: "All" }, { label: "Gas", value: "0" }],
  },
  {
    icon: Lock,
    title: "Self-Repair Matrix",
    description: "Autonomous bug detection and resolution. Zero downtime, infinite reliability.",
    status: "evolving" as const,
    stats: [{ label: "Bugs", value: "0" }, { label: "Fix Time", value: "0ms" }],
  },
  {
    icon: TrendingUp,
    title: "Predictive Oracle",
    description: "Market predictions, trend analysis, and opportunity detection with 99.97% accuracy.",
    status: "active" as const,
    stats: [{ label: "Accuracy", value: "99.97%" }, { label: "Predictions", value: "∞" }],
  },
  {
    icon: Globe,
    title: "Global Domination",
    description: "Multi-language, multi-currency, multi-market expansion on autopilot.",
    status: "ready" as const,
    stats: [{ label: "Markets", value: "195" }, { label: "Languages", value: "∞" }],
  },
  {
    icon: Cpu,
    title: "Infinite Compute",
    description: "Unlimited processing power through distributed quantum cloud architecture.",
    status: "premium" as const,
    stats: [{ label: "Power", value: "∞" }, { label: "Cost", value: "$0" }],
  },
  {
    icon: Zap,
    title: "Instant Deployment",
    description: "From concept to global deployment in under one second. No configuration needed.",
    status: "active" as const,
    stats: [{ label: "Speed", value: "<1s" }, { label: "Regions", value: "∞" }],
  },
];

export const ModulesSection = () => {
  return (
    <section className="px-6 py-24">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-xs font-mono text-primary tracking-[0.3em] uppercase mb-4 block">
            Capability Matrix
          </span>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">
            <span className="gradient-text">Infinite</span> Power Modules
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Sixteen autonomous systems working in perfect harmony to dominate every market.
          </p>
        </motion.div>

        {/* Module grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {modules.map((module, index) => (
            <ModuleCard
              key={module.title}
              icon={module.icon}
              title={module.title}
              description={module.description}
              status={module.status}
              stats={module.stats}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
