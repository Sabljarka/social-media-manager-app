import axios from 'axios';

const FACEBOOK_API_BASE_URL = 'https://graph.facebook.com/v18.0';

export interface FacebookPage {
  id: string;
  name: string;
  access_token: string;
  category: string;
  tasks: string[];
}

export interface FacebookPost {
  id: string;
  message: string;
  created_time: string;
  likes: {
    summary: {
      total_count: number;
    };
  };
  comments: {
    summary: {
      total_count: number;
    };
  };
  shares?: {
    count: number;
  };
}

export class FacebookService {
  private static instance: FacebookService;

  private constructor() {}

  public static getInstance(): FacebookService {
    if (!FacebookService.instance) {
      FacebookService.instance = new FacebookService();
    }
    return FacebookService.instance;
  }

  async validateToken(accessToken: string): Promise<boolean> {
    try {
      const response = await axios.get(`${FACEBOOK_API_BASE_URL}/me`, {
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
  }

  async getPages(accessToken: string): Promise<FacebookPage[]> {
    try {
      const response = await axios.get(`${FACEBOOK_API_BASE_URL}/me/accounts`, {
        params: {
          access_token: accessToken,
          fields: 'id,name,access_token,category',
        },
      });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching Facebook pages:', error);
      throw error;
    }
  }

  async getPagePosts(pageId: string, accessToken: string): Promise<FacebookPost[]> {
    try {
      const response = await axios.get(`${FACEBOOK_API_BASE_URL}/${pageId}/posts`, {
        params: {
          access_token: accessToken,
          fields: 'id,message,created_time,full_picture,likes.summary(true),comments.summary(true)',
        },
      });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching page posts:', error);
      throw error;
    }
  }

  async createPost(pageId: string, accessToken: string, message: string): Promise<FacebookPost> {
    try {
      const response = await axios.post(
        `${FACEBOOK_API_BASE_URL}/${pageId}/feed`,
        {
          message,
        },
        {
          params: {
            access_token: accessToken,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error creating Facebook post:', error);
      throw error;
    }
  }

  async getPostComments(postId: string, accessToken: string) {
    try {
      const response = await axios.get(`${FACEBOOK_API_BASE_URL}/${postId}/comments`, {
        params: {
          access_token: accessToken,
          fields: 'id,message,created_time,from{id,name,picture{url}},like_count',
        },
      });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching post comments:', error);
      throw error;
    }
  }

  async createComment(postId: string, accessToken: string, message: string) {
    try {
      const response = await axios.post(
        `${FACEBOOK_API_BASE_URL}/${postId}/comments`,
        {
          message,
        },
        {
          params: {
            access_token: accessToken,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error creating Facebook comment:', error);
      throw error;
    }
  }

  async getUserInfo(userId: string, accessToken: string): Promise<any> {
    try {
      const response = await axios.get(`${FACEBOOK_API_BASE_URL}/${userId}`, {
        params: {
          access_token: accessToken,
          fields: 'name,picture.type(large)',
        },
      });
      console.log('User info response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching user info:', error);
      return null;
    }
  }
}

// Export a default instance
const facebookService = FacebookService.getInstance();
export default facebookService; 