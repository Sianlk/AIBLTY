import { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { sendAIMessage } from '@/lib/aiService';
import { 
  Plug, Search, Plus, Check, ExternalLink, Settings,
  CreditCard, Mail, Calendar, Database, Cloud, 
  FileText, BarChart3, MessageSquare, Webhook, Key, Loader2, Sparkles
} from 'lucide-react';

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: any;
  category: string;
  status: 'connected' | 'available' | 'coming';
  popular?: boolean;
}

const integrations: Integration[] = [
  // Payments
  { id: 'stripe', name: 'Stripe', description: 'Payment processing and subscriptions', icon: CreditCard, category: 'payments', status: 'connected', popular: true },
  { id: 'paypal', name: 'PayPal', description: 'Global payment solutions', icon: CreditCard, category: 'payments', status: 'available' },
  { id: 'revolut', name: 'Revolut Business', description: 'Banking and payments', icon: CreditCard, category: 'payments', status: 'available' },
  
  // Productivity
  { id: 'notion', name: 'Notion', description: 'Workspace and documentation', icon: FileText, category: 'productivity', status: 'connected', popular: true },
  { id: 'airtable', name: 'Airtable', description: 'Database and spreadsheets', icon: Database, category: 'productivity', status: 'available' },
  { id: 'google', name: 'Google Workspace', description: 'Docs, Sheets, Calendar, Drive', icon: Cloud, category: 'productivity', status: 'connected' },
  
  // Communication
  { id: 'slack', name: 'Slack', description: 'Team communication', icon: MessageSquare, category: 'communication', status: 'available', popular: true },
  { id: 'email', name: 'Email (SMTP)', description: 'Transactional emails', icon: Mail, category: 'communication', status: 'connected' },
  { id: 'calendar', name: 'Calendar', description: 'Scheduling and events', icon: Calendar, category: 'communication', status: 'available' },
  
  // Analytics
  { id: 'ga4', name: 'Google Analytics 4', description: 'Website analytics', icon: BarChart3, category: 'analytics', status: 'available' },
  { id: 'plausible', name: 'Plausible', description: 'Privacy-friendly analytics', icon: BarChart3, category: 'analytics', status: 'available' },
  
  // Developer
  { id: 'webhook', name: 'Webhooks', description: 'Custom event triggers', icon: Webhook, category: 'developer', status: 'connected' },
  { id: 'api', name: 'REST API', description: 'Full API access', icon: Key, category: 'developer', status: 'connected' },
];

const categories = [
  { id: 'all', label: 'All' },
  { id: 'payments', label: 'Payments' },
  { id: 'productivity', label: 'Productivity' },
  { id: 'communication', label: 'Communication' },
  { id: 'analytics', label: 'Analytics' },
  { id: 'developer', label: 'Developer' },
];

export default function IntegrationsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { toast } = useToast();

  const filteredIntegrations = integrations.filter(integration => {
    const matchesSearch = integration.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         integration.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || integration.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleConnect = (integration: Integration) => {
    toast({
      title: integration.status === 'connected' ? 'Already Connected' : 'Connection Started',
      description: integration.status === 'connected' 
        ? `${integration.name} is already connected to your account`
        : `Setting up connection to ${integration.name}...`,
    });
  };

  const connectedCount = integrations.filter(i => i.status === 'connected').length;

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
              <Plug className="w-6 h-6 text-cyan-500" />
              Integration Hub
            </h1>
            <p className="text-muted-foreground">Connect to 100+ services and APIs</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">
              {connectedCount} connected
            </span>
            <Button variant="outline">
              <Key className="w-4 h-4 mr-2" />
              API Keys
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
            { label: 'Connected', value: connectedCount, icon: Check, color: 'text-glow-success' },
            { label: 'Available', value: integrations.filter(i => i.status === 'available').length, icon: Plug, color: 'text-cyan-500' },
            { label: 'API Calls Today', value: '2.4K', icon: Webhook, color: 'text-primary' },
            { label: 'Data Synced', value: '156MB', icon: Database, color: 'text-secondary' },
          ].map((stat) => (
            <div key={stat.label} className="glass-panel p-4">
              <stat.icon className={`w-5 h-5 ${stat.color} mb-2`} />
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col md:flex-row gap-4"
        >
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search integrations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-muted/50"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap transition-all ${
                  selectedCategory === category.id
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500'
                    : 'bg-muted/50 text-muted-foreground hover:text-foreground border border-transparent'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Integrations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredIntegrations.map((integration, i) => (
            <motion.div
              key={integration.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.03 }}
              className="glass-panel-hover p-5"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    integration.status === 'connected' ? 'bg-cyan-500/20' : 'bg-muted'
                  }`}>
                    <integration.icon className={`w-6 h-6 ${
                      integration.status === 'connected' ? 'text-cyan-500' : 'text-muted-foreground'
                    }`} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{integration.name}</h3>
                      {integration.popular && (
                        <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded">Popular</span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{integration.description}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className={`text-xs px-2 py-1 rounded ${
                  integration.status === 'connected' 
                    ? 'bg-glow-success/20 text-glow-success' 
                    : integration.status === 'available'
                    ? 'bg-muted text-muted-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {integration.status === 'connected' ? 'Connected' : 
                   integration.status === 'available' ? 'Available' : 'Coming Soon'}
                </span>
                
                <div className="flex gap-2">
                  {integration.status === 'connected' && (
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Settings className="w-4 h-4" />
                    </Button>
                  )}
                  <Button 
                    variant={integration.status === 'connected' ? 'outline' : 'default'}
                    size="sm"
                    onClick={() => handleConnect(integration)}
                    disabled={integration.status === 'coming'}
                  >
                    {integration.status === 'connected' ? (
                      <>
                        <Check className="w-4 h-4 mr-1" />
                        Connected
                      </>
                    ) : integration.status === 'available' ? (
                      <>
                        <Plus className="w-4 h-4 mr-1" />
                        Connect
                      </>
                    ) : (
                      'Coming Soon'
                    )}
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Custom Integration */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-panel p-6 text-center"
        >
          <Webhook className="w-10 h-10 text-cyan-500 mx-auto mb-3" />
          <h3 className="font-semibold mb-2">Need a Custom Integration?</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Use our Webhooks and REST API to connect any service
          </p>
          <div className="flex gap-3 justify-center">
            <Button variant="outline">
              <ExternalLink className="w-4 h-4 mr-2" />
              API Docs
            </Button>
            <Button variant="outline">
              <Webhook className="w-4 h-4 mr-2" />
              Configure Webhooks
            </Button>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
