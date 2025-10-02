import { apiClient, buildQueryString } from './client';
import { tokenUtils } from '../utils/auth';

// Authentication API endpoints
export const authAPI = {
  // Login
  login: async (credentials) => {
    // apiClient.post() 直接回傳 { code, message, data }
    const res = await apiClient.post('/api/admin/login', credentials);

    // 後端結構：token 在 res.data.token
    const token = res?.data?.token;
    if (!token) throw new Error('No token in response');

    // 寫入（LS + Cookie）
    tokenUtils.setTokens(token);
   
    return res; // { code, message, data }
  },

  // Logout
  logout: async () => {
    try {
      tokenUtils.removeTokens();
      // 如需呼叫後端登出可在此加：
       //await apiClient.post('/api/admin/logout');
      return { success: true };
    } catch (error) {
      tokenUtils.removeTokens();
      throw error;
    }
  },

  // Refresh token（若你的後端尚未提供，可以先保留這段）
  refreshToken: async () => {
    try {
      const refreshToken = tokenUtils.getRefreshToken();
      if (!refreshToken) throw new Error('No refresh token available');

      // 依你的實際路由調整：/api/auth/refresh 或 /api/admin/refresh
      const res = await apiClient.post('/api/auth/refresh', { refreshToken });

      // apiClient 已回 body：期望結構 { data: { accessToken, refreshToken } }
      const accessToken = res?.data?.accessToken;
      const newRefresh = res?.data?.refreshToken ?? refreshToken;

      if (accessToken) {
        tokenUtils.setTokens(accessToken, newRefresh);
        return accessToken;
      }
      throw new Error('No new token received');
    } catch (error) {
      console.error('Token refresh error:', error);
      tokenUtils.removeTokens();
      throw error;
    }
  },

  // Get current user profile（改成實際的 info 端點，且不要再用 .data）
  getCurrentUser: async () => {
    try {
      const res = await apiClient.get('/api/admin/info');
      // res = { code, message, data }；直接回傳 data 給呼叫方
      return res.data;
    } catch (error) {
      console.error('Get current user error:', error);
      throw error;
    }
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const token = tokenUtils.getToken();
    return !!(token && tokenUtils.isTokenValid(token));
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
