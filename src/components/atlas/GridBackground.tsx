import { motion } from "framer-motion";

export const GridBackground = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Luxury grid */}
      <div className="absolute inset-0 grid-luxury opacity-40" />
      
      {/* Radial gradient */}
      <div className="absolute inset-0 bg-gradient-radial from-primary/5 via-transparent to-transparent" />
      
      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,hsl(var(--background))_70%)]" />
      
      {/* Animated gold orbs */}
      <motion.div
        className="absolute top-1/4 left-1/3 w-[600px] h-[600px] rounded-full"
        style={{
          background: "radial-gradient(circle, hsl(45 100% 50% / 0.08) 0%, transparent 70%)",
        }}
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.6, 0.3],
          x: [0, 50, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full"
        style={{
          background: "radial-gradient(circle, hsl(30 100% 45% / 0.06) 0%, transparent 70%)",
        }}
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.2, 0.5, 0.2],
          y: [0, -30, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Scanning line */}
      <motion.div
        className="absolute left-0 right-0 h-[2px]"
        style={{
          background: "linear-gradient(90deg, transparent 0%, hsl(45 100% 50% / 0.4) 50%, transparent 100%)",
          boxShadow: "0 0 20px hsl(45 100% 50% / 0.3)",
        }}
        initial={{ top: "-5%" }}
        animate={{ top: "105%" }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-32 h-32">
        <div className="absolute top-4 left-4 w-16 h-px bg-gradient-to-r from-primary/50 to-transparent" />
        <div className="absolute top-4 left-4 w-px h-16 bg-gradient-to-b from-primary/50 to-transparent" />
      </div>
      <div className="absolute top-0 right-0 w-32 h-32">
        <div className="absolute top-4 right-4 w-16 h-px bg-gradient-to-l from-primary/50 to-transparent" />
        <div className="absolute top-4 right-4 w-px h-16 bg-gradient-to-b from-primary/50 to-transparent" />
      </div>
      <div className="absolute bottom-0 left-0 w-32 h-32">
        <div className="absolute bottom-4 left-4 w-16 h-px bg-gradient-to-r from-primary/50 to-transparent" />
        <div className="absolute bottom-4 left-4 w-px h-16 bg-gradient-to-t from-primary/50 to-transparent" />
      </div>
      <div className="absolute bottom-0 right-0 w-32 h-32">
        <div className="absolute bottom-4 right-4 w-16 h-px bg-gradient-to-l from-primary/50 to-transparent" />
        <div className="absolute bottom-4 right-4 w-px h-16 bg-gradient-to-t from-primary/50 to-transparent" />
      </div>
    </div>
  );
};
