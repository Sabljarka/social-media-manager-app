import axios from 'axios';

const FACEBOOK_API_URL = 'https://graph.facebook.com/v18.0';
const INSTAGRAM_API_URL = 'https://graph.facebook.com/v18.0';

interface FacebookPage {
  id: string;
  name: string;
  access_token: string;
  category: string;
  tasks: string[];
}

interface InstagramAccount {
  id: string;
  username: string;
  followers_count: number;
  media_count: number;
}

export const socialService = {
  // Facebook API methods
  async getFacebookPages(accessToken: string): Promise<FacebookPage[]> {
    try {
      const response = await axios.get(`${FACEBOOK_API_URL}/me/accounts`, {
        params: {
          access_token: accessToken,
          fields: 'id,name,access_token,category,tasks',
        },
      });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching Facebook pages:', error);
      throw error;
    }
  },

  async validateFacebookToken(accessToken: string): Promise<boolean> {
    try {
      const response = await axios.get(`${FACEBOOK_API_URL}/me`, {
        params: {
          access_token: accessToken,
          fields: 'id,name',
        },
      });
      return !!response.data.id;
    } catch (error) {
      console.error('Error validating Facebook token:', error);
      return false;
    }
  },

  // Instagram API methods
  async getInstagramAccounts(accessToken: string): Promise<InstagramAccount[]> {
    try {
      const response = await axios.get(`${INSTAGRAM_API_URL}/me/accounts`, {
        params: {
          access_token: accessToken,
          fields: 'instagram_business_account{id,username,followers_count,media_count}',
        },
      });
      
      return response.data.data
        .filter((page: any) => page.instagram_business_account)
        .map((page: any) => ({
          id: page.instagram_business_account.id,
          username: page.instagram_business_account.username,
          followers_count: page.instagram_business_account.followers_count,
          media_count: page.instagram_business_account.media_count,
        }));
    } catch (error) {
      console.error('Error fetching Instagram accounts:', error);
      throw error;
    }
  },

  async validateInstagramToken(accessToken: string): Promise<boolean> {
    try {
      const response = await axios.get(`${INSTAGRAM_API_URL}/me`, {
        params: {
          access_token: accessToken,
          fields: 'id,name',
        },
      });
      return !!response.data.id;
    } catch (error) {
      console.error('Error validating Instagram token:', error);
      return false;
    }
  },

  // Post methods
  async createFacebookPost(pageId: string, accessToken: string, message: string): Promise<any> {
    try {
      const response = await axios.post(`${FACEBOOK_API_URL}/${pageId}/feed`, {
        message,
        access_token: accessToken,
      });
      return response.data;
    } catch (error) {
      console.error('Error creating Facebook post:', error);
      throw error;
    }
  },

  async createInstagramPost(accountId: string, accessToken: string, imageUrl: string, caption: string): Promise<any> {
    try {
      // First, create a media container
      const containerResponse = await axios.post(`${INSTAGRAM_API_URL}/${accountId}/media`, {
        image_url: imageUrl,
        caption,
        access_token: accessToken,
      });

      // Then publish the media
      const publishResponse = await axios.post(`${INSTAGRAM_API_URL}/${accountId}/media_publish`, {
        creation_id: containerResponse.data.id,
        access_token: accessToken,
      });

      return publishResponse.data;
    } catch (error) {
      console.error('Error creating Instagram post:', error);
      throw error;
    }
  },
}; 