import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import api from '@/lib/apiClient';
import { 
  Users, DollarSign, Server, Settings, Search, 
  Crown, Shield, Mail, Calendar, ArrowUpDown,
  TrendingUp, CreditCard, Rocket, Database,
  RefreshCw, Download, AlertTriangle, Check
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

export default function AdminPage() {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadData();
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
      toast({ title: "Error", description: "Failed to load admin data", variant: "destructive" });
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

  const filteredUsers = users.filter(u => 
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const statCards = [
    { label: 'Total Users', value: stats?.totalUsers || 0, icon: Users, color: 'text-primary' },
    { label: 'Active Subscriptions', value: stats?.activeSubscriptions || 0, icon: CreditCard, color: 'text-emerald-400' },
    { label: 'Total Projects', value: stats?.totalProjects || 0, icon: Database, color: 'text-secondary' },
    { label: 'Total Revenue', value: `$${(stats?.totalRevenue || 0).toLocaleString()}`, icon: DollarSign, color: 'text-yellow-400' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Crown className="w-6 h-6 text-primary" />
              Admin Control Center
            </h1>
            <p className="text-muted-foreground">Manage users, billing, and system operations</p>
          </div>
          <Button variant="outline" onClick={loadData} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {statCards.map((stat, i) => (
            <div key={stat.label} className="glass-panel p-4">
              <div className="flex items-center justify-between mb-2">
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
                <TrendingUp className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Plan Distribution */}
        {stats?.usersByPlan && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="glass-panel p-6"
          >
            <h3 className="font-semibold mb-4">Users by Plan</h3>
            <div className="flex gap-6">
              {Object.entries(stats.usersByPlan).map(([plan, count]) => (
                <div key={plan} className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${
                    plan === 'elite' ? 'bg-primary' : 
                    plan === 'pro' ? 'bg-secondary' : 'bg-muted-foreground'
                  }`} />
                  <span className="capitalize">{plan}:</span>
                  <span className="font-bold">{count}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Tabs */}
        <Tabs defaultValue="users">
          <TabsList className="bg-muted/50">
            <TabsTrigger value="users"><Users className="w-4 h-4 mr-2" />Users</TabsTrigger>
            <TabsTrigger value="payments"><DollarSign className="w-4 h-4 mr-2" />Payments</TabsTrigger>
            <TabsTrigger value="deployments"><Rocket className="w-4 h-4 mr-2" />Deployments</TabsTrigger>
            <TabsTrigger value="settings"><Settings className="w-4 h-4 mr-2" />Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="mt-6">
            <div className="glass-panel p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
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
                      <tr key={user.id} className="border-b border-border/50 hover:bg-muted/20">
                        <td className="p-3">
                          <div>
                            <p className="font-medium">{user.name || 'No name'}</p>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                          </div>
                        </td>
                        <td className="p-3">
                          <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                            {user.role === 'admin' && <Shield className="w-3 h-3 mr-1" />}
                            {user.role}
                          </Badge>
                        </td>
                        <td className="p-3">
                          <Badge variant="outline" className={
                            user.plan === 'elite' ? 'border-primary text-primary' :
                            user.plan === 'pro' ? 'border-secondary text-secondary' : ''
                          }>
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
                              className="text-xs bg-muted/50 border border-border rounded px-2 py-1"
                            >
                              <option value="user">User</option>
                              <option value="admin">Admin</option>
                            </select>
                            <select
                              value={user.plan}
                              onChange={(e) => updateUserPlan(user.id, e.target.value as 'free' | 'pro' | 'elite')}
                              className="text-xs bg-muted/50 border border-border rounded px-2 py-1"
                            >
                              <option value="free">Free</option>
                              <option value="pro">Pro</option>
                              <option value="elite">Elite</option>
                            </select>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="payments" className="mt-6">
            <div className="glass-panel p-6">
              <h3 className="font-semibold mb-4">Recent Payments</h3>
              <div className="space-y-3">
                {payments.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No payments yet</p>
                ) : (
                  payments.map((payment) => (
                    <div key={payment.id} className="flex items-center justify-between p-4 bg-muted/20 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          payment.status === 'succeeded' ? 'bg-emerald-500/20' : 'bg-yellow-500/20'
                        }`}>
                          {payment.status === 'succeeded' ? (
                            <Check className="w-5 h-5 text-emerald-400" />
                          ) : (
                            <AlertTriangle className="w-5 h-5 text-yellow-400" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{payment.user?.email || 'Unknown'}</p>
                          <p className="text-sm text-muted-foreground">{payment.provider} • {payment.status}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">${(payment.amount / 100).toFixed(2)}</p>
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

          <TabsContent value="deployments" className="mt-6">
            <div className="glass-panel p-6">
              <h3 className="font-semibold mb-4">Recent Deployments</h3>
              <div className="space-y-3">
                {deployments.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No deployments yet</p>
                ) : (
                  deployments.map((deploy) => (
                    <div key={deploy.id} className="flex items-center justify-between p-4 bg-muted/20 rounded-lg">
                      <div className="flex items-center gap-4">
                        <Server className="w-5 h-5 text-primary" />
                        <div>
                          <p className="font-medium">{deploy.user?.email || 'Unknown'}</p>
                          <p className="text-sm text-muted-foreground">Target: {deploy.target}</p>
                        </div>
                      </div>
                      <Badge variant={
                        deploy.status === 'success' ? 'default' :
                        deploy.status === 'running' ? 'secondary' :
                        deploy.status === 'failed' ? 'destructive' : 'outline'
                      }>
                        {deploy.status}
                      </Badge>
                    </div>
                  ))
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <div className="glass-panel p-6">
              <h3 className="font-semibold mb-6">System Settings</h3>
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-muted/20 rounded-lg">
                  <div>
                    <p className="font-medium">Maintenance Mode</p>
                    <p className="text-sm text-muted-foreground">Disable access for non-admin users</p>
                  </div>
                  <Button variant="outline" size="sm">Enable</Button>
                </div>
                <div className="flex items-center justify-between p-4 bg-muted/20 rounded-lg">
                  <div>
                    <p className="font-medium">Registration</p>
                    <p className="text-sm text-muted-foreground">Allow new user registrations</p>
                  </div>
                  <Button variant="outline" size="sm">Enabled</Button>
                </div>
                <div className="flex items-center justify-between p-4 bg-muted/20 rounded-lg">
                  <div>
                    <p className="font-medium">Free Plan Limits</p>
                    <p className="text-sm text-muted-foreground">Configure free tier restrictions</p>
                  </div>
                  <Button variant="outline" size="sm">Configure</Button>
                </div>
                <div className="flex items-center justify-between p-4 bg-muted/20 rounded-lg">
                  <div>
                    <p className="font-medium">AI Rate Limits</p>
                    <p className="text-sm text-muted-foreground">Set per-user AI query limits</p>
                  </div>
                  <Button variant="outline" size="sm">Configure</Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}