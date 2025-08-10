import { apiClient, buildQueryString } from './client';
import { tokenUtils } from '../utils/auth';

// Authentication API endpoints
export const authAPI = {
  // Login
  login: async (credentials) => {
    try {
      const response = await apiClient.post('/api/admin/login', credentials);
      
      if (response.data && response.data.token) {
        tokenUtils.setTokens(response.data.token);
      }
      
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  // Logout
  logout: async () => {
    try {
      // Clear local tokens
      tokenUtils.removeTokens();
      
      // Optionally call logout endpoint if needed
      // await apiClient.post('/api/auth/logout');
      
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear tokens even if API call fails
      tokenUtils.removeTokens();
      throw error;
    }
  },

  // Refresh token
  refreshToken: async () => {
    try {
      const refreshToken = tokenUtils.getRefreshToken();
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await apiClient.post('/api/auth/refresh', { refreshToken });
      
      if (response.data && response.data.accessToken) {
        tokenUtils.setTokens(response.data.accessToken, response.data.refreshToken);
        return response.data.accessToken;
      }
      
      throw new Error('No new token received');
    } catch (error) {
      console.error('Token refresh error:', error);
      tokenUtils.removeTokens();
      throw error;
    }
  },

  // Get current user profile
  getCurrentUser: async () => {
    try {
      const response = await apiClient.get('/api/auth/me');
      return response.data;
    } catch (error) {
      console.error('Get current user error:', error);
      throw error;
    }
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const token = tokenUtils.getToken();
    return token && tokenUtils.isTokenValid(token);
  },

  // Check if token is expiring soon
  isTokenExpiringSoon: () => {
    const token = tokenUtils.getToken();
    return tokenUtils.isTokenExpiringSoon(token);
  },

  // Get token payload
  getTokenPayload: () => {
    const token = tokenUtils.getToken();
    return tokenUtils.getTokenPayload(token);
  },
};

export default authAPI; 