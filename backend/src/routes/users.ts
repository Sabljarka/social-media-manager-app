import express, { Request, Response, NextFunction, Router } from 'express';
import { auth } from '../middleware/auth';
import { PrismaClient } from '@prisma/client';

const router: Router = express.Router();
const prisma = new PrismaClient();

interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    username: string;
    role: string;
  };
}

// Get user profile
const getUserProfile = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user?.id },
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
      }
    });

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
};

// Update user profile
const updateUserProfile = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { username, email } = req.body;
    const user = await prisma.user.update({
      where: { id: req.user?.id },
      data: { username, email },
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
      }
    });

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
};

// Register routes
router.get('/profile', auth, getUserProfile);
router.put('/profile', auth, updateUserProfile);

// User data deletion callback
router.post('/data-deletion', async (req: Request, res: Response) => {
  try {
    const { signed_request } = req.body;
    
    // Verify the signed request
    // Note: In production, you should properly verify the signed request
    // using your app secret
    
    // For development, we'll just acknowledge the request
    res.json({
      url: `${process.env.FRONTEND_URL}/privacy-policy`,
      confirmation_code: '1234567890'
    });
  } catch (error) {
    console.error('Error handling data deletion request:', error);
    res.status(500).json({ message: 'Error processing data deletion request' });
  }
});

export default router; 