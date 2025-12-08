-- Add explicit RLS policy to deny anonymous access to profiles table
-- This ensures unauthenticated users cannot query email addresses

CREATE POLICY "Deny anonymous access to profiles" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() IS NOT NULL);