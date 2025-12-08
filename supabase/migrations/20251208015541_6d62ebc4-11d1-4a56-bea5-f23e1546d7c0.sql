-- Fix profiles table - drop ALL existing SELECT policies and recreate correctly
-- First, get a clean slate for profiles SELECT policies

-- Drop the duplicate policies that might have been created
DROP POLICY IF EXISTS "Users can view own profile only" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Deny anonymous access to profiles" ON public.profiles;

-- Now create the single correct policy for users viewing their own profile
CREATE POLICY "Users can view own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Note: "Admins can view all profiles" policy already exists and is correct