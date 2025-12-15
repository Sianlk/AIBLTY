import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { getProjects, getJobs, type Project, type Job } from '@/lib/database';
import { useToast } from '@/hooks/use-toast';
import { 
  Brain, Rocket, Zap, Plus, FolderOpen, 
  Clock, TrendingUp, Sparkles, ArrowRight, Loader2, Activity,
  ShoppingCart, Bot, Server, Code2, FileCode, Database, Smartphone
} from 'lucide-react';

const generatorTypes = [
  { icon: Sparkles, label: 'SaaS Platform', href: '/dashboard/builder?type=saas', color: 'from-primary to-secondary', desc: 'Auth, billing, dashboard' },
  { icon: ShoppingCart, label: 'E-Commerce', href: '/dashboard/builder?type=ecommerce', color: 'from-secondary to-primary', desc: 'Cart, checkout, orders' },
  { icon: Bot, label: 'AI/GPT App', href: '/dashboard/builder?type=gpt', color: 'from-primary to-glow-success', desc: 'Chat, streaming, AI' },
  { icon: Server, label: 'Full-Stack', href: '/dashboard/builder?type=fullstack', color: 'from-glow-success to-primary', desc: 'Frontend + Backend' },
  { icon: Code2, label: 'React App', href: '/dashboard/builder?type=react', color: 'from-secondary to-glow-success', desc: 'Vite + TypeScript' },
  { icon: FileCode, label: 'Next.js', href: '/dashboard/builder?type=nextjs', color: 'from-primary to-secondary', desc: 'SSR + App Router' },
  { icon: Database, label: 'Backend API', href: '/dashboard/builder?type=express', color: 'from-glow-success to-secondary', desc: 'Express + Prisma' },
  { icon: Smartphone, label: 'Mobile App', href: '/dashboard/builder?type=mobile', color: 'from-secondary to-primary', desc: 'iOS + Android' },
];

export default function Dashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [projectsData, jobsData] = await Promise.all([
        getProjects(),
        getJobs()
      ]);
      setProjects(projectsData);
      setJobs(jobsData);
    } catch (error) {
      console.error('Failed to load data:', error);
      toast({
        title: 'Error loading data',
        description: 'Please refresh the page to try again',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const completedJobs = jobs.filter(j => j.status === 'completed').length;
  const runningJobs = jobs.filter(j => j.status === 'running').length;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel p-6"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">
                Welcome back, <span className="text-primary">{user?.name || 'User'}</span>
              </h1>
              <p className="text-muted-foreground mt-1">
                {user?.plan === 'free' 
                  ? 'Upgrade to unlock more AI capabilities' 
                  : `You're on the ${user?.plan} plan`}
              </p>
            </div>
            <Link to="/dashboard/projects">
              <Button variant="glow">
                <Plus className="w-4 h-4 mr-2" />
                New Project
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Generator Types - Full Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-lg font-semibold mb-4">Code Generators</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {generatorTypes.map((type, i) => (
              <Link key={type.label} to={type.href}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 + i * 0.03 }}
                  whileHover={{ scale: 1.02 }}
                  className="glass-panel-hover p-4 cursor-pointer group relative overflow-hidden"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${type.color} opacity-5 group-hover:opacity-10 transition-opacity`} />
                  <div className="relative z-10">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${type.color} flex items-center justify-center mb-3`}>
                      <type.icon className="w-5 h-5 text-background" />
                    </div>
                    <h3 className="font-semibold text-sm mb-1">{type.label}</h3>
                    <p className="text-xs text-muted-foreground">{type.desc}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity absolute top-4 right-4" />
                </motion.div>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Recent Projects */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Recent Projects</h2>
            <Link to="/dashboard/projects" className="text-sm text-primary hover:underline">
              View all
            </Link>
          </div>

          {loading ? (
            <div className="glass-panel p-8 text-center">
              <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
              <p className="text-muted-foreground">Loading projects...</p>
            </div>
          ) : projects.length === 0 ? (
            <div className="glass-panel p-8 text-center">
              <FolderOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold mb-2">No projects yet</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Create your first project to get started with AI tools
              </p>
              <Link to="/dashboard/projects">
                <Button variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Project
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid gap-4">
              {projects.slice(0, 5).map((project, i) => (
                <Link key={project.id} to={`/dashboard/projects/${project.id}`}>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + i * 0.05 }}
                    className="glass-panel-hover p-4 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">{project.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {project.description || 'No description'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`text-xs px-2 py-1 rounded ${
                        project.status === 'active' 
                          ? 'bg-primary/20 text-primary' 
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        {project.status}
                      </span>
                      <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1 justify-end">
                        <Clock className="w-3 h-3" />
                        {new Date(project.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          )}
        </motion.div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {[
            { label: 'Projects', value: projects.length.toString(), icon: FolderOpen },
            { label: 'AI Jobs', value: jobs.length.toString(), icon: Brain },
            { label: 'Completed', value: completedJobs.toString(), icon: Zap },
            { label: 'Running', value: runningJobs.toString(), icon: Activity },
          ].map((stat, i) => (
            <div key={stat.label} className="glass-panel p-4 text-center">
              <stat.icon className="w-6 h-6 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
