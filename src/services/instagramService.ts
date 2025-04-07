import axios from 'axios';

const INSTAGRAM_API_URL = 'https://graph.instagram.com/v18.0';

export const instagramService = {
  async getAccounts(accessToken: string) {
    try {
      const response = await axios.get(`${INSTAGRAM_API_URL}/me/accounts`, {
        params: {
          access_token: accessToken,
          fields: 'id,username,media_count',
        },
      });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching Instagram accounts:', error);
      throw error;
    }
  },

  async getMedia(accountId: string, accessToken: string) {
    try {
      const response = await axios.get(`${INSTAGRAM_API_URL}/${accountId}/media`, {
        params: {
          access_token: accessToken,
          fields: 'id,caption,media_type,media_url,permalink,thumbnail_url,timestamp,username',
        },
      });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching Instagram media:', error);
      throw error;
    }
  },

  async getComments(mediaId: string, accessToken: string) {
    try {
      const response = await axios.get(`${INSTAGRAM_API_URL}/${mediaId}/comments`, {
        params: {
          access_token: accessToken,
          fields: 'id,text,timestamp,username',
        },
      });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching Instagram comments:', error);
      throw error;
    }
  },
}; 