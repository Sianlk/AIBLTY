import { supabase } from '@/integrations/supabase/client';

interface CheckoutResponse {
  url?: string;
  error?: string;
}

export async function createCheckout(plan: 'starter' | 'pro' | 'elite'): Promise<CheckoutResponse> {
  try {
    // Check authentication first
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session) {
      return { error: 'Please sign in to upgrade your plan.' };
    }

    console.log('Creating checkout for plan:', plan);
    
    const { data, error } = await supabase.functions.invoke('create-checkout', {
      body: { plan },
    });

    if (error) {
      console.error('Checkout error:', error);
      return { error: error.message || 'Failed to create checkout session. Please try again.' };
    }

    if (data?.error) {
      console.error('Checkout API error:', data.error);
      return { error: data.error };
    }

    if (!data?.url) {
      return { error: 'No checkout URL returned. Please try again.' };
    }

    return { url: data.url };
  } catch (err) {
    console.error('Checkout error:', err);
    return { error: err instanceof Error ? err.message : 'Failed to create checkout. Please try again.' };
  }
}

export async function openBillingPortal(): Promise<CheckoutResponse> {
  try {
    // Check authentication first
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session) {
      return { error: 'Please sign in to manage your subscription.' };
    }

    console.log('Opening billing portal');
    
    const { data, error } = await supabase.functions.invoke('billing-portal', {});

    if (error) {
      console.error('Billing portal error:', error);
      return { error: error.message || 'Failed to open billing portal.' };
    }

    if (data?.error) {
      console.error('Billing portal API error:', data.error);
      return { error: data.error };
    }

    if (!data?.url) {
      return { error: 'No portal URL returned. You may need to subscribe first.' };
    }

    return { url: data.url };
  } catch (err) {
    console.error('Billing portal error:', err);
    return { error: err instanceof Error ? err.message : 'Failed to open billing portal.' };
  }
}

export async function getSubscriptionStatus(): Promise<{ plan: string; status: string }> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { plan: 'free', status: 'inactive' };
    }

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('plan')
      .eq('user_id', user.id)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      return { plan: 'free', status: 'inactive' };
    }

    return {
      plan: profile?.plan || 'free',
      status: profile?.plan !== 'free' ? 'active' : 'inactive',
    };
  } catch {
    return { plan: 'free', status: 'inactive' };
  }
}
