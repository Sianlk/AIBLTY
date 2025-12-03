import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { TrendingUp, Zap, Globe, Cpu, DollarSign, Users } from "lucide-react";

interface MetricCardProps {
  icon: React.ElementType;
  label: string;
  value: string;
  change: string;
  positive?: boolean;
  index: number;
}

const MetricCard = ({ icon: Icon, label, value, change, positive = true, index }: MetricCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.1 * index }}
    className="glass-panel p-4 group hover:border-primary/40 transition-all duration-500"
  >
    <div className="flex items-start justify-between mb-3">
      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <span className={`text-xs font-mono ${positive ? 'text-emerald-400' : 'text-red-400'}`}>
        {change}
      </span>
    </div>
    <div className="text-2xl font-bold text-foreground mb-1 font-display">{value}</div>
    <div className="text-xs text-muted-foreground uppercase tracking-wider">{label}</div>
  </motion.div>
);

export const LiveMetrics = () => {
  const [metrics, setMetrics] = useState({
    revenue: 2847293,
    users: 47892,
    operations: 1284729,
    efficiency: 99.97,
    nodes: 12847,
    growth: 347,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        revenue: prev.revenue + Math.floor(Math.random() * 100),
        users: prev.users + Math.floor(Math.random() * 5),
        operations: prev.operations + Math.floor(Math.random() * 50),
        efficiency: Math.min(99.99, prev.efficiency + Math.random() * 0.001),
        nodes: prev.nodes + Math.floor(Math.random() * 3),
        growth: prev.growth + (Math.random() > 0.5 ? 1 : 0),
      }));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="px-6 py-12">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <span className="text-xs font-mono text-primary tracking-[0.3em] uppercase">Real-Time Performance</span>
        </motion.div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <MetricCard
            icon={DollarSign}
            label="Revenue Generated"
            value={`$${(metrics.revenue / 1000000).toFixed(2)}M`}
            change="+847%"
            index={0}
          />
          <MetricCard
            icon={Users}
            label="Active Users"
            value={metrics.users.toLocaleString()}
            change="+12.4%"
            index={1}
          />
          <MetricCard
            icon={Zap}
            label="Operations/sec"
            value={metrics.operations.toLocaleString()}
            change="+∞"
            index={2}
          />
          <MetricCard
            icon={Cpu}
            label="System Efficiency"
            value={`${metrics.efficiency.toFixed(2)}%`}
            change="+0.03%"
            index={3}
          />
          <MetricCard
            icon={Globe}
            label="Global Nodes"
            value={metrics.nodes.toLocaleString()}
            change="+284"
            index={4}
          />
          <MetricCard
            icon={TrendingUp}
            label="Growth Rate"
            value={`${metrics.growth}%`}
            change="+47%"
            index={5}
          />
        </div>
      </div>
    </section>
  );
};
