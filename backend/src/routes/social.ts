import express, { Request, Response, NextFunction, Router } from 'express';
import { auth, checkPermission } from '../middleware/auth';
import { prisma } from '../server';
import { User, FacebookPage, InstagramAccount } from '@prisma/client';

const router: Router = express.Router();

interface AuthRequest extends Request {
  user?: User;
}

// Get all social accounts for the authenticated user
const getSocialAccounts = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const [facebookPages, instagramAccounts] = await Promise.all([
      prisma.facebookPage.findMany({
        where: { userId }
      }),
      prisma.instagramAccount.findMany({
        where: { userId }
      })
    ]);

    res.json({
      facebook: facebookPages,
      instagram: instagramAccounts
    });
  } catch (error) {
    next(error);
  }
};

// Add a new social account
const addSocialAccount = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const { platform, accountId, accountName, accessToken } = req.body;

    let account;
    if (platform === 'facebook') {
      account = await prisma.facebookPage.create({
        data: {
          name: accountName,
          accessToken,
          userId
        }
      });
    } else if (platform === 'instagram') {
      account = await prisma.instagramAccount.create({
        data: {
          username: accountName,
          accessToken,
          userId
        }
      });
    } else {
      res.status(400).json({ message: 'Unsupported platform' });
      return;
    }

    res.status(201).json(account);
  } catch (error) {
    next(error);
  }
};

// Update a social account
const updateSocialAccount = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const { id } = req.params;
    const { platform, ...updates } = req.body;

    let account;
    if (platform === 'facebook') {
      account = await prisma.facebookPage.update({
        where: {
          id,
          userId
        },
        data: updates
      });
    } else if (platform === 'instagram') {
      account = await prisma.instagramAccount.update({
        where: {
          id,
          userId
        },
        data: updates
      });
    } else {
      res.status(400).json({ message: 'Unsupported platform' });
      return;
    }

    if (!account) {
      res.status(404).json({ message: 'Account not found' });
      return;
    }

    res.json(account);
  } catch (error) {
    next(error);
  }
};

// Delete a social account
const deleteSocialAccount = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const { id } = req.params;
    const { platform } = req.query;

    let account;
    if (platform === 'facebook') {
      account = await prisma.facebookPage.delete({
        where: {
          id,
          userId
        }
      });
    } else if (platform === 'instagram') {
      account = await prisma.instagramAccount.delete({
        where: {
          id,
          userId
        }
      });
    } else {
      res.status(400).json({ message: 'Unsupported platform' });
      return;
    }

    if (!account) {
      res.status(404).json({ message: 'Account not found' });
      return;
    }

    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// Platform-specific routes
const getFacebookPages = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const pages = await prisma.facebookPage.findMany({
      where: { userId }
    });

    res.json(pages);
  } catch (error) {
    next(error);
  }
};

const getInstagramAccounts = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const accounts = await prisma.instagramAccount.findMany({
      where: { userId }
    });

    res.json(accounts);
  } catch (error) {
    next(error);
  }
};

// Register routes
router.get('/', auth, getSocialAccounts);
router.post('/', auth, addSocialAccount);
router.put('/:id', auth, updateSocialAccount);
router.delete('/:id', auth, deleteSocialAccount);

router.get('/facebook/pages', auth, checkPermission('facebook'), getFacebookPages);
router.get('/instagram/accounts', auth, checkPermission('instagram'), getInstagramAccounts);

export default router; 