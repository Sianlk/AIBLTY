import { motion } from "framer-motion";

interface AibltyLogoProps {
  className?: string;
}

export const AibltyLogo = ({ className }: AibltyLogoProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center gap-3"
    >
      <div className="relative">
        <svg width="40" height="40" viewBox="0 0 40 40" className="text-primary">
          <defs>
            <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(var(--primary))" />
              <stop offset="100%" stopColor="hsl(var(--primary) / 0.6)" />
            </linearGradient>
          </defs>
          <path
            d="M20 2L37 11v18l-17 9-17-9V11z"
            fill="url(#logoGradient)"
            stroke="hsl(var(--primary))"
            strokeWidth="1.5"
          />
          <text x="20" y="25" textAnchor="middle" fill="hsl(var(--primary-foreground))" fontSize="14" fontWeight="bold">A</text>
        </svg>
        <motion.div
          className="absolute inset-0 rounded-full border border-primary/30"
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </div>
      <div className="flex flex-col">
        <span className="text-xl font-bold tracking-wider text-foreground">AIBLTY</span>
        <span className="text-[10px] font-mono text-muted-foreground tracking-widest">AI-POWERED ABILITY</span>
      </div>
    </motion.div>
  );
};
