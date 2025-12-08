import { supabase } from '@/integrations/supabase/client';

interface CheckoutResponse {
  url?: string;
  error?: string;
}

export async function createCheckout(plan: 'pro' | 'elite'): Promise<CheckoutResponse> {
  try {
    const { data, error } = await supabase.functions.invoke('create-checkout', {
      body: { plan },
    });

    if (error) {
      console.error('Checkout error:', error);
      return { error: error.message };
    }

    return data;
  } catch (err) {
    console.error('Checkout error:', err);
    return { error: err instanceof Error ? err.message : 'Failed to create checkout' };
  }
}

export async function openBillingPortal(): Promise<CheckoutResponse> {
  try {
    const { data, error } = await supabase.functions.invoke('billing-portal', {});

    if (error) {
      console.error('Billing portal error:', error);
      return { error: error.message };
    }

    return data;
  } catch (err) {
    console.error('Billing portal error:', err);
    return { error: err instanceof Error ? err.message : 'Failed to open billing portal' };
  }
}

export async function getSubscriptionStatus(): Promise<{ plan: string; status: string }> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { plan: 'free', status: 'inactive' };
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('plan')
      .eq('user_id', user.id)
      .single();

    return {
      plan: profile?.plan || 'free',
      status: profile?.plan !== 'free' ? 'active' : 'inactive',
    };
  } catch {
    return { plan: 'free', status: 'inactive' };
  }
}
