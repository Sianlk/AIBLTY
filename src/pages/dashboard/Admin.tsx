import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import api from '@/lib/apiClient';
import { 
  Users, PoundSterling, Server, Settings, Search, 
  Crown, Shield, Mail, Calendar, ArrowUpDown,
  TrendingUp, CreditCard, Rocket, Database,
  RefreshCw, Download, AlertTriangle, Check,
  Brain, Zap, Activity, Lock, Eye, Terminal,
  Globe, Bot, Cpu, Network, Layers, Target,
  Sparkles, Command, Play, Pause, RotateCcw,
  FileText, Hash, Clock, ChevronRight, Plus,
  Trash2, Edit, Power, AlertCircle, CheckCircle2,
  XCircle, BarChart3, PieChart, LineChart, Workflow,
  MessageSquare, Send, Loader2
} from 'lucide-react';

interface User {
  id: string;
  email: string;
  name?: string;
  role: string;
  plan: string;
  createdAt: string;
  _count?: { projects: number; subscriptions: number };
}

interface Stats {
  totalUsers: number;
  activeSubscriptions: number;
  totalProjects: number;
  totalRevenue: number;
  usersByPlan: Record<string, number>;
}

interface Payment {
  id: string;
  amount: number;
  currency: string;
  status: string;
  provider: string;
  createdAt: string;
  user?: { email: string; name?: string };
}

interface Deployment {
  id: string;
  target: string;
  status: string;
  createdAt: string;
  user?: { email: string; name?: string };
}

interface AIAgent {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive' | 'processing';
  capabilities: string[];
  tasksCompleted: number;
  successRate: number;
}

interface LedgerEntry {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  dataHash: string;
  previousHash: string;
}

interface Module {
  id: string;
  name: string;
  enabled: boolean;
  plans: string[];
}

const mockAgents: AIAgent[] = [
  { id: '1', name: 'ATLAS Core', description: 'Primary intelligence orchestrator', status: 'active', capabilities: ['reasoning', 'planning', 'execution'], tasksCompleted: 15847, successRate: 99.7 },
  { id: '2', name: 'Research Agent', description: 'Deep learning & knowledge synthesis', status: 'active', capabilities: ['research', 'analysis', 'summarization'], tasksCompleted: 8234, successRate: 98.2 },
  { id: '3', name: 'Builder Agent', description: 'Full-stack application generator', status: 'active', capabilities: ['coding', 'architecture', 'deployment'], tasksCompleted: 4521, successRate: 97.8 },
  { id: '4', name: 'Revenue Agent', description: 'Monetisation & growth optimizer', status: 'processing', capabilities: ['pricing', 'analytics', 'optimization'], tasksCompleted: 2156, successRate: 96.5 },
  { id: '5', name: 'Guardian Agent', description: 'Security & compliance monitor', status: 'active', capabilities: ['security', 'monitoring', 'alerting'], tasksCompleted: 12890, successRate: 99.9 },
  { id: '6', name: 'Evolution Agent', description: 'Self-improvement & learning', status: 'active', capabilities: ['learning', 'adaptation', 'enhancement'], tasksCompleted: 6743, successRate: 98.9 },
];

const mockLedger: LedgerEntry[] = [
  { id: '1', timestamp: new Date().toISOString(), actor: 'system', action: 'PLAN_UPGRADE', dataHash: 'a7f8c3e2...', previousHash: 'b2d4f1a9...' },
  { id: '2', timestamp: new Date(Date.now() - 3600000).toISOString(), actor: 'admin@aiblty.com', action: 'CONFIG_CHANGE', dataHash: 'c9e1f5b7...', previousHash: 'a7f8c3e2...' },
  { id: '3', timestamp: new Date(Date.now() - 7200000).toISOString(), actor: 'system', action: 'AI_APPROVAL', dataHash: 'd3a2c8f1...', previousHash: 'c9e1f5b7...' },
  { id: '4', timestamp: new Date(Date.now() - 10800000).toISOString(), actor: 'guardian-agent', action: 'SECURITY_AUDIT', dataHash: 'e5b9d4a2...', previousHash: 'd3a2c8f1...' },
];

const modulesList: Module[] = [
  { id: 'app-generator', name: 'App Generator', enabled: true, plans: ['free', 'pro', 'elite'] },
  { id: 'intelligence', name: 'Intelligence Workspace', enabled: true, plans: ['free', 'pro', 'elite'] },
  { id: 'business-builder', name: 'Business Builder', enabled: true, plans: ['pro', 'elite'] },
  { id: 'research-engine', name: 'Research Engine', enabled: true, plans: ['pro', 'elite'] },
  { id: 'revenue-suite', name: 'Revenue Suite', enabled: true, plans: ['pro', 'elite'] },
  { id: 'automation', name: 'Automation Engine', enabled: true, plans: ['pro', 'elite'] },
  { id: 'integrations', name: 'Integration Hub', enabled: true, plans: ['pro', 'elite'] },
  { id: 'ai-workforce', name: 'AI Workforce', enabled: true, plans: ['elite'] },
  { id: 'quantum', name: 'Quantum Engine', enabled: true, plans: ['elite'] },
  { id: 'security', name: 'Security Layer', enabled: true, plans: ['free', 'pro', 'elite'] },
  { id: 'evolution', name: 'Evolution Layer', enabled: true, plans: ['elite'] },
  { id: 'network', name: 'Global Network', enabled: true, plans: ['elite'] },
];

export default function AdminPage() {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [agents, setAgents] = useState<AIAgent[]>(mockAgents);
  const [ledger, setLedger] = useState<LedgerEntry[]>(mockLedger);
  const [modules, setModules] = useState<Module[]>(modulesList);
  const [adminPrompt, setAdminPrompt] = useState('');
  const [isProcessingPrompt, setIsProcessingPrompt] = useState(false);
  const [systemStatus, setSystemStatus] = useState({
    uptime: '99.99%',
    activeUsers: 1247,
    requestsPerMin: 3456,
    aiTasksQueue: 23,
    errorRate: 0.01,
    latency: 45,
  });

  useEffect(() => {
    loadData();
    const interval = setInterval(() => {
      setSystemStatus(prev => ({
        ...prev,
        activeUsers: Math.floor(prev.activeUsers + (Math.random() - 0.5) * 20),
        requestsPerMin: Math.floor(prev.requestsPerMin + (Math.random() - 0.5) * 100),
        aiTasksQueue: Math.max(0, Math.floor(prev.aiTasksQueue + (Math.random() - 0.5) * 5)),
        latency: Math.max(20, Math.floor(prev.latency + (Math.random() - 0.5) * 10)),
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [usersRes, statsRes, paymentsRes, deploymentsRes] = await Promise.all([
        api.admin.getUsers(),
        api.admin.getStats(),
        api.admin.getPayments(),
        api.admin.getDeployments(),
      ]);
      setUsers(usersRes?.users || []);
      setStats(statsRes?.data || null);
      setPayments(paymentsRes?.payments || []);
      setDeployments(deploymentsRes?.deployments || []);
    } catch (error) {
      console.error('Failed to load admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: string, role: 'admin' | 'user') => {
    try {
      await api.admin.updateUserRole(userId, role);
      toast({ title: "Success", description: `User role updated to ${role}` });
      loadData();
    } catch (error) {
      toast({ title: "Error", description: "Failed to update role", variant: "destructive" });
    }
  };

  const updateUserPlan = async (userId: string, plan: 'free' | 'pro' | 'elite') => {
    try {
      await api.admin.updateUserPlan(userId, plan);
      toast({ title: "Success", description: `User plan updated to ${plan}` });
      loadData();
    } catch (error) {
      toast({ title: "Error", description: "Failed to update plan", variant: "destructive" });
    }
  };

  const toggleAgent = (agentId: string) => {
    setAgents(prev => prev.map(agent => 
      agent.id === agentId 
        ? { ...agent, status: agent.status === 'active' ? 'inactive' : 'active' } 
        : agent
    ));
    toast({ title: "Agent Updated", description: "AI agent status changed successfully" });
  };

  const toggleModule = (moduleId: string) => {
    setModules(prev => prev.map(mod => 
      mod.id === moduleId ? { ...mod, enabled: !mod.enabled } : mod
    ));
    toast({ title: "Module Updated", description: "Module status changed successfully" });
  };

  const handleAdminPrompt = async () => {
    if (!adminPrompt.trim()) return;
    setIsProcessingPrompt(true);
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast({
      title: "Command Executed",
      description: "ATLAS has processed your command and initiated the requested actions.",
    });
    
    setAdminPrompt('');
    setIsProcessingPrompt(false);
  };

  const filteredUsers = users.filter(u => 
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const statCards = [
    { label: 'Total Users', value: stats?.totalUsers || 0, icon: Users, trend: '+12%', color: 'from-primary to-gold-dark' },
    { label: 'Active Subscriptions', value: stats?.activeSubscriptions || 0, icon: CreditCard, trend: '+8%', color: 'from-glow-success to-emerald-700' },
    { label: 'Total Projects', value: stats?.totalProjects || 0, icon: Database, trend: '+24%', color: 'from-secondary to-purple-800' },
    { label: 'Total Revenue', value: `£${(stats?.totalRevenue || 0).toLocaleString()}`, icon: PoundSterling, trend: '+18%', color: 'from-glow-warning to-amber-700' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Premium Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden"
        >
          <div className="glass-panel p-6 relative">
            <div className="absolute inset-0 shimmer opacity-30" />
            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl gradient-gold flex items-center justify-center">
                  <Crown className="w-7 h-7 text-background" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold font-display gradient-text">
                    AIBLTY Command Center
                  </h1>
                  <p className="text-muted-foreground">
                    Supreme AI Ability • Complete Platform Control • aiblty.com
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-4 py-2 glass-panel">
                  <div className="status-online" />
                  <span className="text-sm text-glow-success">All Systems Operational</span>
                </div>
                <Button variant="outline" onClick={loadData} disabled={loading} className="border-primary/30 hover:border-primary">
                  <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Real-time System Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="grid grid-cols-2 md:grid-cols-6 gap-3"
        >
          {[
            { label: 'Uptime', value: systemStatus.uptime, icon: Activity },
            { label: 'Active Users', value: systemStatus.activeUsers.toLocaleString(), icon: Users },
            { label: 'Req/min', value: systemStatus.requestsPerMin.toLocaleString(), icon: Zap },
            { label: 'AI Queue', value: systemStatus.aiTasksQueue, icon: Brain },
            { label: 'Error Rate', value: `${systemStatus.errorRate}%`, icon: AlertCircle },
            { label: 'Latency', value: `${systemStatus.latency}ms`, icon: Clock },
          ].map((item, i) => (
            <div key={i} className="glass-panel p-3 text-center">
              <item.icon className="w-4 h-4 mx-auto mb-1 text-primary" />
              <p className="text-lg font-bold">{item.value}</p>
              <p className="text-xs text-muted-foreground">{item.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {statCards.map((stat, i) => (
            <div key={stat.label} className="premium-card p-5 relative overflow-hidden group">
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 shimmer" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                    <stat.icon className="w-5 h-5 text-background" />
                  </div>
                  <Badge className="bg-glow-success/20 text-glow-success border-glow-success/30">
                    {stat.trend}
                  </Badge>
                </div>
                <p className="text-2xl md:text-3xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Admin AI Command Interface */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="premium-card p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg gradient-gold flex items-center justify-center">
              <Terminal className="w-5 h-5 text-background" />
            </div>
            <div>
              <h3 className="font-semibold">Supreme Command Interface</h3>
              <p className="text-sm text-muted-foreground">Issue commands to build, enhance, or modify any aspect of the platform</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Textarea
              value={adminPrompt}
              onChange={(e) => setAdminPrompt(e.target.value)}
              placeholder="Enter your command... e.g., 'Create a new AI agent for social media automation' or 'Build a landing page for product X'"
              className="flex-1 bg-muted/30 border-primary/20 min-h-[100px] resize-none"
            />
          </div>
          <div className="flex items-center justify-between mt-4">
            <div className="flex gap-2">
              <Badge variant="outline" className="text-xs">
                <Bot className="w-3 h-3 mr-1" />
                6 Agents Ready
              </Badge>
              <Badge variant="outline" className="text-xs">
                <Cpu className="w-3 h-3 mr-1" />
                Quantum Processing
              </Badge>
              <Badge variant="outline" className="text-xs">
                <Globe className="w-3 h-3 mr-1" />
                Global Data Access
              </Badge>
            </div>
            <Button 
              onClick={handleAdminPrompt} 
              disabled={isProcessingPrompt || !adminPrompt.trim()}
              className="gradient-gold text-background hover:opacity-90"
            >
              {isProcessingPrompt ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Execute Command
                </>
              )}
            </Button>
          </div>
        </motion.div>

        {/* Main Tabs */}
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="bg-muted/30 p-1 flex-wrap h-auto gap-1">
            <TabsTrigger value="users" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Users className="w-4 h-4 mr-2" />Users
            </TabsTrigger>
            <TabsTrigger value="ai-workforce" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Bot className="w-4 h-4 mr-2" />AI Workforce
            </TabsTrigger>
            <TabsTrigger value="modules" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Layers className="w-4 h-4 mr-2" />Modules
            </TabsTrigger>
            <TabsTrigger value="ledger" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Lock className="w-4 h-4 mr-2" />Ledger
            </TabsTrigger>
            <TabsTrigger value="payments" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <PoundSterling className="w-4 h-4 mr-2" />Payments
            </TabsTrigger>
            <TabsTrigger value="deployments" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Rocket className="w-4 h-4 mr-2" />Deployments
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Settings className="w-4 h-4 mr-2" />Settings
            </TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users">
            <div className="glass-panel p-6">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-6">
                <div className="relative flex-1 w-full">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search users by email or name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-muted/30 border-primary/20"
                  />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="border-primary/30">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                  <Button className="gradient-gold text-background">
                    <Plus className="w-4 h-4 mr-2" />
                    Add User
                  </Button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-primary/10">
                      <th className="text-left p-3 text-sm font-medium text-muted-foreground">User</th>
                      <th className="text-left p-3 text-sm font-medium text-muted-foreground">Role</th>
                      <th className="text-left p-3 text-sm font-medium text-muted-foreground">Plan</th>
                      <th className="text-left p-3 text-sm font-medium text-muted-foreground">Projects</th>
                      <th className="text-left p-3 text-sm font-medium text-muted-foreground">Joined</th>
                      <th className="text-left p-3 text-sm font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="border-b border-primary/5 hover:bg-primary/5 transition-colors">
                        <td className="p-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-background font-bold">
                              {(user.name || user.email)[0].toUpperCase()}
                            </div>
                            <div>
                              <p className="font-medium">{user.name || 'No name'}</p>
                              <p className="text-sm text-muted-foreground">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-3">
                          <Badge variant={user.role === 'admin' ? 'default' : 'secondary'} className={user.role === 'admin' ? 'bg-primary text-primary-foreground' : ''}>
                            {user.role === 'admin' && <Shield className="w-3 h-3 mr-1" />}
                            {user.role}
                          </Badge>
                        </td>
                        <td className="p-3">
                          <Badge variant="outline" className={
                            user.plan === 'elite' ? 'border-primary text-primary bg-primary/10' :
                            user.plan === 'pro' ? 'border-secondary text-secondary bg-secondary/10' : 'border-muted-foreground'
                          }>
                            {user.plan === 'elite' && <Crown className="w-3 h-3 mr-1" />}
                            {user.plan}
                          </Badge>
                        </td>
                        <td className="p-3 text-muted-foreground">
                          {user._count?.projects || 0}
                        </td>
                        <td className="p-3 text-sm text-muted-foreground">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                        <td className="p-3">
                          <div className="flex gap-2">
                            <select
                              value={user.role}
                              onChange={(e) => updateUserRole(user.id, e.target.value as 'admin' | 'user')}
                              className="text-xs bg-muted/50 border border-primary/20 rounded px-2 py-1"
                            >
                              <option value="user">User</option>
                              <option value="admin">Admin</option>
                            </select>
                            <select
                              value={user.plan}
                              onChange={(e) => updateUserPlan(user.id, e.target.value as 'free' | 'pro' | 'elite')}
                              className="text-xs bg-muted/50 border border-primary/20 rounded px-2 py-1"
                            >
                              <option value="free">Free</option>
                              <option value="pro">Pro</option>
                              <option value="elite">Elite</option>
                            </select>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredUsers.length === 0 && (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-muted-foreground">
                          No users found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          {/* AI Workforce Tab */}
          <TabsContent value="ai-workforce">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {agents.map((agent) => (
                  <motion.div
                    key={agent.id}
                    layout
                    className="premium-card p-5 relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-2xl" />
                    <div className="relative z-10">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                            agent.status === 'active' ? 'gradient-gold' :
                            agent.status === 'processing' ? 'bg-glow-warning' : 'bg-muted'
                          }`}>
                            <Bot className={`w-6 h-6 ${agent.status === 'active' ? 'text-background' : 'text-foreground'}`} />
                          </div>
                          <div>
                            <h4 className="font-semibold">{agent.name}</h4>
                            <div className="flex items-center gap-2">
                              <div className={
                                agent.status === 'active' ? 'status-online' :
                                agent.status === 'processing' ? 'status-processing' :
                                'w-2 h-2 rounded-full bg-muted-foreground'
                              } />
                              <span className="text-xs text-muted-foreground capitalize">{agent.status}</span>
                            </div>
                          </div>
                        </div>
                        <Switch
                          checked={agent.status === 'active'}
                          onCheckedChange={() => toggleAgent(agent.id)}
                        />
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">{agent.description}</p>
                      <div className="flex flex-wrap gap-1 mb-4">
                        {agent.capabilities.map((cap) => (
                          <Badge key={cap} variant="outline" className="text-xs border-primary/20">
                            {cap}
                          </Badge>
                        ))}
                      </div>
                      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-primary/10">
                        <div>
                          <p className="text-xs text-muted-foreground">Tasks Completed</p>
                          <p className="text-lg font-bold">{agent.tasksCompleted.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Success Rate</p>
                          <p className="text-lg font-bold text-glow-success">{agent.successRate}%</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="glass-panel p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  Create New AI Agent
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input placeholder="Agent Name" className="bg-muted/30 border-primary/20" />
                  <Input placeholder="Description" className="bg-muted/30 border-primary/20" />
                  <Input placeholder="Capabilities (comma-separated)" className="bg-muted/30 border-primary/20 md:col-span-2" />
                  <div className="md:col-span-2">
                    <Button className="gradient-gold text-background">
                      <Plus className="w-4 h-4 mr-2" />
                      Deploy Agent
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Modules Tab */}
          <TabsContent value="modules">
            <div className="glass-panel p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold flex items-center gap-2">
                  <Layers className="w-5 h-5 text-primary" />
                  Platform Modules
                </h3>
                <Badge className="bg-glow-success/20 text-glow-success border-glow-success/30">
                  {modules.filter(m => m.enabled).length} Active
                </Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {modules.map((mod) => (
                  <div key={mod.id} className="p-4 bg-muted/20 rounded-lg border border-primary/10 hover:border-primary/30 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">{mod.name}</h4>
                      <Switch
                        checked={mod.enabled}
                        onCheckedChange={() => toggleModule(mod.id)}
                      />
                    </div>
                    <div className="flex gap-1">
                      {mod.plans.map((plan) => (
                        <Badge key={plan} variant="outline" className={`text-xs ${
                          plan === 'elite' ? 'border-primary text-primary' :
                          plan === 'pro' ? 'border-secondary text-secondary' : ''
                        }`}>
                          {plan}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Ledger Tab */}
          <TabsContent value="ledger">
            <div className="glass-panel p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg gradient-gold flex items-center justify-center">
                    <Lock className="w-5 h-5 text-background" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Blockchain-Style Security Ledger</h3>
                    <p className="text-sm text-muted-foreground">Immutable, hash-chained audit trail</p>
                  </div>
                </div>
                <Button variant="outline" className="border-primary/30">
                  <Download className="w-4 h-4 mr-2" />
                  Export Ledger
                </Button>
              </div>
              <div className="space-y-3">
                {ledger.map((entry, i) => (
                  <div key={entry.id} className="p-4 bg-muted/20 rounded-lg border border-primary/10 font-mono text-sm">
                    <div className="flex flex-wrap items-center gap-4 mb-2">
                      <Badge variant="outline" className="bg-primary/10 border-primary/30">
                        Block #{ledger.length - i}
                      </Badge>
                      <span className="text-muted-foreground">
                        <Clock className="w-3 h-3 inline mr-1" />
                        {new Date(entry.timestamp).toLocaleString()}
                      </span>
                      <Badge className={
                        entry.action.includes('SECURITY') ? 'bg-glow-success/20 text-glow-success' :
                        entry.action.includes('CHANGE') ? 'bg-glow-warning/20 text-glow-warning' :
                        'bg-secondary/20 text-secondary'
                      }>
                        {entry.action}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
                      <div>
                        <span className="text-muted-foreground">Actor:</span>
                        <span className="ml-2">{entry.actor}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Hash:</span>
                        <span className="ml-2 text-primary">{entry.dataHash}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Prev:</span>
                        <span className="ml-2 text-secondary">{entry.previousHash}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Payments Tab */}
          <TabsContent value="payments">
            <div className="glass-panel p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold flex items-center gap-2">
                  <PoundSterling className="w-5 h-5 text-primary" />
                  Payment Transactions
                </h3>
                <div className="flex gap-2">
                  <Badge className="bg-glow-success/20 text-glow-success border-glow-success/30">
                    Stripe Active
                  </Badge>
                  <Badge className="bg-secondary/20 text-secondary border-secondary/30">
                    PayPal Active
                  </Badge>
                </div>
              </div>
              <div className="space-y-3">
                {payments.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No payments yet</p>
                ) : (
                  payments.map((payment) => (
                    <div key={payment.id} className="flex items-center justify-between p-4 bg-muted/20 rounded-lg border border-primary/10">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          payment.status === 'succeeded' ? 'bg-glow-success/20' : 'bg-glow-warning/20'
                        }`}>
                          {payment.status === 'succeeded' ? (
                            <CheckCircle2 className="w-5 h-5 text-glow-success" />
                          ) : (
                            <AlertTriangle className="w-5 h-5 text-glow-warning" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{payment.user?.email || 'Unknown'}</p>
                          <p className="text-sm text-muted-foreground">{payment.provider} • {payment.status}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">£{(payment.amount / 100).toFixed(2)}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(payment.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </TabsContent>

          {/* Deployments Tab */}
          <TabsContent value="deployments">
            <div className="glass-panel p-6">
              <h3 className="font-semibold mb-6 flex items-center gap-2">
                <Rocket className="w-5 h-5 text-primary" />
                Deployment History
              </h3>
              <div className="space-y-3">
                {deployments.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No deployments yet</p>
                ) : (
                  deployments.map((deploy) => (
                    <div key={deploy.id} className="flex items-center justify-between p-4 bg-muted/20 rounded-lg border border-primary/10">
                      <div className="flex items-center gap-4">
                        <Server className="w-5 h-5 text-primary" />
                        <div>
                          <p className="font-medium">{deploy.user?.email || 'Unknown'}</p>
                          <p className="text-sm text-muted-foreground">Target: {deploy.target}</p>
                        </div>
                      </div>
                      <Badge className={
                        deploy.status === 'success' ? 'bg-glow-success/20 text-glow-success' :
                        deploy.status === 'running' ? 'bg-secondary/20 text-secondary' :
                        deploy.status === 'failed' ? 'bg-destructive/20 text-destructive' : ''
                      }>
                        {deploy.status}
                      </Badge>
                    </div>
                  ))
                )}
              </div>
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <div className="space-y-6">
              <div className="glass-panel p-6">
                <h3 className="font-semibold mb-6 flex items-center gap-2">
                  <Settings className="w-5 h-5 text-primary" />
                  System Configuration
                </h3>
                <div className="space-y-4">
                  {[
                    { label: 'Maintenance Mode', desc: 'Disable access for non-admin users', dangerous: true },
                    { label: 'User Registration', desc: 'Allow new user registrations', enabled: true },
                    { label: 'AI Auto-Evolution', desc: 'Allow AI agents to self-improve automatically', enabled: true },
                    { label: 'Global Data Scraping', desc: 'Enable worldwide data collection and learning', enabled: true },
                    { label: 'Quantum Processing', desc: 'Enable quantum optimization algorithms', enabled: true },
                    { label: 'Genius Mode', desc: 'Apply billionaire mindset algorithms to all outputs', enabled: true },
                  ].map((setting) => (
                    <div key={setting.label} className="flex items-center justify-between p-4 bg-muted/20 rounded-lg border border-primary/10">
                      <div>
                        <p className="font-medium">{setting.label}</p>
                        <p className="text-sm text-muted-foreground">{setting.desc}</p>
                      </div>
                      <Switch defaultChecked={setting.enabled} />
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-panel p-6">
                <h3 className="font-semibold mb-6 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-primary" />
                  Payment Integration
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-muted/20 rounded-lg border border-primary/10">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium">Stripe</h4>
                      <Badge className="bg-glow-success/20 text-glow-success">Connected</Badge>
                    </div>
                    <Input placeholder="Stripe API Key" type="password" className="bg-muted/30 border-primary/20" defaultValue="sk_live_••••••••" />
                  </div>
                  <div className="p-4 bg-muted/20 rounded-lg border border-primary/10">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium">PayPal</h4>
                      <Badge className="bg-glow-success/20 text-glow-success">Connected</Badge>
                    </div>
                    <Input placeholder="PayPal Client ID" type="password" className="bg-muted/30 border-primary/20" defaultValue="client_••••••••" />
                  </div>
                </div>
              </div>

              <div className="glass-panel p-6">
                <h3 className="font-semibold mb-6 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-primary" />
                  Platform Branding
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">Platform Name</label>
                    <Input defaultValue="AIBLTY" className="bg-muted/30 border-primary/20" />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">Tagline</label>
                    <Input defaultValue="Supreme AI Ability" className="bg-muted/30 border-primary/20" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm text-muted-foreground mb-2 block">Domain</label>
                    <Input defaultValue="aiblty.com" className="bg-muted/30 border-primary/20" />
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
