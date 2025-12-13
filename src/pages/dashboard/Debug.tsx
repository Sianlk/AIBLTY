import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { getEventLogs, getJobs, type EventLog, type Job } from '@/lib/database';
import { motion } from 'framer-motion';
import { 
  RefreshCw, AlertCircle, Info, AlertTriangle, 
  CheckCircle2, Clock, Loader2, XCircle, Shield
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function DebugPage() {
  const { user, isAdmin } = useAuth();
  const [events, setEvents] = useState<EventLog[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    setRefreshing(true);
    try {
      const [eventsData, jobsData] = await Promise.all([
        getEventLogs(100),
        getJobs(),
      ]);
      setEvents(eventsData);
      setJobs(jobsData);
    } catch (err) {
      console.error('Failed to load debug data:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Auto-refresh every 10 seconds
  useEffect(() => {
    const interval = setInterval(loadData, 10000);
    return () => clearInterval(interval);
  }, []);

  if (!isAdmin) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Shield className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Admin Access Required</h2>
            <p className="text-muted-foreground">
              This page is only accessible to administrators.
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'error':
        return <AlertCircle className="w-4 h-4 text-destructive" />;
      case 'warn':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      default:
        return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'running':
        return <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-destructive" />;
      default:
        return <Clock className="w-4 h-4 text-muted-foreground" />;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Debug Console</h1>
            <p className="text-muted-foreground">
              System events, jobs, and error tracking
            </p>
          </div>
          <Button
            variant="outline"
            onClick={loadData}
            disabled={refreshing}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="glass-panel p-4">
            <p className="text-sm text-muted-foreground">Total Events</p>
            <p className="text-2xl font-bold">{events.length}</p>
          </div>
          <div className="glass-panel p-4">
            <p className="text-sm text-muted-foreground">Errors</p>
            <p className="text-2xl font-bold text-destructive">
              {events.filter(e => e.level === 'error').length}
            </p>
          </div>
          <div className="glass-panel p-4">
            <p className="text-sm text-muted-foreground">Active Jobs</p>
            <p className="text-2xl font-bold text-blue-500">
              {jobs.filter(j => j.status === 'running').length}
            </p>
          </div>
          <div className="glass-panel p-4">
            <p className="text-sm text-muted-foreground">Failed Jobs</p>
            <p className="text-2xl font-bold text-destructive">
              {jobs.filter(j => j.status === 'failed').length}
            </p>
          </div>
        </div>

        <Tabs defaultValue="events">
          <TabsList>
            <TabsTrigger value="events">Events ({events.length})</TabsTrigger>
            <TabsTrigger value="jobs">Jobs ({jobs.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="events" className="mt-4">
            {loading ? (
              <div className="glass-panel p-8 text-center">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
                <p className="text-muted-foreground">Loading events...</p>
              </div>
            ) : events.length === 0 ? (
              <div className="glass-panel p-8 text-center">
                <Info className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No events recorded yet</p>
              </div>
            ) : (
              <div className="space-y-2">
                {events.map((event, i) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.02 }}
                    className="glass-panel p-4"
                  >
                    <div className="flex items-start gap-3">
                      {getLevelIcon(event.level)}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm">{event.source}</span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(event.created_at).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm text-foreground/80">{event.message}</p>
                        {event.meta && Object.keys(event.meta).length > 0 && (
                          <pre className="mt-2 text-xs bg-muted/50 p-2 rounded overflow-x-auto">
                            {JSON.stringify(event.meta, null, 2)}
                          </pre>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="jobs" className="mt-4">
            {loading ? (
              <div className="glass-panel p-8 text-center">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
                <p className="text-muted-foreground">Loading jobs...</p>
              </div>
            ) : jobs.length === 0 ? (
              <div className="glass-panel p-8 text-center">
                <Info className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No jobs recorded yet</p>
              </div>
            ) : (
              <div className="space-y-2">
                {jobs.map((job, i) => (
                  <motion.div
                    key={job.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.02 }}
                    className="glass-panel p-4"
                  >
                    <div className="flex items-start gap-3">
                      {getStatusIcon(job.status)}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm">{job.type}</span>
                          <span className={`text-xs px-2 py-0.5 rounded ${
                            job.status === 'completed' ? 'bg-green-500/20 text-green-500' :
                            job.status === 'running' ? 'bg-blue-500/20 text-blue-500' :
                            job.status === 'failed' ? 'bg-destructive/20 text-destructive' :
                            'bg-muted text-muted-foreground'
                          }`}>
                            {job.status}
                          </span>
                          {job.progress > 0 && job.progress < 100 && (
                            <span className="text-xs text-muted-foreground">
                              {job.progress}%
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Created: {new Date(job.created_at).toLocaleString()}
                          {job.finished_at && ` • Finished: ${new Date(job.finished_at).toLocaleString()}`}
                        </p>
                        {job.error && (
                          <p className="text-sm text-destructive mt-1">{job.error}</p>
                        )}
                        {job.input && (
                          <details className="mt-2">
                            <summary className="text-xs text-muted-foreground cursor-pointer">
                              View input
                            </summary>
                            <pre className="mt-1 text-xs bg-muted/50 p-2 rounded overflow-x-auto">
                              {JSON.stringify(job.input, null, 2)}
                            </pre>
                          </details>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
