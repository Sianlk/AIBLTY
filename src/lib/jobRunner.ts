import { supabase } from "@/integrations/supabase/client";
import { createJob, updateJob, createArtifact, logEvent, type Job } from "./database";
import { sendAIMessage, type AIMode } from "./aiService";

export type CapabilityType = 
  | 'app-generator'
  | 'intelligence-workspace'
  | 'business-builder'
  | 'research-engine'
  | 'revenue-suite'
  | 'automation-engine'
  | 'integration-hub'
  | 'ai-workforce'
  | 'quantum-engine'
  | 'security-layer'
  | 'evolution-layer'
  | 'global-network';

const CAPABILITY_TO_AI_MODE: Record<CapabilityType, AIMode> = {
  'app-generator': 'builder',
  'intelligence-workspace': 'solver',
  'business-builder': 'builder',
  'research-engine': 'research',
  'revenue-suite': 'revenue',
  'automation-engine': 'automation',
  'integration-hub': 'integrations',
  'ai-workforce': 'workforce',
  'quantum-engine': 'quantum',
  'security-layer': 'security',
  'evolution-layer': 'evolution',
  'global-network': 'network',
};

const CAPABILITY_PROMPTS: Record<CapabilityType, string> = {
  'app-generator': `You are generating a complete application blueprint. Output MUST include:

## Application Architecture
- System overview and tech stack recommendation

## Database Schema
- Tables, relationships, and data models

## API Endpoints
- RESTful endpoints with request/response formats

## Frontend Components
- Component hierarchy and key UI elements

## Deployment Guide
- Step-by-step deployment instructions

## Files to Create
List each file path with a brief description.

Generate a production-ready, comprehensive blueprint based on the user's request.`,

  'intelligence-workspace': `Analyze this problem comprehensively. Provide:

## Problem Analysis
- Core issue identification
- Root causes
- Impact assessment

## Solution Options
Rank by feasibility (High/Medium/Low):
1. **Solution A** - [Description, Pros, Cons, Effort]
2. **Solution B** - [Description, Pros, Cons, Effort]
3. **Solution C** - [Description, Pros, Cons, Effort]

## Recommended Approach
- Selected solution with justification
- Implementation steps
- Timeline estimate
- Risk mitigation

## Next Steps
Immediate actionable items.`,

  'business-builder': `Generate a comprehensive business plan:

## Executive Summary
- Business concept and value proposition

## Market Analysis
- Target market, size, competition

## Business Model
- Revenue streams, pricing strategy, cost structure

## Go-to-Market Strategy
- Launch plan, marketing channels, customer acquisition

## Financial Projections
- Revenue forecast, unit economics, break-even analysis

## Monetization Framework
- Pricing tiers, upsell paths, retention strategies

## Risk Assessment
- Key risks and mitigation strategies`,

  'research-engine': `Conduct deep research and provide:

## Research Summary
- Key findings overview

## Detailed Analysis
- In-depth exploration of the topic
- Data points and statistics (with sources)

## Expert Insights
- Industry perspectives and trends

## Practical Applications
- How to apply these findings

## Sources & References
- List of authoritative sources for verification

## Recommendations
- Evidence-based recommendations`,

  'revenue-suite': `Create a revenue optimization plan:

## Current State Analysis
- Revenue model assessment

## Pricing Strategy
- Optimal pricing tiers and positioning

## Conversion Optimization
- Funnel improvements and A/B test ideas

## Upsell/Cross-sell Opportunities
- Revenue expansion strategies

## Retention Mechanics
- Churn reduction tactics

## Revenue Projections
- 6-12 month forecast with assumptions`,

  'automation-engine': `Design an automation strategy:

## Process Analysis
- Current workflow mapping
- Bottleneck identification

## Automation Opportunities
- High-impact automation candidates

## Implementation Plan
- Tool recommendations
- Integration requirements
- Step-by-step setup

## ROI Projection
- Time saved, cost reduction estimates

## Monitoring & Maintenance
- Automation health checks`,

  'integration-hub': `Design integration architecture:

## Integration Requirements
- Systems to connect
- Data flows needed

## Technical Architecture
- API connections, webhooks, data sync

## Implementation Guide
- Setup steps for each integration

## Error Handling
- Failure modes and recovery

## Security Considerations
- Auth, encryption, data protection`,

  'ai-workforce': `Create an AI agent deployment plan:

## Agent Requirements
- Tasks to automate
- Required capabilities

## Agent Architecture
- Agent types and responsibilities
- Communication protocols

## Task Orchestration
- Workflow design
- Human-in-loop points

## Performance Metrics
- Success criteria
- Monitoring approach

## Safety Guardrails
- Limits and controls`,

  'quantum-engine': `Apply advanced computational analysis:

## Problem Formalization
- Mathematical representation

## Optimization Approach
- Algorithm selection and rationale

## Analysis Results
- Key findings and patterns

## Breakthrough Insights
- Non-obvious discoveries

## Implementation Path
- Practical application steps`,

  'security-layer': `Conduct security analysis:

## Threat Assessment
- Vulnerability identification
- Risk scoring

## Security Architecture
- Defense layers
- Access controls

## Compliance Review
- Regulatory requirements
- Gap analysis

## Remediation Plan
- Priority fixes
- Implementation timeline

## Audit Trail
- Logging and monitoring setup`,

  'evolution-layer': `Analyze patterns and suggest improvements:

## Pattern Analysis
- Usage patterns identified
- Performance trends

## Optimization Opportunities
- Configuration improvements
- Efficiency gains

## Learning Insights
- Adaptive recommendations

## Evolution Roadmap
- Short-term and long-term improvements`,

  'global-network': `Design distributed infrastructure:

## Requirements Analysis
- Performance needs
- Geographic coverage

## Architecture Design
- Node placement
- Redundancy strategy

## Scaling Plan
- Growth handling
- Load balancing

## Monitoring Setup
- Health checks
- Alerting

## Disaster Recovery
- Failover procedures`,
};

export interface JobProgress {
  job: Job;
  onProgress?: (progress: number, status: string) => void;
}

export async function runCapabilityJob(
  capability: CapabilityType,
  userPrompt: string,
  projectId?: string,
  onProgress?: (progress: number, status: string) => void
): Promise<{ job: Job; artifacts: Array<{ type: string; title: string; content: string }> }> {
  
  // Create job record
  const job = await createJob(capability, { prompt: userPrompt }, projectId);
  
  try {
    onProgress?.(10, 'Job created, starting AI analysis...');
    
    // Update job to running
    await updateJob(job.id, { 
      status: 'running', 
      started_at: new Date().toISOString(),
      progress: 10 
    });
    
    onProgress?.(20, 'Generating plan...');

    // Get the AI mode and system prompt
    const aiMode = CAPABILITY_TO_AI_MODE[capability];
    const systemContext = CAPABILITY_PROMPTS[capability];
    
    // Combine system context with user prompt
    const enhancedPrompt = `${systemContext}\n\n---\n\nUser Request:\n${userPrompt}`;
    
    onProgress?.(40, 'AI processing...');
    
    // Call AI
    const response = await sendAIMessage(
      [{ role: 'user', content: enhancedPrompt }],
      aiMode
    );
    
    if (!response.success) {
      throw new Error(response.error || 'AI processing failed');
    }
    
    onProgress?.(70, 'Generating artifacts...');
    
    // Create artifacts from response
    const artifacts: Array<{ type: string; title: string; content: string }> = [];
    
    // Main output artifact
    const mainArtifact = await createArtifact(
      'document',
      `${capability.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())} Output`,
      response.content,
      { capability, prompt: userPrompt },
      job.id,
      projectId
    );
    
    artifacts.push({
      type: mainArtifact.type,
      title: mainArtifact.title,
      content: response.content,
    });
    
    onProgress?.(90, 'Finalizing...');
    
    // Update job to completed
    await updateJob(job.id, {
      status: 'completed',
      finished_at: new Date().toISOString(),
      progress: 100,
      result: { artifactCount: artifacts.length },
    });
    
    logEvent('jobs', `Job completed: ${capability}`, 'info', { jobId: job.id });
    onProgress?.(100, 'Complete!');
    
    return { job: { ...job, status: 'completed', progress: 100 } as Job, artifacts };
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    await updateJob(job.id, {
      status: 'failed',
      finished_at: new Date().toISOString(),
      error: errorMessage,
    });
    
    logEvent('jobs', `Job failed: ${capability} - ${errorMessage}`, 'error', { jobId: job.id });
    
    throw error;
  }
}

// Poll job status for real-time updates
export async function pollJobStatus(
  jobId: string,
  onUpdate: (job: Job) => void,
  intervalMs = 1000
): Promise<() => void> {
  const interval = setInterval(async () => {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('id', jobId)
      .single();
    
    if (!error && data) {
      onUpdate(data as Job);
      
      if (data.status === 'completed' || data.status === 'failed') {
        clearInterval(interval);
      }
    }
  }, intervalMs);
  
  return () => clearInterval(interval);
}
