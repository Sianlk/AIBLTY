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
      features: [
        '5 AI queries/day',
        '1 Project',
        'Basic Problem Solver',
        'Community support',
      ],
    },
    pro: {
      id: 'pro',
      name: 'Pro',
      price: 49,
      currency: 'GBP',
      priceId: 'price_pro_monthly', // Will be set up in Stripe Dashboard
      features: [
        'Unlimited AI queries',
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
      priceId: 'price_elite_monthly', // Will be set up in Stripe Dashboard
      features: [
        'Everything in Pro',
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

export default STRIPE_CONFIG;
