import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, stripe-signature",
};

const logStep = (step: string, details?: Record<string, unknown>) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[STRIPE-WEBHOOK] ${step}${detailsStr}`);
};

// Price ID to Plan mapping
const PRICE_TO_PLAN: Record<string, "starter" | "pro" | "elite"> = {
  "price_1SbsPJCL9suzCBniOemTarlT": "starter",
  "price_1Sbs9aCL9suzCBnijVCsflFI": "pro",
  "price_1Sbs9pCL9suzCBnimI8LQvOS": "elite",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Webhook received");

    const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    
    if (!stripeSecretKey) {
      throw new Error("STRIPE_SECRET_KEY not configured");
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2025-08-27.basil",
    });

    const body = await req.text();
    const signature = req.headers.get("stripe-signature");

    let event: Stripe.Event;

    if (webhookSecret && signature) {
      try {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
        logStep("Webhook signature verified");
      } catch (err) {
        logStep("Webhook signature verification failed", { error: err instanceof Error ? err.message : String(err) });
        return new Response(JSON.stringify({ error: "Invalid signature" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    } else {
      event = JSON.parse(body);
      logStep("Webhook received without signature verification (dev mode)");
    }

    logStep("Processing event", { type: event.type, id: event.id });

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        logStep("Checkout session completed", { 
          sessionId: session.id, 
          customerId: session.customer,
          metadata: session.metadata 
        });

        if (session.mode === "subscription" && session.metadata?.user_id) {
          const userId = session.metadata.user_id;
          const plan = session.metadata.plan as "starter" | "pro" | "elite";

          const { error: updateError } = await supabaseAdmin
            .from("profiles")
            .update({ plan })
            .eq("user_id", userId);

          if (updateError) {
            logStep("Error updating user plan", { error: updateError.message, userId });
          } else {
            logStep("User plan updated successfully", { userId, plan });
          }
        }
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        logStep("Subscription updated", { 
          subscriptionId: subscription.id, 
          status: subscription.status,
          customerId: subscription.customer 
        });

        const customerId = typeof subscription.customer === 'string' 
          ? subscription.customer 
          : subscription.customer.id;
        
        const customer = await stripe.customers.retrieve(customerId);
        if (customer.deleted) {
          logStep("Customer was deleted");
          break;
        }

        const email = customer.email;
        if (!email) {
          logStep("No email found for customer");
          break;
        }

        const priceId = subscription.items.data[0]?.price.id;
        let plan: "free" | "starter" | "pro" | "elite" = "free";
        
        if (subscription.status === "active" || subscription.status === "trialing") {
          plan = PRICE_TO_PLAN[priceId] || "free";
        }

        const { error } = await supabaseAdmin
          .from("profiles")
          .update({ plan })
          .eq("email", email);

        if (error) {
          logStep("Error updating subscription", { error: error.message });
        } else {
          logStep("Subscription plan updated", { email, plan });
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        logStep("Subscription cancelled", { subscriptionId: subscription.id });

        const customerId = typeof subscription.customer === 'string' 
          ? subscription.customer 
          : subscription.customer.id;
        
        const customer = await stripe.customers.retrieve(customerId);
        if (customer.deleted) break;

        const email = customer.email;
        if (!email) break;

        const { error } = await supabaseAdmin
          .from("profiles")
          .update({ plan: "free" })
          .eq("email", email);

        if (error) {
          logStep("Error downgrading user", { error: error.message });
        } else {
          logStep("User downgraded to free plan", { email });
        }
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        logStep("Payment failed", { invoiceId: invoice.id, customerId: invoice.customer });
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        logStep("Payment succeeded", { invoiceId: invoice.id, amount: invoice.amount_paid });
        break;
      }

      default:
        logStep("Unhandled event type", { type: event.type });
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("Webhook error", { error: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});