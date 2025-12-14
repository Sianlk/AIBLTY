import { supabase } from "@/integrations/supabase/client";

// Type definitions based on new tables
export interface Project {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface Job {
  id: string;
  user_id: string;
  project_id?: string | null;
  type: string;
  status: 'queued' | 'running' | 'completed' | 'failed';
  progress: number;
  input?: unknown;
  result?: unknown;
  error?: string | null;
  started_at?: string | null;
  finished_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Artifact {
  id: string;
  user_id: string;
  project_id?: string | null;
  job_id?: string | null;
  type: string;
  title: string;
  content?: string | null;
  metadata?: unknown;
  url?: string | null;
  created_at: string;
}

export interface Conversation {
  id: string;
  user_id: string;
  title?: string;
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  id: string;
  conversation_id: string;
  role: string;
  content: string;
  created_at: string;
}

export interface EventLog {
  id: string;
  user_id?: string | null;
  level: string;
  source: string;
  message: string;
  meta?: Record<string, unknown>;
  created_at: string;
}

// ========== EVENT LOGGING ==========
export async function logEvent(
  source: string,
  message: string,
  level: 'info' | 'warn' | 'error' = 'info',
  meta?: Record<string, unknown>
) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from('events_log').insert([{
      user_id: user?.id || null,
      source,
      message,
      level,
      meta: meta ? JSON.parse(JSON.stringify(meta)) : null,
    }]);
    console.log(`[${level.toUpperCase()}] ${source}: ${message}`, meta || '');
  } catch (err) {
    console.error('Failed to log event:', err);
  }
}

// ========== PROJECTS ==========
export async function getProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    logEvent('projects', `Failed to fetch projects: ${error.message}`, 'error');
    throw error;
  }
  return data || [];
}

export async function getProject(id: string): Promise<Project | null> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  
  if (error) {
    logEvent('projects', `Failed to fetch project ${id}: ${error.message}`, 'error');
    throw error;
  }
  return data;
}

export async function createProject(title: string, description?: string): Promise<Project> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('projects')
    .insert({ user_id: user.id, title, description })
    .select()
    .single();
  
  if (error) {
    logEvent('projects', `Failed to create project: ${error.message}`, 'error');
    throw error;
  }
  
  logEvent('projects', `Created project: ${title}`, 'info', { projectId: data.id });
  return data;
}

export async function updateProject(id: string, updates: Partial<Pick<Project, 'title' | 'description' | 'status'>>): Promise<Project> {
  const { data, error } = await supabase
    .from('projects')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    logEvent('projects', `Failed to update project ${id}: ${error.message}`, 'error');
    throw error;
  }
  
  logEvent('projects', `Updated project: ${id}`, 'info');
  return data;
}

export async function deleteProject(id: string): Promise<void> {
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id);
  
  if (error) {
    logEvent('projects', `Failed to delete project ${id}: ${error.message}`, 'error');
    throw error;
  }
  
  logEvent('projects', `Deleted project: ${id}`, 'info');
}

// ========== JOBS ==========
export async function createJob(
  type: string,
  input: Record<string, unknown>,
  projectId?: string
): Promise<Job> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('jobs')
    .insert([{
      user_id: user.id,
      project_id: projectId || null,
      type,
      input: JSON.parse(JSON.stringify(input)),
      status: 'queued',
      progress: 0,
    }])
    .select()
    .single();
  
  if (error) {
    logEvent('jobs', `Failed to create job: ${error.message}`, 'error');
    throw error;
  }
  
  logEvent('jobs', `Created job: ${type}`, 'info', { jobId: data.id });
  return data as Job;
}

export async function getJob(id: string): Promise<Job | null> {
  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  
  if (error) throw error;
  return data as Job | null;
}

export async function getJobs(projectId?: string): Promise<Job[]> {
  let query = supabase
    .from('jobs')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (projectId) {
    query = query.eq('project_id', projectId);
  }
  
  const { data, error } = await query;
  if (error) throw error;
  return (data || []) as Job[];
}

export async function updateJob(id: string, updates: Partial<Omit<Job, 'id' | 'user_id' | 'created_at'>>): Promise<Job> {
  const { data, error } = await supabase
    .from('jobs')
    .update(updates as Record<string, unknown>)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data as Job;
}

// ========== ARTIFACTS ==========
export async function createArtifact(
  type: string,
  title: string,
  content?: string,
  metadata?: Record<string, unknown>,
  jobId?: string,
  projectId?: string
): Promise<Artifact> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('artifacts')
    .insert([{
      user_id: user.id,
      project_id: projectId || null,
      job_id: jobId || null,
      type,
      title,
      content: content || null,
      metadata: metadata ? JSON.parse(JSON.stringify(metadata)) : null,
    }])
    .select()
    .single();
  
  if (error) {
    logEvent('artifacts', `Failed to create artifact: ${error.message}`, 'error');
    throw error;
  }
  
  logEvent('artifacts', `Created artifact: ${title}`, 'info', { artifactId: data.id });
  return data as Artifact;
}

export async function getArtifacts(jobId?: string, projectId?: string): Promise<Artifact[]> {
  let query = supabase
    .from('artifacts')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (jobId) query = query.eq('job_id', jobId);
  if (projectId) query = query.eq('project_id', projectId);
  
  const { data, error } = await query;
  if (error) throw error;
  return (data || []) as Artifact[];
}

export async function getArtifact(id: string): Promise<Artifact | null> {
  const { data, error } = await supabase
    .from('artifacts')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  
  if (error) throw error;
  return data as Artifact | null;
}

// ========== CONVERSATIONS ==========
export async function getConversations(): Promise<Conversation[]> {
  const { data, error } = await supabase
    .from('conversations')
    .select('*')
    .order('updated_at', { ascending: false });
  
  if (error) throw error;
  return (data || []) as Conversation[];
}

export async function getOrCreateConversation(title?: string): Promise<Conversation> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  // Get most recent conversation or create new
  const { data: existing } = await supabase
    .from('conversations')
    .select('*')
    .order('updated_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (existing) return existing as Conversation;

  const { data, error } = await supabase
    .from('conversations')
    .insert({ user_id: user.id, title: title || 'New Chat' })
    .select()
    .single();
  
  if (error) throw error;
  return data as Conversation;
}

export async function createConversation(title?: string): Promise<Conversation> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('conversations')
    .insert({ user_id: user.id, title: title || 'New Chat' })
    .select()
    .single();
  
  if (error) throw error;
  return data as Conversation;
}

export async function updateConversation(id: string, updates: Partial<Pick<Conversation, 'title'>>): Promise<Conversation> {
  const { data, error } = await supabase
    .from('conversations')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data as Conversation;
}

export async function deleteConversation(id: string): Promise<void> {
  // Delete messages first (cascade should handle this but be explicit)
  await supabase
    .from('chat_messages')
    .delete()
    .eq('conversation_id', id);
  
  const { error } = await supabase
    .from('conversations')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
  logEvent('conversations', `Deleted conversation: ${id}`, 'info');
}

// ========== CHAT MESSAGES ==========
export async function getChatMessages(conversationId: string): Promise<ChatMessage[]> {
  const { data, error } = await supabase
    .from('chat_messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true });
  
  if (error) throw error;
  return (data || []) as ChatMessage[];
}

export async function addChatMessage(
  conversationId: string,
  role: string,
  content: string
): Promise<ChatMessage> {
  const { data, error } = await supabase
    .from('chat_messages')
    .insert({ conversation_id: conversationId, role, content })
    .select()
    .single();
  
  if (error) throw error;
  
  // Update conversation timestamp
  await supabase
    .from('conversations')
    .update({ updated_at: new Date().toISOString() })
    .eq('id', conversationId);
  
  return data as ChatMessage;
}

export async function deleteChatMessages(conversationId: string): Promise<void> {
  const { error } = await supabase
    .from('chat_messages')
    .delete()
    .eq('conversation_id', conversationId);
  
  if (error) throw error;
}

// ========== EVENT LOG (for debug page) ==========
export async function getEventLogs(limit = 100): Promise<EventLog[]> {
  const { data, error } = await supabase
    .from('events_log')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);
  
  if (error) throw error;
  return (data || []) as EventLog[];
}
