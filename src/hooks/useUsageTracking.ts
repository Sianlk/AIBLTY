import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface UsageData {
  canProceed: boolean;
  tokensUsed: number;
  dailyLimit: string;
  remaining: string;
  plan: string;
}

interface UsageResponse {
  can_proceed: boolean;
  tokens_used: number;
  daily_limit: string;
  remaining: string;
  plan: string;
}

export function useUsageTracking() {
  const { user, session } = useAuth();
  const [usage, setUsage] = useState<UsageData | null>(null);
  const [loading, setLoading] = useState(true);

  const checkUsage = useCallback(async () => {
    if (!user || !session) {
      setUsage(null);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.rpc('check_daily_limit', {
        _user_id: session.user.id,
        _tokens_requested: 1
      });

      if (error) {
        console.error('Failed to check usage:', error);
        return;
      }

      // Type guard for the response
      const response = data as unknown as UsageResponse;
      
      if (response) {
        setUsage({
          canProceed: response.can_proceed,
          tokensUsed: response.tokens_used,
          dailyLimit: response.daily_limit,
          remaining: response.remaining,
          plan: response.plan
        });
      }
    } catch (err) {
      console.error('Usage check error:', err);
    } finally {
      setLoading(false);
    }
  }, [user, session]);

  const incrementUsage = useCallback(async (tokens: number = 1) => {
    if (!session) return;

    try {
      await supabase.rpc('increment_usage', {
        _user_id: session.user.id,
        _tokens: tokens
      });
      // Refresh usage after increment
      await checkUsage();
    } catch (err) {
      console.error('Failed to increment usage:', err);
    }
  }, [session, checkUsage]);

  useEffect(() => {
    checkUsage();
  }, [checkUsage]);

  return {
    usage,
    loading,
    checkUsage,
    incrementUsage,
    isLimitReached: usage ? !usage.canProceed : false
  };
}
