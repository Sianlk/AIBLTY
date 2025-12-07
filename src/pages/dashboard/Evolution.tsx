import { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, Check, X, Brain, Lightbulb, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const suggestions = [
  { id: '1', title: 'Optimise prompt routing', desc: 'Route complex queries to more capable models', impact: 'High', confidence: 92 },
  { id: '2', title: 'Adjust agent selection', desc: 'Prefer research agent for technical queries', impact: 'Medium', confidence: 87 },
  { id: '3', title: 'Update rate limits', desc: 'Increase API limits during peak hours', impact: 'Low', confidence: 78 },
];

export default function EvolutionPage() {
  const [appliedIds, setAppliedIds] = useState<string[]>([]);
  const { toast } = useToast();

  const handleApply = (id: string) => {
    setAppliedIds([...appliedIds, id]);
    toast({ title: 'Suggestion Applied', description: 'Configuration updated successfully' });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2"><Sparkles className="w-6 h-6 text-secondary" />Evolution Layer</h1>
            <p className="text-muted-foreground">Self-learning system that adapts to your patterns</p>
          </div>
          <Button variant="outline"><RefreshCw className="w-4 h-4 mr-2" />Analyse Logs</Button>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Brain, label: 'Patterns Detected', value: '47', color: 'text-secondary' },
            { icon: Lightbulb, label: 'Suggestions', value: suggestions.length.toString(), color: 'text-primary' },
            { icon: TrendingUp, label: 'Improvement', value: '+23%', color: 'text-emerald-400' },
            { icon: Check, label: 'Applied', value: appliedIds.length.toString(), color: 'text-primary' },
          ].map((stat) => (
            <motion.div key={stat.label} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass-panel p-4">
              <stat.icon className={`w-5 h-5 ${stat.color} mb-2`} />
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-panel p-6">
          <h3 className="font-semibold mb-4">AI Improvement Suggestions</h3>
          <div className="space-y-4">
            {suggestions.map((s, i) => (
              <motion.div key={s.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium">{s.title}</p>
                  <p className="text-sm text-muted-foreground">{s.desc}</p>
                  <div className="flex gap-4 mt-2">
                    <span className="text-xs text-primary">Impact: {s.impact}</span>
                    <span className="text-xs text-muted-foreground">Confidence: {s.confidence}%</span>
                  </div>
                </div>
                {appliedIds.includes(s.id) ? (
                  <span className="text-xs bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded">Applied</span>
                ) : (
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => handleApply(s.id)}><Check className="w-4 h-4" /></Button>
                    <Button size="sm" variant="ghost"><X className="w-4 h-4" /></Button>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
