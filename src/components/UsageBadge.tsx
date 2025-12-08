import { Badge } from '@/components/ui/badge';
import { Zap, Crown, Loader2 } from 'lucide-react';
import { useUsageTracking } from '@/hooks/useUsageTracking';
import { Link } from 'react-router-dom';

export function UsageBadge() {
  const { usage, loading, isLimitReached } = useUsageTracking();

  if (loading) {
    return (
      <Badge variant="outline" className="text-xs">
        <Loader2 className="w-3 h-3 mr-1 animate-spin" />
        Loading...
      </Badge>
    );
  }

  if (!usage) return null;

  const isUnlimited = usage.dailyLimit === 'unlimited';

  if (isLimitReached) {
    return (
      <Link to="/dashboard/billing">
        <Badge variant="destructive" className="text-xs cursor-pointer hover:opacity-80">
          <Crown className="w-3 h-3 mr-1" />
          Upgrade for more tokens
        </Badge>
      </Link>
    );
  }

  return (
    <Badge 
      variant="outline" 
      className={`text-xs ${isUnlimited ? 'border-primary/50 text-primary' : 'border-border'}`}
    >
      <Zap className="w-3 h-3 mr-1" />
      {isUnlimited ? (
        <span>Unlimited</span>
      ) : (
        <span>{usage.remaining}/{usage.dailyLimit} tokens</span>
      )}
    </Badge>
  );
}
