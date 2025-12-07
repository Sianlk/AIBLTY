import { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { motion } from 'framer-motion';
import { Shield, Lock, FileCheck, Clock, Hash, User, Activity, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ledgerEntries = [
  { id: '1', timestamp: '2024-01-15 14:32:00', actor: 'admin@aiblty.com', action: 'USER_ROLE_CHANGED', data: 'user123 -> admin', hash: 'a1b2c3d4...' },
  { id: '2', timestamp: '2024-01-15 13:15:00', actor: 'system', action: 'PLAN_UPGRADED', data: 'user456: free -> pro', hash: 'e5f6g7h8...' },
  { id: '3', timestamp: '2024-01-15 12:00:00', actor: 'admin@aiblty.com', action: 'CONFIG_CHANGED', data: 'rate_limit: 100 -> 200', hash: 'i9j0k1l2...' },
  { id: '4', timestamp: '2024-01-15 10:30:00', actor: 'system', action: 'AI_TASK_APPROVED', data: 'task_789 approved', hash: 'm3n4o5p6...' },
];

export default function SecurityPage() {
  const [filter, setFilter] = useState('all');

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2"><Shield className="w-6 h-6 text-primary" />Security Layer</h1>
            <p className="text-muted-foreground">Blockchain-style ledger and audit trail</p>
          </div>
          <Button variant="outline"><Activity className="w-4 h-4 mr-2" />Run Audit</Button>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Lock, label: 'Encryption', value: 'AES-256', color: 'text-emerald-400' },
            { icon: Hash, label: 'Hash Chain', value: 'Verified', color: 'text-primary' },
            { icon: FileCheck, label: 'Audit Events', value: '1,247', color: 'text-secondary' },
            { icon: AlertTriangle, label: 'Threats Blocked', value: '0', color: 'text-emerald-400' },
          ].map((stat) => (
            <motion.div key={stat.label} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass-panel p-4">
              <stat.icon className={`w-5 h-5 ${stat.color} mb-2`} />
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-panel p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2"><Hash className="w-5 h-5 text-primary" />Tamper-Evident Ledger</h3>
          <div className="space-y-3">
            {ledgerEntries.map((entry, i) => (
              <motion.div key={entry.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{entry.action}</p>
                    <p className="text-xs text-muted-foreground">{entry.data}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-mono text-primary">{entry.hash}</p>
                  <p className="text-xs text-muted-foreground">{entry.timestamp}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
