import { Request, Response, NextFunction } from 'express';
import * as billingService from './billing.service';

export async function createStripeCheckout(req: Request, res: Response, next: NextFunction) {
  try {
    const { plan } = req.body;
    const result = await billingService.createStripeCheckout(req.user!.userId, plan);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

export async function createBillingPortal(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await billingService.createBillingPortal(req.user!.userId);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

export async function handleStripeWebhook(req: Request, res: Response, next: NextFunction) {
  try {
    const signature = req.headers['stripe-signature'] as string;
    const result = await billingService.handleStripeWebhook(req.body, signature);
    res.json(result);
  } catch (error) {
    next(error);
  }
}

export async function getSubscription(req: Request, res: Response, next: NextFunction) {
  try {
    const subscription = await billingService.getSubscription(req.user!.userId);
    res.json({ success: true, data: subscription });
  } catch (error) {
    next(error);
  }
}

export async function getPaymentHistory(req: Request, res: Response, next: NextFunction) {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const result = await billingService.getPaymentHistory(req.user!.userId, page);
    res.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
}

export async function cancelSubscription(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await billingService.cancelSubscription(req.user!.userId);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

export async function createPaypalOrder(req: Request, res: Response, next: NextFunction) {
  try {
    const { plan } = req.body;
    const result = await billingService.createPaypalOrder(req.user!.userId, plan);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

export async function createRevolutPayment(req: Request, res: Response, next: NextFunction) {
  try {
    const { plan } = req.body;
    const result = await billingService.createRevolutPayment(req.user!.userId, plan);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}
