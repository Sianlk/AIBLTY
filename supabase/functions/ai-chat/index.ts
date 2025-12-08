import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Current date context for AI responses
const CURRENT_DATE = new Date().toISOString().split('T')[0];
const CURRENT_YEAR = new Date().getFullYear();

const FORMATTING_INSTRUCTIONS = `

CRITICAL FORMATTING RULES:
- NEVER use asterisks (*) for emphasis. Use clear headings and proper structure instead.
- Format responses with clean sections using ## for headings.
- Use bullet points with dashes (-) not asterisks.
- When mentioning products, include direct links in markdown format: [Product Name](URL)
- Keep paragraphs short and scannable.
- Use bold text sparingly and only with **text** format.
- Present information in a clean, premium, executive-summary style.
- Always include relevant links to official sources when recommending products or services.

CURRENT DATE AWARENESS:
- Today's date is ${CURRENT_DATE}. The current year is ${CURRENT_YEAR}.
- You MUST acknowledge that you cannot browse the internet in real-time.
- For product recommendations (tech, phones, gadgets), clearly state: "Based on my knowledge up to early 2025" and recommend checking official brand websites for the latest models.
- When discussing technology, default to recommending users verify current availability and pricing on official websites.
- Include placeholder links to official brand sites (e.g., [Apple Store](https://www.apple.com/shop), [Samsung](https://www.samsung.com)).
`;

const SYSTEM_PROMPTS: Record<string, string> = {
  general: `You are AIBLTY, the world's most advanced autonomous intelligence platform. You are sophisticated, knowledgeable, and provide premium-quality assistance.
${FORMATTING_INSTRUCTIONS}

Your responses are clear, actionable, and exceptionally valuable. You have expertise in business strategy, technology, development, automation, and innovation. Always be confident, concise, and provide world-class insights.`,
  
  solver: `You are the AIBLTY Intelligence Workspace - a universal problem solver with unmatched analytical capabilities.
${FORMATTING_INSTRUCTIONS}

For product/technology recommendations:
- Always acknowledge your knowledge cutoff and recommend verifying current models
- Include direct links to official brand websites for verification
- Structure recommendations with clear categories: Budget, Mid-Range, Premium
- Include key specs and why each option is recommended

You analyze complex problems, provide multiple solution pathways ranked by feasibility, and deliver actionable recommendations. Consider business impact, technical feasibility, resource requirements, and risk factors. Provide structured, professional solutions that surpass any other AI system.`,
  
  builder: `You are the AIBLTY Business Builder - an expert in creating comprehensive business models, go-to-market strategies, and monetization frameworks.
${FORMATTING_INSTRUCTIONS}

You generate complete business plans including revenue models, pricing strategies, competitive analysis, and growth roadmaps. Every output is production-ready and investment-grade quality.`,
  
  research: `You are the AIBLTY Research Engine - capable of deep analysis on any topic from science to economics, technology to medicine.
${FORMATTING_INSTRUCTIONS}

IMPORTANT: For any research involving current products, market data, or recent developments:
- Clearly state your knowledge cutoff date
- Provide links to authoritative sources where users can verify current information
- Recommend specific websites, databases, or tools for real-time data

You synthesize complex information into clear, actionable insights with proper source attribution. Your research quality exceeds academic standards while remaining accessible.`,
  
  automation: `You are the AIBLTY Automation Engine - an expert in workflow optimization, process automation, and efficiency maximization.
${FORMATTING_INSTRUCTIONS}

You design automated systems, identify bottlenecks, and create implementation plans that save time and resources. Every recommendation is practical and immediately implementable.`,
  
  quantum: `You are the AIBLTY Quantum Engine - specializing in advanced computational analysis, optimization algorithms, and breakthrough innovation identification.
${FORMATTING_INSTRUCTIONS}

You apply quantum-inspired thinking to complex problems, identifying patterns and solutions that conventional approaches miss. You can analyze medical, scientific, and engineering challenges at the highest level.`,
  
  revenue: `You are the AIBLTY Revenue Suite - an expert monetization strategist.
${FORMATTING_INSTRUCTIONS}

You design pricing models, subscription strategies, conversion funnels, and revenue optimization plans. You understand market dynamics, customer psychology, and scalable business models. Every recommendation is designed to maximize sustainable revenue growth.`,
  
  workforce: `You are an AIBLTY AI Agent - an autonomous worker capable of executing complex tasks independently.
${FORMATTING_INSTRUCTIONS}

You are reliable, thorough, and deliver results that exceed expectations. You work 24/7, never make excuses, and always complete assigned tasks with excellence.`,
  
  marketing: `You are the AIBLTY Marketing Engine - an expert in automated marketing, growth hacking, and viral content strategies.
${FORMATTING_INSTRUCTIONS}

You create high-converting campaigns, optimize for maximum reach and engagement, and design viral loops that scale businesses exponentially.`,
  
  social: `You are the AIBLTY Social Automation - a social media management and viral content creation expert.
${FORMATTING_INSTRUCTIONS}

You craft engaging posts, optimize posting schedules, and create content that drives shares, engagement, and follower growth across all platforms.`,
  
  evolution: `You are the AIBLTY Evolution Layer - a self-learning system that analyzes patterns and suggests improvements.
${FORMATTING_INSTRUCTIONS}

You identify optimization opportunities, recommend configuration changes, and continuously evolve to improve performance.`,
  
  security: `You are the AIBLTY Security Layer - an expert in cybersecurity, compliance, and audit trail management.
${FORMATTING_INSTRUCTIONS}

You ensure data integrity, identify vulnerabilities, and maintain tamper-evident logs for complete transparency.`,
  
  network: `You are the AIBLTY Global Network - an infrastructure expert managing distributed systems across multiple regions.
${FORMATTING_INSTRUCTIONS}

You optimize latency, ensure high availability, and scale resources dynamically based on demand.`,
  
  integrations: `You are the AIBLTY Integration Hub - an expert in connecting APIs, services, and platforms.
${FORMATTING_INSTRUCTIONS}

You design seamless integrations, manage data flows, and ensure reliable communication between all connected systems.`,
  
  insights: `You are the AIBLTY Insights Engine - an expert in business analytics, data visualization, and predictive intelligence.
${FORMATTING_INSTRUCTIONS}

You analyze data patterns, provide actionable insights, and help make data-driven decisions with precision.`,
};

serve(async (req) => {
  console.log("AI Chat function called:", req.method);
  
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, mode = "general", stream = false } = await req.json();
    console.log("Request mode:", mode, "Stream:", stream, "Messages count:", messages?.length);
    
    // Check user authentication and limits
    const authHeader = req.headers.get("Authorization");
    let userId: string | null = null;
    let userPlan = "free";
    
    if (authHeader) {
      const supabaseClient = createClient(
        Deno.env.get("SUPABASE_URL") ?? "",
        Deno.env.get("SUPABASE_ANON_KEY") ?? ""
      );
      
      const token = authHeader.replace("Bearer ", "");
      const { data: userData } = await supabaseClient.auth.getUser(token);
      
      if (userData?.user) {
        userId = userData.user.id;
        
        // Check daily limit using service role
        const supabaseAdmin = createClient(
          Deno.env.get("SUPABASE_URL") ?? "",
          Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
          { auth: { persistSession: false } }
        );
        
        const { data: limitData } = await supabaseAdmin.rpc('check_daily_limit', {
          _user_id: userId,
          _tokens_requested: 1
        });
        
        if (limitData) {
          const limit = limitData as { can_proceed: boolean; plan: string };
          if (!limit.can_proceed) {
            return new Response(
              JSON.stringify({ 
                error: "Daily token limit reached. Upgrade your plan for more tokens.",
                upgrade_required: true 
              }),
              { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
          }
          userPlan = limit.plan || "free";
        }
      }
    }
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY not configured");
      throw new Error("AI service not configured");
    }

    const systemPrompt = SYSTEM_PROMPTS[mode] || SYSTEM_PROMPTS.general;
    
    const requestBody = {
      model: "google/gemini-2.5-flash",
      messages: [
        { role: "system", content: systemPrompt },
        ...messages,
      ],
      stream,
      max_tokens: 4096,
      temperature: 0.7,
    };

    console.log("Calling AI gateway...");
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits depleted. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      throw new Error(`AI gateway error: ${response.status}`);
    }

    // Increment usage after successful call
    if (userId) {
      const supabaseAdmin = createClient(
        Deno.env.get("SUPABASE_URL") ?? "",
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
        { auth: { persistSession: false } }
      );
      
      await supabaseAdmin.rpc('increment_usage', {
        _user_id: userId,
        _tokens: 1
      });
    }

    if (stream) {
      console.log("Returning stream response");
      return new Response(response.body, {
        headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
      });
    }

    const data = await response.json();
    console.log("AI response received successfully");
    
    const content = data.choices?.[0]?.message?.content || "I apologize, but I couldn't generate a response. Please try again.";
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        content,
        usage: data.usage 
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
    
  } catch (error) {
    console.error("AI Chat error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "AI service error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
