import dotenv from 'dotenv';
dotenv.config();

export const env = {
  // Server
  PORT: process.env.PORT || '4000',
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // Database
  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/aiblty',
  
  // Auth
  JWT_SECRET: (() => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET environment variable is required and must be set');
    }
    return secret;
  })(),
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  ADMIN_EMAILS: process.env.ADMIN_EMAILS?.split(',').map(e => e.trim().toLowerCase()) || [],
  
  // Stripe
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || '',
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET || '',
  STRIPE_PRICE_PRO: process.env.STRIPE_PRICE_PRO || '',
  STRIPE_PRICE_ELITE: process.env.STRIPE_PRICE_ELITE || '',
  
  // PayPal
  PAYPAL_CLIENT_ID: process.env.PAYPAL_CLIENT_ID || '',
  PAYPAL_SECRET: process.env.PAYPAL_SECRET || '',
  
  // Revolut
  REVOLUT_API_KEY: process.env.REVOLUT_API_KEY || '',
  
  // AI
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
  ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY || '',
  
  // CORS
  CORS_ORIGINS: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:5173'],
  
  // File storage
  STORAGE_PATH: process.env.STORAGE_PATH || './storage',
};

export function isAdmin(email: string): boolean {
  return env.ADMIN_EMAILS.includes(email.toLowerCase());
}
