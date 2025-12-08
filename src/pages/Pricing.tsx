import { useState } from 'react';
import { Header } from '@/components/aiblty/Header';
import { Footer } from '@/components/aiblty/Footer';
import { GridBackground } from '@/components/atlas/GridBackground';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Check, Zap, Crown, Rocket, Star, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/apiClient';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

type PlanType = 'free' | 'starter' | 'pro' | 'elite';

const plans = [
  {
    name: 'Free',
    price: '£0',
    period: '/month',
    description: 'Get started with AI-powered tools',
    icon: Zap,
    features: [
      '5 AI queries/day',
      '1 Project',
      'Basic Problem Solver',
      'Community support',
    ],
    cta: 'Get Started',
    popular: false,
    plan: 'free' as PlanType,
  },
  {
    name: 'Starter',
    price: '£19',
    period: '/month',
    description: 'Perfect for light users',
    icon: Star,
    features: [
      '25 AI queries/day',
      '3 Projects',
      'All Core AI Tools',
      'Business Builder Basic',
      'Email support',
    ],
    cta: 'Start Building',
    popular: false,
    plan: 'starter' as PlanType,
  },
  {
    name: 'Pro',
    price: '£49',
    period: '/month',
    description: 'For professionals and growing teams',
    icon: Rocket,
    features: [
      '100 AI queries/day',
      '10 Projects',
      'All AI Tools',
      'Business Builder',
      'Automation Engine',
      'Research Engine',
      'Integration Hub',
      'Priority support',
    ],
    cta: 'Upgrade to Pro',
    popular: true,
    plan: 'pro' as PlanType,
  },
  {
    name: 'Elite',
    price: '£199',
    period: '/month',
    description: 'Maximum power for enterprises',
    icon: Crown,
    features: [
      'Unlimited AI queries',
      'Unlimited Projects',
      'Everything in Pro',
      'AI Workforce',
      'Quantum Engine',
      'White-label exports',
      'Dedicated support',
      'API access',
      'SLA guarantee',
    ],
    cta: 'Go Elite',
    popular: false,
    plan: 'elite' as PlanType,
  },
];

export default function PricingPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const handleSelectPlan = async (plan: PlanType) => {
    if (!user) {
      navigate('/auth');
      return;
    }

    if (plan === 'free') {
      toast({ title: 'You\'re on Free', description: 'Upgrade to unlock more features!' });
      return;
    }

    if (user.plan === plan) {
      toast({ title: 'Current Plan', description: `You're already on the ${plan} plan.` });
      return;
    }

    setLoadingPlan(plan);
    try {
      const response = await api.createCheckout(plan);
      if (response.data?.url) {
        window.open(response.data.url, '_blank');
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create checkout session',
        variant: 'destructive',
      });
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className="relative min-h-screen bg-background">
      <GridBackground />
      <Header />

      <main className="pt-32 pb-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <span className="text-xs font-mono text-primary tracking-[0.3em] uppercase mb-4 block">
              Simple Pricing
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="gradient-text">Choose Your Power Level</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              All prices in pounds sterling. Start free, scale infinitely.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {plans.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`relative glass-panel p-6 ${
                  plan.popular ? 'border-primary ring-2 ring-primary/20' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  <plan.icon className={`w-10 h-10 mx-auto mb-3 ${
                    plan.popular ? 'text-primary' : 'text-muted-foreground'
                  }`} />
                  <h3 className="text-xl font-bold">{plan.name}</h3>
                  <div className="mt-2">
                    <span className="text-3xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground text-sm">{plan.period}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">{plan.description}</p>
                </div>

                <ul className="space-y-2 mb-6">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <span className="text-xs text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  variant={plan.popular ? 'glow' : 'outline'}
                  size="sm"
                  className="w-full"
                  onClick={() => handleSelectPlan(plan.plan)}
                  disabled={loadingPlan === plan.plan || user?.plan === plan.plan}
                >
                  {loadingPlan === plan.plan ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : null}
                  {user?.plan === plan.plan ? 'Current Plan' : plan.cta}
                </Button>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center mt-16"
          >
            <p className="text-muted-foreground">
              All plans include SSL security, 99.9% uptime, and automatic backups.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Need custom solutions? <a href="mailto:enterprise@aiblty.com" className="text-primary hover:underline">Contact us</a>
            </p>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}