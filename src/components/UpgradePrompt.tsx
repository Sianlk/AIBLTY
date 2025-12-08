import { motion } from 'framer-motion';
import { Crown, Zap, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface UpgradePromptProps {
  title?: string;
  description?: string;
}

export function UpgradePrompt({ 
  title = "You've reached your daily limit",
  description = "Upgrade to Pro or Elite for more AI tokens and unlock powerful features"
}: UpgradePromptProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-panel p-6 text-center max-w-md mx-auto border-primary/30"
    >
      <div className="w-16 h-16 rounded-full gradient-gold flex items-center justify-center mx-auto mb-4">
        <Crown className="w-8 h-8 text-background" />
      </div>
      
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-muted-foreground mb-6">{description}</p>
      
      <div className="space-y-3 mb-6">
        <div className="flex items-center gap-3 text-left p-3 bg-muted/30 rounded-lg">
          <Zap className="w-5 h-5 text-primary shrink-0" />
          <div>
            <p className="font-medium text-sm">Pro Plan - £49/month</p>
            <p className="text-xs text-muted-foreground">100 AI tokens per day</p>
          </div>
        </div>
        <div className="flex items-center gap-3 text-left p-3 bg-primary/10 rounded-lg border border-primary/30">
          <Sparkles className="w-5 h-5 text-primary shrink-0" />
          <div>
            <p className="font-medium text-sm">Elite Plan - £199/month</p>
            <p className="text-xs text-muted-foreground">Unlimited AI tokens</p>
          </div>
        </div>
      </div>
      
      <Link to="/dashboard/billing">
        <Button variant="glow" className="w-full">
          Upgrade Now
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </Link>
    </motion.div>
  );
}
