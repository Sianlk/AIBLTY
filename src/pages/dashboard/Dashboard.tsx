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
  Clock, TrendingUp, Sparkles, ArrowRight, Loader2, Activity
} from 'lucide-react';

const quickActions = [
  { icon: Brain, label: 'Problem Solver', href: '/dashboard/solver', color: 'text-primary', desc: 'Analyze and solve complex problems' },
  { icon: Rocket, label: 'Business Builder', href: '/dashboard/builder', color: 'text-secondary', desc: 'Generate business plans & strategies' },
  { icon: Zap, label: 'Automation', href: '/dashboard/automation', color: 'text-glow-success', desc: 'Create automated workflows' },
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

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-lg font-semibold mb-4">AI Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickActions.map((action, i) => (
              <Link key={action.label} to={action.href}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 + i * 0.05 }}
                  className="glass-panel-hover p-6 cursor-pointer group relative"
                >
                  <action.icon className={`w-10 h-10 ${action.color} mb-4`} />
                  <h3 className="font-semibold mb-1">{action.label}</h3>
                  <p className="text-sm text-muted-foreground">{action.desc}</p>
                  <ArrowRight className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity absolute top-6 right-6" />
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
