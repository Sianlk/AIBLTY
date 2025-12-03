import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Sparkles, Loader2 } from "lucide-react";
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
  placeholder = "Build an app that...",
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
    "Build a task management app with AI prioritization",
    "Create an e-commerce platform with Stripe integration",
    "Design a social media dashboard with analytics",
    "Generate a portfolio website with CMS",
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="w-full max-w-3xl mx-auto"
    >
      <form onSubmit={handleSubmit} className="relative">
        {/* Main input container */}
        <div
          className={cn(
            "glass-panel transition-all duration-300 p-1",
            isFocused && "border-primary/50 shadow-lg shadow-primary/20"
          )}
        >
          <div className="flex items-center gap-2 p-3">
            <Sparkles className="w-5 h-5 text-primary shrink-0" />
            <input
              type="text"
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={placeholder}
              disabled={isProcessing}
              className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground font-mono text-sm"
            />
            <Button
              type="submit"
              variant="glow"
              size="sm"
              disabled={!command.trim() || isProcessing}
              className="shrink-0"
            >
              {isProcessing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Typing indicator line */}
        <AnimatePresence>
          {isFocused && (
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              exit={{ scaleX: 0 }}
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-primary to-transparent"
            />
          )}
        </AnimatePresence>
      </form>

      {/* Quick suggestions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-4 flex flex-wrap gap-2 justify-center"
      >
        {suggestions.map((suggestion, index) => (
          <motion.button
            key={suggestion}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 + index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            onClick={() => setCommand(suggestion)}
            className="text-xs px-3 py-1.5 rounded-full bg-muted/50 text-muted-foreground hover:bg-primary/20 hover:text-primary transition-all duration-200 font-mono"
          >
            {suggestion}
          </motion.button>
        ))}
      </motion.div>
    </motion.div>
  );
};
