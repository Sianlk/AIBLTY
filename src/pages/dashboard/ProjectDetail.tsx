import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import api from '@/lib/apiClient';
import { 
  ArrowLeft, Send, Bot, User, Brain, Rocket, Zap,
  Clock, MessageSquare, Settings, Sparkles, Loader2,
  Plus, Trash2, MoreVertical, ChevronRight
} from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt: string;
}

interface Session {
  id: string;
  type: string;
  createdAt: string;
  messages?: Message[];
}

interface Project {
  id: string;
  title: string;
  description?: string;
  status: string;
  createdAt: string;
}

const sessionTypes = [
  { type: 'chat', icon: MessageSquare, label: 'Chat' },
  { type: 'solver', icon: Brain, label: 'Problem Solver' },
  { type: 'builder', icon: Rocket, label: 'Business Builder' },
  { type: 'automation', icon: Zap, label: 'Automation' },
];

export default function ProjectDetailPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const { toast } = useToast();
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  const [project, setProject] = useState<Project | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [activeSession, setActiveSession] = useState<Session | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (projectId) loadProject();
  }, [projectId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadProject = async () => {
    try {
      const res = await api.getProject(projectId!);
      setProject(res?.data);
      const sessionsRes = await api.getSessions(projectId!);
      setSessions(sessionsRes?.data || []);
    } catch (error) {
      console.error('Failed to load project:', error);
      toast({ title: "Error", description: "Failed to load project", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const createSession = async (type: string) => {
    try {
      const res = await api.createSession(projectId!, type);
      const newSession = res?.data;
      setSessions([newSession, ...sessions]);
      setActiveSession(newSession);
      setMessages([]);
      toast({ title: "Session Created", description: `New ${type} session started` });
    } catch (error) {
      toast({ title: "Error", description: "Failed to create session", variant: "destructive" });
    }
  };

  const loadSession = async (session: Session) => {
    setActiveSession(session);
    try {
      const res = await api.getMessages(session.id) as any;
      setMessages(res?.data || []);
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || !activeSession || sending) return;
    
    const userMessage: Message = {
      id: `temp-${Date.now()}`,
      role: 'user',
      content: input,
      createdAt: new Date().toISOString(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setSending(true);

    try {
      // Send message and get AI response
      await api.createMessage(activeSession.id, 'user', input);
      
      // Call AI based on session type
      let aiResponse: any;
      if (activeSession.type === 'solver') {
        aiResponse = await api.ai.solveProblem(projectId!, input);
      } else if (activeSession.type === 'builder') {
        aiResponse = await api.ai.buildBusiness(projectId!, input);
      } else {
        aiResponse = await api.ai.solveProblem(projectId!, input);
      }
      
      const assistantMessage: Message = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: aiResponse.data?.data?.response || 'I processed your request.',
        createdAt: new Date().toISOString(),
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      toast({ title: "Error", description: "Failed to get AI response", variant: "destructive" });
    } finally {
      setSending(false);
    }
  };

  const getSessionIcon = (type: string) => {
    const found = sessionTypes.find(s => s.type === type);
    return found?.icon || MessageSquare;
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="h-[calc(100vh-120px)] flex flex-col">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-4"
        >
          <div className="flex items-center gap-4">
            <Link to="/dashboard/projects">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-bold">{project?.title || 'Project'}</h1>
              <p className="text-sm text-muted-foreground">{project?.description}</p>
            </div>
          </div>
          <Badge variant={project?.status === 'active' ? 'default' : 'secondary'}>
            {project?.status}
          </Badge>
        </motion.div>

        {/* Main Content */}
        <div className="flex-1 flex gap-4 overflow-hidden">
          {/* Sessions Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-64 shrink-0 glass-panel p-4 flex flex-col"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-sm">Sessions</h3>
              <div className="relative group">
                <Button variant="ghost" size="sm">
                  <Plus className="w-4 h-4" />
                </Button>
                <div className="absolute right-0 top-full mt-1 w-48 bg-card border border-border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                  {sessionTypes.map((st) => (
                    <button
                      key={st.type}
                      onClick={() => createSession(st.type)}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted/50 first:rounded-t-lg last:rounded-b-lg"
                    >
                      <st.icon className="w-4 h-4 text-primary" />
                      {st.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2">
              {sessions.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No sessions yet
                </p>
              ) : (
                sessions.map((session) => {
                  const Icon = getSessionIcon(session.type);
                  return (
                    <button
                      key={session.id}
                      onClick={() => loadSession(session)}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
                        activeSession?.id === session.id 
                          ? 'bg-primary/20 border border-primary/40' 
                          : 'bg-muted/30 hover:bg-muted/50'
                      }`}
                    >
                      <Icon className="w-4 h-4 text-primary shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium capitalize truncate">{session.type}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(session.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </button>
                  );
                })
              )}
            </div>
          </motion.div>

          {/* Chat Area */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 glass-panel flex flex-col overflow-hidden"
          >
            {!activeSession ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <Sparkles className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Start a New Session</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Select a session type to begin working with AI
                  </p>
                  <div className="flex gap-2 justify-center flex-wrap">
                    {sessionTypes.map((st) => (
                      <Button
                        key={st.type}
                        variant="outline"
                        size="sm"
                        onClick={() => createSession(st.type)}
                      >
                        <st.icon className="w-4 h-4 mr-2" />
                        {st.label}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <>
                {/* Session Header */}
                <div className="p-4 border-b border-border flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {(() => {
                      const Icon = getSessionIcon(activeSession.type);
                      return <Icon className="w-5 h-5 text-primary" />;
                    })()}
                    <span className="font-medium capitalize">{activeSession.type} Session</span>
                  </div>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  <AnimatePresence>
                    {messages.map((msg, i) => (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                      >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                          msg.role === 'user' ? 'bg-primary/20' : 'bg-secondary/20'
                        }`}>
                          {msg.role === 'user' ? (
                            <User className="w-4 h-4 text-primary" />
                          ) : (
                            <Bot className="w-4 h-4 text-secondary" />
                          )}
                        </div>
                        <div className={`max-w-[70%] p-4 rounded-lg ${
                          msg.role === 'user' 
                            ? 'bg-primary/10 border border-primary/20' 
                            : 'bg-muted/50 border border-border'
                        }`}>
                          <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                          <p className="text-xs text-muted-foreground mt-2">
                            {new Date(msg.createdAt).toLocaleTimeString()}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  
                  {sending && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex gap-3"
                    >
                      <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center">
                        <Bot className="w-4 h-4 text-secondary" />
                      </div>
                      <div className="bg-muted/50 border border-border p-4 rounded-lg">
                        <div className="flex gap-1">
                          <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      </div>
                    </motion.div>
                  )}
                  <div ref={chatEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 border-t border-border">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      sendMessage();
                    }}
                    className="flex gap-2"
                  >
                    <Input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder={`Ask the ${activeSession.type}...`}
                      disabled={sending}
                      className="flex-1"
                    />
                    <Button type="submit" variant="glow" disabled={!input.trim() || sending}>
                      {sending ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                    </Button>
                  </form>
                </div>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}