import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Terminal, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const terminalLines = [
  { type: "command", text: "> atlas.init()" },
  { type: "success", text: "✓ Genesis Protocol activated" },
  { type: "info", text: "→ Scanning user requirements..." },
  { type: "info", text: "→ Generating system architecture..." },
  { type: "success", text: "✓ Database schema created" },
  { type: "success", text: "✓ API endpoints configured" },
  { type: "success", text: "✓ Authentication layer ready" },
  { type: "info", text: "→ Building frontend components..." },
  { type: "success", text: "✓ UI/UX screens generated" },
  { type: "success", text: "✓ Deployment pipeline configured" },
  { type: "output", text: "" },
  { type: "success", text: "★ APPLICATION READY FOR LAUNCH" },
];

export const TerminalDisplay = () => {
  const [visibleLines, setVisibleLines] = useState<number>(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (visibleLines < terminalLines.length) {
      const timer = setTimeout(() => {
        setVisibleLines((prev) => prev + 1);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [visibleLines]);

  const handleCopy = () => {
    const text = terminalLines.map((l) => l.text).join("\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getLineColor = (type: string) => {
    switch (type) {
      case "command":
        return "text-primary";
      case "success":
        return "text-glow-success";
      case "info":
        return "text-muted-foreground";
      case "output":
        return "text-foreground";
      default:
        return "text-foreground";
    }
  };

  return (
    <section className="px-6 py-24">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-panel overflow-hidden"
        >
          {/* Terminal header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border/50 bg-muted/30">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-destructive/80" />
                <div className="w-3 h-3 rounded-full bg-glow-warning/80" />
                <div className="w-3 h-3 rounded-full bg-glow-success/80" />
              </div>
              <div className="flex items-center gap-2 text-sm font-mono text-muted-foreground">
                <Terminal className="w-4 h-4" />
                <span>atlas-terminal</span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className="text-muted-foreground hover:text-foreground"
            >
              {copied ? (
                <Check className="w-4 h-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>
          </div>

          {/* Terminal content */}
          <div className="p-6 font-mono text-sm space-y-2 min-h-[400px] bg-background/50">
            {terminalLines.slice(0, visibleLines).map((line, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
                className={getLineColor(line.type)}
              >
                {line.text}
              </motion.div>
            ))}
            
            {/* Cursor */}
            {visibleLines < terminalLines.length && (
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.5, repeat: Infinity }}
                className="inline-block w-2 h-4 bg-primary ml-1"
              />
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
