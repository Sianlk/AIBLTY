import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, stripe-signature",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    
    if (!stripeSecretKey) {
      throw new Error("Stripe not configured");
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2023-10-16",
    });

    const body = await req.text();
    const signature = req.headers.get("stripe-signature");

    let event: Stripe.Event;

    if (webhookSecret && signature) {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } else {
      event = JSON.parse(body);
    }

    console.log(`Processing webhook event: ${event.type}`);

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.user_id;
        const plan = session.metadata?.plan;

        if (userId && plan) {
          const { error } = await supabaseAdmin
            .from("profiles")
            .update({ plan: plan })
            .eq("user_id", userId);

          if (error) {
            console.error("Error updating user plan:", error);
          } else {
            console.log(`User ${userId} upgraded to ${plan}`);
          }
        }
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;
        
        const customer = await stripe.customers.retrieve(customerId);
        if (customer.deleted) break;

        const email = (customer as Stripe.Customer).email;
        if (!email) break;

        const { data: profile } = await supabaseAdmin
          .from("profiles")
          .select("user_id")
          .eq("email", email)
          .single();

        if (profile) {
          const newPlan = subscription.status === "active" 
            ? (subscription.items.data[0].price.unit_amount === 19900 ? "elite" : "pro")
            : "free";

          await supabaseAdmin
            .from("profiles")
            .update({ plan: newPlan })
            .eq("user_id", profile.user_id);

          console.log(`Subscription updated for ${email}: ${newPlan}`);
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;
        
        const customer = await stripe.customers.retrieve(customerId);
        if (customer.deleted) break;

        const email = (customer as Stripe.Customer).email;
        if (!email) break;

        const { data: profile } = await supabaseAdmin
          .from("profiles")
          .select("user_id")
          .eq("email", email)
          .single();

        if (profile) {
          await supabaseAdmin
            .from("profiles")
            .update({ plan: "free" })
            .eq("user_id", profile.user_id);

          console.log(`Subscription canceled for ${email}`);
        }
        break;
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Webhook error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
