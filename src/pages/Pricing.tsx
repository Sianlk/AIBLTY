import { useState } from 'react';
import { Header } from '@/components/aiblty/Header';
import { Footer } from '@/components/aiblty/Footer';
import { GridBackground } from '@/components/atlas/GridBackground';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Check, Zap, Crown, Rocket, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/apiClient';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Get started with AI-powered tools',
    icon: Zap,
    features: [
      '3 projects',
      '100 AI queries/month',
      'Basic problem solver',
      'Community support',
      'Standard response time',
    ],
    cta: 'Get Started',
    popular: false,
    plan: 'free' as const,
  },
  {
    name: 'Pro',
    price: '$29',
    period: '/month',
    description: 'For professionals and growing teams',
    icon: Rocket,
    features: [
      'Unlimited projects',
      '2,000 AI queries/month',
      'Advanced problem solver',
      'Business builder access',
      'Automation engine',
      'Priority support',
      'API access',
    ],
    cta: 'Upgrade to Pro',
    popular: true,
    plan: 'pro' as const,
  },
  {
    name: 'Elite',
    price: '$99',
    period: '/month',
    description: 'Maximum power for enterprises',
    icon: Crown,
    features: [
      'Everything in Pro',
      'Unlimited AI queries',
      'Custom AI models',
      'White-label options',
      'Dedicated support',
      'Custom integrations',
      'SLA guarantee',
      'Advanced analytics',
    ],
    cta: 'Go Elite',
    popular: false,
    plan: 'elite' as const,
  },
];

export default function PricingPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const handleSelectPlan = async (plan: 'free' | 'pro' | 'elite') => {
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
        window.location.href = response.data.url;
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
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="gradient-text">Simple Pricing</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Choose the plan that fits your needs. Upgrade anytime as you grow.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`relative glass-panel p-8 ${
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
                  <plan.icon className={`w-12 h-12 mx-auto mb-4 ${
                    plan.popular ? 'text-primary' : 'text-muted-foreground'
                  }`} />
                  <h3 className="text-2xl font-bold">{plan.name}</h3>
                  <div className="mt-2">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">{plan.description}</p>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  variant={plan.popular ? 'glow' : 'outline'}
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
