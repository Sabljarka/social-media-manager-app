import { Request, Response } from 'express';
import { socialService } from '../services/socialService';
import { tokenService } from '../services/tokenService';

export const socialController = {
  // Facebook endpoints
  async getFacebookPages(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const pages = await socialService.getFacebookPages(userId);
      res.json(pages);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch Facebook pages' });
    }
  },

  async addFacebookPage(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const { name, accessToken } = req.body;

      // Validate and refresh token
      const validToken = await tokenService.validateAndRefreshToken(userId, 'facebook', accessToken);
      if (!validToken) {
        return res.status(400).json({ error: 'Invalid access token' });
      }

      const page = await socialService.saveFacebookPage({
        name,
        accessToken: validToken,
        userId,
      });

      res.json(page);
    } catch (error) {
      res.status(500).json({ error: 'Failed to add Facebook page' });
    }
  },

  // Instagram endpoints
  async getInstagramAccounts(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const accounts = await socialService.getInstagramAccounts(userId);
      res.json(accounts);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch Instagram accounts' });
    }
  },

  async addInstagramAccount(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const { username, accessToken } = req.body;

      // Validate and refresh token
      const validToken = await tokenService.validateAndRefreshToken(userId, 'instagram', accessToken);
      if (!validToken) {
        return res.status(400).json({ error: 'Invalid access token' });
      }

      const account = await socialService.saveInstagramAccount({
        username,
        accessToken: validToken,
        userId,
      });

      res.json(account);
    } catch (error) {
      res.status(500).json({ error: 'Failed to add Instagram account' });
    }
  },

  // Post endpoints
  async createPost(req: Request, res: Response) {
    try {
      const { pageId } = req.params;
      const { content, mediaUrl, platform } = req.body;

      const post = await socialService.savePost({
        content,
        mediaUrl,
        pageId,
        platform,
      });

      res.json(post);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create post' });
    }
  },

  async getPosts(req: Request, res: Response) {
    try {
      const { pageId } = req.params;
      const posts = await socialService.getPosts(pageId);
      res.json(posts);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch posts' });
    }
  },

  // Comment endpoints
  async createComment(req: Request, res: Response) {
    try {
      const { postId } = req.params;
      const { author, content, parentId } = req.body;

      const comment = await socialService.saveComment({
        postId,
        author,
        content,
        parentId,
      });

      // Emit notification for new comment
      req.app.get('io').emit('newComment', {
        postId,
        comment,
      });

      res.json(comment);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create comment' });
    }
  },

  async getComments(req: Request, res: Response) {
    try {
      const { postId } = req.params;
      const comments = await socialService.getComments(postId);
      res.json(comments);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch comments' });
    }
  },

  // Notification endpoints
  async getNotifications(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      // Implement notification fetching logic
      res.json([]);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch notifications' });
    }
  },

  async markNotificationAsRead(req: Request, res: Response) {
    try {
      const { notificationId } = req.params;
      // Implement notification marking logic
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Failed to mark notification as read' });
    }
  },
}; 