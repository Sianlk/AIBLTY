import { motion } from "framer-motion";
import { CommandInput } from "./CommandInput";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export const HeroSection = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleCommand = async (command: string) => {
    setIsProcessing(true);
    
    toast({
      title: "Command Received",
      description: `Processing: "${command}"`,
    });

    // Simulate processing
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    toast({
      title: "Genesis Protocol Initiated",
      description: "Your application architecture is being generated...",
    });

    setIsProcessing(false);
  };

  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-6 pt-24 pb-12">
      {/* Main title */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <span className="text-xs font-mono text-primary tracking-[0.3em] uppercase">
            Autonomous Development System
          </span>
        </motion.div>
        
        <h1 className="text-5xl md:text-7xl font-bold mb-6">
          <span className="gradient-text glow-text-strong">One Command.</span>
          <br />
          <span className="text-foreground">Infinite Possibilities.</span>
        </h1>
        
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Transform ideas into production-ready applications with a single instruction.
          <span className="text-primary"> ATLAS</span> handles architecture, code, deployment, and everything in between.
        </p>
      </motion.div>

      {/* Command input */}
      <CommandInput onSubmit={handleCommand} isProcessing={isProcessing} />

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8"
      >
        {[
          { value: "∞", label: "App Templates" },
          { value: "100%", label: "Code Ownership" },
          { value: "0", label: "Config Required" },
          { value: "<60s", label: "To Production" },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 + index * 0.1 }}
            className="text-center"
          >
            <div className="text-3xl md:text-4xl font-bold text-primary glow-text mb-1">
              {stat.value}
            </div>
            <div className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
              {stat.label}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};
