-- =====================================================
-- FIX 1: Harden profiles table RLS
-- Users should only see their own profile, admins can see all
-- =====================================================

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Deny anonymous access to profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;

-- Create stricter SELECT policies
-- Policy 1: Users can only view their OWN profile
CREATE POLICY "Users can view own profile only"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Policy 2: Admins can view ALL profiles (using the has_role function)
CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- =====================================================
-- FIX 2: Harden security_ledger table - IMMUTABLE audit logs
-- No one should be able to UPDATE or DELETE audit records
-- =====================================================

-- Add explicit DENY policies for UPDATE and DELETE
-- These will prevent any modifications to audit logs
CREATE POLICY "Deny all updates to security ledger"
ON public.security_ledger
FOR UPDATE
TO authenticated
USING (false)
WITH CHECK (false);

CREATE POLICY "Deny all deletes from security ledger"
ON public.security_ledger
FOR DELETE
TO authenticated
USING (false);

-- Also deny for anon role
CREATE POLICY "Deny anon updates to security ledger"
ON public.security_ledger
FOR UPDATE
TO anon
USING (false)
WITH CHECK (false);

CREATE POLICY "Deny anon deletes from security ledger"
ON public.security_ledger
FOR DELETE
TO anon
USING (false);

-- =====================================================
-- FIX 3: Verify daily_usage policies are correct
-- Users should only see their own usage data
-- =====================================================

-- Drop any potentially problematic policies
DROP POLICY IF EXISTS "Users can view own usage" ON public.daily_usage;

-- Create strict user-only policy
CREATE POLICY "Users can view own usage only"
ON public.daily_usage
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Ensure admin policy exists for viewing all usage
DROP POLICY IF EXISTS "Admins can view all usage" ON public.daily_usage;
CREATE POLICY "Admins can view all usage"
ON public.daily_usage
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));