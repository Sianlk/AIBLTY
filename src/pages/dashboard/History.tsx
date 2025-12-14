import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { MarkdownRenderer } from '@/components/ui/markdown-renderer';
import { 
  History, Trash2, Download, Copy, ChevronDown, ChevronRight,
  FileText, Loader2, AlertCircle, Clock, CheckCircle2, XCircle,
  Rocket, Brain, Briefcase, Search, DollarSign, Zap, Link2,
  Users, Atom, Shield, RefreshCw, Globe
} from 'lucide-react';

interface JobWithArtifacts {
  id: string;
  type: string;
  status: string;
  progress: number;
  input: { prompt?: string } | null;
  result: unknown;
  error: string | null;
  created_at: string;
  finished_at: string | null;
  artifacts: Array<{
    id: string;
    type: string;
    title: string;
    content: string | null;
    created_at: string;
  }>;
}

const CAPABILITY_ICONS: Record<string, React.ReactNode> = {
  'app-generator': <Rocket className="w-5 h-5" />,
  'intelligence-workspace': <Brain className="w-5 h-5" />,
  'business-builder': <Briefcase className="w-5 h-5" />,
  'research-engine': <Search className="w-5 h-5" />,
  'revenue-suite': <DollarSign className="w-5 h-5" />,
  'automation-engine': <Zap className="w-5 h-5" />,
  'integration-hub': <Link2 className="w-5 h-5" />,
  'ai-workforce': <Users className="w-5 h-5" />,
  'quantum-engine': <Atom className="w-5 h-5" />,
  'security-layer': <Shield className="w-5 h-5" />,
  'evolution-layer': <RefreshCw className="w-5 h-5" />,
  'global-network': <Globe className="w-5 h-5" />,
};

const CAPABILITY_NAMES: Record<string, string> = {
  'app-generator': 'App Generator',
  'intelligence-workspace': 'Intelligence Workspace',
  'business-builder': 'Business Builder',
  'research-engine': 'Research Engine',
  'revenue-suite': 'Revenue Suite',
  'automation-engine': 'Automation Engine',
  'integration-hub': 'Integration Hub',
  'ai-workforce': 'AI Workforce',
  'quantum-engine': 'Quantum Engine',
  'security-layer': 'Security Layer',
  'evolution-layer': 'Evolution Layer',
  'global-network': 'Global Network',
};

export default function HistoryPage() {
  const { toast } = useToast();
  const [jobs, setJobs] = useState<JobWithArtifacts[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedJob, setExpandedJob] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  const loadHistory = async () => {
    setLoading(true);
    try {
      // Fetch jobs
      const { data: jobsData, error: jobsError } = await supabase
        .from('jobs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (jobsError) throw jobsError;

      // Fetch artifacts for all jobs
      const jobIds = (jobsData || []).map(j => j.id);
      const { data: artifactsData, error: artifactsError } = await supabase
        .from('artifacts')
        .select('*')
        .in('job_id', jobIds);

      if (artifactsError) throw artifactsError;

      // Group artifacts by job
      const artifactsByJob = (artifactsData || []).reduce((acc, artifact) => {
        const jobId = artifact.job_id;
        if (jobId) {
          if (!acc[jobId]) acc[jobId] = [];
          acc[jobId].push(artifact);
        }
        return acc;
      }, {} as Record<string, typeof artifactsData>);

      // Combine
      const jobsWithArtifacts = (jobsData || []).map(job => ({
        ...job,
        input: job.input as { prompt?: string } | null,
        artifacts: artifactsByJob[job.id] || [],
      }));

      setJobs(jobsWithArtifacts);
    } catch (err) {
      console.error('Failed to load history:', err);
      toast({
        title: 'Failed to load history',
        description: 'Please try again',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handleDelete = async (jobId: string) => {
    setDeleting(jobId);
    try {
      // Delete artifacts first
      await supabase.from('artifacts').delete().eq('job_id', jobId);
      // Delete job
      const { error } = await supabase.from('jobs').delete().eq('id', jobId);
      if (error) throw error;

      setJobs(prev => prev.filter(j => j.id !== jobId));
      toast({ title: 'Deleted successfully' });
    } catch (err) {
      console.error('Failed to delete:', err);
      toast({
        title: 'Failed to delete',
        description: 'Please try again',
        variant: 'destructive',
      });
    } finally {
      setDeleting(null);
    }
  };

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    toast({ title: 'Copied to clipboard' });
  };

  const handleDownload = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: 'Downloaded' });
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-destructive" />;
      case 'running':
        return <Loader2 className="w-4 h-4 text-primary animate-spin" />;
      default:
        return <Clock className="w-4 h-4 text-muted-foreground" />;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="glass-panel p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <History className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">History</h1>
                <p className="text-muted-foreground">View and manage your generated outputs</p>
              </div>
            </div>
            <Button variant="outline" onClick={loadHistory} disabled={loading}>
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="glass-panel p-12 text-center">
            <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading history...</p>
          </div>
        )}

        {/* Empty state */}
        {!loading && jobs.length === 0 && (
          <div className="glass-panel p-12 text-center">
            <History className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No history yet</h3>
            <p className="text-muted-foreground">
              Start using AIBLTY capabilities to see your history here
            </p>
          </div>
        )}

        {/* Jobs list */}
        {!loading && jobs.length > 0 && (
          <div className="space-y-3">
            {jobs.map((job) => (
              <motion.div
                key={job.id}
                layout
                className="glass-panel overflow-hidden"
              >
                {/* Job header */}
                <div
                  className="p-4 cursor-pointer hover:bg-white/5 transition-colors"
                  onClick={() => setExpandedJob(expandedJob === job.id ? null : job.id)}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                      {CAPABILITY_ICONS[job.type] || <FileText className="w-5 h-5" />}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold truncate">
                          {CAPABILITY_NAMES[job.type] || job.type}
                        </h3>
                        {getStatusIcon(job.status)}
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {job.input?.prompt?.slice(0, 100) || 'No prompt'}
                        {(job.input?.prompt?.length || 0) > 100 ? '...' : ''}
                      </p>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{formatDate(job.created_at)}</span>
                      <span className="text-xs px-2 py-1 rounded bg-muted">
                        {job.artifacts.length} artifact{job.artifacts.length !== 1 ? 's' : ''}
                      </span>
                      {expandedJob === job.id ? (
                        <ChevronDown className="w-5 h-5" />
                      ) : (
                        <ChevronRight className="w-5 h-5" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Expanded content */}
                <AnimatePresence>
                  {expandedJob === job.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-border/50"
                    >
                      <div className="p-4 space-y-4">
                        {/* Prompt */}
                        {job.input?.prompt && (
                          <div className="bg-muted/30 rounded-lg p-4">
                            <h4 className="text-sm font-medium text-muted-foreground mb-2">Your Request</h4>
                            <p className="text-sm">{job.input.prompt}</p>
                          </div>
                        )}

                        {/* Error */}
                        {job.error && (
                          <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4">
                            <div className="flex items-center gap-2 text-destructive mb-1">
                              <AlertCircle className="w-4 h-4" />
                              <span className="font-medium">Error</span>
                            </div>
                            <p className="text-sm text-destructive/80">{job.error}</p>
                          </div>
                        )}

                        {/* Artifacts */}
                        {job.artifacts.length > 0 && (
                          <div className="space-y-3">
                            {job.artifacts.map((artifact) => (
                              <div
                                key={artifact.id}
                                className="border border-border/50 rounded-lg overflow-hidden"
                              >
                                <div className="flex items-center justify-between p-3 bg-muted/20">
                                  <div className="flex items-center gap-2">
                                    <FileText className="w-4 h-4 text-primary" />
                                    <span className="font-medium text-sm">{artifact.title}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    {artifact.content && (
                                      <>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleCopy(artifact.content!);
                                          }}
                                        >
                                          <Copy className="w-4 h-4 mr-1" />
                                          Copy
                                        </Button>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleDownload(
                                              artifact.content!,
                                              `${artifact.title.toLowerCase().replace(/\s+/g, '-')}.md`
                                            );
                                          }}
                                        >
                                          <Download className="w-4 h-4 mr-1" />
                                          Download
                                        </Button>
                                      </>
                                    )}
                                  </div>
                                </div>
                                {artifact.content && (
                                  <div className="p-4 max-h-96 overflow-y-auto">
                                    <MarkdownRenderer content={artifact.content} />
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex justify-end pt-2 border-t border-border/30">
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(job.id);
                            }}
                            disabled={deleting === job.id}
                          >
                            {deleting === job.id ? (
                              <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4 mr-1" />
                            )}
                            Delete
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
