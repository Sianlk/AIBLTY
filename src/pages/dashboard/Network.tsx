import { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Network, Globe, Server, Activity, Wifi, MapPin, RefreshCw, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { sendAIMessage } from '@/lib/aiService';

const regions = [
  { name: 'Europe (London)', status: 'active', latency: '12ms', load: 45 },
  { name: 'US East (Virginia)', status: 'active', latency: '78ms', load: 62 },
  { name: 'US West (Oregon)', status: 'active', latency: '145ms', load: 38 },
  { name: 'Asia (Singapore)', status: 'active', latency: '198ms', load: 28 },
];

export default function NetworkPage() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleOptimize = async () => {
    setLoading(true);
    try {
      const response = await sendAIMessage(
        [{ role: 'user', content: 'Analyze network performance and suggest optimizations for latency and load balancing across regions.' }],
        'network'
      );
      if (response.success) {
        toast({ title: 'Analysis Complete', description: 'Network optimizations identified' });
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to analyze network', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2"><Network className="w-6 h-6 text-primary" />Global Network</h1>
            <p className="text-muted-foreground">Distributed infrastructure for worldwide deployment</p>
          </div>
          <Button variant="outline" onClick={handleOptimize} disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
            Optimize
          </Button>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Globe, label: 'Regions', value: '4', color: 'text-primary' },
            { icon: Server, label: 'Edge Nodes', value: '128', color: 'text-secondary' },
            { icon: Activity, label: 'Uptime', value: '99.99%', color: 'text-emerald-400' },
            { icon: Wifi, label: 'Avg Latency', value: '45ms', color: 'text-primary' },
          ].map((stat) => (
            <motion.div key={stat.label} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass-panel p-4">
              <stat.icon className={`w-5 h-5 ${stat.color} mb-2`} />
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-panel p-6">
          <h3 className="font-semibold mb-4">Active Regions</h3>
          <div className="space-y-4">
            {regions.map((region, i) => (
              <motion.div key={region.name} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{region.name}</p>
                    <p className="text-xs text-muted-foreground">Latency: {region.latency}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${region.load}%` }} />
                  </div>
                  <span className="text-xs text-muted-foreground w-10">{region.load}%</span>
                  <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded">{region.status}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
