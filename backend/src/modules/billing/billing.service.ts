import Stripe from 'stripe';
import { prisma } from '../../config/db';
import { env } from '../../config/env';
import { AppError } from '../../middleware/errorHandler';

const stripe = env.STRIPE_SECRET_KEY ? new Stripe(env.STRIPE_SECRET_KEY, { apiVersion: '2023-10-16' }) : null;

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
  
  const priceId = plan === 'pro' ? env.STRIPE_PRICE_PRO : env.STRIPE_PRICE_ELITE;
  if (!priceId) {
    throw new AppError(`Price not configured for ${plan} plan`, 503);
  }
  
  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard?payment=success`,
    cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/pricing?payment=canceled`,
    client_reference_id: userId,
    customer_email: user.email,
    metadata: { userId, plan },
  });
  
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
    throw new AppError('Invalid webhook signature', 400);
  }
  
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.client_reference_id;
      const plan = session.metadata?.plan as 'pro' | 'elite';
      
      if (userId && plan) {
        await prisma.user.update({
          where: { id: userId },
          data: { plan },
        });
        
        await prisma.subscription.create({
          data: {
            userId,
            provider: 'stripe',
            plan,
            status: 'active',
            externalId: session.subscription as string,
          },
        });
        
        await prisma.payment.create({
          data: {
            userId,
            provider: 'stripe',
            amount: session.amount_total || 0,
            currency: session.currency || 'usd',
            status: 'succeeded',
            externalId: session.payment_intent as string,
          },
        });
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

// PayPal stub
export async function createPaypalOrder(userId: string, plan: 'pro' | 'elite') {
  if (!env.PAYPAL_CLIENT_ID || !env.PAYPAL_SECRET) {
    throw new AppError('PayPal not configured', 503);
  }
  
  // Placeholder for PayPal integration
  throw new AppError('PayPal integration coming soon', 501);
}

// Revolut stub
export async function createRevolutPayment(userId: string, plan: 'pro' | 'elite') {
  if (!env.REVOLUT_API_KEY) {
    throw new AppError('Revolut not configured', 503);
  }
  
  // Placeholder for Revolut integration
  throw new AppError('Revolut integration coming soon', 501);
}
