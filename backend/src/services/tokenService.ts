import axios from 'axios';
import { socialService } from './socialService';

const FACEBOOK_API_URL = 'https://graph.facebook.com/v18.0';
const INSTAGRAM_API_URL = 'https://graph.facebook.com/v18.0';

export const tokenService = {
  async refreshFacebookToken(userId: string, currentToken: string): Promise<string | null> {
    try {
      // Check if we have a valid refresh token
      const existingRefresh = await socialService.getTokenRefresh(userId, 'facebook');
      if (existingRefresh) {
        return existingRefresh.token;
      }

      // Get new token from Facebook
      const response = await axios.get(`${FACEBOOK_API_URL}/oauth/access_token`, {
        params: {
          grant_type: 'fb_exchange_token',
          client_id: process.env.FACEBOOK_APP_ID,
          client_secret: process.env.FACEBOOK_APP_SECRET,
          fb_exchange_token: currentToken,
        },
      });

      const { access_token, expires_in } = response.data;

      // Save the new token
      await socialService.saveTokenRefresh(
        userId,
        'facebook',
        access_token,
        new Date(Date.now() + expires_in * 1000)
      );

      return access_token;
    } catch (error) {
      console.error('Error refreshing Facebook token:', error);
      return null;
    }
  },

  async refreshInstagramToken(userId: string, currentToken: string): Promise<string | null> {
    try {
      // Check if we have a valid refresh token
      const existingRefresh = await socialService.getTokenRefresh(userId, 'instagram');
      if (existingRefresh) {
        return existingRefresh.token;
      }

      // Get new token from Instagram
      const response = await axios.get(`${INSTAGRAM_API_URL}/oauth/access_token`, {
        params: {
          grant_type: 'ig_exchange_token',
          client_id: process.env.INSTAGRAM_APP_ID,
          client_secret: process.env.INSTAGRAM_APP_SECRET,
          ig_exchange_token: currentToken,
        },
      });

      const { access_token, expires_in } = response.data;

      // Save the new token
      await socialService.saveTokenRefresh(
        userId,
        'instagram',
        access_token,
        new Date(Date.now() + expires_in * 1000)
      );

      return access_token;
    } catch (error) {
      console.error('Error refreshing Instagram token:', error);
      return null;
    }
  },

  async validateAndRefreshToken(
    userId: string,
    platform: 'facebook' | 'instagram',
    currentToken: string
  ): Promise<string | null> {
    try {
      const apiUrl = platform === 'facebook' ? FACEBOOK_API_URL : INSTAGRAM_API_URL;
      const response = await axios.get(`${apiUrl}/me`, {
        params: {
          access_token: currentToken,
          fields: 'id,name',
        },
      });

      if (response.data.id) {
        return currentToken;
      }
    } catch (error) {
      // Token is invalid, try to refresh
      return platform === 'facebook'
        ? this.refreshFacebookToken(userId, currentToken)
        : this.refreshInstagramToken(userId, currentToken);
    }

    return null;
  },
}; 