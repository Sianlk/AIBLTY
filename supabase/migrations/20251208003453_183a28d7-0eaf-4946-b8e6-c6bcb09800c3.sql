-- Add 'starter' to the app_plan enum
ALTER TYPE public.app_plan ADD VALUE IF NOT EXISTS 'starter';

-- Update the check_daily_limit function to include starter plan
CREATE OR REPLACE FUNCTION public.check_daily_limit(_user_id uuid, _tokens_requested integer DEFAULT 1)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
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
    WHEN 'starter' THEN daily_limit := 25;
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
$function$;