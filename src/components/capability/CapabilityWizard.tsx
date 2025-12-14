import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { MarkdownRenderer } from '@/components/ui/markdown-renderer';
import { streamAIMessage, type AIMode } from '@/lib/aiService';
import { createJob, updateJob, createArtifact, logEvent, type Job } from '@/lib/database';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, ArrowRight, Loader2, CheckCircle2, XCircle, 
  Copy, Download, Sparkles, Wand2, FileText, AlertCircle,
  History, Play, Square
} from 'lucide-react';

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

interface CapabilityWizardProps {
  capability: CapabilityType;
  title: string;
  description: string;
  placeholder?: string;
  icon?: React.ReactNode;
  projectId?: string;
}

type WizardStep = 'input' | 'processing' | 'results';

interface ArtifactResult {
  type: string;
  title: string;
  content: string;
}

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
  'app-generator': `Generate a complete, production-ready application specification. Include:

## Application Overview
Concept, purpose, and target users.

## Technology Stack
Recommended frontend, backend, database, and deployment technologies.

## Database Schema
Complete table definitions with columns, types, and relationships.

## API Design
All endpoints with methods, paths, request/response formats.

## Frontend Architecture
Component structure, pages, and navigation flow.

## Core Features
Detailed feature specifications with user stories.

## Implementation Roadmap
Phase-by-phase development plan with milestones.

## Deployment Configuration
Infrastructure setup and environment requirements.

Be extremely detailed and specific. This should be directly implementable.`,

  'intelligence-workspace': `Analyze this problem with maximum depth and precision. Provide:

## Problem Definition
Clear articulation of the core challenge.

## Root Cause Analysis
Underlying factors contributing to the problem.

## Impact Assessment
Business, technical, and operational implications.

## Solution Options
Multiple approaches ranked by feasibility:
- Solution A: [approach, pros, cons, effort estimate]
- Solution B: [approach, pros, cons, effort estimate]
- Solution C: [approach, pros, cons, effort estimate]

## Recommended Strategy
Selected approach with detailed justification.

## Implementation Plan
Step-by-step execution guide with timelines.

## Risk Mitigation
Potential issues and prevention strategies.

## Success Metrics
How to measure solution effectiveness.`,

  'business-builder': `Create a comprehensive business plan:

## Executive Summary
Business concept and unique value proposition.

## Market Analysis
Target market size, demographics, and trends.

## Competitive Landscape
Key competitors and differentiation strategy.

## Business Model
Revenue streams, pricing strategy, and cost structure.

## Go-to-Market Strategy
Launch plan, marketing channels, and customer acquisition.

## Financial Projections
12-month revenue forecast with key assumptions.

## Monetization Framework
Pricing tiers, upsell paths, and retention strategies.

## Risk Assessment
Business risks and mitigation strategies.

## Key Milestones
Critical success factors and timeline.`,

  'research-engine': `Conduct comprehensive research and analysis:

## Research Overview
Topic scope and key questions addressed.

## Methodology
Research approach and sources consulted.

## Key Findings
Primary discoveries and insights with supporting evidence.

## Data Analysis
Relevant statistics, trends, and patterns.

## Expert Perspectives
Industry viewpoints and thought leadership insights.

## Practical Applications
How to apply these findings in real scenarios.

## Recommendations
Evidence-based action items.

## Further Research
Areas requiring additional investigation.

## Sources
Authoritative references for verification.`,

  'revenue-suite': `Design a complete revenue optimization strategy:

## Current State Analysis
Revenue model assessment and performance baseline.

## Market Positioning
Competitive pricing analysis and positioning strategy.

## Pricing Strategy
Optimal pricing tiers with psychological pricing techniques.

## Conversion Optimization
Funnel improvements and conversion rate tactics.

## Upsell and Cross-sell
Revenue expansion opportunities and implementation.

## Customer Retention
Churn reduction strategies and loyalty programs.

## Revenue Projections
6-12 month forecast with growth scenarios.

## Implementation Roadmap
Priority actions and timeline.`,

  'automation-engine': `Design a comprehensive automation strategy:

## Process Mapping
Current workflow documentation and pain points.

## Automation Opportunities
High-impact automation candidates ranked by ROI.

## Technology Stack
Recommended tools and platforms for automation.

## Implementation Architecture
Technical design for automated systems.

## Integration Requirements
Systems to connect and data flows.

## Step-by-Step Setup
Detailed implementation guide for each automation.

## ROI Analysis
Time saved, cost reduction, and efficiency gains.

## Monitoring Strategy
Performance tracking and maintenance requirements.`,

  'integration-hub': `Design a complete integration architecture:

## Requirements Analysis
Systems to connect and data synchronization needs.

## Architecture Design
Integration patterns and data flow diagrams.

## API Specifications
Endpoints, authentication, and payload formats.

## Implementation Guide
Step-by-step setup for each integration.

## Error Handling
Failure modes, retry logic, and recovery procedures.

## Security Framework
Authentication, encryption, and access control.

## Testing Strategy
Validation approach and test scenarios.

## Monitoring Setup
Health checks and alerting configuration.`,

  'ai-workforce': `Design an AI agent deployment strategy:

## Workforce Requirements
Tasks to automate and capability needs.

## Agent Architecture
Agent types, responsibilities, and communication.

## Task Orchestration
Workflow design and task routing logic.

## Human-in-the-Loop
Approval points and escalation procedures.

## Performance Metrics
Success criteria and KPI tracking.

## Safety Controls
Guardrails, limits, and fallback procedures.

## Training Requirements
Agent configuration and learning approach.

## Deployment Plan
Rollout strategy and scaling considerations.`,

  'quantum-engine': `Apply advanced computational analysis:

## Problem Formalization
Mathematical representation and constraints.

## Algorithm Selection
Optimization approach with theoretical basis.

## Analysis Methodology
Computational techniques applied.

## Results and Findings
Key patterns and optimization outcomes.

## Breakthrough Insights
Non-obvious discoveries and implications.

## Validation
Verification of results and confidence levels.

## Implementation Path
Practical application of findings.

## Future Optimization
Areas for continued analysis.`,

  'security-layer': `Conduct comprehensive security analysis:

## Threat Assessment
Vulnerability identification and risk scoring.

## Attack Surface Analysis
Potential entry points and exposure areas.

## Security Architecture
Defense layers and protection mechanisms.

## Access Control
Authentication and authorization design.

## Compliance Review
Regulatory requirements and gap analysis.

## Remediation Plan
Priority fixes with implementation timeline.

## Monitoring Strategy
Logging, alerting, and incident response.

## Audit Trail
Evidence collection and forensic capabilities.`,

  'evolution-layer': `Analyze patterns and recommend improvements:

## Pattern Analysis
Usage patterns and behavioral trends identified.

## Performance Assessment
Efficiency metrics and optimization opportunities.

## Anomaly Detection
Unusual patterns and their implications.

## Improvement Recommendations
Configuration optimizations and enhancements.

## Learning Insights
Adaptive recommendations based on data.

## Evolution Roadmap
Short-term and long-term improvement plan.

## Implementation Priority
Actions ranked by impact and effort.`,

  'global-network': `Design distributed infrastructure:

## Requirements Analysis
Performance needs and geographic coverage.

## Architecture Design
Node placement and network topology.

## Redundancy Strategy
High availability and failover design.

## Load Balancing
Traffic distribution and scaling approach.

## CDN Configuration
Content delivery optimization.

## Monitoring Setup
Health checks and performance tracking.

## Disaster Recovery
Backup procedures and recovery objectives.

## Cost Optimization
Efficient resource utilization.`,
};

const STATUS_MESSAGES = [
  'Initializing AI engine...',
  'Analyzing your request...',
  'Processing with advanced algorithms...',
  'Generating comprehensive output...',
  'Structuring results...',
  'Applying quality checks...',
  'Finalizing your deliverable...',
];

export function CapabilityWizard({
  capability,
  title,
  description,
  placeholder = 'Describe what you want to create or solve in detail...',
  icon,
  projectId,
}: CapabilityWizardProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [step, setStep] = useState<WizardStep>('input');
  const [prompt, setPrompt] = useState('');
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');
  const [streamedContent, setStreamedContent] = useState('');
  const [artifacts, setArtifacts] = useState<ArtifactResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const statusIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-scroll during streaming
  useEffect(() => {
    if (contentRef.current && isStreaming) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight;
    }
  }, [streamedContent, isStreaming]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (statusIntervalRef.current) {
        clearInterval(statusIntervalRef.current);
      }
    };
  }, []);

  const handleRun = async () => {
    if (!user) {
      toast({
        title: 'Sign in required',
        description: 'Please sign in to use this capability',
        variant: 'destructive',
      });
      return;
    }

    if (!prompt.trim()) {
      toast({
        title: 'Input required',
        description: 'Please describe what you want to create',
        variant: 'destructive',
      });
      return;
    }

    setStep('processing');
    setProgress(0);
    setError(null);
    setStreamedContent('');
    setIsStreaming(true);

    // Create job record
    let job: Job | null = null;
    try {
      job = await createJob(capability, { prompt }, projectId);
      await updateJob(job.id, { status: 'running', started_at: new Date().toISOString() });
    } catch (err) {
      console.error('Failed to create job:', err);
    }

    // Rotating status messages
    let statusIndex = 0;
    setStatusMessage(STATUS_MESSAGES[0]);
    statusIntervalRef.current = setInterval(() => {
      statusIndex = (statusIndex + 1) % STATUS_MESSAGES.length;
      setStatusMessage(STATUS_MESSAGES[statusIndex]);
      setProgress(prev => Math.min(prev + 5, 90));
    }, 3000);

    try {
      const aiMode = CAPABILITY_TO_AI_MODE[capability];
      const systemContext = CAPABILITY_PROMPTS[capability];
      const enhancedPrompt = `${systemContext}\n\n---\n\nUser Request:\n${prompt}`;

      let fullContent = '';

      await streamAIMessage(
        [{ role: 'user', content: enhancedPrompt }],
        aiMode,
        (delta) => {
          fullContent += delta;
          setStreamedContent(fullContent);
        },
        async () => {
          // Stream complete
          if (statusIntervalRef.current) {
            clearInterval(statusIntervalRef.current);
          }
          
          setIsStreaming(false);
          setProgress(100);
          setStatusMessage('Complete!');

          // Create artifact
          const artifactTitle = `${title} Output`;
          if (job) {
            try {
              await createArtifact(
                'document',
                artifactTitle,
                fullContent,
                { capability, prompt },
                job.id,
                projectId
              );
              await updateJob(job.id, {
                status: 'completed',
                finished_at: new Date().toISOString(),
                progress: 100,
                result: { artifactCount: 1 },
              });
              logEvent('jobs', `Job completed: ${capability}`, 'info', { jobId: job.id });
            } catch (err) {
              console.error('Failed to save artifact:', err);
            }
          }

          setArtifacts([{
            type: 'document',
            title: artifactTitle,
            content: fullContent,
          }]);

          setTimeout(() => {
            setStep('results');
            toast({
              title: 'Success!',
              description: 'Your output has been generated and saved',
            });
          }, 500);
        },
        async (errorMessage) => {
          if (statusIntervalRef.current) {
            clearInterval(statusIntervalRef.current);
          }
          setIsStreaming(false);
          setError(errorMessage);
          setStep('results');

          if (job) {
            await updateJob(job.id, {
              status: 'failed',
              finished_at: new Date().toISOString(),
              error: errorMessage,
            });
          }

          toast({
            title: 'Error',
            description: errorMessage,
            variant: 'destructive',
          });
        }
      );
    } catch (err) {
      if (statusIntervalRef.current) {
        clearInterval(statusIntervalRef.current);
      }
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      setStep('results');
      setIsStreaming(false);

      if (job) {
        await updateJob(job.id, {
          status: 'failed',
          finished_at: new Date().toISOString(),
          error: errorMessage,
        });
      }

      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    toast({ title: 'Copied to clipboard' });
  };

  const handleDownload = (content: string, filename: string, ext: string = 'md') => {
    const mimeTypes: Record<string, string> = {
      md: 'text/markdown',
      txt: 'text/plain',
      json: 'application/json',
      html: 'text/html',
    };
    const blob = new Blob([content], { type: mimeTypes[ext] || 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: `Downloaded as ${filename}.${ext}` });
  };

  const handleReset = () => {
    setStep('input');
    setPrompt('');
    setProgress(0);
    setStatusMessage('');
    setStreamedContent('');
    setArtifacts([]);
    setError(null);
    setIsStreaming(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-panel p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            {icon && (
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                {icon}
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold">{title}</h1>
              <p className="text-muted-foreground">{description}</p>
            </div>
          </div>
          <Link to="/dashboard/history">
            <Button variant="outline" size="sm">
              <History className="w-4 h-4 mr-2" />
              View History
            </Button>
          </Link>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-2 text-sm">
          <span className={`px-3 py-1 rounded-full ${step === 'input' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
            1. Describe
          </span>
          <ArrowRight className="w-4 h-4 text-muted-foreground" />
          <span className={`px-3 py-1 rounded-full ${step === 'processing' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
            2. Generate
          </span>
          <ArrowRight className="w-4 h-4 text-muted-foreground" />
          <span className={`px-3 py-1 rounded-full ${step === 'results' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
            3. Results
          </span>
        </div>
      </div>

      {/* Auth check */}
      {!user && (
        <div className="glass-panel p-6 text-center">
          <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Sign in Required</h3>
          <p className="text-muted-foreground mb-4">
            Please sign in to use AIBLTY capabilities
          </p>
          <Link to="/auth">
            <Button variant="glow">Sign In</Button>
          </Link>
        </div>
      )}

      {/* Step Content */}
      {user && (
        <AnimatePresence mode="wait">
          {step === 'input' && (
            <motion.div
              key="input"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="glass-panel p-6 space-y-4"
            >
              <div className="flex items-center gap-2 mb-4">
                <Wand2 className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold">Describe Your Request</h2>
              </div>
              
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={placeholder}
                rows={8}
                className="resize-none text-base"
              />
              
              <p className="text-xs text-muted-foreground">
                Be specific and detailed for best results. Include context, requirements, and desired outcomes.
              </p>
              
              <div className="flex justify-end">
                <Button
                  variant="glow"
                  size="lg"
                  onClick={handleRun}
                  disabled={!prompt.trim()}
                >
                  <Play className="w-4 h-4 mr-2" />
                  Generate
                </Button>
              </div>
            </motion.div>
          )}

          {step === 'processing' && (
            <motion.div
              key="processing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              {/* Progress header */}
              <div className="glass-panel p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Loader2 className="w-6 h-6 text-primary animate-spin" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Generating...</h3>
                      <p className="text-sm text-muted-foreground">{statusMessage}</p>
                    </div>
                  </div>
                  <span className="text-sm text-muted-foreground">{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>

              {/* Live streaming output */}
              {streamedContent && (
                <div className="glass-panel overflow-hidden">
                  <div className="flex items-center justify-between p-3 border-b border-border/50 bg-muted/20">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      <span className="text-sm font-medium">Live Output</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {streamedContent.length} characters
                    </span>
                  </div>
                  <div 
                    ref={contentRef}
                    className="p-6 max-h-[500px] overflow-y-auto"
                  >
                    <MarkdownRenderer content={streamedContent} />
                    {isStreaming && (
                      <span className="inline-block w-2 h-4 bg-primary animate-pulse ml-1" />
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {step === 'results' && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              {error ? (
                <div className="glass-panel p-6 border-destructive/50">
                  <div className="flex items-center gap-3 mb-4">
                    <XCircle className="w-6 h-6 text-destructive" />
                    <h3 className="text-lg font-semibold">Error</h3>
                  </div>
                  <p className="text-muted-foreground mb-4">{error}</p>
                  <Button onClick={handleReset} variant="outline">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Try Again
                  </Button>
                </div>
              ) : (
                <>
                  <div className="glass-panel p-4 border-primary/30">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="w-6 h-6 text-green-500" />
                        <div>
                          <span className="font-medium">Generation Complete</span>
                          <p className="text-sm text-muted-foreground">
                            {artifacts.length} deliverable{artifacts.length !== 1 ? 's' : ''} ready
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Link to="/dashboard/history">
                          <Button variant="outline" size="sm">
                            <History className="w-4 h-4 mr-2" />
                            History
                          </Button>
                        </Link>
                        <Button onClick={handleReset} variant="outline" size="sm">
                          <Sparkles className="w-4 h-4 mr-2" />
                          New Request
                        </Button>
                      </div>
                    </div>
                  </div>

                  {artifacts.map((artifact, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="glass-panel overflow-hidden"
                    >
                      <div className="flex items-center justify-between p-4 border-b border-border/50 bg-muted/20">
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-primary" />
                          <div>
                            <h3 className="font-semibold">{artifact.title}</h3>
                            <p className="text-xs text-muted-foreground">
                              {artifact.content.length.toLocaleString()} characters
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCopy(artifact.content)}
                          >
                            <Copy className="w-4 h-4 mr-1" />
                            Copy
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDownload(
                              artifact.content,
                              artifact.title.toLowerCase().replace(/\s+/g, '-'),
                              'md'
                            )}
                          >
                            <Download className="w-4 h-4 mr-1" />
                            Markdown
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDownload(
                              artifact.content,
                              artifact.title.toLowerCase().replace(/\s+/g, '-'),
                              'txt'
                            )}
                          >
                            <Download className="w-4 h-4 mr-1" />
                            Text
                          </Button>
                        </div>
                      </div>
                      <div className="p-6 max-h-[600px] overflow-y-auto">
                        <MarkdownRenderer content={artifact.content} />
                      </div>
                    </motion.div>
                  ))}
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}
