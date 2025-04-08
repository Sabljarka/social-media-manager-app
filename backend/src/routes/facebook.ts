import express, { Request, Response } from 'express';
import axios from 'axios';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// ... existing code ...

// Get direct messages
router.get('/messages', async (req: Request, res: Response) => {
  try {
    const { pageId } = req.query;
    const page = await prisma.facebookPage.findUnique({
      where: { id: pageId as string },
    });

    if (!page) {
      return res.status(404).json({ message: 'Page not found' });
    }

    const response = await axios.get(`https://graph.facebook.com/v18.0/${pageId}/conversations`, {
      params: {
        access_token: page.accessToken,
        fields: 'id,senders,messages{id,message,created_time,from}',
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: 'Error fetching messages' });
  }
});

// Send direct message
router.post('/messages', async (req: Request, res: Response) => {
  try {
    const { pageId, recipientId, message } = req.body;
    const page = await prisma.facebookPage.findUnique({
      where: { id: pageId },
    });

    if (!page) {
      return res.status(404).json({ message: 'Page not found' });
    }

    const response = await axios.post(
      `https://graph.facebook.com/v18.0/${pageId}/messages`,
      {
        recipient: { id: recipientId },
        message: { text: message },
      },
      {
        params: {
          access_token: page.accessToken,
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ message: 'Error sending message' });
  }
});

export default router; 