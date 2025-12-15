import { motion } from "framer-motion";
import aibltyLogo from "@/assets/aiblty-logo.png";

interface AibltyLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export const AibltyLogo = ({ className, size = "md" }: AibltyLogoProps) => {
  const sizes = {
    sm: { img: 32, text: "text-lg", sub: "text-[8px]" },
    md: { img: 40, text: "text-xl", sub: "text-[10px]" },
    lg: { img: 56, text: "text-2xl", sub: "text-xs" },
  };

  const { img, text, sub } = sizes[size];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`flex items-center gap-3 ${className || ""}`}
    >
      <div className="relative">
        <img 
          src={aibltyLogo} 
          alt="AIBLTY Logo" 
          width={img} 
          height={img}
          className="object-contain"
        />
        <motion.div
          className="absolute inset-0 rounded-full border border-gold/30"
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </div>
      <div className="flex flex-col">
        <span className={`${text} font-bold tracking-wider text-foreground`}>AIBLTY</span>
        <span className={`${sub} font-mono text-gold tracking-widest`}>AI-POWERED ABILITY</span>
      </div>
    </motion.div>
  );
};
