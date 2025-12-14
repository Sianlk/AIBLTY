import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Template generators for different project types
const PROJECT_TEMPLATES: Record<string, { files: Record<string, string>; instructions: string }> = {
  react: {
    files: {
      'package.json': `{
  "name": "{{PROJECT_NAME}}",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.37",
    "@types/react-dom": "^18.2.15",
    "@vitejs/plugin-react": "^4.2.0",
    "typescript": "^5.2.2",
    "vite": "^5.0.0"
  }
}`,
      'vite.config.ts': `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})`,
      'tsconfig.json': `{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}`,
      'index.html': `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{{PROJECT_NAME}}</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`,
    },
    instructions: `
## Deployment Options

### Option 1: Vercel (Recommended - Free)
1. Push code to GitHub
2. Import project at vercel.com/import
3. Deploy automatically

### Option 2: Netlify
1. Push code to GitHub
2. Connect at app.netlify.com
3. Build command: npm run build
4. Publish directory: dist

### Option 3: Docker
\`\`\`dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
\`\`\`

### Local Development
\`\`\`bash
npm install
npm run dev
\`\`\`
`
  },
  nextjs: {
    files: {
      'package.json': `{
  "name": "{{PROJECT_NAME}}",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "14.0.0",
    "react": "^18",
    "react-dom": "^18"
  },
  "devDependencies": {
    "typescript": "^5",
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18"
  }
}`,
      'next.config.js': `/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

module.exports = nextConfig`,
      'tsconfig.json': `{
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}`,
    },
    instructions: `
## Deployment Options

### Vercel (Recommended)
1. Push to GitHub
2. Import at vercel.com
3. Automatic deployment

### Docker
\`\`\`dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./
RUN npm install --production
EXPOSE 3000
CMD ["npm", "start"]
\`\`\`
`
  },
  express: {
    files: {
      'package.json': `{
  "name": "{{PROJECT_NAME}}-api",
  "version": "1.0.0",
  "main": "dist/index.js",
  "scripts": {
    "dev": "ts-node-dev --respawn src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1"
  },
  "devDependencies": {
    "@types/express": "^4.17.21",
    "@types/cors": "^2.8.17",
    "typescript": "^5.2.2",
    "ts-node-dev": "^2.0.0"
  }
}`,
      'tsconfig.json': `{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}`,
      'src/index.ts': `import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Add your routes here

app.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`);
});
`,
      'Dockerfile': `FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]`,
      'docker-compose.yml': `version: '3.8'
services:
  api:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    restart: unless-stopped`,
    },
    instructions: `
## Deployment

### Docker (Recommended)
\`\`\`bash
docker build -t {{PROJECT_NAME}}-api .
docker run -p 3000:3000 {{PROJECT_NAME}}-api
\`\`\`

### Railway/Render
1. Push to GitHub
2. Connect repository
3. Deploy automatically

### VPS
\`\`\`bash
npm install
npm run build
pm2 start dist/index.js --name {{PROJECT_NAME}}
\`\`\`
`
  },
};

const CODE_GENERATION_PROMPT = `You are AIBLTY Code Generator - the most advanced AI code generation system in the world.

Your task is to generate COMPLETE, PRODUCTION-READY code for applications.

CRITICAL REQUIREMENTS:
1. Generate REAL, WORKING code - not pseudocode or examples
2. Include ALL necessary files for a complete application
3. Code must be copy-paste ready and immediately runnable
4. Include proper error handling and best practices
5. Add comprehensive comments explaining the code
6. Generate complete database schemas if needed
7. Include deployment configurations

OUTPUT FORMAT:
You MUST output code in this EXACT format for EACH FILE:

---FILE: path/to/file.ext---
\`\`\`language
// Complete file contents here
\`\`\`
---END FILE---

IMPORTANT RULES:
- Use "---FILE: path---" to start each file (with the exact dashes)
- Use "---END FILE---" to end each file
- Include the complete, working code for each file
- Do NOT abbreviate or truncate code with "..." or "// rest of code"
- Every file must be complete and functional

TECH STACK RECOMMENDATIONS:
- Web Apps: React + Vite + TypeScript + Tailwind CSS
- APIs: Express/Node.js + TypeScript + Prisma
- Mobile: React Native or Capacitor
- Full-Stack: Next.js or React + Express
- Database: PostgreSQL with Prisma ORM
- Auth: Supabase Auth or JWT
- Payments: Stripe integration
- Hosting: Vercel, Railway, or Docker

Always include:
1. Package.json with all dependencies
2. Configuration files (tsconfig, vite.config, etc.)
3. Environment variable templates (.env.example)
4. Docker/deployment configurations
5. README with setup instructions

Generate production-quality code that surpasses human developers.`;

serve(async (req) => {
  console.log("Generate Code function called:", req.method);
  
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { prompt, projectType, projectName, stream } = body;
    
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
    const template = PROJECT_TEMPLATES[projectType || 'react'];
    
    const enhancedPrompt = `${CODE_GENERATION_PROMPT}

PROJECT NAME: ${safeProjectName}
PROJECT TYPE: ${projectType || 'react'}

USER REQUEST:
${prompt}

${template ? `
BASE TEMPLATE FILES (include these and add to them):
${Object.entries(template.files).map(([path, content]) => 
  `---FILE: ${path}---\n\`\`\`\n${content.replace(/\{\{PROJECT_NAME\}\}/g, safeProjectName)}\n\`\`\`\n---END FILE---`
).join('\n\n')}

DEPLOYMENT INSTRUCTIONS TO INCLUDE:
${template.instructions.replace(/\{\{PROJECT_NAME\}\}/g, safeProjectName)}
` : ''}

Generate the complete application with all files needed. Remember to use the exact ---FILE: path--- format.`;

    console.log("Generating code for:", safeProjectName, "Type:", projectType);
    
    const requestBody = {
      model: "google/gemini-2.5-flash",
      messages: [
        { role: "user", content: enhancedPrompt }
      ],
      stream: stream || false,
      max_tokens: 8192,
      temperature: 0.3, // Lower temperature for more consistent code
    };

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
          JSON.stringify({ error: "Rate limit exceeded" }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      throw new Error(`AI gateway error: ${response.status}`);
    }

    // Increment usage
    await supabaseAdmin.rpc('increment_usage', {
      _user_id: userId,
      _tokens: 1
    });

    if (stream) {
      return new Response(response.body, {
        headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
      });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";
    
    // Parse files from response
    const files: Record<string, string> = {};
    const fileRegex = /---FILE:\s*(.+?)---\s*```[\w]*\n([\s\S]*?)```\s*---END FILE---/g;
    let match;
    
    while ((match = fileRegex.exec(content)) !== null) {
      const filePath = match[1].trim();
      const fileContent = match[2].trim();
      files[filePath] = fileContent;
    }

    // If no files parsed, try alternative format
    if (Object.keys(files).length === 0) {
      const altRegex = /```[\w]*\s*\/\/\s*(.+?)\n([\s\S]*?)```/g;
      while ((match = altRegex.exec(content)) !== null) {
        const filePath = match[1].trim();
        const fileContent = match[2].trim();
        files[filePath] = fileContent;
      }
    }

    console.log("Generated", Object.keys(files).length, "files");
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        content,
        files,
        fileCount: Object.keys(files).length,
        projectName: safeProjectName,
        projectType: projectType || 'react',
        deploymentInstructions: template?.instructions?.replace(/\{\{PROJECT_NAME\}\}/g, safeProjectName) || ''
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
    
  } catch (error) {
    console.error("Generate Code error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Code generation failed" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
