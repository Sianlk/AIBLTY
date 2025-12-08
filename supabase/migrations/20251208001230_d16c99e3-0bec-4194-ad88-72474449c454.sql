-- Create table for tracking daily AI usage tokens per user
CREATE TABLE public.daily_usage (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  usage_date date NOT NULL DEFAULT CURRENT_DATE,
  tokens_used integer NOT NULL DEFAULT 0,
  requests_count integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id, usage_date)
);

-- Enable RLS
ALTER TABLE public.daily_usage ENABLE ROW LEVEL SECURITY;

-- Users can view their own usage
CREATE POLICY "Users can view own usage"
ON public.daily_usage
FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own usage
CREATE POLICY "Users can insert own usage"
ON public.daily_usage
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own usage
CREATE POLICY "Users can update own usage"
ON public.daily_usage
FOR UPDATE
USING (auth.uid() = user_id);

-- Admins can view all usage
CREATE POLICY "Admins can view all usage"
ON public.daily_usage
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create updated_at trigger
CREATE TRIGGER update_daily_usage_updated_at
BEFORE UPDATE ON public.daily_usage
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- Create function to check daily token limit
CREATE OR REPLACE FUNCTION public.check_daily_limit(
  _user_id uuid,
  _tokens_requested integer DEFAULT 1
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_plan app_plan;
  daily_limit integer;
  tokens_used integer;
  remaining integer;
  can_proceed boolean;
BEGIN
  -- Get user's plan
  SELECT plan INTO user_plan
  FROM public.profiles
  WHERE user_id = _user_id;
  
  -- Set limits based on plan
  CASE user_plan
    WHEN 'free' THEN daily_limit := 5;
    WHEN 'pro' THEN daily_limit := 100;
    WHEN 'elite' THEN daily_limit := -1; -- Unlimited
    ELSE daily_limit := 5;
  END CASE;
  
  -- Get current usage
  SELECT COALESCE(du.tokens_used, 0) INTO tokens_used
  FROM public.daily_usage du
  WHERE du.user_id = _user_id AND du.usage_date = CURRENT_DATE;
  
  IF tokens_used IS NULL THEN
    tokens_used := 0;
  END IF;
  
  -- Calculate remaining
  IF daily_limit = -1 THEN
    remaining := 999999;
    can_proceed := true;
  ELSE
    remaining := GREATEST(0, daily_limit - tokens_used);
    can_proceed := remaining >= _tokens_requested;
  END IF;
  
  RETURN jsonb_build_object(
    'can_proceed', can_proceed,
    'tokens_used', tokens_used,
    'daily_limit', CASE WHEN daily_limit = -1 THEN 'unlimited' ELSE daily_limit::text END,
    'remaining', CASE WHEN daily_limit = -1 THEN 'unlimited' ELSE remaining::text END,
    'plan', user_plan
  );
END;
$$;

-- Create function to increment usage
CREATE OR REPLACE FUNCTION public.increment_usage(
  _user_id uuid,
  _tokens integer DEFAULT 1
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.daily_usage (user_id, usage_date, tokens_used, requests_count)
  VALUES (_user_id, CURRENT_DATE, _tokens, 1)
  ON CONFLICT (user_id, usage_date)
  DO UPDATE SET 
    tokens_used = daily_usage.tokens_used + _tokens,
    requests_count = daily_usage.requests_count + 1,
    updated_at = now();
END;
$$;