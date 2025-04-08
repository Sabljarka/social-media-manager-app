import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import authRoutes from './routes/auth';
import socialRoutes from './routes/social';

// Import routes
import facebookAuthRoutes from './routes/facebookAuth';
import userRoutes from './routes/users';
import facebookRoutes from './routes/facebook';
import { errorHandler } from './middleware/errorHandler';

// Load environment variables
dotenv.config();

const app = express();
const prisma = new PrismaClient();

// Middleware
app.use(cors());
app.use(express.json());

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
const PORT = process.env.PORT || 3003;

async function startServer() {
  try {
    await prisma.$connect();
    console.log('Connected to PostgreSQL database');
    
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer(); 