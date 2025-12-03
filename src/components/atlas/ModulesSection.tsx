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
} from "lucide-react";

const modules = [
  {
    icon: Rocket,
    title: "App Generator",
    description: "One-click full-stack application generation with complete architecture, APIs, and deployment.",
    status: "active" as const,
  },
  {
    icon: Brain,
    title: "Problem Solver",
    description: "Universal problem analysis with root cause identification and ranked solutions.",
    status: "ready" as const,
  },
  {
    icon: Building2,
    title: "Venture Foundry",
    description: "Complete business generation including models, pricing, go-to-market strategy.",
    status: "ready" as const,
  },
  {
    icon: Search,
    title: "Research Engine",
    description: "Deep research and insight generation across science, tech, economics, and more.",
    status: "ready" as const,
  },
  {
    icon: Sparkles,
    title: "Evolution Layer",
    description: "Continuous learning from your patterns and decisions for personalized assistance.",
    status: "coming" as const,
  },
  {
    icon: DollarSign,
    title: "Monetization Engine",
    description: "Automatic profit models, pricing strategies, and revenue optimization.",
    status: "ready" as const,
  },
  {
    icon: Plug,
    title: "Integration Hub",
    description: "Pre-built connections to Stripe, Google, Notion, and 100+ services.",
    status: "ready" as const,
  },
  {
    icon: Shield,
    title: "Blockchain Layer",
    description: "Optional document hashing, timestamps, and IP validation capabilities.",
    status: "coming" as const,
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
            System Modules
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Capability <span className="gradient-text">Matrix</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Eight interconnected modules working in harmony to transform your ideas into reality.
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
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
