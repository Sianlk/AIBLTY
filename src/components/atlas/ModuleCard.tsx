import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModuleCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  status?: "active" | "ready" | "premium" | "evolving";
  stats?: { label: string; value: string }[];
  onClick?: () => void;
  index?: number;
}

export const ModuleCard = ({
  icon: Icon,
  title,
  description,
  status = "ready",
  stats,
  onClick,
  index = 0,
}: ModuleCardProps) => {
  const statusStyles = {
    active: "border-primary/50",
    ready: "border-primary/20 hover:border-primary/50",
    premium: "border-primary/60 shadow-[0_0_30px_hsl(45,100%,50%,0.15)]",
    evolving: "border-emerald-500/40",
  };

  const statusLabels = {
    active: "ACTIVE",
    ready: "READY",
    premium: "PREMIUM",
    evolving: "SELF-EVOLVING",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.5 }}
      whileHover={{ y: -8, scale: 1.02 }}
      onClick={onClick}
      className={cn(
        "luxury-card p-6 cursor-pointer group relative",
        statusStyles[status]
      )}
    >
      {/* Shimmer effect */}
      <div className="absolute inset-0 shimmer rounded-2xl" />
      
      {/* Background gradient on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
      
      {/* Icon container */}
      <div className="relative mb-5">
        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center group-hover:from-primary/30 group-hover:to-primary/10 transition-all duration-500 border border-primary/10">
          <Icon className="w-7 h-7 text-primary" />
        </div>
        {status === "evolving" && (
          <motion.div
            className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <span className="text-[8px] font-bold text-white">∞</span>
          </motion.div>
        )}
        {status === "premium" && (
          <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full gold-gradient flex items-center justify-center">
            <span className="text-[8px] font-bold text-background">★</span>
          </div>
        )}
      </div>

      {/* Content */}
      <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors duration-300 font-display">
        {title}
      </h3>
      <p className="text-sm text-muted-foreground leading-relaxed mb-4">
        {description}
      </p>

      {/* Stats row */}
      {stats && (
        <div className="flex gap-4 mb-4">
          {stats.map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-lg font-bold text-primary">{stat.value}</div>
              <div className="text-[10px] font-mono text-muted-foreground uppercase">{stat.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Status badge */}
      <div className="flex items-center justify-between">
        <div
          className={cn(
            "text-[10px] font-mono px-2.5 py-1 rounded-full tracking-wider",
            status === "active" && "bg-emerald-500/20 text-emerald-400",
            status === "ready" && "bg-primary/20 text-primary",
            status === "premium" && "gold-gradient text-background font-semibold",
            status === "evolving" && "bg-emerald-500/20 text-emerald-400"
          )}
        >
          {statusLabels[status]}
        </div>
        <motion.div
          className="w-8 h-8 rounded-full border border-primary/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          whileHover={{ scale: 1.1, borderColor: "hsl(45, 100%, 50%)" }}
        >
          <span className="text-primary text-lg">→</span>
        </motion.div>
      </div>
    </motion.div>
  );
};
