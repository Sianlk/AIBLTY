-- Fix security issues found in the scan

-- Add policy to require authentication for profiles SELECT
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() IS NOT NULL AND auth.uid() = user_id);

-- Profiles are inserted via trigger, not by users directly
-- But add explicit INSERT policy for clarity
CREATE POLICY "System can create profiles"
ON public.profiles
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Allow users to delete their own profiles (GDPR compliance)
CREATE POLICY "Users can delete own profile"
ON public.profiles
FOR DELETE
USING (auth.uid() = user_id);

-- Fix security_ledger INSERT policy - only allow service role
DROP POLICY IF EXISTS "System can insert ledger entries" ON public.security_ledger;
CREATE POLICY "Service can insert ledger entries"
ON public.security_ledger
FOR INSERT
WITH CHECK (auth.role() = 'service_role');

-- Add UPDATE policy for ai_sessions
CREATE POLICY "Users can update own sessions"
ON public.ai_sessions
FOR UPDATE
USING (auth.uid() = user_id);

-- Add UPDATE and DELETE policies for ai_messages
CREATE POLICY "Users can update messages in own sessions"
ON public.ai_messages
FOR UPDATE
USING (EXISTS (
  SELECT 1 FROM ai_sessions
  WHERE ai_sessions.id = ai_messages.session_id
  AND ai_sessions.user_id = auth.uid()
));

CREATE POLICY "Users can delete messages in own sessions"
ON public.ai_messages
FOR DELETE
USING (EXISTS (
  SELECT 1 FROM ai_sessions
  WHERE ai_sessions.id = ai_messages.session_id
  AND ai_sessions.user_id = auth.uid()
));

-- Add DELETE policy for ai_tasks
CREATE POLICY "Users can delete own tasks"
ON public.ai_tasks
FOR DELETE
USING (auth.uid() = user_id);