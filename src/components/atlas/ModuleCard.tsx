import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModuleCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  status?: "active" | "ready" | "coming";
  onClick?: () => void;
  index?: number;
}

export const ModuleCard = ({
  icon: Icon,
  title,
  description,
  status = "ready",
  onClick,
  index = 0,
}: ModuleCardProps) => {
  const statusStyles = {
    active: "border-primary/40 shadow-primary/20",
    ready: "border-primary/20 hover:border-primary/40",
    coming: "border-muted/20 opacity-60",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      whileHover={status !== "coming" ? { scale: 1.02, y: -4 } : {}}
      onClick={status !== "coming" ? onClick : undefined}
      className={cn(
        "glass-panel-hover p-6 cursor-pointer group relative overflow-hidden",
        statusStyles[status],
        status === "coming" && "cursor-not-allowed"
      )}
    >
      {/* Background glow on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Icon */}
      <div className="relative mb-4">
        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
          <Icon className="w-6 h-6 text-primary" />
        </div>
        {status === "active" && (
          <motion.div
            className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-glow-success"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
      </div>

      {/* Content */}
      <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
        {title}
      </h3>
      <p className="text-sm text-muted-foreground leading-relaxed">
        {description}
      </p>

      {/* Status badge */}
      <div className="mt-4 flex items-center gap-2">
        <div
          className={cn(
            "text-xs font-mono px-2 py-1 rounded",
            status === "active" && "bg-glow-success/20 text-glow-success",
            status === "ready" && "bg-primary/20 text-primary",
            status === "coming" && "bg-muted/20 text-muted-foreground"
          )}
        >
          {status === "active" && "ACTIVE"}
          {status === "ready" && "READY"}
          {status === "coming" && "COMING SOON"}
        </div>
      </div>

      {/* Corner accent */}
      <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden">
        <div className="absolute top-0 right-0 w-px h-8 bg-gradient-to-b from-primary/40 to-transparent" />
        <div className="absolute top-0 right-0 w-8 h-px bg-gradient-to-l from-primary/40 to-transparent" />
      </div>
    </motion.div>
  );
};
