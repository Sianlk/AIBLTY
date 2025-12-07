import { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { sendAIMessage } from '@/lib/aiService';
import { 
  Megaphone, Plus, Calendar, Clock, Image, Link2,
  Twitter, Instagram, Linkedin, Facebook, Youtube,
  TrendingUp, BarChart3, Users, Heart, MessageCircle,
  Share2, Eye, Send, Loader2
} from 'lucide-react';

interface ScheduledPost {
  id: string;
  content: string;
  platforms: string[];
  scheduledFor: string;
  status: 'scheduled' | 'published' | 'draft';
}

const platforms = [
  { id: 'twitter', name: 'Twitter/X', icon: Twitter, color: 'text-sky-400', connected: true },
  { id: 'instagram', name: 'Instagram', icon: Instagram, color: 'text-pink-500', connected: true },
  { id: 'linkedin', name: 'LinkedIn', icon: Linkedin, color: 'text-blue-600', connected: false },
  { id: 'facebook', name: 'Facebook', icon: Facebook, color: 'text-blue-500', connected: false },
  { id: 'youtube', name: 'YouTube', icon: Youtube, color: 'text-red-500', connected: false },
];

const samplePosts: ScheduledPost[] = [
  { 
    id: '1', 
    content: 'Exciting news! We just launched our new AI-powered features. Check them out! 🚀 #AI #Innovation', 
    platforms: ['twitter', 'linkedin'], 
    scheduledFor: 'Today, 3:00 PM',
    status: 'scheduled'
  },
  { 
    id: '2', 
    content: 'Behind the scenes look at how we build our products. Thread incoming... 🧵', 
    platforms: ['twitter'], 
    scheduledFor: 'Tomorrow, 10:00 AM',
    status: 'scheduled'
  },
  { 
    id: '3', 
    content: 'Thank you for 10K followers! Your support means everything. 🎉', 
    platforms: ['twitter', 'instagram'], 
    scheduledFor: 'Yesterday, 2:00 PM',
    status: 'published'
  },
];

const analytics = [
  { label: 'Total Followers', value: '24.5K', change: '+12%', icon: Users },
  { label: 'Engagement Rate', value: '4.8%', change: '+0.5%', icon: Heart },
  { label: 'Total Impressions', value: '156K', change: '+23%', icon: Eye },
  { label: 'Posts This Week', value: '12', change: '+3', icon: MessageCircle },
];

export default function SocialPage() {
  const [posts, setPosts] = useState<ScheduledPost[]>(samplePosts);
  const [newPostContent, setNewPostContent] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const togglePlatform = (platformId: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platformId) 
        ? prev.filter(p => p !== platformId)
        : [...prev, platformId]
    );
  };

  const handleSchedulePost = async () => {
    if (!newPostContent.trim()) {
      toast({ title: 'Error', description: 'Please enter post content', variant: 'destructive' });
      return;
    }
    if (selectedPlatforms.length === 0) {
      toast({ title: 'Error', description: 'Please select at least one platform', variant: 'destructive' });
      return;
    }

    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    
    const newPost: ScheduledPost = {
      id: Date.now().toString(),
      content: newPostContent,
      platforms: selectedPlatforms,
      scheduledFor: 'Scheduled for later',
      status: 'scheduled'
    };
    
    setPosts([newPost, ...posts]);
    setNewPostContent('');
    setSelectedPlatforms([]);
    setLoading(false);
    
    toast({ title: 'Post Scheduled', description: 'Your post has been scheduled successfully' });
  };

  const handleGenerateContent = async () => {
    setLoading(true);
    const response = await sendAIMessage(
      [{ role: 'user', content: 'Generate a viral, engaging social media post for a technology/AI platform. Include emojis, hashtags, and make it shareable. Keep it under 280 characters for Twitter compatibility.' }],
      'social'
    );
    if (response.success) {
      setNewPostContent(response.content);
      toast({ title: 'Content Generated', description: 'AI has generated a viral post for you' });
    } else {
      toast({ title: 'Error', description: response.error || 'Failed to generate content', variant: 'destructive' });
    }
    setLoading(false);
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
              <Megaphone className="w-6 h-6 text-pink-500" />
              Social Automation
            </h1>
            <p className="text-muted-foreground">Automate your social media presence across all platforms</p>
          </div>
          <Button variant="glow">
            <Plus className="w-4 h-4 mr-2" />
            Create Post
          </Button>
        </motion.div>

        {/* Analytics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {analytics.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              className="glass-panel p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <stat.icon className="w-5 h-5 text-pink-500" />
                <span className="text-xs text-glow-success">{stat.change}</span>
              </div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        <Tabs defaultValue="compose" className="space-y-6">
          <TabsList>
            <TabsTrigger value="compose">Compose</TabsTrigger>
            <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="accounts">Accounts</TabsTrigger>
          </TabsList>

          <TabsContent value="compose">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Compose Area */}
              <div className="lg:col-span-2 glass-panel p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Create New Post</Label>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleGenerateContent}
                    disabled={loading}
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                    AI Generate
                  </Button>
                </div>
                
                <Textarea
                  placeholder="What's on your mind? Write your post here..."
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  rows={6}
                  className="bg-muted/50 border-border resize-none"
                />
                
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Image className="w-4 h-4 mr-2" />
                    Add Image
                  </Button>
                  <Button variant="outline" size="sm">
                    <Link2 className="w-4 h-4 mr-2" />
                    Add Link
                  </Button>
                </div>

                {/* Platform Selection */}
                <div>
                  <Label className="mb-3 block">Select Platforms</Label>
                  <div className="flex flex-wrap gap-2">
                    {platforms.filter(p => p.connected).map((platform) => (
                      <button
                        key={platform.id}
                        onClick={() => togglePlatform(platform.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
                          selectedPlatforms.includes(platform.id)
                            ? 'border-pink-500 bg-pink-500/10'
                            : 'border-border bg-muted/50 hover:border-muted-foreground'
                        }`}
                      >
                        <platform.icon className={`w-4 h-4 ${platform.color}`} />
                        <span className="text-sm">{platform.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button variant="outline">
                    <Calendar className="w-4 h-4 mr-2" />
                    Schedule
                  </Button>
                  <Button 
                    className="bg-pink-600 hover:bg-pink-700"
                    onClick={handleSchedulePost}
                    disabled={loading}
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Post Now
                  </Button>
                </div>
              </div>

              {/* Preview */}
              <div className="glass-panel p-6">
                <h3 className="font-semibold mb-4">Preview</h3>
                <div className="bg-muted/30 rounded-lg p-4 min-h-[200px]">
                  {newPostContent ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-full bg-primary/20" />
                        <div>
                          <p className="font-medium text-sm">Your Brand</p>
                          <p className="text-xs text-muted-foreground">@yourbrand</p>
                        </div>
                      </div>
                      <p className="text-sm whitespace-pre-wrap">{newPostContent}</p>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground text-center pt-16">
                      Start typing to see a preview
                    </p>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="scheduled">
            <div className="space-y-4">
              {posts.map((post, i) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="glass-panel-hover p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <p className="text-sm mb-3">{post.content}</p>
                      <div className="flex items-center gap-4">
                        <div className="flex gap-1">
                          {post.platforms.map(p => {
                            const platform = platforms.find(pl => pl.id === p);
                            return platform ? (
                              <platform.icon key={p} className={`w-4 h-4 ${platform.color}`} />
                            ) : null;
                          })}
                        </div>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {post.scheduledFor}
                        </span>
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded ${
                      post.status === 'published' 
                        ? 'bg-glow-success/20 text-glow-success' 
                        : post.status === 'scheduled'
                        ? 'bg-primary/20 text-primary'
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {post.status}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="glass-panel p-8 text-center">
              <BarChart3 className="w-12 h-12 text-pink-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Detailed Analytics</h3>
              <p className="text-muted-foreground mb-6">
                Track performance across all your connected platforms
              </p>
              <Button variant="outline">View Full Report</Button>
            </div>
          </TabsContent>

          <TabsContent value="accounts">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {platforms.map((platform, i) => (
                <motion.div
                  key={platform.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="glass-panel p-5"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      platform.connected ? 'bg-primary/20' : 'bg-muted'
                    }`}>
                      <platform.icon className={`w-6 h-6 ${platform.color}`} />
                    </div>
                    <div>
                      <h3 className="font-semibold">{platform.name}</h3>
                      <p className="text-xs text-muted-foreground">
                        {platform.connected ? 'Connected' : 'Not connected'}
                      </p>
                    </div>
                  </div>
                  <Button 
                    variant={platform.connected ? "outline" : "default"}
                    className="w-full"
                  >
                    {platform.connected ? 'Disconnect' : 'Connect'}
                  </Button>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
