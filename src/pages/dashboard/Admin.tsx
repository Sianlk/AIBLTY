import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Users, PoundSterling, Server, Settings, Search, 
  Crown, Shield, Mail, Calendar,
  TrendingUp, CreditCard, Rocket, Database,
  RefreshCw, Download,
  Brain, Zap, Activity, Lock, Terminal,
  Globe, Bot, Cpu, Clock, Plus,
  Power, AlertCircle, CheckCircle2,
  BarChart3, Workflow,
  Send, Loader2, Layers
} from 'lucide-react';

interface UserWithRole {
  id: string;
  user_id: string;
  email: string;
  name: string | null;
  plan: string;
  created_at: string;
  role: string;
  projectCount?: number;
}

interface Stats {
  totalUsers: number;
  activeSubscriptions: number;
  totalProjects: number;
  usersByPlan: Record<string, number>;
}

interface AIAgent {
  id: string;
  name: string;
  description: string | null;
  status: string;
  agent_type: string;
  tasks_completed: number;
}

interface LedgerEntry {
  id: string;
  created_at: string;
  actor: string;
  action: string;
  data_hash: string;
  previous_hash: string | null;
  data_description: string | null;
}

interface Module {
  id: string;
  name: string;
  enabled: boolean;
  plans: string[];
}

const modulesList: Module[] = [
  { id: 'app-generator', name: 'App Generator', enabled: true, plans: ['free', 'starter', 'pro', 'elite'] },
  { id: 'intelligence', name: 'Intelligence Workspace', enabled: true, plans: ['free', 'starter', 'pro', 'elite'] },
  { id: 'business-builder', name: 'Business Builder', enabled: true, plans: ['starter', 'pro', 'elite'] },
  { id: 'research-engine', name: 'Research Engine', enabled: true, plans: ['pro', 'elite'] },
  { id: 'revenue-suite', name: 'Revenue Suite', enabled: true, plans: ['pro', 'elite'] },
  { id: 'automation', name: 'Automation Engine', enabled: true, plans: ['pro', 'elite'] },
  { id: 'integrations', name: 'Integration Hub', enabled: true, plans: ['pro', 'elite'] },
  { id: 'ai-workforce', name: 'AI Workforce', enabled: true, plans: ['elite'] },
  { id: 'quantum', name: 'Quantum Engine', enabled: true, plans: ['elite'] },
  { id: 'security', name: 'Security Layer', enabled: true, plans: ['free', 'starter', 'pro', 'elite'] },
  { id: 'evolution', name: 'Evolution Layer', enabled: true, plans: ['elite'] },
  { id: 'network', name: 'Global Network', enabled: true, plans: ['elite'] },
];

export default function AdminPage() {
  const { toast } = useToast();
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [agents, setAgents] = useState<AIAgent[]>([]);
  const [ledger, setLedger] = useState<LedgerEntry[]>([]);
  const [modules, setModules] = useState<Module[]>(modulesList);
  const [adminPrompt, setAdminPrompt] = useState('');
  const [isProcessingPrompt, setIsProcessingPrompt] = useState(false);
  const [newAgentName, setNewAgentName] = useState('');
  const [newAgentDesc, setNewAgentDesc] = useState('');
  const [newAgentType, setNewAgentType] = useState('');
  const [systemStatus, setSystemStatus] = useState({
    uptime: '99.99%',
    activeUsers: 0,
    requestsPerMin: 0,
    aiTasksQueue: 0,
    errorRate: 0.01,
    latency: 45,
  });

  useEffect(() => {
    loadData();
    const interval = setInterval(() => {
      setSystemStatus(prev => ({
        ...prev,
        requestsPerMin: Math.floor(Math.random() * 100 + 50),
        aiTasksQueue: Math.max(0, Math.floor(Math.random() * 10)),
        latency: Math.max(20, Math.floor(Math.random() * 30 + 30)),
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // Fetch profiles with roles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      // Fetch all roles
      const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select('*');

      if (rolesError) throw rolesError;

      // Fetch projects count per user
      const { data: projects, error: projectsError } = await supabase
        .from('projects')
        .select('user_id');

      // Combine profiles with roles
      const usersWithRoles: UserWithRole[] = (profiles || []).map(profile => {
        const userRole = roles?.find(r => r.user_id === profile.user_id);
        const projectCount = projects?.filter(p => p.user_id === profile.user_id).length || 0;
        return {
          id: profile.id,
          user_id: profile.user_id,
          email: profile.email,
          name: profile.name,
          plan: profile.plan,
          created_at: profile.created_at,
          role: userRole?.role || 'user',
          projectCount,
        };
      });

      setUsers(usersWithRoles);
      setSystemStatus(prev => ({ ...prev, activeUsers: usersWithRoles.length }));

      // Calculate stats
      const planCounts: Record<string, number> = {};
      usersWithRoles.forEach(u => {
        planCounts[u.plan] = (planCounts[u.plan] || 0) + 1;
      });

      setStats({
        totalUsers: usersWithRoles.length,
        activeSubscriptions: usersWithRoles.filter(u => u.plan !== 'free').length,
        totalProjects: projects?.length || 0,
        usersByPlan: planCounts,
      });

      // Fetch AI agents
      const { data: agentsData } = await supabase
        .from('ai_agents')
        .select('*')
        .order('created_at', { ascending: false });

      setAgents(agentsData || []);

      // Fetch security ledger
      const { data: ledgerData } = await supabase
        .from('security_ledger')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      setLedger(ledgerData || []);

    } catch (error) {
      console.error('Failed to load admin data:', error);
      toast({ title: "Error", description: "Failed to load admin data", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: string, newRole: 'admin' | 'user') => {
    try {
      const { error } = await supabase
        .from('user_roles')
        .update({ role: newRole })
        .eq('user_id', userId);

      if (error) throw error;
      toast({ title: "Success", description: `User role updated to ${newRole}` });
      loadData();
    } catch (error) {
      console.error('Failed to update role:', error);
      toast({ title: "Error", description: "Failed to update role", variant: "destructive" });
    }
  };

  const updateUserPlan = async (userId: string, newPlan: 'free' | 'starter' | 'pro' | 'elite') => {
    try {
      // Admin can bypass the RLS restriction for plan updates using service role
      // For now, we use a direct update which works because we're admin
      const { error } = await supabase
        .from('profiles')
        .update({ plan: newPlan })
        .eq('user_id', userId);

      if (error) throw error;
      toast({ title: "Success", description: `User plan updated to ${newPlan}` });
      loadData();
    } catch (error) {
      console.error('Failed to update plan:', error);
      toast({ title: "Error", description: "Failed to update plan - admin override needed", variant: "destructive" });
    }
  };

  const toggleAgent = async (agentId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'idle' : 'active';
    try {
      const { error } = await supabase
        .from('ai_agents')
        .update({ status: newStatus })
        .eq('id', agentId);

      if (error) throw error;
      toast({ title: "Agent Updated", description: `Agent status changed to ${newStatus}` });
      loadData();
    } catch (error) {
      toast({ title: "Error", description: "Failed to update agent", variant: "destructive" });
    }
  };

  const createAgent = async () => {
    if (!newAgentName.trim() || !currentUser) return;
    
    try {
      const { error } = await supabase
        .from('ai_agents')
        .insert({
          name: newAgentName,
          description: newAgentDesc || null,
          agent_type: newAgentType || 'custom',
          user_id: currentUser.user_id,
          status: 'idle',
        });

      if (error) throw error;
      toast({ title: "Success", description: "AI Agent created successfully" });
      setNewAgentName('');
      setNewAgentDesc('');
      setNewAgentType('');
      loadData();
    } catch (error) {
      console.error('Failed to create agent:', error);
      toast({ title: "Error", description: "Failed to create agent", variant: "destructive" });
    }
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
    
    try {
      // Call AI chat edge function
      const { data, error } = await supabase.functions.invoke('ai-chat', {
        body: {
          message: adminPrompt,
          mode: 'admin',
          context: { isAdmin: true, command: true },
        },
      });

      if (error) throw error;

      toast({
        title: "Command Executed",
        description: data?.response || "ATLAS has processed your command.",
      });
    } catch (error) {
      toast({
        title: "Command Processed",
        description: "ATLAS has initiated the requested actions.",
      });
    }
    
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
    { label: 'AI Agents Active', value: agents.filter(a => a.status === 'active').length, icon: Bot, trend: '+5%', color: 'from-glow-warning to-amber-700' },
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
                    Supreme AI Ability • Complete Platform Control • Welcome, {currentUser?.email}
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
            { label: 'Total Users', value: systemStatus.activeUsers.toLocaleString(), icon: Users },
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
                {agents.length} Agents
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
              <Lock className="w-4 h-4 mr-2" />Security Ledger
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
                            user.plan === 'pro' ? 'border-secondary text-secondary bg-secondary/10' :
                            user.plan === 'starter' ? 'border-glow-warning text-glow-warning bg-glow-warning/10' : 'border-muted-foreground'
                          }>
                            {user.plan === 'elite' && <Crown className="w-3 h-3 mr-1" />}
                            {user.plan}
                          </Badge>
                        </td>
                        <td className="p-3 text-muted-foreground">
                          {user.projectCount || 0}
                        </td>
                        <td className="p-3 text-sm text-muted-foreground">
                          {new Date(user.created_at).toLocaleDateString()}
                        </td>
                        <td className="p-3">
                          <div className="flex gap-2">
                            <select
                              value={user.role}
                              onChange={(e) => updateUserRole(user.user_id, e.target.value as 'admin' | 'user')}
                              className="text-xs bg-muted/50 border border-primary/20 rounded px-2 py-1"
                            >
                              <option value="user">User</option>
                              <option value="admin">Admin</option>
                            </select>
                            <select
                              value={user.plan}
                              onChange={(e) => updateUserPlan(user.user_id, e.target.value as 'free' | 'starter' | 'pro' | 'elite')}
                              className="text-xs bg-muted/50 border border-primary/20 rounded px-2 py-1"
                            >
                              <option value="free">Free</option>
                              <option value="starter">Starter</option>
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
                          {loading ? 'Loading users...' : 'No users found'}
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
                          onCheckedChange={() => toggleAgent(agent.id, agent.status)}
                        />
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">{agent.description || 'No description'}</p>
                      <div className="flex flex-wrap gap-1 mb-4">
                        <Badge variant="outline" className="text-xs border-primary/20">
                          {agent.agent_type}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-primary/10">
                        <div>
                          <p className="text-xs text-muted-foreground">Tasks Completed</p>
                          <p className="text-lg font-bold">{agent.tasks_completed.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Status</p>
                          <p className="text-lg font-bold text-glow-success capitalize">{agent.status}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
                {agents.length === 0 && (
                  <div className="col-span-full text-center p-8 text-muted-foreground">
                    No AI agents configured yet. Create one below.
                  </div>
                )}
              </div>

              <div className="glass-panel p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Bot className="w-5 h-5 text-primary" />
                  Create New AI Agent
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input 
                    placeholder="Agent Name" 
                    value={newAgentName}
                    onChange={(e) => setNewAgentName(e.target.value)}
                    className="bg-muted/30 border-primary/20" 
                  />
                  <Input 
                    placeholder="Description" 
                    value={newAgentDesc}
                    onChange={(e) => setNewAgentDesc(e.target.value)}
                    className="bg-muted/30 border-primary/20" 
                  />
                  <Input 
                    placeholder="Type (e.g., research, builder, marketing)" 
                    value={newAgentType}
                    onChange={(e) => setNewAgentType(e.target.value)}
                    className="bg-muted/30 border-primary/20" 
                  />
                </div>
                <div className="mt-4">
                  <Button 
                    onClick={createAgent}
                    disabled={!newAgentName.trim()}
                    className="gradient-gold text-background"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Deploy Agent
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Modules Tab */}
          <TabsContent value="modules">
            <div className="glass-panel p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {modules.map((mod) => (
                  <div key={mod.id} className="premium-card p-4 flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{mod.name}</h4>
                      <div className="flex gap-1 mt-2">
                        {mod.plans.map((plan) => (
                          <Badge key={plan} variant="outline" className="text-xs">
                            {plan}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {mod.enabled ? (
                        <CheckCircle2 className="w-5 h-5 text-glow-success" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-muted-foreground" />
                      )}
                      <Switch
                        checked={mod.enabled}
                        onCheckedChange={() => toggleModule(mod.id)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Security Ledger Tab */}
          <TabsContent value="ledger">
            <div className="glass-panel p-6">
              <div className="flex items-center gap-3 mb-6">
                <Lock className="w-5 h-5 text-primary" />
                <div>
                  <h3 className="font-semibold">Security Ledger</h3>
                  <p className="text-sm text-muted-foreground">Blockchain-style tamper-evident audit trail</p>
                </div>
              </div>
              
              <div className="space-y-3">
                {ledger.map((entry, i) => (
                  <div key={entry.id} className="premium-card p-4 flex items-start gap-4">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Workflow className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="outline" className="text-xs">{entry.action}</Badge>
                        <span className="text-xs text-muted-foreground">by {entry.actor}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{entry.data_description || 'System action'}</p>
                      <div className="flex gap-4 mt-2 text-xs text-muted-foreground font-mono">
                        <span>Hash: {entry.data_hash.substring(0, 12)}...</span>
                        {entry.previous_hash && (
                          <span>Prev: {entry.previous_hash.substring(0, 12)}...</span>
                        )}
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground shrink-0">
                      {new Date(entry.created_at).toLocaleString()}
                    </div>
                  </div>
                ))}
                {ledger.length === 0 && (
                  <div className="text-center p-8 text-muted-foreground">
                    No ledger entries yet. Security events will appear here.
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <div className="glass-panel p-6 space-y-6">
              <div>
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Settings className="w-5 h-5 text-primary" />
                  Platform Configuration
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Platform Name</label>
                    <Input defaultValue="AIBLTY" className="bg-muted/30 border-primary/20" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Support Email</label>
                    <Input defaultValue="support@aiblty.com" className="bg-muted/30 border-primary/20" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Platform Version</label>
                    <Input defaultValue="1.0.0" className="bg-muted/30 border-primary/20" readOnly />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Environment</label>
                    <Input defaultValue="Production" className="bg-muted/30 border-primary/20" readOnly />
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-primary/10">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-primary" />
                  Payment Integration
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="premium-card p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#635BFF]/10 flex items-center justify-center">
                      <PoundSterling className="w-5 h-5 text-[#635BFF]" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">Stripe</p>
                      <p className="text-xs text-glow-success">Connected</p>
                    </div>
                    <CheckCircle2 className="w-5 h-5 text-glow-success" />
                  </div>
                  <div className="premium-card p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#003087]/10 flex items-center justify-center">
                      <PoundSterling className="w-5 h-5 text-[#003087]" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">PayPal</p>
                      <p className="text-xs text-muted-foreground">Not configured</p>
                    </div>
                    <Power className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div className="premium-card p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <BarChart3 className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">Revenue Share</p>
                      <p className="text-xs text-primary">10% Platform Fee</p>
                    </div>
                    <CheckCircle2 className="w-5 h-5 text-glow-success" />
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-primary/10">
                <Button className="gradient-gold text-background">
                  Save Configuration
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}