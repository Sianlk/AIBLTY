import { motion } from "framer-motion";
import { AtlasLogo } from "./AtlasLogo";
import { Github, Twitter, Linkedin, Mail, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Footer = () => {
  return (
    <footer className="px-6 py-16 border-t border-primary/10 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative">
        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16 pb-16 border-b border-primary/10"
        >
          <h3 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
            Ready to <span className="gradient-text">Dominate</span>?
          </h3>
          <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
            Join the elite who have discovered autonomous wealth generation.
          </p>
          <Button variant="luxury" size="xl" className="gap-3">
            <Crown className="w-5 h-5" />
            Unlock ATLAS Genesis
          </Button>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <AtlasLogo />
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
              The world's most advanced autonomous wealth generation system. 
              Self-evolving. Self-healing. Unstoppable.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4 text-sm uppercase tracking-wider">Platform</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">Genesis Forge</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Empire Builder</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Revenue Automaton</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Quantum Mining</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4 text-sm uppercase tracking-wider">Resources</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">API Reference</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Case Studies</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">System Status</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4 text-sm uppercase tracking-wider">Legal</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">100% Ownership</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-primary/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground font-mono">
            © 2024 ATLAS GENESIS OS. You own 100% of everything generated.
          </p>
          
          <div className="flex items-center gap-4">
            <motion.a
              href="#"
              whileHover={{ scale: 1.1, color: "hsl(45, 100%, 50%)" }}
              className="text-muted-foreground transition-colors"
            >
              <Github className="w-5 h-5" />
            </motion.a>
            <motion.a
              href="#"
              whileHover={{ scale: 1.1, color: "hsl(45, 100%, 50%)" }}
              className="text-muted-foreground transition-colors"
            >
              <Twitter className="w-5 h-5" />
            </motion.a>
            <motion.a
              href="#"
              whileHover={{ scale: 1.1, color: "hsl(45, 100%, 50%)" }}
              className="text-muted-foreground transition-colors"
            >
              <Linkedin className="w-5 h-5" />
            </motion.a>
            <motion.a
              href="#"
              whileHover={{ scale: 1.1, color: "hsl(45, 100%, 50%)" }}
              className="text-muted-foreground transition-colors"
            >
              <Mail className="w-5 h-5" />
            </motion.a>
          </div>
        </div>
      </div>
    </footer>
  );
};
