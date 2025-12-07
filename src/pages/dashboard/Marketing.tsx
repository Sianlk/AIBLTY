import { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { sendAIMessage } from '@/lib/aiService';
import {
  Megaphone, TrendingUp, Share2, Mail, MessageSquare, Globe,
  Zap, Target, BarChart3, Users, Calendar, Clock, Send,
  Twitter, Linkedin, Instagram, Facebook, Youtube, Sparkles,
  Rocket, ArrowRight, CheckCircle, Play, Pause, Settings,
  RefreshCw, Eye, Heart, MessageCircle, Repeat2, DollarSign,
  PieChart, Activity, Bot, Loader2, Plus as PlusIcon
} from 'lucide-react';

interface Campaign {
  id: string;
  name: string;
  type: 'social' | 'email' | 'seo' | 'viral';
  status: 'active' | 'paused' | 'scheduled' | 'completed';
  reach: number;
  engagement: number;
  conversions: number;
  revenue: number;
  startDate: string;
}

const campaigns: Campaign[] = [
  { id: '1', name: 'Product Launch Campaign', type: 'social', status: 'active', reach: 45230, engagement: 12.4, conversions: 847, revenue: 23450, startDate: '2024-01-10' },
  { id: '2', name: 'Email Nurture Sequence', type: 'email', status: 'active', reach: 8500, engagement: 34.2, conversions: 423, revenue: 15670, startDate: '2024-01-05' },
  { id: '3', name: 'SEO Content Blitz', type: 'seo', status: 'active', reach: 125000, engagement: 8.7, conversions: 1240, revenue: 45800, startDate: '2024-01-01' },
  { id: '4', name: 'Viral Referral Program', type: 'viral', status: 'active', reach: 67800, engagement: 28.3, conversions: 2100, revenue: 89500, startDate: '2023-12-15' },
];

const socialPlatforms = [
  { id: 'twitter', name: 'Twitter/X', icon: Twitter, connected: true, followers: '12.4K', color: 'text-sky-400' },
  { id: 'linkedin', name: 'LinkedIn', icon: Linkedin, connected: true, followers: '8.2K', color: 'text-blue-500' },
  { id: 'instagram', name: 'Instagram', icon: Instagram, connected: false, followers: '0', color: 'text-pink-500' },
  { id: 'facebook', name: 'Facebook', icon: Facebook, connected: true, followers: '5.6K', color: 'text-blue-600' },
  { id: 'youtube', name: 'YouTube', icon: Youtube, connected: false, followers: '0', color: 'text-red-500' },
];

const automationRules = [
  { id: '1', name: 'Auto-post new content', enabled: true, trigger: 'New blog published', action: 'Share to all platforms' },
  { id: '2', name: 'Welcome sequence', enabled: true, trigger: 'New signup', action: 'Send 5-email welcome series' },
  { id: '3', name: 'Engagement boost', enabled: true, trigger: 'Low engagement detected', action: 'Trigger retargeting campaign' },
  { id: '4', name: 'Lead scoring', enabled: true, trigger: 'User action', action: 'Update lead score & notify sales' },
  { id: '5', name: 'Viral loop', enabled: true, trigger: 'Customer purchase', action: 'Send referral incentive' },
];

export default function MarketingPage() {
  const { toast } = useToast();
  const [postContent, setPostContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [rules, setRules] = useState(automationRules);

  const handleGenerateContent = async () => {
    setIsGenerating(true);
    const response = await sendAIMessage(
      [{ role: 'user', content: 'Generate a viral marketing post for AIBLTY - the world\'s most advanced AI platform. Include emojis, call-to-action, and make it highly engaging. Format for multiple social platforms.' }],
      'marketing'
    );
    if (response.success) {
      setPostContent(response.content);
    } else {
      toast({ title: 'Error', description: response.error || 'Failed to generate content', variant: 'destructive' });
    }
    setIsGenerating(false);
  };

  const handlePublish = () => {
    toast({ title: 'Published', description: 'Content published to all connected platforms' });
    setPostContent('');
  };

  const toggleRule = (id: string) => {
    setRules(rules.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r));
    toast({ title: 'Automation Updated', description: 'Rule has been toggled' });
  };

  const toggleCampaign = (id: string) => {
    toast({ title: 'Campaign Updated', description: 'Campaign status changed' });
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
              <Megaphone className="w-6 h-6 text-primary" />
              Auto-Marketing Engine
            </h1>
            <p className="text-muted-foreground">Automated marketing that scales your business while you sleep</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">
              <BarChart3 className="w-4 h-4 mr-2" />
              Analytics
            </Button>
            <Button variant="glow">
              <Rocket className="w-4 h-4 mr-2" />
              Launch Campaign
            </Button>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-5 gap-4"
        >
          {[
            { label: 'Total Reach', value: '286K', icon: Eye, color: 'text-primary', change: '+24%' },
            { label: 'Engagement', value: '18.4%', icon: Heart, color: 'text-pink-400', change: '+12%' },
            { label: 'Conversions', value: '4,610', icon: Target, color: 'text-glow-success', change: '+31%' },
            { label: 'Revenue', value: '£174K', icon: DollarSign, color: 'text-secondary', change: '+48%' },
            { label: 'ROI', value: '847%', icon: TrendingUp, color: 'text-glow-warning', change: '+156%' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              className="glass-panel p-4"
            >
              <stat.icon className={`w-5 h-5 ${stat.color} mb-2`} />
              <p className="text-2xl font-bold">{stat.value}</p>
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">{stat.label}</p>
                <span className="text-xs text-glow-success">{stat.change}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <Tabs defaultValue="campaigns" className="space-y-6">
          <TabsList>
            <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
            <TabsTrigger value="social">Social Media</TabsTrigger>
            <TabsTrigger value="automation">Automation</TabsTrigger>
            <TabsTrigger value="viral">Viral Engine</TabsTrigger>
          </TabsList>

          <TabsContent value="campaigns">
            <div className="space-y-4">
              {campaigns.map((campaign, i) => (
                <motion.div
                  key={campaign.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="glass-panel p-5"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        campaign.status === 'active' ? 'bg-glow-success/20' : 'bg-muted'
                      }`}>
                        {campaign.type === 'social' ? <Share2 className="w-6 h-6 text-primary" /> :
                         campaign.type === 'email' ? <Mail className="w-6 h-6 text-blue-400" /> :
                         campaign.type === 'seo' ? <Globe className="w-6 h-6 text-green-400" /> :
                         <Zap className="w-6 h-6 text-yellow-400" />}
                      </div>
                      <div>
                        <h3 className="font-semibold">{campaign.name}</h3>
                        <p className="text-xs text-muted-foreground capitalize">{campaign.type} • Started {campaign.startDate}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-4 gap-6 text-center">
                      <div>
                        <p className="text-sm font-semibold">{campaign.reach.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">Reach</p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{campaign.engagement}%</p>
                        <p className="text-xs text-muted-foreground">Engagement</p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{campaign.conversions.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">Conversions</p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-glow-success">£{campaign.revenue.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">Revenue</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`text-xs px-2 py-1 rounded ${
                        campaign.status === 'active' ? 'bg-glow-success/20 text-glow-success' : 'bg-muted text-muted-foreground'
                      }`}>
                        {campaign.status}
                      </span>
                      <Button variant="ghost" size="sm" onClick={() => toggleCampaign(campaign.id)}>
                        {campaign.status === 'active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Settings className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="social">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Content Creator */}
              <div className="glass-panel p-6 space-y-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  AI Content Generator
                </h3>
                
                <div className="space-y-4">
                  <Textarea
                    placeholder="What do you want to promote? The AI will generate viral content..."
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                    rows={6}
                    className="bg-muted/50"
                  />
                  
                  <div className="flex gap-3">
                    <Button onClick={handleGenerateContent} disabled={isGenerating} variant="outline" className="flex-1">
                      {isGenerating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Bot className="w-4 h-4 mr-2" />}
                      {isGenerating ? 'Generating...' : 'Generate Viral Content'}
                    </Button>
                    <Button onClick={handlePublish} disabled={!postContent.trim()} variant="glow" className="flex-1">
                      <Send className="w-4 h-4 mr-2" />
                      Publish to All
                    </Button>
                  </div>
                </div>
              </div>

              {/* Connected Platforms */}
              <div className="glass-panel p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Share2 className="w-5 h-5 text-primary" />
                  Connected Platforms
                </h3>
                
                <div className="space-y-3">
                  {socialPlatforms.map((platform) => (
                    <div key={platform.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <platform.icon className={`w-5 h-5 ${platform.color}`} />
                        <div>
                          <p className="font-medium text-sm">{platform.name}</p>
                          <p className="text-xs text-muted-foreground">{platform.connected ? `${platform.followers} followers` : 'Not connected'}</p>
                        </div>
                      </div>
                      <Button variant={platform.connected ? 'ghost' : 'outline'} size="sm">
                        {platform.connected ? <CheckCircle className="w-4 h-4 text-glow-success" /> : 'Connect'}
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="automation">
            <div className="glass-panel p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold flex items-center gap-2">
                  <Zap className="w-5 h-5 text-primary" />
                  Marketing Automation Rules
                </h3>
                <Button variant="outline">
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Add Rule
                </Button>
              </div>

              <div className="space-y-3">
                {rules.map((rule, i) => (
                  <motion.div
                    key={rule.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center justify-between p-4 bg-muted/30 rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        rule.enabled ? 'bg-primary/20' : 'bg-muted'
                      }`}>
                        <Zap className={`w-5 h-5 ${rule.enabled ? 'text-primary' : 'text-muted-foreground'}`} />
                      </div>
                      <div>
                        <p className="font-medium">{rule.name}</p>
                        <p className="text-xs text-muted-foreground">
                          <span className="text-primary">{rule.trigger}</span> → {rule.action}
                        </p>
                      </div>
                    </div>
                    <Switch checked={rule.enabled} onCheckedChange={() => toggleRule(rule.id)} />
                  </motion.div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="viral">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="glass-panel p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Rocket className="w-5 h-5 text-primary" />
                  Viral Growth Engine
                </h3>
                <p className="text-muted-foreground text-sm mb-6">
                  Our AI-powered viral engine automatically optimizes for maximum shareability and growth.
                </p>

                <div className="space-y-4">
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Viral Coefficient</span>
                      <span className="text-lg font-bold text-glow-success">2.4x</span>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-primary to-secondary w-4/5"></div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Each user brings 2.4 new users on average</p>
                  </div>

                  <div className="p-4 bg-muted/30 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Share Rate</span>
                      <span className="text-lg font-bold text-primary">34%</span>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary w-1/3"></div>
                    </div>
                  </div>

                  <div className="p-4 bg-muted/30 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Referral Revenue</span>
                      <span className="text-lg font-bold text-secondary">£89,500</span>
                    </div>
                    <p className="text-xs text-muted-foreground">From 2,100 successful referrals this month</p>
                  </div>
                </div>
              </div>

              <div className="glass-panel p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-primary" />
                  Growth Levers
                </h3>
                
                <div className="space-y-3">
                  {[
                    { name: 'Referral Rewards', status: 'active', impact: 'High' },
                    { name: 'Social Proof Widgets', status: 'active', impact: 'Medium' },
                    { name: 'Gamification', status: 'active', impact: 'High' },
                    { name: 'FOMO Triggers', status: 'active', impact: 'Medium' },
                    { name: 'Exit Intent Capture', status: 'active', impact: 'High' },
                  ].map((lever, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-4 h-4 text-glow-success" />
                        <span className="text-sm font-medium">{lever.name}</span>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded ${
                        lever.impact === 'High' ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'
                      }`}>
                        {lever.impact} Impact
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}

const Plus = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14" /><path d="M12 5v14" />
  </svg>
);
