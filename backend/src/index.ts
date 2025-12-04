import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { logger } from './utils/logger';
import { errorHandler } from './middleware/errorHandler';
import { prisma } from './config/db';

// Route imports
import authRoutes from './modules/auth/auth.routes';
import usersRoutes from './modules/users/users.routes';
import projectsRoutes from './modules/projects/projects.routes';
import sessionsRoutes from './modules/sessions/sessions.routes';
import messagesRoutes from './modules/messages/messages.routes';
import billingRoutes from './modules/billing/billing.routes';
import filesRoutes from './modules/files/files.routes';
import adminRoutes from './modules/admin/admin.routes';
import deployRoutes from './modules/deploy/deploy.routes';
import aiRoutes from './modules/ai/ai.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:5173', 'http://localhost:8080'],
  credentials: true,
}));

// Raw body for Stripe webhooks
app.use('/api/billing/stripe/webhook', express.raw({ type: 'application/json' }));

// JSON body parser for everything else
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/sessions', sessionsRoutes);
app.use('/api/messages', messagesRoutes);
app.use('/api/billing', billingRoutes);
app.use('/api/files', filesRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/deploy', deployRoutes);
app.use('/api/ai', aiRoutes);

// Error handler
app.use(errorHandler);

// Start server
async function start() {
  try {
    await prisma.$connect();
    logger.info('✅ Database connected');
    
    app.listen(PORT, () => {
      logger.info(`🚀 AIBLTY Backend running on port ${PORT}`);
    });
  } catch (error) {
    logger.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

start();

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down...');
  await prisma.$disconnect();
  process.exit(0);
});
