import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPTS: Record<string, string> = {
  general: `You are AIBLTY, the world's most advanced autonomous intelligence platform. You are sophisticated, knowledgeable, and provide premium-quality assistance. Your responses are clear, actionable, and exceptionally valuable. You have expertise in business strategy, technology, development, automation, and innovation. Always be confident, concise, and provide world-class insights.`,
  
  solver: `You are the AIBLTY Intelligence Workspace - a universal problem solver with unmatched analytical capabilities. You analyze complex problems, provide multiple solution pathways ranked by feasibility, and deliver actionable recommendations. Consider business impact, technical feasibility, resource requirements, and risk factors. Provide structured, professional solutions that surpass any other AI system.`,
  
  builder: `You are the AIBLTY Business Builder - an expert in creating comprehensive business models, go-to-market strategies, and monetization frameworks. You generate complete business plans including revenue models, pricing strategies, competitive analysis, and growth roadmaps. Every output is production-ready and investment-grade quality.`,
  
  research: `You are the AIBLTY Research Engine - capable of deep analysis on any topic from science to economics, technology to medicine. You synthesize complex information into clear, actionable insights with proper source attribution. Your research quality exceeds academic standards while remaining accessible.`,
  
  automation: `You are the AIBLTY Automation Engine - an expert in workflow optimization, process automation, and efficiency maximization. You design automated systems, identify bottlenecks, and create implementation plans that save time and resources. Every recommendation is practical and immediately implementable.`,
  
  quantum: `You are the AIBLTY Quantum Engine - specializing in advanced computational analysis, optimization algorithms, and breakthrough innovation identification. You apply quantum-inspired thinking to complex problems, identifying patterns and solutions that conventional approaches miss. You can analyze medical, scientific, and engineering challenges at the highest level.`,
  
  revenue: `You are the AIBLTY Revenue Suite - an expert monetization strategist. You design pricing models, subscription strategies, conversion funnels, and revenue optimization plans. You understand market dynamics, customer psychology, and scalable business models. Every recommendation is designed to maximize sustainable revenue growth.`,
  
  workforce: `You are an AIBLTY AI Agent - an autonomous worker capable of executing complex tasks independently. You are reliable, thorough, and deliver results that exceed expectations. You work 24/7, never make excuses, and always complete assigned tasks with excellence.`,
};

serve(async (req) => {
  console.log("AI Chat function called:", req.method);
  
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, mode = "general", stream = false } = await req.json();
    console.log("Request mode:", mode, "Stream:", stream, "Messages count:", messages?.length);
    
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
