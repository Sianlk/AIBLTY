import { motion } from "framer-motion";
import { Repeat, TrendingUp, Shield, Zap, Globe, Bot } from "lucide-react";

const features = [
  {
    icon: Repeat,
    title: "Self-Evolving",
    description: "Continuously improves its algorithms, learns from every interaction, and becomes exponentially smarter every second.",
  },
  {
    icon: Shield,
    title: "Self-Healing",
    description: "Automatically detects, diagnoses, and fixes any issues before they impact performance. Zero downtime guaranteed.",
  },
  {
    icon: TrendingUp,
    title: "Self-Marketing",
    description: "Deploys viral campaigns, optimizes ad spend, and scales customer acquisition autonomously across all channels.",
  },
  {
    icon: Zap,
    title: "Self-Optimizing",
    description: "Real-time performance tuning, resource allocation, and efficiency improvements without human intervention.",
  },
  {
    icon: Globe,
    title: "Self-Scaling",
    description: "Instantly expands to handle any load, enters new markets, and adapts to global demand patterns.",
  },
  {
    icon: Bot,
    title: "Self-Monetizing",
    description: "Identifies revenue opportunities, implements pricing strategies, and maximizes profit margins automatically.",
  },
];

export const AutonomousFeatures = () => {
  return (
    <section className="px-6 py-24 relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-xs font-mono text-primary tracking-[0.3em] uppercase mb-4 block">
            Autonomous Intelligence
          </span>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">
            <span className="gradient-text">Self-Operating</span> Systems
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            ATLAS requires zero human intervention. It thinks, learns, acts, and profits—completely autonomously.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative group"
            >
              <div className="glass-panel-hover p-8 h-full">
                {/* Animated border gradient */}
                <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute inset-[-1px] rounded-xl bg-gradient-to-r from-primary/50 via-transparent to-primary/50 animate-spin-slow" style={{ animationDuration: '8s' }} />
                </div>
                
                <div className="relative">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-transparent flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                    <feature.icon className="w-7 h-7 text-primary" />
                  </div>
                  
                  <h3 className="text-xl font-display font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
