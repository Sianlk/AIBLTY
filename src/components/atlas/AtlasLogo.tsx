import { motion } from "framer-motion";

export const AtlasLogo = () => {
  return (
    <motion.div 
      className="flex items-center gap-4"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Luxury hexagonal logo */}
      <div className="relative">
        <motion.div
          className="w-14 h-14 relative"
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        >
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <defs>
              <linearGradient id="luxuryGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="hsl(45, 100%, 70%)" />
                <stop offset="50%" stopColor="hsl(45, 100%, 50%)" />
                <stop offset="100%" stopColor="hsl(30, 100%, 45%)" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            <polygon
              points="50,5 90,27.5 90,72.5 50,95 10,72.5 10,27.5"
              fill="none"
              stroke="url(#luxuryGradient)"
              strokeWidth="2"
              filter="url(#glow)"
            />
            <polygon
              points="50,18 78,33.5 78,66.5 50,82 22,66.5 22,33.5"
              fill="none"
              stroke="url(#luxuryGradient)"
              strokeWidth="1"
              opacity="0.5"
            />
            <circle
              cx="50"
              cy="50"
              r="10"
              fill="url(#luxuryGradient)"
              filter="url(#glow)"
            />
          </svg>
        </motion.div>
        
        {/* Outer pulse ring */}
        <motion.div
          className="absolute inset-[-4px] border border-primary/20 rounded-full"
          animate={{ scale: [1, 1.3], opacity: [0.4, 0] }}
          transition={{ duration: 2.5, repeat: Infinity }}
        />
      </div>
      
      {/* Text */}
      <div className="flex flex-col">
        <span className="text-2xl font-display font-bold tracking-wide gradient-text">
          ATLAS
        </span>
        <span className="text-[10px] font-mono text-muted-foreground tracking-[0.25em] uppercase">
          Genesis OS
        </span>
      </div>
    </motion.div>
  );
};
