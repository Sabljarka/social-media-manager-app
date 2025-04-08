import axios from 'axios';

interface AuthResponse {
  token: string;
  user: {
    id: string;
    username: string;
    email: string;
    role: string;
  };
}

interface OAuthResponse {
  url: string;
}

interface StatusResponse {
  connected: boolean;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3003';

export const authService = {
  // Osnovna autentifikacija
  login: async (username: string, password: string) => {
    try {
      const response = await axios.post<AuthResponse>(`${API_URL}/api/auth/login`, {
        username,
        password
      });
      return response.data;
    } catch (error) {
      console.error('Greška pri prijavi:', error);
      throw error;
    }
  },

  register: async (username: string, email: string, password: string) => {
    try {
      const response = await axios.post<AuthResponse>(`${API_URL}/api/auth/register`, {
        username,
        email,
        password
      });
      return response.data;
    } catch (error) {
      console.error('Greška pri registraciji:', error);
      throw error;
    }
  },

  // Facebook autentifikacija
  connectFacebook: async () => {
    try {
      const response = await axios.get<OAuthResponse>(`${API_URL}/api/facebook/auth`);
      window.location.href = response.data.url;
    } catch (error) {
      console.error('Greška pri povezivanju sa Facebook-om:', error);
      throw error;
    }
  },

  // Instagram autentifikacija
  connectInstagram: async () => {
    try {
      const response = await axios.get<OAuthResponse>(`${API_URL}/api/instagram/auth`);
      window.location.href = response.data.url;
    } catch (error) {
      console.error('Greška pri povezivanju sa Instagram-om:', error);
      throw error;
    }
  },

  // TikTok autentifikacija
  connectTikTok: async () => {
    try {
      const response = await axios.get<OAuthResponse>(`${API_URL}/api/tiktok/auth`);
      window.location.href = response.data.url;
    } catch (error) {
      console.error('Greška pri povezivanju sa TikTok-om:', error);
      throw error;
    }
  },

  // YouTube autentifikacija
  connectYouTube: async () => {
    try {
      const response = await axios.get<OAuthResponse>(`${API_URL}/api/youtube/auth`);
      window.location.href = response.data.url;
    } catch (error) {
      console.error('Greška pri povezivanju sa YouTube-om:', error);
      throw error;
    }
  },

  // Provera statusa povezivanja
  checkConnectionStatus: async (platform: string) => {
    try {
      const response = await axios.get<StatusResponse>(`${API_URL}/api/${platform.toLowerCase()}/status`);
      return response.data.connected;
    } catch (error) {
      console.error(`Greška pri proveri statusa za ${platform}:`, error);
      return false;
    }
  }
}; 