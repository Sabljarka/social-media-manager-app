import axios from 'axios';
import { Post } from '../store/slices/socialSlice';

const FACEBOOK_API_BASE_URL = 'https://graph.facebook.com/v18.0';

interface FacebookApiResponse<T> {
  data: T;
}

export interface FacebookPage {
  id: string;
  name: string;
  access_token: string;
  category: string;
  tasks: string[];
  posts: Post[];
  followers: number;
  isActive: boolean;
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
      const response = await axios.get<FacebookApiResponse<{ id: string; name: string }>>(`${FACEBOOK_API_BASE_URL}/me`, {
        params: {
          access_token: accessToken,
          fields: 'id,name',
        },
      });
      return !!response.data.data.id;
    } catch (error) {
      console.error('Error validating Facebook token:', error);
      return false;
    }
  }

  async getPages(accessToken: string): Promise<FacebookPage[]> {
    try {
      const response = await axios.get<FacebookApiResponse<FacebookPage[]>>(`${FACEBOOK_API_BASE_URL}/me/accounts`, {
        params: {
          access_token: accessToken,
          fields: 'id,name,access_token,category',
        },
      });
      return response.data.data.map(page => ({
        ...page,
        posts: [],
        followers: 0,
        isActive: true,
      }));
    } catch (error) {
      console.error('Error fetching Facebook pages:', error);
      throw error;
    }
  }

  async getPagePosts(pageId: string, accessToken: string): Promise<FacebookPost[]> {
    try {
      const response = await axios.get<FacebookApiResponse<FacebookPost[]>>(`${FACEBOOK_API_BASE_URL}/${pageId}/posts`, {
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
      const response = await axios.post<FacebookPost>(
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
      console.error('Error creating post:', error);
      throw error;
    }
  }

  async getPostComments(postId: string, accessToken: string) {
    try {
      const response = await axios.get<FacebookApiResponse<any[]>>(`${FACEBOOK_API_BASE_URL}/${postId}/comments`, {
        params: {
          access_token: accessToken,
          fields: 'id,message,created_time,from',
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
      console.error('Error creating comment:', error);
      throw error;
    }
  }

  async getUserInfo(userId: string, accessToken: string): Promise<any> {
    try {
      const response = await axios.get(`${FACEBOOK_API_BASE_URL}/${userId}`, {
        params: {
          access_token: accessToken,
          fields: 'id,name,picture',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching user info:', error);
      throw error;
    }
  }

  async getPageInfo(pageId: string, accessToken: string): Promise<FacebookPage> {
    try {
      const response = await axios.get<FacebookApiResponse<{
        id: string;
        name: string;
        access_token: string;
        category: string;
        tasks: string[];
        fan_count: number;
      }>>(`${FACEBOOK_API_BASE_URL}/${pageId}`, {
        params: {
          access_token: accessToken,
          fields: 'id,name,access_token,category,tasks,fan_count',
        },
      });
      return {
        id: response.data.data.id,
        name: response.data.data.name,
        access_token: response.data.data.access_token,
        category: response.data.data.category,
        tasks: response.data.data.tasks || [],
        posts: [],
        followers: response.data.data.fan_count || 0,
        isActive: true,
      };
    } catch (error) {
      console.error('Error fetching page info:', error);
      throw error;
    }
  }
}

// Export a default instance
const facebookService = FacebookService.getInstance();
export default facebookService; 