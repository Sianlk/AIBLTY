// Stripe Configuration for AIBLTY
// The Ultimate AI Ability Platform

export const STRIPE_CONFIG = {
  publishableKey: 'pk_live_51SRK7aCL9suzCBniaeqvbekmoReuxLJOUPlAnJXx0YVUMsAXIn43oLje04uCu3vqNvql5R945U25DpLNLJjW9wGL00Ijcakq3v',
  
  // Pricing in GBP
  plans: {
    free: {
      id: 'free',
      name: 'Free',
      price: 0,
      currency: 'GBP',
      tokensPerDay: 5,
      projectLimit: 1,
      features: [
        '5 AI queries/day',
        '1 Project',
        'Basic Problem Solver',
        'Community support',
      ],
    },
    starter: {
      id: 'starter',
      name: 'Starter',
      price: 19,
      currency: 'GBP',
      priceId: 'price_1SbsPJCL9suzCBniOemTarlT',
      productId: 'prod_TZ0Q4sO29Iq7yD',
      tokensPerDay: 25,
      projectLimit: 3,
      features: [
        '25 AI queries/day',
        '3 Projects',
        'All Core AI Tools',
        'Business Builder Basic',
        'Email support',
      ],
    },
    pro: {
      id: 'pro',
      name: 'Pro',
      price: 49,
      currency: 'GBP',
      priceId: 'price_1Sbs9aCL9suzCBnijVCsflFI',
      productId: 'prod_TZ09fVQJ6mBffb',
      tokensPerDay: 100,
      projectLimit: 10,
      features: [
        '100 AI queries/day',
        '10 Projects',
        'All AI Tools',
        'Business Builder',
        'Automation Engine',
        'Priority support',
      ],
    },
    elite: {
      id: 'elite',
      name: 'Elite',
      price: 199,
      currency: 'GBP',
      priceId: 'price_1Sbs9pCL9suzCBnimI8LQvOS',
      productId: 'prod_TZ0AN7JOzKDX3T',
      tokensPerDay: -1, // Unlimited
      projectLimit: -1, // Unlimited
      features: [
        'Unlimited AI queries',
        'Unlimited Projects',
        'AI Workforce',
        'Quantum Engine',
        'White-label exports',
        'Dedicated support',
        'API access',
      ],
    },
  },
};

export type PlanId = keyof typeof STRIPE_CONFIG.plans;

export const getPlanLimits = (planId: PlanId) => {
  const plan = STRIPE_CONFIG.plans[planId];
  return {
    tokensPerDay: plan.tokensPerDay,
    projectLimit: plan.projectLimit,
    isUnlimited: plan.tokensPerDay === -1,
  };
};

export default STRIPE_CONFIG;
