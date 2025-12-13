-- Create jobs table for tracking all capability executions
CREATE TABLE IF NOT EXISTS public.jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
  type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'queued',
  progress INTEGER DEFAULT 0,
  input JSONB,
  result JSONB,
  error TEXT,
  started_at TIMESTAMPTZ,
  finished_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create artifacts table for storing job outputs
CREATE TABLE IF NOT EXISTS public.artifacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
  job_id UUID REFERENCES public.jobs(id) ON DELETE SET NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  metadata JSONB,
  url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create events_log table for instrumentation
CREATE TABLE IF NOT EXISTS public.events_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  level TEXT NOT NULL DEFAULT 'info',
  source TEXT NOT NULL,
  message TEXT NOT NULL,
  meta JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create conversations table for chat persistence
CREATE TABLE IF NOT EXISTS public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  title TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create chat_messages table
CREATE TABLE IF NOT EXISTS public.chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on all new tables
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.artifacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Jobs RLS policies
CREATE POLICY "Users can view own jobs" ON public.jobs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create jobs" ON public.jobs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own jobs" ON public.jobs FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Service role can manage jobs" ON public.jobs FOR ALL USING (auth.role() = 'service_role');

-- Artifacts RLS policies
CREATE POLICY "Users can view own artifacts" ON public.artifacts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create artifacts" ON public.artifacts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Service role can manage artifacts" ON public.artifacts FOR ALL USING (auth.role() = 'service_role');

-- Events log RLS policies
CREATE POLICY "Users can view own events" ON public.events_log FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create events" ON public.events_log FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);
CREATE POLICY "Admins can view all events" ON public.events_log FOR SELECT USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Service role can manage events" ON public.events_log FOR ALL USING (auth.role() = 'service_role');

-- Conversations RLS policies
CREATE POLICY "Users can view own conversations" ON public.conversations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create conversations" ON public.conversations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own conversations" ON public.conversations FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own conversations" ON public.conversations FOR DELETE USING (auth.uid() = user_id);

-- Chat messages RLS policies
CREATE POLICY "Users can view messages in own conversations" ON public.chat_messages FOR SELECT 
  USING (EXISTS (SELECT 1 FROM public.conversations WHERE id = chat_messages.conversation_id AND user_id = auth.uid()));
CREATE POLICY "Users can create messages in own conversations" ON public.chat_messages FOR INSERT 
  WITH CHECK (EXISTS (SELECT 1 FROM public.conversations WHERE id = chat_messages.conversation_id AND user_id = auth.uid()));

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_jobs_user_id ON public.jobs(user_id);
CREATE INDEX IF NOT EXISTS idx_jobs_project_id ON public.jobs(project_id);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON public.jobs(status);
CREATE INDEX IF NOT EXISTS idx_artifacts_user_id ON public.artifacts(user_id);
CREATE INDEX IF NOT EXISTS idx_artifacts_job_id ON public.artifacts(job_id);
CREATE INDEX IF NOT EXISTS idx_events_log_user_id ON public.events_log(user_id);
CREATE INDEX IF NOT EXISTS idx_events_log_created_at ON public.events_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_conversations_user_id ON public.conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_conversation_id ON public.chat_messages(conversation_id);

-- Add triggers for updated_at
CREATE TRIGGER update_jobs_updated_at BEFORE UPDATE ON public.jobs 
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER update_conversations_updated_at BEFORE UPDATE ON public.conversations 
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();