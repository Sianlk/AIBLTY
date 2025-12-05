import { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { 
  Zap, Plus, Play, Pause, Settings, Clock, 
  Mail, MessageSquare, Calendar, Database,
  FileText, Globe, Webhook, ArrowRight
} from 'lucide-react';

interface Workflow {
  id: string;
  name: string;
  status: 'active' | 'paused' | 'draft';
  trigger: string;
  actions: number;
  lastRun?: string;
}

const sampleWorkflows: Workflow[] = [
  { id: '1', name: 'Welcome Email Sequence', status: 'active', trigger: 'New User Signup', actions: 5, lastRun: '2 hours ago' },
  { id: '2', name: 'Lead Qualification', status: 'active', trigger: 'Form Submission', actions: 3, lastRun: '30 mins ago' },
  { id: '3', name: 'Weekly Report Generator', status: 'paused', trigger: 'Schedule', actions: 4, lastRun: '7 days ago' },
];

const triggers = [
  { icon: Mail, label: 'Email Received', description: 'When you receive an email' },
  { icon: Webhook, label: 'Webhook', description: 'When data is sent to your endpoint' },
  { icon: Calendar, label: 'Schedule', description: 'At specific times or intervals' },
  { icon: Database, label: 'Database Change', description: 'When data is added or updated' },
];

const actions = [
  { icon: Mail, label: 'Send Email', color: 'text-primary' },
  { icon: MessageSquare, label: 'Send Message', color: 'text-secondary' },
  { icon: FileText, label: 'Generate Document', color: 'text-glow-success' },
  { icon: Globe, label: 'API Call', color: 'text-glow-warning' },
];

export default function AutomationPage() {
  const [workflows] = useState<Workflow[]>(sampleWorkflows);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-4"
        >
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Zap className="w-6 h-6 text-glow-success" />
              Automation Engine
            </h1>
            <p className="text-muted-foreground">Create powerful workflows that run automatically</p>
          </div>
          <Button variant="glow">
            <Plus className="w-4 h-4 mr-2" />
            New Workflow
          </Button>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {[
            { label: 'Active Workflows', value: '2', icon: Zap },
            { label: 'Total Runs Today', value: '47', icon: Play },
            { label: 'Time Saved', value: '12h', icon: Clock },
            { label: 'Success Rate', value: '99%', icon: Settings },
          ].map((stat) => (
            <div key={stat.label} className="glass-panel p-4">
              <stat.icon className="w-5 h-5 text-primary mb-2" />
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Workflows List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-lg font-semibold mb-4">Your Workflows</h2>
          <div className="space-y-3">
            {workflows.map((workflow, i) => (
              <motion.div
                key={workflow.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.05 }}
                className="glass-panel-hover p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    workflow.status === 'active' ? 'bg-glow-success/10' : 'bg-muted'
                  }`}>
                    <Zap className={`w-5 h-5 ${
                      workflow.status === 'active' ? 'text-glow-success' : 'text-muted-foreground'
                    }`} />
                  </div>
                  <div>
                    <h3 className="font-medium">{workflow.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {workflow.trigger} • {workflow.actions} actions
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-muted-foreground hidden md:block">
                    {workflow.lastRun && `Last run: ${workflow.lastRun}`}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded ${
                    workflow.status === 'active' 
                      ? 'bg-glow-success/20 text-glow-success' 
                      : workflow.status === 'paused'
                      ? 'bg-glow-warning/20 text-glow-warning'
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {workflow.status}
                  </span>
                  <Button variant="ghost" size="icon">
                    {workflow.status === 'active' ? (
                      <Pause className="w-4 h-4" />
                    ) : (
                      <Play className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Create Workflow Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {/* Triggers */}
          <div className="glass-panel p-6">
            <h3 className="font-semibold mb-4">Available Triggers</h3>
            <div className="space-y-3">
              {triggers.map((trigger) => (
                <button
                  key={trigger.label}
                  className="w-full flex items-center gap-4 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors text-left"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <trigger.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{trigger.label}</p>
                    <p className="text-xs text-muted-foreground">{trigger.description}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground" />
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="glass-panel p-6">
            <h3 className="font-semibold mb-4">Available Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              {actions.map((action) => (
                <button
                  key={action.label}
                  className="flex flex-col items-center gap-2 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  <action.icon className={`w-8 h-8 ${action.color}`} />
                  <span className="text-sm font-medium">{action.label}</span>
                </button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground text-center mt-4">
              More actions available with Pro and Elite plans
            </p>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
