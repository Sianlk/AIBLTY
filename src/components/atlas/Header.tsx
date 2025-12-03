import { motion } from "framer-motion";
import { AtlasLogo } from "./AtlasLogo";
import { StatusIndicator } from "./StatusIndicator";
import { Settings, Bell, Crown, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

export const Header = () => {
  const [revenue, setRevenue] = useState(847293.42);

  useEffect(() => {
    const interval = setInterval(() => {
      setRevenue(prev => prev + Math.random() * 10);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 px-4 md:px-6 py-3"
    >
      <div className="glass-panel px-4 md:px-6 py-3 flex items-center justify-between">
        <AtlasLogo />

        {/* Center - Live stats */}
        <div className="hidden lg:flex items-center gap-8">
          <StatusIndicator status="earning" />
          <div className="h-6 w-px bg-border" />
          <div className="flex items-center gap-2">
            <Wallet className="w-4 h-4 text-primary" />
            <span className="text-sm font-mono text-primary font-semibold">
              ${revenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <div className="h-6 w-px bg-border" />
          <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
            <span className="text-primary">v3.0.0</span>
            <span className="text-primary/40">|</span>
            <span>QUANTUM EDITION</span>
          </div>
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary hidden sm:flex">
            <Bell className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary hidden sm:flex">
            <Settings className="w-5 h-5" />
          </Button>
          <div className="w-px h-6 bg-border mx-1 hidden sm:block" />
          <Button variant="gold" size="sm" className="gap-2">
            <Crown className="w-4 h-4" />
            <span className="hidden sm:inline">Elite Access</span>
          </Button>
        </div>
      </div>
    </motion.header>
  );
};
