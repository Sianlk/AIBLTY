import { motion } from "framer-motion";

export const AtlasLogo = () => {
  return (
    <motion.div 
      className="flex items-center gap-3"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Hexagonal logo mark */}
      <div className="relative">
        <motion.div
          className="w-12 h-12 relative"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <defs>
              <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="hsl(186, 100%, 50%)" />
                <stop offset="100%" stopColor="hsl(270, 60%, 50%)" />
              </linearGradient>
            </defs>
            <polygon
              points="50,5 90,27.5 90,72.5 50,95 10,72.5 10,27.5"
              fill="none"
              stroke="url(#logoGradient)"
              strokeWidth="2"
              className="drop-shadow-[0_0_10px_hsl(186,100%,50%,0.5)]"
            />
            <polygon
              points="50,20 75,35 75,65 50,80 25,65 25,35"
              fill="none"
              stroke="url(#logoGradient)"
              strokeWidth="1.5"
              opacity="0.6"
            />
            <circle
              cx="50"
              cy="50"
              r="8"
              fill="url(#logoGradient)"
              className="drop-shadow-[0_0_15px_hsl(186,100%,50%,0.8)]"
            />
          </svg>
        </motion.div>
        
        {/* Pulse ring */}
        <motion.div
          className="absolute inset-0 border-2 border-primary/30 rounded-full"
          animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </div>
      
      {/* Text */}
      <div className="flex flex-col">
        <span className="text-xl font-bold tracking-wider glow-text text-primary">
          ATLAS
        </span>
        <span className="text-xs font-mono text-muted-foreground tracking-widest">
          GENESIS OS
        </span>
      </div>
    </motion.div>
  );
};
