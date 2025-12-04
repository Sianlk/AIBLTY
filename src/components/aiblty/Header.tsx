import { motion } from "framer-motion";
import { AibltyLogo } from "./AibltyLogo";
import { Settings, Bell, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const Header = () => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
    >
      <div className="glass-panel px-6 py-3 flex items-center justify-between">
        <Link to="/"><AibltyLogo /></Link>

        <div className="hidden md:flex items-center gap-6">
          <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
            <span className="text-primary">v1.0</span>
            <span>|</span>
            <span>PLATFORM ACTIVE</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/pricing">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
              Pricing
            </Button>
          </Link>
          <Link to="/auth">
            <Button variant="glass" size="sm" className="gap-2">
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Sign In</span>
            </Button>
          </Link>
        </div>
      </div>
    </motion.header>
  );
};
