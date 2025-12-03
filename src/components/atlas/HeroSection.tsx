import { motion } from "framer-motion";
import { CommandInput } from "./CommandInput";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Sparkles, Shield, Infinity, Zap } from "lucide-react";

export const HeroSection = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleCommand = async (command: string) => {
    setIsProcessing(true);
    
    toast({
      title: "⚡ Command Acknowledged",
      description: `Initiating: "${command}"`,
    });

    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    toast({
      title: "🚀 Genesis Protocol Active",
      description: "Autonomous systems engaged. Revenue generation initiated.",
    });

    setIsProcessing(false);
  };

  const features = [
    { icon: Sparkles, label: "Self-Evolving" },
    { icon: Shield, label: "Self-Healing" },
    { icon: Infinity, label: "Unlimited Scale" },
    { icon: Zap, label: "Quantum Speed" },
  ];

  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-6 pt-28 pb-16 relative">
      {/* Decorative elements */}
      <motion.div
        className="absolute top-1/3 left-10 w-1 h-32 bg-gradient-to-b from-primary/50 to-transparent"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      />
      <motion.div
        className="absolute top-1/3 right-10 w-1 h-32 bg-gradient-to-b from-primary/50 to-transparent"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      />

      {/* Main content */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-12 max-w-5xl"
      >
        {/* Badge */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full border border-primary/30 bg-primary/5"
        >
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-xs font-mono text-primary tracking-[0.2em] uppercase">
            Quantum-Powered Autonomous Intelligence
          </span>
        </motion.div>
        
        {/* Headline */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold mb-8 leading-[0.9]">
          <span className="gradient-text glow-text-strong">The Future of</span>
          <br />
          <span className="text-foreground">Wealth Creation</span>
        </h1>
        
        {/* Subheadline */}
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-8">
          ATLAS GENESIS doesn't just build applications—it creates 
          <span className="text-primary"> autonomous empires</span> that evolve, market themselves, 
          and generate revenue while you sleep.
        </p>

        {/* Feature badges */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {features.map((feature, index) => (
            <motion.div
              key={feature.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-card/60 border border-primary/20"
            >
              <feature.icon className="w-4 h-4 text-primary" />
              <span className="text-sm text-foreground">{feature.label}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Command input */}
      <CommandInput onSubmit={handleCommand} isProcessing={isProcessing} />

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16"
      >
        {[
          { value: "$2.8B+", label: "Revenue Generated" },
          { value: "∞", label: "Possibilities" },
          { value: "0.001s", label: "Response Time" },
          { value: "100%", label: "Autonomous" },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 + index * 0.1 }}
            className="text-center"
          >
            <div className="text-3xl md:text-5xl font-display font-bold gradient-text glow-text mb-2">
              {stat.value}
            </div>
            <div className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
              {stat.label}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};
