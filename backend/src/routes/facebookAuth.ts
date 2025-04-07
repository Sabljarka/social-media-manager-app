import express from 'express';
import axios from 'axios';
import { User } from '../models/User';
import { socialService } from '../services/socialService';

const router = express.Router();

// Facebook OAuth callback
router.get('/callback', async (req, res) => {
  try {
    const { code } = req.query;
    
    if (!code) {
      return res.status(400).json({ error: 'Authorization code is required' });
    }

    // Exchange code for access token
    const tokenResponse = await axios.get('https://graph.facebook.com/v18.0/oauth/access_token', {
      params: {
        client_id: process.env.FACEBOOK_APP_ID,
        client_secret: process.env.FACEBOOK_APP_SECRET,
        redirect_uri: process.env.FACEBOOK_CALLBACK_URL,
        code: code
      }
    });

    const { access_token } = tokenResponse.data;

    // Get user info from Facebook
    const userResponse = await axios.get('https://graph.facebook.com/v18.0/me', {
      params: {
        access_token,
        fields: 'id,name,email'
      }
    });

    const { id, name, email } = userResponse.data;

    // Find or create user
    let user = await User.findOne({ email });
    if (!user) {
      user = new User({
        email,
        username: name,
        password: '', // We'll set a random password for OAuth users
        role: 'user'
      });
      await user.save();
    }

    // Save Facebook account
    await socialService.saveFacebookPage({
      userId: user._id,
      name: name,
      accessToken: access_token
    });

    // Redirect to frontend with success message
    res.redirect(`${process.env.FRONTEND_URL}/facebook?success=true`);
  } catch (error) {
    console.error('Facebook callback error:', error);
    res.redirect(`${process.env.FRONTEND_URL}/facebook?error=true`);
  }
});

export default router; 