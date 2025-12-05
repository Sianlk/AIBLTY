import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { motion } from 'framer-motion';
import { 
  BarChart3, TrendingUp, TrendingDown, Users, 
  Activity, DollarSign, Clock, Target
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';

const usageData = [
  { name: 'Mon', queries: 12, automations: 5 },
  { name: 'Tue', queries: 19, automations: 8 },
  { name: 'Wed', queries: 15, automations: 6 },
  { name: 'Thu', queries: 28, automations: 12 },
  { name: 'Fri', queries: 35, automations: 15 },
  { name: 'Sat', queries: 20, automations: 7 },
  { name: 'Sun', queries: 18, automations: 9 },
];

const performanceData = [
  { name: 'Week 1', efficiency: 75 },
  { name: 'Week 2', efficiency: 82 },
  { name: 'Week 3', efficiency: 78 },
  { name: 'Week 4', efficiency: 91 },
];

export default function InsightsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-primary" />
            Insights Hub
          </h1>
          <p className="text-muted-foreground">Track your performance and usage analytics</p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {[
            { label: 'Total Queries', value: '147', change: '+23%', up: true, icon: Activity },
            { label: 'Time Saved', value: '18.5h', change: '+12%', up: true, icon: Clock },
            { label: 'Projects', value: '5', change: '+2', up: true, icon: Target },
            { label: 'This Month', value: '$0', change: 'Free Plan', up: null, icon: DollarSign },
          ].map((stat) => (
            <div key={stat.label} className="glass-panel p-4">
              <div className="flex items-center justify-between mb-2">
                <stat.icon className="w-5 h-5 text-primary" />
                {stat.up !== null && (
                  <span className={`text-xs flex items-center gap-1 ${
                    stat.up ? 'text-glow-success' : 'text-destructive'
                  }`}>
                    {stat.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {stat.change}
                  </span>
                )}
                {stat.up === null && (
                  <span className="text-xs text-muted-foreground">{stat.change}</span>
                )}
              </div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Usage Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-panel p-6"
          >
            <h3 className="font-semibold mb-4">Weekly Usage</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={usageData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar dataKey="queries" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="automations" fill="hsl(var(--secondary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-6 mt-4">
              <span className="flex items-center gap-2 text-sm">
                <div className="w-3 h-3 rounded bg-primary"></div>
                AI Queries
              </span>
              <span className="flex items-center gap-2 text-sm">
                <div className="w-3 h-3 rounded bg-secondary"></div>
                Automations
              </span>
            </div>
          </motion.div>

          {/* Performance Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-panel p-6"
          >
            <h3 className="font-semibold mb-4">Efficiency Trend</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="efficiency" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--primary))' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* Activity Feed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-panel p-6"
        >
          <h3 className="font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {[
              { action: 'Generated business plan', time: '2 hours ago', type: 'ai' },
              { action: 'Created new project "Marketing Strategy"', time: '4 hours ago', type: 'project' },
              { action: 'Automation "Welcome Email" completed', time: '6 hours ago', type: 'automation' },
              { action: 'Solved problem: Customer retention', time: '1 day ago', type: 'ai' },
            ].map((activity, i) => (
              <div key={i} className="flex items-center gap-4 p-3 rounded-lg bg-muted/30">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  activity.type === 'ai' ? 'bg-primary/10' : 
                  activity.type === 'automation' ? 'bg-glow-success/10' : 'bg-secondary/10'
                }`}>
                  {activity.type === 'ai' && <Activity className="w-4 h-4 text-primary" />}
                  {activity.type === 'automation' && <Activity className="w-4 h-4 text-glow-success" />}
                  {activity.type === 'project' && <Target className="w-4 h-4 text-secondary" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm">{activity.action}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
