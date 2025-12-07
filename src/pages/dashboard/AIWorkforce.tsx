import { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { 
  Bot, Plus, Play, Pause, Settings, Clock, Search,
  FileText, Globe, TrendingUp, Pencil, MessageSquare,
  Target, Briefcase, BarChart3, Megaphone, Code,
  RefreshCw, MoreHorizontal
} from 'lucide-react';

interface Agent {
  id: string;
  name: string;
  type: string;
  status: 'active' | 'paused' | 'idle';
  tasksCompleted: number;
  lastActive: string;
  icon: any;
}

const agentTypes = [
  { id: 'researcher', name: 'Research Agent', icon: Search, desc: 'Deep research on any topic', color: 'text-blue-400' },
  { id: 'writer', name: 'Content Writer', icon: Pencil, desc: 'Generate articles, copy, docs', color: 'text-green-400' },
  { id: 'analyst', name: 'Data Analyst', icon: BarChart3, desc: 'Analyze data and trends', color: 'text-purple-400' },
  { id: 'seo', name: 'SEO Specialist', icon: TrendingUp, desc: 'Optimize for search engines', color: 'text-orange-400' },
  { id: 'social', name: 'Social Manager', icon: Megaphone, desc: 'Manage social presence', color: 'text-pink-400' },
  { id: 'developer', name: 'Code Assistant', icon: Code, desc: 'Generate and review code', color: 'text-cyan-400' },
];

const sampleAgents: Agent[] = [
  { id: '1', name: 'ResearchBot Alpha', type: 'researcher', status: 'active', tasksCompleted: 47, lastActive: '2 mins ago', icon: Search },
  { id: '2', name: 'ContentGen Pro', type: 'writer', status: 'active', tasksCompleted: 128, lastActive: '5 mins ago', icon: Pencil },
  { id: '3', name: 'SEO Optimizer', type: 'seo', status: 'paused', tasksCompleted: 89, lastActive: '1 hour ago', icon: TrendingUp },
  { id: '4', name: 'Data Insights', type: 'analyst', status: 'idle', tasksCompleted: 34, lastActive: '3 hours ago', icon: BarChart3 },
];

const recentTasks = [
  { agent: 'ResearchBot Alpha', task: 'Market analysis for fintech sector', status: 'completed', time: '2 mins ago' },
  { agent: 'ContentGen Pro', task: 'Blog post: AI Trends 2024', status: 'completed', time: '5 mins ago' },
  { agent: 'SEO Optimizer', task: 'Keyword research for product pages', status: 'completed', time: '1 hour ago' },
  { agent: 'Data Insights', task: 'Competitor pricing analysis', status: 'queued', time: 'Scheduled' },
];

export default function AIWorkforcePage() {
  const [agents, setAgents] = useState<Agent[]>(sampleAgents);
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  const handleToggleAgent = (id: string) => {
    setAgents(agents.map(agent => {
      if (agent.id === id) {
        const newStatus = agent.status === 'active' ? 'paused' : 'active';
        toast({
          title: newStatus === 'active' ? 'Agent Activated' : 'Agent Paused',
          description: `${agent.name} is now ${newStatus}`,
        });
        return { ...agent, status: newStatus as 'active' | 'paused' };
      }
      return agent;
    }));
  };

  const handleCreateAgent = (typeId: string) => {
    const agentType = agentTypes.find(t => t.id === typeId);
    if (agentType) {
      toast({
        title: 'Agent Created',
        description: `New ${agentType.name} is ready to work`,
      });
    }
  };

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
            <Button variant="outline" size="icon">
              <RefreshCw className="w-4 h-4" />
            </Button>
            <Button variant="glow">
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
            { label: 'Active Agents', value: agents.filter(a => a.status === 'active').length, icon: Bot, color: 'text-glow-success' },
            { label: 'Tasks Today', value: '156', icon: Target, color: 'text-primary' },
            { label: 'Hours Saved', value: '48h', icon: Clock, color: 'text-secondary' },
            { label: 'Success Rate', value: '98.5%', icon: TrendingUp, color: 'text-glow-warning' },
          ].map((stat) => (
            <div key={stat.label} className="glass-panel p-4">
              <stat.icon className={`w-5 h-5 ${stat.color} mb-2`} />
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        <Tabs defaultValue="agents" className="space-y-6">
          <TabsList>
            <TabsTrigger value="agents">My Agents</TabsTrigger>
            <TabsTrigger value="create">Create Agent</TabsTrigger>
            <TabsTrigger value="tasks">Task Queue</TabsTrigger>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {agents.filter(a => a.name.toLowerCase().includes(searchQuery.toLowerCase())).map((agent, i) => (
                <motion.div
                  key={agent.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.05 }}
                  className="glass-panel-hover p-5"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      agent.status === 'active' ? 'bg-primary/20' : 'bg-muted'
                    }`}>
                      <agent.icon className={`w-6 h-6 ${
                        agent.status === 'active' ? 'text-primary' : 'text-muted-foreground'
                      }`} />
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <h3 className="font-semibold mb-1">{agent.name}</h3>
                  <p className="text-xs text-muted-foreground capitalize mb-4">{agent.type}</p>
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                    <span>{agent.tasksCompleted} tasks</span>
                    <span>{agent.lastActive}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className={`text-xs px-2 py-1 rounded ${
                      agent.status === 'active' 
                        ? 'bg-glow-success/20 text-glow-success' 
                        : agent.status === 'paused'
                        ? 'bg-glow-warning/20 text-glow-warning'
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {agent.status}
                    </span>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleToggleAgent(agent.id)}
                    >
                      {agent.status === 'active' ? (
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

          <TabsContent value="create">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {agentTypes.map((type, i) => (
                <motion.div
                  key={type.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="glass-panel-hover p-6"
                >
                  <type.icon className={`w-10 h-10 ${type.color} mb-4`} />
                  <h3 className="font-semibold mb-2">{type.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{type.desc}</p>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => handleCreateAgent(type.id)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Agent
                  </Button>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="tasks">
            <div className="glass-panel p-6">
              <h3 className="font-semibold mb-4">Recent Tasks</h3>
              <div className="space-y-4">
                {recentTasks.map((task, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center justify-between p-4 bg-muted/30 rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Bot className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{task.task}</p>
                        <p className="text-sm text-muted-foreground">{task.agent}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`text-xs px-2 py-1 rounded ${
                        task.status === 'completed' 
                          ? 'bg-glow-success/20 text-glow-success' 
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        {task.status}
                      </span>
                      <p className="text-xs text-muted-foreground mt-1">{task.time}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
