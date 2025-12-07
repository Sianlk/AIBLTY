import Stripe from 'stripe';
import { prisma } from '../../config/db';
import { env } from '../../config/env';
import { AppError } from '../../middleware/errorHandler';
import { logger } from '../../utils/logger';

const stripe = env.STRIPE_SECRET_KEY ? new Stripe(env.STRIPE_SECRET_KEY, { apiVersion: '2023-10-16' }) : null;

// GBP Pricing in pence
const PLAN_PRICES = {
  pro: 4900, // £49.00
  elite: 19900, // £199.00
};

export async function createStripeCheckout(userId: string, plan: 'pro' | 'elite') {
  if (!stripe) {
    throw new AppError('Stripe not configured', 503);
  }
  
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new AppError('User not found', 404);
  
  // Admin users never need to pay
  if (user.role === 'admin') {
    throw new AppError('Admin accounts do not need to subscribe', 400);
  }
  
  // Check if user already has an active subscription
  const existingSub = await prisma.subscription.findFirst({
    where: { userId, status: 'active' },
  });
  
  if (existingSub && existingSub.plan === plan) {
    throw new AppError(`You are already subscribed to the ${plan} plan`, 400);
  }
  
  let priceId = plan === 'pro' ? env.STRIPE_PRICE_PRO : env.STRIPE_PRICE_ELITE;
  
  // If no price ID configured, create a price dynamically
  if (!priceId) {
    logger.info(`Creating dynamic price for ${plan} plan`);
    
    // First, create or get a product
    let product;
    const products = await stripe.products.list({ limit: 10 });
    product = products.data.find(p => p.metadata.plan === plan);
    
    if (!product) {
      product = await stripe.products.create({
        name: `AIBLTY ${plan.charAt(0).toUpperCase() + plan.slice(1)} Plan`,
        description: plan === 'pro' 
          ? 'Unlimited AI queries, 10 Projects, All AI Tools, Business Builder, Automation Engine, Priority support'
          : 'Everything in Pro, Unlimited Projects, AI Workforce, Quantum Engine, White-label exports, Dedicated support, API access',
        metadata: { plan },
      });
    }
    
    // Create recurring price
    const price = await stripe.prices.create({
      product: product.id,
      unit_amount: PLAN_PRICES[plan],
      currency: 'gbp',
      recurring: { interval: 'month' },
      metadata: { plan },
    });
    
    priceId = price.id;
    logger.info(`Created price ${priceId} for ${plan} plan`);
  }
  
  // Create or retrieve customer
  let customerId: string | undefined;
  const existingCustomers = await stripe.customers.list({ email: user.email, limit: 1 });
  
  if (existingCustomers.data.length > 0) {
    customerId = existingCustomers.data[0].id;
  } else {
    const customer = await stripe.customers.create({
      email: user.email,
      name: user.name || undefined,
      metadata: { userId },
    });
    customerId = customer.id;
  }
  
  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${process.env.FRONTEND_URL || 'https://aiblty.com'}/dashboard?payment=success&plan=${plan}`,
    cancel_url: `${process.env.FRONTEND_URL || 'https://aiblty.com'}/pricing?payment=canceled`,
    client_reference_id: userId,
    customer: customerId,
    metadata: { userId, plan },
    subscription_data: {
      metadata: { userId, plan },
    },
    allow_promotion_codes: true,
    billing_address_collection: 'auto',
  });
  
  logger.info(`Created checkout session ${session.id} for user ${userId} - ${plan} plan`);
  
  return { url: session.url, sessionId: session.id };
}

export async function handleStripeWebhook(payload: Buffer, signature: string) {
  if (!stripe) {
    throw new AppError('Stripe not configured', 503);
  }
  
  let event: Stripe.Event;
  
  try {
    event = stripe.webhooks.constructEvent(payload, signature, env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    logger.error('Webhook signature verification failed:', err);
    throw new AppError('Invalid webhook signature', 400);
  }
  
  logger.info(`Processing webhook event: ${event.type}`);
  
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.client_reference_id;
      const plan = session.metadata?.plan as 'pro' | 'elite';
      
      if (userId && plan) {
        // Update user plan
        await prisma.user.update({
          where: { id: userId },
          data: { plan },
        });
        
        // Create subscription record
        await prisma.subscription.create({
          data: {
            userId,
            provider: 'stripe',
            plan,
            status: 'active',
            externalId: session.subscription as string,
          },
        });
        
        // Record payment
        await prisma.payment.create({
          data: {
            userId,
            provider: 'stripe',
            amount: session.amount_total || 0,
            currency: (session.currency || 'gbp').toUpperCase(),
            status: 'succeeded',
            externalId: session.payment_intent as string,
          },
        });
        
        logger.info(`User ${userId} upgraded to ${plan} plan via Stripe`);
      }
      break;
    }
    
    case 'invoice.payment_succeeded': {
      const invoice = event.data.object as Stripe.Invoice;
      if (invoice.subscription) {
        const dbSub = await prisma.subscription.findFirst({
          where: { externalId: invoice.subscription as string },
        });
        
        if (dbSub) {
          // Record recurring payment
          await prisma.payment.create({
            data: {
              userId: dbSub.userId,
              provider: 'stripe',
              amount: invoice.amount_paid,
              currency: (invoice.currency || 'gbp').toUpperCase(),
              status: 'succeeded',
              externalId: invoice.payment_intent as string,
            },
          });
          
          logger.info(`Recorded recurring payment for subscription ${dbSub.id}`);
        }
      }
      break;
    }
    
    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice;
      if (invoice.subscription) {
        const dbSub = await prisma.subscription.findFirst({
          where: { externalId: invoice.subscription as string },
        });
        
        if (dbSub) {
          await prisma.subscription.update({
            where: { id: dbSub.id },
            data: { status: 'past_due' },
          });
          
          logger.warn(`Payment failed for subscription ${dbSub.id}`);
        }
      }
      break;
    }
    
    case 'customer.subscription.updated':
    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription;
      const dbSub = await prisma.subscription.findFirst({
        where: { externalId: subscription.id },
      });
      
      if (dbSub) {
        const status = subscription.status === 'active' ? 'active' :
                       subscription.status === 'canceled' ? 'canceled' :
                       subscription.status === 'past_due' ? 'past_due' : 'incomplete';
        
        await prisma.subscription.update({
          where: { id: dbSub.id },
          data: {
            status,
            currentPeriodEnd: new Date(subscription.current_period_end * 1000),
          },
        });
        
        // Update user plan if canceled
        if (subscription.status === 'canceled') {
          await prisma.user.update({
            where: { id: dbSub.userId },
            data: { plan: 'free' },
          });
          logger.info(`Subscription canceled for user ${dbSub.userId}, reverted to free plan`);
        }
      }
      break;
    }
  }
  
  return { received: true };
}

export async function getSubscription(userId: string) {
  const subscription = await prisma.subscription.findFirst({
    where: { userId, status: 'active' },
    orderBy: { createdAt: 'desc' },
  });
  
  // If we have a Stripe subscription, fetch latest details
  if (subscription?.externalId && stripe) {
    try {
      const stripeSub = await stripe.subscriptions.retrieve(subscription.externalId);
      return {
        ...subscription,
        currentPeriodEnd: new Date(stripeSub.current_period_end * 1000),
        cancelAtPeriodEnd: stripeSub.cancel_at_period_end,
      };
    } catch (error) {
      logger.error('Failed to fetch Stripe subscription:', error);
    }
  }
  
  return subscription;
}

export async function getPaymentHistory(userId: string, page = 1, limit = 20) {
  const skip = (page - 1) * limit;
  
  const [payments, total] = await Promise.all([
    prisma.payment.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.payment.count({ where: { userId } }),
  ]);
  
  return {
    payments,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
}

// Cancel subscription
export async function cancelSubscription(userId: string) {
  if (!stripe) {
    throw new AppError('Stripe not configured', 503);
  }
  
  const subscription = await prisma.subscription.findFirst({
    where: { userId, status: 'active' },
  });
  
  if (!subscription?.externalId) {
    throw new AppError('No active subscription found', 404);
  }
  
  await stripe.subscriptions.update(subscription.externalId, {
    cancel_at_period_end: true,
  });
  
  logger.info(`Subscription ${subscription.id} marked for cancellation at period end`);
  
  return { message: 'Subscription will be canceled at the end of the billing period' };
}

// PayPal integration
export async function createPaypalOrder(userId: string, plan: 'pro' | 'elite') {
  if (!env.PAYPAL_CLIENT_ID || !env.PAYPAL_SECRET) {
    throw new AppError('PayPal not configured', 503);
  }
  
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new AppError('User not found', 404);
  
  // PayPal API integration
  const auth = Buffer.from(`${env.PAYPAL_CLIENT_ID}:${env.PAYPAL_SECRET}`).toString('base64');
  
  const tokenResponse = await fetch('https://api-m.paypal.com/v1/oauth2/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });
  
  if (!tokenResponse.ok) {
    throw new AppError('Failed to authenticate with PayPal', 503);
  }
  
  const { access_token } = await tokenResponse.json();
  
  const orderResponse = await fetch('https://api-m.paypal.com/v2/checkout/orders', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${access_token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      intent: 'CAPTURE',
      purchase_units: [{
        amount: {
          currency_code: 'GBP',
          value: (PLAN_PRICES[plan] / 100).toFixed(2),
        },
        description: `AIBLTY ${plan.charAt(0).toUpperCase() + plan.slice(1)} Plan - Monthly Subscription`,
      }],
      application_context: {
        return_url: `${process.env.FRONTEND_URL || 'https://aiblty.com'}/dashboard?payment=success&provider=paypal&plan=${plan}`,
        cancel_url: `${process.env.FRONTEND_URL || 'https://aiblty.com'}/pricing?payment=canceled`,
      },
    }),
  });
  
  if (!orderResponse.ok) {
    throw new AppError('Failed to create PayPal order', 503);
  }
  
  const order = await orderResponse.json();
  const approveLink = order.links.find((link: any) => link.rel === 'approve');
  
  logger.info(`Created PayPal order ${order.id} for user ${userId}`);
  
  return { orderId: order.id, approveUrl: approveLink?.href };
}

// Revolut integration (placeholder - requires Revolut Business API)
export async function createRevolutPayment(userId: string, plan: 'pro' | 'elite') {
  if (!env.REVOLUT_API_KEY) {
    throw new AppError('Revolut not configured', 503);
  }
  
  // Revolut Business API integration would go here
  // For now, return a structured response indicating the feature is coming
  throw new AppError('Revolut integration coming soon. Please use Stripe or PayPal.', 501);
}
