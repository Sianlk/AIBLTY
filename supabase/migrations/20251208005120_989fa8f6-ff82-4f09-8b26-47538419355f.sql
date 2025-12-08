-- Fix critical security issue: Prevent users from modifying their own plan
-- Drop the existing update policy and create a more restrictive one

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

-- Create new update policy that prevents plan modification
CREATE POLICY "Users can update own profile except plan" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (
  auth.uid() = user_id AND
  -- Ensure plan cannot be changed by users (must match current value)
  plan = (SELECT plan FROM public.profiles WHERE user_id = auth.uid())
);

-- Fix usage tracking: Make it service-role only for inserts/updates
DROP POLICY IF EXISTS "Users can insert own usage" ON public.daily_usage;
DROP POLICY IF EXISTS "Users can update own usage" ON public.daily_usage;

-- Only allow service role to manage usage (prevents manipulation)
CREATE POLICY "Service role can insert usage" 
ON public.daily_usage 
FOR INSERT 
WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Service role can update usage" 
ON public.daily_usage 
FOR UPDATE 
USING (auth.role() = 'service_role');