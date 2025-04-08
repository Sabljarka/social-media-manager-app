import express from 'express';
import axios from 'axios';
import { socialService } from '../services/socialService';

const router = express.Router();

// Get Facebook page posts
router.get('/pages/:pageId/posts', async (req, res) => {
  try {
    const { pageId } = req.params;
    const page = await socialService.getFacebookPage(pageId);
    
    if (!page) {
      return res.status(404).json({ error: 'Facebook page not found' });
    }

    // Fetch posts from Facebook API
    const response = await axios.get(`https://graph.facebook.com/v18.0/${pageId}/posts`, {
      params: {
        access_token: page.accessToken,
        fields: 'id,message,created_time,attachments,comments{id,message,created_time,from}'
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error fetching Facebook posts:', error);
    res.status(500).json({ error: 'Failed to fetch Facebook posts' });
  }
});

// Get post comments
router.get('/posts/:postId/comments', async (req, res) => {
  try {
    const { postId } = req.params;
    const { pageId } = req.query;
    
    if (!pageId) {
      return res.status(400).json({ error: 'Facebook page ID is required' });
    }

    const page = await socialService.getFacebookPage(pageId as string);
    
    if (!page) {
      return res.status(404).json({ error: 'Facebook page not found' });
    }

    // Fetch comments from Facebook API
    const response = await axios.get(`https://graph.facebook.com/v18.0/${postId}/comments`, {
      params: {
        access_token: page.accessToken,
        fields: 'id,message,created_time,from,attachment'
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error fetching post comments:', error);
    res.status(500).json({ error: 'Failed to fetch post comments' });
  }
});

// Add comment to post
router.post('/posts/:postId/comments', async (req, res) => {
  try {
    const { postId } = req.params;
    const { pageId, message } = req.body;
    
    if (!pageId || !message) {
      return res.status(400).json({ error: 'Facebook page ID and message are required' });
    }

    const page = await socialService.getFacebookPage(pageId);
    
    if (!page) {
      return res.status(404).json({ error: 'Facebook page not found' });
    }

    // Post comment to Facebook
    const response = await axios.post(`https://graph.facebook.com/v18.0/${postId}/comments`, {
      message,
      access_token: page.accessToken
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ error: 'Failed to add comment' });
  }
});

// Hide comment
router.post('/comments/:commentId/hide', async (req, res) => {
  try {
    const { commentId } = req.params;
    const { pageId } = req.body;
    
    if (!pageId) {
      return res.status(400).json({ error: 'Facebook page ID is required' });
    }

    const page = await socialService.getFacebookPage(pageId);
    
    if (!page) {
      return res.status(404).json({ error: 'Facebook page not found' });
    }

    // Hide comment on Facebook
    const response = await axios.post(`https://graph.facebook.com/v18.0/${commentId}`, {
      is_hidden: true,
      access_token: page.accessToken
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error hiding comment:', error);
    res.status(500).json({ error: 'Failed to hide comment' });
  }
});

// Delete comment
router.delete('/comments/:commentId', async (req, res) => {
  try {
    const { commentId } = req.params;
    const { pageId } = req.query;
    
    if (!pageId) {
      return res.status(400).json({ error: 'Facebook page ID is required' });
    }

    const page = await socialService.getFacebookPage(pageId as string);
    
    if (!page) {
      return res.status(404).json({ error: 'Facebook page not found' });
    }

    // Delete comment from Facebook
    await axios.delete(`https://graph.facebook.com/v18.0/${commentId}`, {
      params: {
        access_token: page.accessToken
      }
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ error: 'Failed to delete comment' });
  }
});

export default router; 