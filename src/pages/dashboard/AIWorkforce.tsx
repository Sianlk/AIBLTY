import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { motion, AnimatePresence } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '@/lib/apiClient';
import { 
  Bot, Plus, Play, Pause, Settings, Clock, Search,
  FileText, Globe, TrendingUp, Pencil, MessageSquare,
  Target, Briefcase, BarChart3, Megaphone, Code,
  RefreshCw, MoreHorizontal, Zap, Shield, AlertTriangle,
  CheckCircle, XCircle, Loader2, Send, Sparkles,
  ArrowRight, Crown, Lock, Brain, Workflow, Users,
  ChevronRight, Activity
} from 'lucide-react';

interface Agent {
  id: string;
  name: string;
  type: string;
  status: 'active' | 'paused' | 'idle' | 'working';
  tasksCompleted: number;
  lastActive: string;
  icon: any;
  description: string;
}

interface Task {
  id: string;
  agent: string;
  task: string;
  status: 'completed' | 'running' | 'queued' | 'failed';
  time: string;
  priority: 'high' | 'medium' | 'low';
}

const agentTypes = [
  { id: 'researcher', name: 'Research Agent', icon: Search, desc: 'Deep research on any topic with source verification', color: 'text-blue-400', capabilities: ['Web research', 'Data compilation', 'Source verification', 'Report generation'] },
  { id: 'writer', name: 'Content Writer', icon: Pencil, desc: 'Generate articles, copy, documentation, and marketing content', color: 'text-green-400', capabilities: ['Blog posts', 'Marketing copy', 'Documentation', 'Social media'] },
  { id: 'analyst', name: 'Data Analyst', icon: BarChart3, desc: 'Analyze data, trends, and generate actionable insights', color: 'text-purple-400', capabilities: ['Data analysis', 'Trend detection', 'Predictive modeling', 'Visualization'] },
  { id: 'seo', name: 'SEO Specialist', icon: TrendingUp, desc: 'Optimize content and strategy for search engines', color: 'text-orange-400', capabilities: ['Keyword research', 'Content optimization', 'Competitor analysis', 'Ranking tracking'] },
  { id: 'social', name: 'Social Manager', icon: Megaphone, desc: 'Manage social presence and automate posting', color: 'text-pink-400', capabilities: ['Content scheduling', 'Engagement tracking', 'Audience analysis', 'Auto-posting'] },
  { id: 'developer', name: 'Code Assistant', icon: Code, desc: 'Generate, review, and optimize code', color: 'text-cyan-400', capabilities: ['Code generation', 'Bug fixing', 'Code review', 'Documentation'] },
  { id: 'marketer', name: 'Marketing Strategist', icon: Target, desc: 'Create and execute marketing strategies', color: 'text-yellow-400', capabilities: ['Campaign planning', 'A/B testing', 'Funnel optimization', 'ROI tracking'] },
  { id: 'automation', name: 'Workflow Automator', icon: Workflow, desc: 'Automate repetitive tasks and workflows', color: 'text-emerald-400', capabilities: ['Task automation', 'Integration setup', 'Process optimization', 'Scheduling'] },
];

const sampleAgents: Agent[] = [
  { id: '1', name: 'ResearchBot Alpha', type: 'researcher', status: 'active', tasksCompleted: 247, lastActive: 'now', icon: Search, description: 'Conducting market research' },
  { id: '2', name: 'ContentGen Pro', type: 'writer', status: 'working', tasksCompleted: 1028, lastActive: 'now', icon: Pencil, description: 'Writing blog post' },
  { id: '3', name: 'SEO Master', type: 'seo', status: 'active', tasksCompleted: 589, lastActive: '5 mins ago', icon: TrendingUp, description: 'Optimizing landing pages' },
  { id: '4', name: 'DataMiner X', type: 'analyst', status: 'idle', tasksCompleted: 134, lastActive: '1 hour ago', icon: BarChart3, description: 'Ready for tasks' },
  { id: '5', name: 'SocialBot', type: 'social', status: 'active', tasksCompleted: 456, lastActive: '2 mins ago', icon: Megaphone, description: 'Scheduling posts' },
];

const sampleTasks: Task[] = [
  { id: '1', agent: 'ResearchBot Alpha', task: 'Complete competitor analysis for Q1 strategy', status: 'completed', time: '2 mins ago', priority: 'high' },
  { id: '2', agent: 'ContentGen Pro', task: 'Write 5 blog posts on AI trends', status: 'running', time: 'In progress', priority: 'medium' },
  { id: '3', agent: 'SEO Master', task: 'Keyword optimization for 20 pages', status: 'completed', time: '15 mins ago', priority: 'high' },
  { id: '4', agent: 'DataMiner X', task: 'Generate monthly sales report', status: 'queued', time: 'Scheduled 3pm', priority: 'medium' },
  { id: '5', agent: 'SocialBot', task: 'Schedule next week social posts', status: 'running', time: 'In progress', priority: 'low' },
];

export default function AIWorkforcePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [agents, setAgents] = useState<Agent[]>(sampleAgents);
  const [tasks, setTasks] = useState<Task[]>(sampleTasks);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedAgentType, setSelectedAgentType] = useState<string | null>(null);
  const [newAgentName, setNewAgentName] = useState('');
  const [taskInput, setTaskInput] = useState('');
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const isPremium = user?.plan === 'elite';

  const handleToggleAgent = (id: string) => {
    setAgents(agents.map(agent => {
      if (agent.id === id) {
        const newStatus = agent.status === 'active' || agent.status === 'working' ? 'paused' : 'active';
        toast({
          title: newStatus === 'active' ? 'Agent Activated' : 'Agent Paused',
          description: `${agent.name} is now ${newStatus}`,
        });
        return { ...agent, status: newStatus as Agent['status'] };
      }
      return agent;
    }));
  };

  const handleCreateAgent = async () => {
    if (!selectedAgentType || !newAgentName.trim()) {
      toast({ title: 'Error', description: 'Please select agent type and enter a name', variant: 'destructive' });
      return;
    }

    setIsCreating(true);
    await new Promise(r => setTimeout(r, 1500));

    const agentType = agentTypes.find(t => t.id === selectedAgentType);
    const newAgent: Agent = {
      id: Date.now().toString(),
      name: newAgentName,
      type: selectedAgentType,
      status: 'idle',
      tasksCompleted: 0,
      lastActive: 'just now',
      icon: agentType?.icon || Bot,
      description: 'Ready to work'
    };

    setAgents([newAgent, ...agents]);
    setNewAgentName('');
    setSelectedAgentType(null);
    setShowCreateModal(false);
    setIsCreating(false);
    
    toast({
      title: 'Agent Created',
      description: `${newAgentName} is now ready to work!`,
    });
  };

  const handleAssignTask = async () => {
    if (!taskInput.trim() || !selectedAgent) {
      toast({ title: 'Error', description: 'Please enter a task and select an agent', variant: 'destructive' });
      return;
    }

    const agent = agents.find(a => a.id === selectedAgent);
    const newTask: Task = {
      id: Date.now().toString(),
      agent: agent?.name || 'Unknown',
      task: taskInput,
      status: 'running',
      time: 'Starting...',
      priority: 'medium'
    };

    setTasks([newTask, ...tasks]);
    setTaskInput('');
    
    toast({
      title: 'Task Assigned',
      description: `${agent?.name} is now working on your task`,
    });
  };

  if (!isPremium) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-lg"
          >
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-primary/20 via-secondary/20 to-primary/20 flex items-center justify-center mx-auto mb-6 border border-primary/30">
              <Lock className="w-12 h-12 text-primary" />
            </div>
            <h1 className="text-3xl font-bold mb-4 gradient-text">AI Workforce</h1>
            <p className="text-muted-foreground mb-6">
              Deploy autonomous AI agents that work 24/7 on your tasks. From content creation to data analysis, 
              marketing to code development - your AI workforce never sleeps.
            </p>
            
            <div className="grid grid-cols-2 gap-3 mb-8">
              {['24/7 Autonomous Work', 'Multi-Agent Coordination', 'Task Queue Management', 'Auto-Scaling'].map((feature) => (
                <div key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="w-4 h-4 text-primary" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>

            <Button variant="glow" size="lg" onClick={() => navigate('/dashboard/billing')}>
              <Crown className="w-5 h-5 mr-2" />
              Upgrade to Elite
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <p className="text-xs text-muted-foreground mt-4">
              AI Workforce is included in the Elite plan (£199/month)
            </p>
          </motion.div>
        </div>
      </DashboardLayout>
    );
  }

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
              <Bot className="w-6 h-6 text-primary" />
              AI Workforce
            </h1>
            <p className="text-muted-foreground">Autonomous agents working 24/7 on your tasks</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="icon" onClick={() => toast({ title: 'Refreshed', description: 'Agent status updated' })}>
              <RefreshCw className="w-4 h-4" />
            </Button>
            <Button variant="glow" onClick={() => setShowCreateModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Deploy Agent
            </Button>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {[
            { label: 'Active Agents', value: agents.filter(a => a.status === 'active' || a.status === 'working').length, icon: Bot, color: 'text-glow-success' },
            { label: 'Tasks Today', value: '347', icon: Target, color: 'text-primary' },
            { label: 'Hours Saved', value: '156h', icon: Clock, color: 'text-secondary' },
            { label: 'Success Rate', value: '99.2%', icon: TrendingUp, color: 'text-glow-warning' },
          ].map((stat) => (
            <div key={stat.label} className="glass-panel p-4">
              <stat.icon className={`w-5 h-5 ${stat.color} mb-2`} />
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Quick Task Assignment */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="glass-panel p-4"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Describe a task for your AI workforce..."
                value={taskInput}
                onChange={(e) => setTaskInput(e.target.value)}
                className="bg-muted/50"
              />
            </div>
            <select
              className="px-4 py-2 rounded-lg bg-muted/50 border border-border text-sm"
              value={selectedAgent || ''}
              onChange={(e) => setSelectedAgent(e.target.value)}
            >
              <option value="">Select Agent</option>
              {agents.filter(a => a.status !== 'paused').map(a => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
            <Button onClick={handleAssignTask} disabled={!taskInput.trim() || !selectedAgent}>
              <Send className="w-4 h-4 mr-2" />
              Assign Task
            </Button>
          </div>
        </motion.div>

        <Tabs defaultValue="agents" className="space-y-6">
          <TabsList>
            <TabsTrigger value="agents">My Agents ({agents.length})</TabsTrigger>
            <TabsTrigger value="tasks">Task Queue ({tasks.length})</TabsTrigger>
            <TabsTrigger value="create">Create Agent</TabsTrigger>
          </TabsList>

          <TabsContent value="agents">
            {/* Search */}
            <div className="flex gap-4 mb-6">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search agents..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-muted/50"
                />
              </div>
            </div>

            {/* Agents Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {agents.filter(a => a.name.toLowerCase().includes(searchQuery.toLowerCase())).map((agent, i) => (
                <motion.div
                  key={agent.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.05 }}
                  className="glass-panel-hover p-5"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                      agent.status === 'working' ? 'bg-primary/20 animate-pulse' :
                      agent.status === 'active' ? 'bg-glow-success/20' : 'bg-muted'
                    }`}>
                      <agent.icon className={`w-7 h-7 ${
                        agent.status === 'working' ? 'text-primary' :
                        agent.status === 'active' ? 'text-glow-success' : 'text-muted-foreground'
                      }`} />
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Settings className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <h3 className="font-semibold mb-1">{agent.name}</h3>
                  <p className="text-xs text-muted-foreground mb-1">{agent.description}</p>
                  <p className="text-xs text-primary capitalize">{agent.type}</p>
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground my-4">
                    <span className="flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      {agent.tasksCompleted} tasks
                    </span>
                    <span>{agent.lastActive}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className={`text-xs px-2 py-1 rounded flex items-center gap-1 ${
                      agent.status === 'working' 
                        ? 'bg-primary/20 text-primary' 
                        : agent.status === 'active' 
                        ? 'bg-glow-success/20 text-glow-success' 
                        : agent.status === 'paused'
                        ? 'bg-glow-warning/20 text-glow-warning'
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {agent.status === 'working' && <Loader2 className="w-3 h-3 animate-spin" />}
                      {agent.status}
                    </span>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleToggleAgent(agent.id)}
                    >
                      {agent.status === 'active' || agent.status === 'working' ? (
                        <Pause className="w-4 h-4" />
                      ) : (
                        <Play className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="tasks">
            <div className="glass-panel p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold flex items-center gap-2">
                  <Activity className="w-5 h-5 text-primary" />
                  Task Queue
                </h3>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">Clear Completed</Button>
                </div>
              </div>
              
              <div className="space-y-3">
                {tasks.map((task, i) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        task.status === 'completed' ? 'bg-glow-success/10' :
                        task.status === 'running' ? 'bg-primary/10' :
                        task.status === 'failed' ? 'bg-destructive/10' :
                        'bg-muted'
                      }`}>
                        {task.status === 'completed' ? <CheckCircle className="w-5 h-5 text-glow-success" /> :
                         task.status === 'running' ? <Loader2 className="w-5 h-5 text-primary animate-spin" /> :
                         task.status === 'failed' ? <XCircle className="w-5 h-5 text-destructive" /> :
                         <Clock className="w-5 h-5 text-muted-foreground" />}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{task.task}</p>
                        <p className="text-sm text-muted-foreground">{task.agent}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`text-xs px-2 py-1 rounded ${
                        task.priority === 'high' ? 'bg-destructive/20 text-destructive' :
                        task.priority === 'medium' ? 'bg-glow-warning/20 text-glow-warning' :
                        'bg-muted text-muted-foreground'
                      }`}>
                        {task.priority}
                      </span>
                      <p className="text-xs text-muted-foreground mt-1">{task.time}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="create">
            <div className="max-w-4xl mx-auto">
              <div className="glass-panel p-6 mb-6">
                <h3 className="font-semibold mb-4">Select Agent Type</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {agentTypes.map((type, i) => (
                    <motion.button
                      key={type.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      onClick={() => setSelectedAgentType(type.id)}
                      className={`p-4 rounded-xl border text-left transition-all ${
                        selectedAgentType === type.id
                          ? 'border-primary bg-primary/10'
                          : 'border-border bg-muted/30 hover:border-primary/50'
                      }`}
                    >
                      <type.icon className={`w-8 h-8 ${type.color} mb-3`} />
                      <h4 className="font-semibold text-sm mb-1">{type.name}</h4>
                      <p className="text-xs text-muted-foreground">{type.desc}</p>
                    </motion.button>
                  ))}
                </div>
              </div>

              {selectedAgentType && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-panel p-6"
                >
                  <h3 className="font-semibold mb-4">Configure Your Agent</h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="agentName">Agent Name</Label>
                      <Input
                        id="agentName"
                        placeholder="e.g., ResearchBot Pro"
                        value={newAgentName}
                        onChange={(e) => setNewAgentName(e.target.value)}
                        className="bg-muted/50 mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label>Capabilities</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {agentTypes.find(t => t.id === selectedAgentType)?.capabilities.map(cap => (
                          <span key={cap} className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full">
                            {cap}
                          </span>
                        ))}
                      </div>
                    </div>

                    <Button 
                      onClick={handleCreateAgent} 
                      disabled={isCreating || !newAgentName.trim()}
                      className="w-full"
                      variant="glow"
                    >
                      {isCreating ? (
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      ) : (
                        <Sparkles className="w-4 h-4 mr-2" />
                      )}
                      {isCreating ? 'Creating Agent...' : 'Deploy Agent'}
                    </Button>
                  </div>
                </motion.div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
