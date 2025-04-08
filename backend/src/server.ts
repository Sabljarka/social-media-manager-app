import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

// Import routes
import authRoutes from './routes/auth';
import facebookAuthRoutes from './routes/facebookAuth';
import socialRoutes from './routes/social';
import userRoutes from './routes/users';
import facebookRoutes from './routes/facebook';
import { errorHandler } from './middleware/errorHandler';

// Load environment variables
dotenv.config();

const app = express();
export const prisma = new PrismaClient();

// Middleware
app.use(cors());
app.use(express.json());

// Test database connection
prisma.$connect()
  .then(() => {
    console.log('Connected to PostgreSQL database');
  })
  .catch((error) => {
    console.error('Database connection error:', error);
  });

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/facebook', facebookAuthRoutes);
app.use('/api/facebook', facebookRoutes);
app.use('/api/social', socialRoutes);
app.use('/api/users', userRoutes);

// Error handling middleware
app.use(errorHandler);

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received. Closing HTTP server and database connection...');
  await prisma.$disconnect();
  process.exit(0);
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 