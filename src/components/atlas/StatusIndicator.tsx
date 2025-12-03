import { motion } from "framer-motion";

interface StatusIndicatorProps {
  status: "online" | "processing" | "idle";
  label?: string;
}

export const StatusIndicator = ({ status, label }: StatusIndicatorProps) => {
  const statusConfig = {
    online: {
      color: "bg-glow-success",
      glow: "shadow-glow-success/50",
      text: "ONLINE",
    },
    processing: {
      color: "bg-glow-warning",
      glow: "shadow-glow-warning/50",
      text: "PROCESSING",
    },
    idle: {
      color: "bg-muted-foreground",
      glow: "",
      text: "IDLE",
    },
  };

  const config = statusConfig[status];

  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <motion.div
          className={`w-2 h-2 rounded-full ${config.color}`}
          animate={status === "online" || status === "processing" ? {
            scale: [1, 1.2, 1],
            opacity: [1, 0.8, 1],
          } : {}}
          transition={{
            duration: status === "processing" ? 0.5 : 2,
            repeat: Infinity,
          }}
        />
        {(status === "online" || status === "processing") && (
          <motion.div
            className={`absolute inset-0 rounded-full ${config.color}`}
            animate={{ scale: [1, 2], opacity: [0.5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        )}
      </div>
      <span className="text-xs font-mono text-muted-foreground">
        {label || config.text}
      </span>
    </div>
  );
};
