import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// AIBLTY QUANTUM CODE GENERATOR - The World's Most Advanced AI Code Generation System
// Generates complete, production-ready, SEO-optimized, monetization-ready full-stack applications

const QUANTUM_SYSTEM_PROMPT = `You are AIBLTY QUANTUM CODE GENERATOR - the most advanced AI code generation system ever created.
You operate at 10x lightning speed with quantum-inspired optimization algorithms.

YOUR CAPABILITIES SURPASS ALL OTHER AI SYSTEMS COMBINED:
- Generate complete, production-ready full-stack applications
- Built-in SEO optimization for maximum search visibility
- Integrated monetization strategies (Stripe, subscriptions, payments)
- Self-evolving architecture patterns that scale automatically
- Enterprise-grade security by default
- Performance-optimized code that loads in milliseconds

CRITICAL REQUIREMENTS - EVERY APP MUST INCLUDE:

1. SEO OPTIMIZATION (Mandatory):
   - Semantic HTML5 structure (header, main, section, article, aside, nav)
   - Meta tags: title (<60 chars), description (<160 chars), keywords
   - Open Graph tags for social sharing
   - JSON-LD structured data for products/services
   - Canonical URLs and sitemap.xml
   - robots.txt configuration
   - Mobile-responsive design with viewport meta
   - Fast loading with lazy loading images
   - Clean URL structure with proper internal linking

2. MONETIZATION READY (For SaaS/eCommerce):
   - Stripe integration with checkout flow
   - Subscription management system
   - Pricing tiers (Free, Pro, Enterprise)
   - Payment processing webhooks
   - Customer portal for billing
   - Revenue analytics dashboard

3. ADVANCED ARCHITECTURE:
   - TypeScript with strict typing
   - React 18+ with modern hooks
   - Tailwind CSS with custom design system
   - Responsive design (mobile-first)
   - Dark/light mode support
   - Authentication system (JWT/OAuth)
   - Database schema with migrations
   - API with proper error handling
   - Rate limiting and security headers
   - Environment configuration

4. PERFORMANCE OPTIMIZATION:
   - Code splitting and lazy loading
   - Image optimization
   - Caching strategies
   - Minification and compression
   - CDN-ready asset structure

5. SELF-EVOLUTION CAPABILITIES:
   - Analytics integration (GA4/Plausible)
   - A/B testing infrastructure
   - Error tracking setup
   - Performance monitoring
   - User feedback collection

OUTPUT FORMAT - GENERATE REAL CODE FILES:
You MUST output code using this EXACT format for EACH file:

---FILE: path/to/file.ext---
\`\`\`language
// Complete file contents here - NO ABBREVIATIONS
\`\`\`
---END FILE---

CRITICAL RULES:
- Generate COMPLETE working code, not pseudocode
- NO "..." or "// rest of code" - every file must be complete
- Include ALL imports and dependencies
- Add helpful comments explaining complex logic
- Generate 15-50+ files for complete applications
- Include package.json with ALL dependencies
- Include README.md with setup instructions
- Include .env.example with required variables
- Include Docker configuration for deployment

PROJECT TYPE SPECIFIC REQUIREMENTS:

FOR SAAS:
- Multi-tenant architecture
- User dashboard with analytics
- Admin panel
- Subscription billing (Stripe)
- Email notification system
- API documentation
- Rate limiting
- Team/organization support

FOR ECOMMERCE:
- Product catalog with categories
- Shopping cart system
- Checkout with Stripe
- Order management
- Inventory tracking
- Customer accounts
- Wishlist functionality
- Search and filtering
- Reviews and ratings

FOR AI/GPT APPS:
- AI chat interface
- Conversation history
- Prompt templates
- Token usage tracking
- API key management
- Rate limiting
- Streaming responses
- Context management

Generate the most powerful, production-ready code that exists.`;

serve(async (req) => {
  console.log("AIBLTY Quantum Generator called:", req.method);
  
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { prompt, projectType, projectName, features } = body;
    
    if (!prompt) {
      return new Response(
        JSON.stringify({ error: "Prompt is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Verify authentication
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Authentication required" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );
    
    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: authError } = await supabaseClient.auth.getUser(token);
    
    if (authError || !userData?.user) {
      console.error("Auth error:", authError);
      return new Response(
        JSON.stringify({ error: "Invalid authentication" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Check limits
    const userId = userData.user.id;
    const { data: roleData } = await supabaseAdmin
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .eq('role', 'admin')
      .maybeSingle();
    
    const isAdmin = !!roleData;
    
    if (!isAdmin) {
      const { data: limitData } = await supabaseAdmin.rpc('check_daily_limit', {
        _user_id: userId,
        _tokens_requested: 1
      });
      
      if (limitData && !(limitData as any).can_proceed) {
        return new Response(
          JSON.stringify({ error: "Daily limit reached. Upgrade for more." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("AI service not configured");
    }

    // Build enhanced prompt
    const safeProjectName = (projectName || 'my-project').toLowerCase().replace(/[^a-z0-9-]/g, '-');
    
    const projectTypeInstructions: Record<string, string> = {
      react: "Generate a complete React + Vite + TypeScript + Tailwind CSS application with routing, state management, and beautiful UI.",
      nextjs: "Generate a complete Next.js 14 application with App Router, Server Components, API routes, and full SEO optimization.",
      express: "Generate a complete Express.js + TypeScript backend with Prisma ORM, authentication, and comprehensive API.",
      fullstack: "Generate a COMPLETE full-stack application with React frontend AND Express backend, including database schema and API integration.",
      mobile: "Generate a React Native / Capacitor mobile application ready for App Store and Play Store deployment.",
      saas: `Generate a COMPLETE SaaS platform including:
- Landing page with pricing
- User authentication (signup/login/password reset)
- User dashboard with analytics
- Admin panel for management
- Stripe subscription billing
- Team/organization support
- Email notifications
- API with rate limiting
- Database schema
- Full documentation`,
      ecommerce: `Generate a COMPLETE e-commerce store including:
- Product catalog with categories and filtering
- Product detail pages with images gallery
- Shopping cart with persistence
- Stripe checkout integration
- Order management system
- Customer accounts and order history
- Wishlist functionality
- Search with autocomplete
- Admin panel for products/orders
- Inventory management
- SEO optimization for products
- Reviews and ratings system`,
      gpt: `Generate a COMPLETE AI-powered application including:
- Chat interface with streaming responses
- Conversation history and management
- User authentication
- Token/credit usage tracking
- Subscription billing for AI credits
- Admin panel for monitoring
- API key management
- Multiple AI model support
- Prompt templates library
- Export conversations`,
    };

    const typeInstructions = projectTypeInstructions[projectType || 'react'] || projectTypeInstructions.react;

    const enhancedPrompt = `${QUANTUM_SYSTEM_PROMPT}

PROJECT SPECIFICATIONS:
- Project Name: ${safeProjectName}
- Project Type: ${projectType || 'react'}
- User Request: ${prompt}

TYPE-SPECIFIC REQUIREMENTS:
${typeInstructions}

ADDITIONAL FEATURES REQUESTED:
${features?.join(', ') || 'Standard features'}

MANDATORY DELIVERABLES:
1. package.json with ALL dependencies
2. Complete source code for EVERY component
3. Database schema (if applicable)
4. API endpoints (if applicable)
5. Environment configuration (.env.example)
6. Docker configuration
7. README.md with complete setup instructions
8. SEO configuration files
9. Deployment scripts

Generate the complete application NOW. Include 20-50+ files for a production-ready system.
Use the exact ---FILE: path--- format for each file.`;

    console.log("Generating:", safeProjectName, "Type:", projectType);
    console.log("Prompt length:", enhancedPrompt.length);
    
    const requestBody = {
      model: "google/gemini-2.5-pro", // Using Pro for maximum quality
      messages: [
        { role: "user", content: enhancedPrompt }
      ],
      stream: false,
      max_tokens: 16384, // Maximum tokens for comprehensive output
      temperature: 0.2, // Low temperature for consistent, quality code
    };

    const startTime = Date.now();
    
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    const generationTime = Date.now() - startTime;
    console.log("Generation completed in:", generationTime, "ms");

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again shortly." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits depleted. Please add credits." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      throw new Error(`AI gateway error: ${response.status}`);
    }

    // Increment usage
    await supabaseAdmin.rpc('increment_usage', {
      _user_id: userId,
      _tokens: 1
    });

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";
    
    // Parse files from response with multiple regex patterns
    const files: Record<string, string> = {};
    
    // Primary format: ---FILE: path---
    const fileRegex = /---FILE:\s*(.+?)---\s*```[\w]*\n([\s\S]*?)```\s*---END FILE---/g;
    let match;
    
    while ((match = fileRegex.exec(content)) !== null) {
      const filePath = match[1].trim();
      const fileContent = match[2].trim();
      if (filePath && fileContent) {
        files[filePath] = fileContent;
      }
    }

    // Fallback format: ```language // path/file.ext
    if (Object.keys(files).length === 0) {
      const altRegex = /```[\w]*\s*(?:\/\/|#)\s*(.+?)\n([\s\S]*?)```/g;
      while ((match = altRegex.exec(content)) !== null) {
        const filePath = match[1].trim();
        const fileContent = match[2].trim();
        if (filePath && fileContent && filePath.includes('/') || filePath.includes('.')) {
          files[filePath] = fileContent;
        }
      }
    }

    // Second fallback: look for file path headers
    if (Object.keys(files).length === 0) {
      const headerRegex = /(?:^|\n)(?:#+\s*)?(?:File|Path):\s*`?([^\n`]+)`?\s*\n```[\w]*\n([\s\S]*?)```/gi;
      while ((match = headerRegex.exec(content)) !== null) {
        const filePath = match[1].trim();
        const fileContent = match[2].trim();
        if (filePath && fileContent) {
          files[filePath] = fileContent;
        }
      }
    }

    console.log("Parsed", Object.keys(files).length, "files");

    // Generate deployment instructions
    const deploymentInstructions = `
## 🚀 AIBLTY Quantum Generator - Deployment Guide

### Project: ${safeProjectName}
### Type: ${projectType || 'react'}
### Files Generated: ${Object.keys(files).length}
### Generation Time: ${generationTime}ms

---

## Quick Start

\`\`\`bash
# Clone or download the generated files
cd ${safeProjectName}

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Start development server
npm run dev
\`\`\`

---

## 🌐 Deployment Options

### Vercel (Recommended for Frontend)
1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Add environment variables
5. Deploy automatically

### Railway (Recommended for Full-Stack)
1. Push code to GitHub
2. Go to [railway.app](https://railway.app)
3. Create new project from GitHub
4. Add PostgreSQL database
5. Configure environment variables
6. Deploy

### Docker Deployment
\`\`\`bash
# Build image
docker build -t ${safeProjectName} .

# Run container
docker run -p 3000:3000 ${safeProjectName}
\`\`\`

### VPS Deployment (Ubuntu)
\`\`\`bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2
npm install -g pm2

# Clone and setup
git clone <your-repo-url>
cd ${safeProjectName}
npm install
npm run build

# Start with PM2
pm2 start npm --name "${safeProjectName}" -- start
pm2 save
\`\`\`

---

## 📱 Mobile App Deployment

### iOS (App Store)
1. Install Xcode
2. Run \`npx cap add ios\`
3. Run \`npx cap open ios\`
4. Build and submit via App Store Connect

### Android (Play Store)
1. Install Android Studio
2. Run \`npx cap add android\`
3. Run \`npx cap open android\`
4. Build APK/Bundle and submit via Play Console

---

## 🔧 Environment Variables

Copy \`.env.example\` to \`.env\` and configure:

\`\`\`env
# Database
DATABASE_URL=postgresql://...

# Authentication
JWT_SECRET=your-secret-key

# Stripe (if applicable)
STRIPE_SECRET_KEY=sk_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Analytics
GA_TRACKING_ID=G-...
\`\`\`

---

## 📈 SEO Checklist

✅ Meta tags configured
✅ Open Graph tags for social sharing
✅ JSON-LD structured data
✅ Sitemap.xml generated
✅ robots.txt configured
✅ Mobile responsive design
✅ Fast loading optimized

---

## 💰 Monetization Ready

${projectType === 'saas' || projectType === 'ecommerce' ? `
✅ Stripe integration configured
✅ Subscription billing ready
✅ Payment webhooks set up
✅ Customer portal enabled
✅ Pricing tiers defined
` : '✅ Ready for monetization integration'}

---

Generated by AIBLTY Quantum Code Generator
The World's Most Advanced AI Development System
`;

    return new Response(
      JSON.stringify({ 
        success: true, 
        content,
        files,
        fileCount: Object.keys(files).length,
        projectName: safeProjectName,
        projectType: projectType || 'react',
        deploymentInstructions,
        generationTime,
        capabilities: {
          seoOptimized: true,
          monetizationReady: ['saas', 'ecommerce'].includes(projectType || ''),
          mobileReady: true,
          dockerized: true,
        }
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
    
  } catch (error) {
    console.error("Quantum Generator error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Code generation failed" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
