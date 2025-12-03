import { motion } from "framer-motion";

interface StatusIndicatorProps {
  status: "online" | "processing" | "idle" | "earning";
  label?: string;
}

export const StatusIndicator = ({ status, label }: StatusIndicatorProps) => {
  const statusConfig = {
    online: {
      color: "bg-emerald-400",
      glow: "shadow-emerald-400/50",
      text: "SYSTEMS OPTIMAL",
    },
    processing: {
      color: "bg-primary",
      glow: "shadow-primary/50",
      text: "PROCESSING",
    },
    idle: {
      color: "bg-muted-foreground",
      glow: "",
      text: "STANDBY",
    },
    earning: {
      color: "bg-primary",
      glow: "shadow-primary/50",
      text: "GENERATING REVENUE",
    },
  };

  const config = statusConfig[status];

  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <motion.div
          className={`w-2 h-2 rounded-full ${config.color}`}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [1, 0.7, 1],
          }}
          transition={{
            duration: status === "processing" || status === "earning" ? 0.8 : 2,
            repeat: Infinity,
          }}
        />
        <motion.div
          className={`absolute inset-0 rounded-full ${config.color}`}
          animate={{ scale: [1, 2.5], opacity: [0.6, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </div>
      <span className="text-xs font-mono text-muted-foreground tracking-wider">
        {label || config.text}
      </span>
    </div>
  );
};
