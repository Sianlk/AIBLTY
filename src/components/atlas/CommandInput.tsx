import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Sparkles, Loader2, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CommandInputProps {
  onSubmit: (command: string) => void;
  isProcessing?: boolean;
  placeholder?: string;
}

export const CommandInput = ({
  onSubmit,
  isProcessing = false,
  placeholder = "Command ATLAS to build, analyze, or automate anything...",
}: CommandInputProps) => {
  const [command, setCommand] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (command.trim() && !isProcessing) {
      onSubmit(command.trim());
      setCommand("");
    }
  };

  const suggestions = [
    "Build a SaaS platform with recurring revenue",
    "Create autonomous trading system",
    "Generate viral marketing campaign",
    "Deploy self-scaling infrastructure",
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="w-full max-w-4xl mx-auto"
    >
      <form onSubmit={handleSubmit} className="relative">
        {/* Outer glow container */}
        <div
          className={cn(
            "relative rounded-2xl p-[1px] transition-all duration-500",
            isFocused 
              ? "bg-gradient-to-r from-primary via-gold-light to-primary shadow-[0_0_40px_hsl(45,100%,50%,0.3)]" 
              : "bg-gradient-to-r from-primary/30 via-primary/50 to-primary/30"
          )}
        >
          <div className="glass-panel rounded-2xl overflow-hidden">
            <div className="flex items-center gap-3 p-4">
              <div className="w-10 h-10 rounded-xl gold-gradient flex items-center justify-center shrink-0">
                <Zap className="w-5 h-5 text-background" />
              </div>
              <input
                type="text"
                value={command}
                onChange={(e) => setCommand(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder={placeholder}
                disabled={isProcessing}
                className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground text-base"
              />
              <Button
                type="submit"
                variant="luxury"
                size="lg"
                disabled={!command.trim() || isProcessing}
                className="shrink-0"
              >
                {isProcessing ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span className="hidden sm:inline ml-2">Execute</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Animated underline */}
        <AnimatePresence>
          {isFocused && (
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              exit={{ scaleX: 0, opacity: 0 }}
              className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1/3 h-px bg-gradient-to-r from-transparent via-primary to-transparent"
            />
          )}
        </AnimatePresence>
      </form>

      {/* Quick suggestions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-6 flex flex-wrap gap-3 justify-center"
      >
        {suggestions.map((suggestion, index) => (
          <motion.button
            key={suggestion}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 + index * 0.1 }}
            whileHover={{ scale: 1.05, y: -2 }}
            onClick={() => setCommand(suggestion)}
            className="text-xs px-4 py-2 rounded-full bg-card/60 text-muted-foreground hover:bg-primary/20 hover:text-primary transition-all duration-300 font-mono border border-primary/10 hover:border-primary/30"
          >
            {suggestion}
          </motion.button>
        ))}
      </motion.div>
    </motion.div>
  );
};
