import { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { sendAIMessage } from '@/lib/aiService';
import { 
  DollarSign, TrendingUp, CreditCard, PieChart, 
  BarChart3, ArrowUp, ArrowDown, Target, Zap,
  Wallet, Receipt, Settings, Plus, RefreshCw, Loader2, Sparkles
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const revenueData = [
  { month: 'Jan', revenue: 4200, expenses: 2100, profit: 2100 },
  { month: 'Feb', revenue: 5800, expenses: 2400, profit: 3400 },
  { month: 'Mar', revenue: 7200, expenses: 2800, profit: 4400 },
  { month: 'Apr', revenue: 6500, expenses: 2600, profit: 3900 },
  { month: 'May', revenue: 8900, expenses: 3100, profit: 5800 },
  { month: 'Jun', revenue: 11200, expenses: 3500, profit: 7700 },
];

const revenueStreams = [
  { name: 'Subscriptions', amount: '$8,450', percentage: 52, trend: '+12%' },
  { name: 'One-time Sales', amount: '$4,200', percentage: 26, trend: '+8%' },
  { name: 'API Usage', amount: '$2,100', percentage: 13, trend: '+23%' },
  { name: 'Consulting', amount: '$1,450', percentage: 9, trend: '-5%' },
];

const pricingModels = [
  { name: 'Freemium', desc: 'Free tier with premium upgrades', status: 'active' },
  { name: 'Subscription', desc: 'Monthly/annual recurring plans', status: 'active' },
  { name: 'Usage-Based', desc: 'Pay per API call or resource', status: 'configured' },
  { name: 'One-Time', desc: 'Single purchase products', status: 'configured' },
];

export default function RevenuePage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleOptimize = async () => {
    setLoading(true);
    try {
      const response = await sendAIMessage(
        [{ role: 'user', content: 'Analyze my revenue data and provide optimization suggestions to maximize profit and reduce churn.' }],
        'revenue'
      );
      if (response.success) {
        toast({ title: 'Optimization Complete', description: 'Revenue insights generated' });
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to run optimization', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    { label: 'Monthly Revenue', value: '$16,200', change: '+18%', icon: DollarSign, positive: true },
    { label: 'Active Subscriptions', value: '342', change: '+24', icon: CreditCard, positive: true },
    { label: 'Avg. Revenue/User', value: '$47.37', change: '+$5.20', icon: Target, positive: true },
    { label: 'Churn Rate', value: '2.3%', change: '-0.5%', icon: TrendingUp, positive: true },
  ];

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
              <DollarSign className="w-6 h-6 text-green-500" />
              Revenue Suite
            </h1>
            <p className="text-muted-foreground">Automated monetization and revenue optimization</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="icon">
              <RefreshCw className="w-4 h-4" />
            </Button>
            <Button variant="glow">
              <Plus className="w-4 h-4 mr-2" />
              Add Revenue Stream
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
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              className="glass-panel p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <stat.icon className="w-5 h-5 text-green-500" />
                <span className={`text-xs flex items-center gap-1 ${
                  stat.positive ? 'text-glow-success' : 'text-destructive'
                }`}>
                  {stat.positive ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                  {stat.change}
                </span>
              </div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="streams">Revenue Streams</TabsTrigger>
            <TabsTrigger value="pricing">Pricing Models</TabsTrigger>
            <TabsTrigger value="optimize">Optimize</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Revenue Chart */}
              <div className="lg:col-span-2 glass-panel p-6">
                <h3 className="font-semibold mb-4">Revenue Trend</h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                      <YAxis stroke="hsl(var(--muted-foreground))" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }} 
                      />
                      <Area 
                        type="monotone" 
                        dataKey="revenue" 
                        stroke="hsl(142, 76%, 36%)" 
                        fill="hsl(142, 76%, 36%, 0.2)" 
                        name="Revenue"
                      />
                      <Area 
                        type="monotone" 
                        dataKey="profit" 
                        stroke="hsl(var(--primary))" 
                        fill="hsl(var(--primary), 0.2)" 
                        name="Profit"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Revenue Breakdown */}
              <div className="glass-panel p-6">
                <h3 className="font-semibold mb-4">Revenue Breakdown</h3>
                <div className="space-y-4">
                  {revenueStreams.map((stream, i) => (
                    <motion.div
                      key={stream.name}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">{stream.name}</span>
                        <span className="text-sm text-muted-foreground">{stream.amount}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${stream.percentage}%` }}
                            transition={{ duration: 0.8, delay: i * 0.1 }}
                            className="h-full bg-green-500 rounded-full"
                          />
                        </div>
                        <span className={`text-xs ${
                          stream.trend.startsWith('+') ? 'text-glow-success' : 'text-destructive'
                        }`}>
                          {stream.trend}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="streams">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {revenueStreams.map((stream, i) => (
                <motion.div
                  key={stream.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="glass-panel-hover p-6"
                >
                  <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center mb-4">
                    <Wallet className="w-6 h-6 text-green-500" />
                  </div>
                  <h3 className="font-semibold mb-1">{stream.name}</h3>
                  <p className="text-2xl font-bold mb-2">{stream.amount}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{stream.percentage}% of total</span>
                    <span className={`text-xs ${
                      stream.trend.startsWith('+') ? 'text-glow-success' : 'text-destructive'
                    }`}>
                      {stream.trend}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="pricing">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {pricingModels.map((model, i) => (
                <motion.div
                  key={model.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="glass-panel p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <Receipt className="w-8 h-8 text-green-500" />
                    <span className={`text-xs px-2 py-1 rounded ${
                      model.status === 'active' 
                        ? 'bg-glow-success/20 text-glow-success' 
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {model.status}
                    </span>
                  </div>
                  <h3 className="font-semibold mb-1">{model.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{model.desc}</p>
                  <Button variant="outline" size="sm" className="w-full">
                    <Settings className="w-4 h-4 mr-2" />
                    Configure
                  </Button>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="optimize">
            <div className="max-w-4xl mx-auto glass-panel p-8 text-center">
              <Zap className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Revenue Optimization</h3>
              <p className="text-muted-foreground mb-6">
                AI-powered suggestions to maximize your revenue and reduce churn
              </p>
              <Button className="bg-green-600 hover:bg-green-700" onClick={handleOptimize} disabled={loading}>
                {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
                Run Optimization Analysis
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
