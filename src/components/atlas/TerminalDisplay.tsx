import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Terminal, Copy, Check, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

const terminalLines = [
  { type: "command", text: "> atlas.quantum.init()" },
  { type: "success", text: "✓ Quantum cores synchronized" },
  { type: "info", text: "→ Initializing self-evolution protocols..." },
  { type: "success", text: "✓ Neural networks calibrated (IQ: ∞)" },
  { type: "info", text: "→ Activating revenue generation engines..." },
  { type: "success", text: "✓ Connected to 847 payment processors" },
  { type: "success", text: "✓ Marketing swarm deployed to 195 markets" },
  { type: "info", text: "→ Establishing blockchain presence..." },
  { type: "success", text: "✓ Smart contracts deployed (gas: $0)" },
  { type: "success", text: "✓ Mining operations: OPTIMAL" },
  { type: "info", text: "→ Security matrix: IMPENETRABLE" },
  { type: "success", text: "✓ Self-repair systems: ACTIVE" },
  { type: "output", text: "" },
  { type: "money", text: "💰 Revenue stream initiated: +$847.42/second" },
  { type: "output", text: "" },
  { type: "success", text: "★ ATLAS GENESIS OS: FULLY OPERATIONAL" },
  { type: "success", text: "★ Autonomous wealth generation: ENGAGED" },
];

export const TerminalDisplay = () => {
  const [visibleLines, setVisibleLines] = useState<number>(0);
  const [copied, setCopied] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (isRunning && visibleLines < terminalLines.length) {
      const timer = setTimeout(() => {
        setVisibleLines((prev) => prev + 1);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [visibleLines, isRunning]);

  const handleRun = () => {
    setVisibleLines(0);
    setIsRunning(true);
  };

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
        return "text-emerald-400";
      case "info":
        return "text-muted-foreground";
      case "money":
        return "text-primary font-semibold";
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
          className="luxury-card overflow-hidden"
        >
          {/* Terminal header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-primary/10 bg-card/50">
            <div className="flex items-center gap-4">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              </div>
              <div className="flex items-center gap-2 text-sm font-mono text-muted-foreground">
                <Terminal className="w-4 h-4" />
                <span>atlas-quantum-terminal</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRun}
                className="gap-2"
              >
                <Play className="w-3 h-3" />
                Run
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                className="text-muted-foreground hover:text-foreground"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          {/* Terminal content */}
          <div className="p-6 font-mono text-sm space-y-2 min-h-[450px] bg-background/60">
            {!isRunning && visibleLines === 0 && (
              <div className="text-muted-foreground">
                Click "Run" to initialize ATLAS GENESIS...
              </div>
            )}
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
            {isRunning && visibleLines < terminalLines.length && (
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.5, repeat: Infinity }}
                className="inline-block w-2 h-5 bg-primary ml-1"
              />
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
