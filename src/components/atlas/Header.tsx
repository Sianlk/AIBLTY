import { motion } from "framer-motion";
import { AtlasLogo } from "./AtlasLogo";
import { StatusIndicator } from "./StatusIndicator";
import { Settings, Bell, User } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Header = () => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
    >
      <div className="glass-panel px-6 py-3 flex items-center justify-between">
        <AtlasLogo />

        {/* Center status */}
        <div className="hidden md:flex items-center gap-6">
          <StatusIndicator status="online" label="SYSTEMS OPERATIONAL" />
          <div className="h-4 w-px bg-border" />
          <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
            <span className="text-primary">v2.0.0</span>
            <span>|</span>
            <span>GENESIS BUILD</span>
          </div>
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
            <Bell className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
            <Settings className="w-5 h-5" />
          </Button>
          <div className="w-px h-6 bg-border mx-2" />
          <Button variant="glass" size="sm" className="gap-2">
            <User className="w-4 h-4" />
            <span className="hidden sm:inline">Commander</span>
          </Button>
        </div>
      </div>
    </motion.header>
  );
};
