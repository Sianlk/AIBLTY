import { Router } from 'express';
import * as billingController from './billing.controller';
import { authMiddleware } from '../../middleware/auth';

const router = Router();

// Stripe webhook (no auth - verified by signature)
router.post('/stripe/webhook', billingController.handleStripeWebhook);

// Protected routes
router.post('/stripe/checkout', authMiddleware, billingController.createStripeCheckout);
router.get('/subscription', authMiddleware, billingController.getSubscription);
router.get('/payments', authMiddleware, billingController.getPaymentHistory);

// PayPal
router.post('/paypal/create', authMiddleware, billingController.createPaypalOrder);

// Revolut
router.post('/revolut/create', authMiddleware, billingController.createRevolutPayment);

export default router;
