import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { DollarSign, TrendingUp, Wallet, CreditCard, Bitcoin, Banknote } from "lucide-react";

export const RevenueShowcase = () => {
  const [totalRevenue, setTotalRevenue] = useState(2847293847.42);
  const [streams, setStreams] = useState([
    { name: "SaaS Subscriptions", amount: 847293.42, rate: 12.4 },
    { name: "API Licensing", amount: 429847.28, rate: 8.7 },
    { name: "Crypto Mining", amount: 1284729.84, rate: 24.2 },
    { name: "Ad Revenue", amount: 294827.12, rate: 15.8 },
    { name: "Affiliate Marketing", amount: 182947.33, rate: 6.3 },
    { name: "NFT Royalties", amount: 92847.19, rate: 31.4 },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTotalRevenue(prev => prev + Math.random() * 1000);
      setStreams(prev => prev.map(stream => ({
        ...stream,
        amount: stream.amount + Math.random() * stream.rate,
      })));
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const icons = [DollarSign, CreditCard, Bitcoin, Banknote, TrendingUp, Wallet];

  return (
    <section className="px-6 py-24">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-xs font-mono text-primary tracking-[0.3em] uppercase mb-4 block">
            Live Revenue Dashboard
          </span>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">
            <span className="gradient-text">$2.8 Billion+</span> Generated
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Watch your wealth grow in real-time across multiple autonomous revenue streams.
          </p>
        </motion.div>

        {/* Main revenue counter */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="luxury-card p-8 md:p-12 text-center mb-12 relative overflow-hidden"
        >
          <div className="absolute inset-0 shimmer" />
          <div className="relative">
            <div className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-4">
              Total Revenue Generated
            </div>
            <div className="text-5xl md:text-7xl lg:text-8xl font-display font-bold gradient-text glow-text-strong mb-4">
              ${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="flex items-center justify-center gap-2 text-emerald-400">
              <TrendingUp className="w-5 h-5" />
              <span className="font-mono">+$847.42/second</span>
            </div>
          </div>
        </motion.div>

        {/* Revenue streams grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {streams.map((stream, index) => {
            const Icon = icons[index];
            return (
              <motion.div
                key={stream.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass-panel p-6 group hover:border-primary/40 transition-all duration-500"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <span className="text-xs font-mono text-emerald-400">
                    +{stream.rate.toFixed(1)}%
                  </span>
                </div>
                <div className="text-2xl font-bold text-foreground mb-1 font-display">
                  ${stream.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div className="text-sm text-muted-foreground">{stream.name}</div>
                
                {/* Progress bar */}
                <div className="mt-4 h-1 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className="h-full gold-gradient"
                    initial={{ width: "0%" }}
                    whileInView={{ width: `${Math.min((stream.amount / 1500000) * 100, 100)}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
