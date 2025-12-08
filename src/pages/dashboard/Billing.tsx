import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { createCheckout, openBillingPortal, getSubscriptionStatus } from '@/lib/billingService';
import { useToast } from '@/hooks/use-toast';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  CreditCard, Crown, Zap, Rocket, Check, ArrowRight,
  Shield, Clock, RefreshCw, Download, Loader2, AlertTriangle,
  Sparkles, TrendingUp, Lock
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const plans = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    icon: Zap,
    tokens: '5 tokens/day',
    features: ['5 AI queries/day', '1 Project', 'Basic Problem Solver', 'Community Support'],
    limitations: ['Limited AI capabilities', 'No AI Workforce', 'No Quantum Engine', 'No Priority Support'],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 49,
    icon: Rocket,
    popular: true,
    tokens: '100 tokens/day',
    features: ['100 AI queries/day', '10 Projects', 'All AI Tools', 'Business Builder', 'Automation Engine', 'Research Engine', 'Priority Support'],
    limitations: ['No AI Workforce', 'No Quantum Engine'],
  },
  {
    id: 'elite',
    name: 'Elite',
    price: 199,
    icon: Crown,
    tokens: 'Unlimited',
    features: ['Unlimited AI tokens', 'Unlimited Projects', 'AI Workforce', 'Quantum Engine', 'Evolution Layer', 'Global Network', 'White-label exports', 'Dedicated support', 'API access', 'SLA guarantee'],
    limitations: [],
  },
];
export default function BillingPage() {
  const { user, refreshUser } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [subscription, setSubscription] = useState<{ plan: string; status: string } | null>(null);
  const [payments, setPayments] = useState<any[]>([]);
  const [loadingPayments, setLoadingPayments] = useState(true);

  useEffect(() => {
    fetchBillingData();
    
    // Handle Stripe redirect
    if (searchParams.get('success') === 'true') {
      toast({ title: 'Payment Successful!', description: 'Your subscription is now active.' });
      refreshUser?.();
    } else if (searchParams.get('canceled') === 'true') {
      toast({ title: 'Payment Canceled', description: 'Your subscription was not processed.', variant: 'destructive' });
    }
  }, [searchParams]);

  const fetchBillingData = async () => {
    try {
      const sub = await getSubscriptionStatus();
      setSubscription(sub);
    } catch (error) {
      console.error('Failed to fetch billing data', error);
    } finally {
      setLoadingPayments(false);
    }
  };

  const handleUpgrade = async (plan: string) => {
    if (plan === 'free') return;
    setLoading(true);
    try {
      const response = await createCheckout(plan as 'pro' | 'elite');
      if (response.url) {
        window.location.href = response.url;
      } else if (response.error) {
        throw new Error(response.error);
      }
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleManageSubscription = async () => {
    setLoading(true);
    try {
      const response = await openBillingPortal();
      if (response.url) {
        window.location.href = response.url;
      } else if (response.error) {
        toast({ title: 'Info', description: response.error });
      }
    } catch (error) {
      toast({ title: 'Info', description: 'Please subscribe to a plan to manage billing' });
    } finally {
      setLoading(false);
    }
  };

  const currentPlan = user?.plan || 'free';

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-primary" />
            Billing & Subscription
          </h1>
          <p className="text-muted-foreground">Manage your plan and payment methods</p>
        </motion.div>

        {/* Current Plan Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="premium-card p-6"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Current Plan</p>
              <h2 className="text-3xl font-bold gradient-text capitalize">{currentPlan}</h2>
              <p className="text-sm text-muted-foreground mt-2">
                {subscription?.status === 'active' ? (
                  <span className="flex items-center gap-1 text-glow-success">
                    <Check className="w-4 h-4" /> Active subscription
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-glow-warning">
                    <AlertTriangle className="w-4 h-4" /> No active subscription
                  </span>
                )}
              </p>
            </div>
            <div className="flex gap-3">
              {currentPlan !== 'elite' && (
                <Button variant="glow" onClick={() => handleUpgrade('elite')}>
                  <Crown className="w-4 h-4 mr-2" />
                  Upgrade to Elite
                </Button>
              )}
              <Button variant="outline" onClick={handleManageSubscription}>
                Manage Subscription
              </Button>
            </div>
          </div>
        </motion.div>

        <Tabs defaultValue="plans" className="space-y-6">
          <TabsList>
            <TabsTrigger value="plans">Plans</TabsTrigger>
            <TabsTrigger value="payment-methods">Payment Methods</TabsTrigger>
            <TabsTrigger value="history">Billing History</TabsTrigger>
          </TabsList>

          <TabsContent value="plans">
            {/* Upgrade Temptation for Free Users */}
            {currentPlan === 'free' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-6 p-6 rounded-xl bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20 border border-primary/30"
              >
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center">
                      <Sparkles className="w-8 h-8 text-primary" />
                    </div>
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="text-xl font-bold mb-2">Unlock Your Full Potential</h3>
                    <p className="text-muted-foreground mb-4">
                      You're missing out on <strong className="text-primary">AI Workforce</strong>, 
                      <strong className="text-secondary"> Quantum Engine</strong>, and 
                      <strong className="text-primary"> unlimited projects</strong>. 
                      Upgrade now and transform your business!
                    </p>
                    <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                      <div className="flex items-center gap-2 text-sm">
                        <TrendingUp className="w-4 h-4 text-glow-success" />
                        <span>10x faster results</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Lock className="w-4 h-4 text-primary" />
                        <span>Enterprise security</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-secondary" />
                        <span>24/7 AI agents</span>
                      </div>
                    </div>
                  </div>
                  <Button variant="glow" size="lg" onClick={() => handleUpgrade('pro')}>
                    Upgrade Now <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </motion.div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {plans.map((plan, i) => (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.1 }}
                  className={`glass-panel p-6 relative ${plan.popular ? 'border-primary ring-2 ring-primary/20' : ''} ${currentPlan === plan.id ? 'border-glow-success' : ''}`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
                        Most Popular
                      </span>
                    </div>
                  )}
                  {currentPlan === plan.id && (
                    <div className="absolute -top-3 right-4">
                      <span className="bg-glow-success text-background text-xs font-semibold px-3 py-1 rounded-full">
                        Current
                      </span>
                    </div>
                  )}

                  <div className="text-center mb-6">
                    <plan.icon className={`w-10 h-10 mx-auto mb-3 ${plan.popular ? 'text-primary' : 'text-muted-foreground'}`} />
                    <h3 className="text-xl font-bold">{plan.name}</h3>
                    <div className="mt-2">
                      <span className="text-3xl font-bold">£{plan.price}</span>
                      <span className="text-muted-foreground">/month</span>
                    </div>
                  </div>

                  <ul className="space-y-2 mb-6">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm">
                        <Check className="w-4 h-4 text-glow-success shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                    {plan.limitations.map((l) => (
                      <li key={l} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="w-4 h-4 shrink-0 mt-0.5 text-center">✕</span>
                        <span>{l}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    variant={plan.popular ? 'glow' : 'outline'}
                    className="w-full"
                    disabled={loading || currentPlan === plan.id || plan.id === 'free'}
                    onClick={() => handleUpgrade(plan.id)}
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                    {currentPlan === plan.id ? 'Current Plan' : plan.id === 'free' ? 'Free Forever' : `Upgrade to ${plan.name}`}
                  </Button>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="payment-methods">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-panel p-6"
            >
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                Payment Methods
              </h3>
              <div className="space-y-4">
                <div className="p-4 bg-muted/30 rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-8 bg-gradient-to-r from-blue-600 to-blue-800 rounded flex items-center justify-center">
                      <span className="text-white text-xs font-bold">VISA</span>
                    </div>
                    <div>
                      <p className="font-medium">•••• •••• •••• 4242</p>
                      <p className="text-xs text-muted-foreground">Expires 12/25</p>
                    </div>
                  </div>
                  <span className="text-xs bg-glow-success/20 text-glow-success px-2 py-1 rounded">Default</span>
                </div>

                <Button variant="outline" className="w-full">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Add Payment Method
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  <Lock className="w-3 h-3 inline mr-1" />
                  Payments secured with 256-bit SSL encryption via Stripe
                </p>
              </div>
            </motion.div>
          </TabsContent>

          <TabsContent value="history">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-panel p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  Billing History
                </h3>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>

              {loadingPayments ? (
                <div className="text-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto text-primary" />
                </div>
              ) : payments.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <CreditCard className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No payment history yet</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {payments.map((payment, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div>
                        <p className="font-medium">{payment.description || 'Subscription'}</p>
                        <p className="text-xs text-muted-foreground">{payment.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">£{payment.amount}</p>
                        <span className={`text-xs ${payment.status === 'succeeded' ? 'text-glow-success' : 'text-glow-warning'}`}>
                          {payment.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
