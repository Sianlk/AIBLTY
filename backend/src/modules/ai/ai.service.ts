import OpenAI from 'openai';
import { prisma } from '../../config/db';
import { env } from '../../config/env';
import { AppError } from '../../middleware/errorHandler';
import { logger } from '../../utils/logger';

const openai = env.OPENAI_API_KEY ? new OpenAI({ apiKey: env.OPENAI_API_KEY }) : null;

// System prompts are kept server-side and never exposed to frontend
const SYSTEM_PROMPTS = {
  problemSolver: `You are an expert problem-solving AI assistant. Analyze problems systematically and provide actionable solutions. Break down complex issues into manageable steps. Be concise but thorough.`,
  
  businessBuilder: `You are a business strategy AI assistant. Help users develop business ideas, create plans, identify market opportunities, and build sustainable business models. Provide practical, actionable advice.`,
  
  automation: `You are an automation workflow AI assistant. Help users design and optimize automated processes. Identify repetitive tasks that can be automated and suggest implementation approaches.`,
  
  general: `You are a helpful AI assistant. Provide clear, accurate, and useful responses to user queries.`,
};

async function createCompletion(
  userId: string,
  sessionId: string,
  userMessage: string,
  systemPromptKey: keyof typeof SYSTEM_PROMPTS = 'general'
) {
  if (!openai) {
    throw new AppError('AI service not configured', 503);
  }
  
  // Get previous messages for context
  const previousMessages = await prisma.message.findMany({
    where: { sessionId },
    orderBy: { createdAt: 'asc' },
    take: 20, // Limit context window
  });
  
  const messages: OpenAI.ChatCompletionMessageParam[] = [
    { role: 'system', content: SYSTEM_PROMPTS[systemPromptKey] },
    ...previousMessages.map(m => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    })),
    { role: 'user', content: userMessage },
  ];
  
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
      max_tokens: 2000,
      temperature: 0.7,
    });
    
    const assistantMessage = completion.choices[0]?.message?.content || 'No response generated.';
    
    // Save messages to database
    await prisma.message.createMany({
      data: [
        { sessionId, role: 'user', content: userMessage },
        { sessionId, role: 'assistant', content: assistantMessage },
      ],
    });
    
    // Return only the safe, user-facing response
    return {
      message: assistantMessage,
      usage: {
        promptTokens: completion.usage?.prompt_tokens,
        completionTokens: completion.usage?.completion_tokens,
      },
    };
  } catch (error: any) {
    logger.error('AI completion error:', error);
    throw new AppError('AI service error: ' + (error.message || 'Unknown error'), 500);
  }
}

export async function solveProblem(userId: string, projectId: string, prompt: string) {
  // Create or get session for this project
  let session = await prisma.session.findFirst({
    where: { projectId, type: 'solver' },
    orderBy: { createdAt: 'desc' },
  });
  
  if (!session) {
    session = await prisma.session.create({
      data: { projectId, type: 'solver', title: 'Problem Solving Session' },
    });
  }
  
  return createCompletion(userId, session.id, prompt, 'problemSolver');
}

export async function buildBusiness(userId: string, projectId: string, prompt: string) {
  let session = await prisma.session.findFirst({
    where: { projectId, type: 'builder' },
    orderBy: { createdAt: 'desc' },
  });
  
  if (!session) {
    session = await prisma.session.create({
      data: { projectId, type: 'builder', title: 'Business Building Session' },
    });
  }
  
  return createCompletion(userId, session.id, prompt, 'businessBuilder');
}

export async function runAutomation(userId: string, projectId: string, prompt: string) {
  let session = await prisma.session.findFirst({
    where: { projectId, type: 'automation' },
    orderBy: { createdAt: 'desc' },
  });
  
  if (!session) {
    session = await prisma.session.create({
      data: { projectId, type: 'automation', title: 'Automation Session' },
    });
  }
  
  return createCompletion(userId, session.id, prompt, 'automation');
}

export async function chat(userId: string, sessionId: string, prompt: string) {
  // Verify session belongs to user's project
  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    include: { project: { select: { userId: true } } },
  });
  
  if (!session || session.project.userId !== userId) {
    throw new AppError('Session not found', 404);
  }
  
  return createCompletion(userId, sessionId, prompt, 'general');
}
