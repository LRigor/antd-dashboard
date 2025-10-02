/*

'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { tokenUtils } from '../utils/auth';
import { authAPI } from '../api-fetch';
import { useRouter } from 'next/navigation';

// Create the auth context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

// Auth provider component
export const AuthProvider = ({ children }) => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Initialize auth state on mount
  useEffect(() => {
    initializeAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Initialize authentication state
  const initializeAuth = async () => {
    try {
      const token = tokenUtils.getToken();

      if (token) {
        const isValid = tokenUtils.isTokenValid ? tokenUtils.isTokenValid(token) : true;

        if (isValid) {
          try {
            const payload = tokenUtils.getTokenPayload?.(token);
            if (payload) setUser(payload);
          } catch (e) {
            // payload 解析失败不致命，后续可通过 /api/admin/info 补齐
          }
          setIsAuthenticated(true);
        } else {
          // Token exists but is invalid, try to refresh
          try {
            await authAPI.refreshToken?.();
            const newToken = tokenUtils.getToken();
            const payload = tokenUtils.getTokenPayload?.(newToken);
            if (payload) setUser(payload);
            setIsAuthenticated(true);
          } catch (error) {
            tokenUtils.removeTokens();
            setUser(null);
            setIsAuthenticated(false);
          }
        }
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch {
      tokenUtils.removeTokens();
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  // Login function
  const login = async (credentials) => {
    try {
      setLoading(true);
      // authAPI.login 会把 data.token 写入 tokenUtils（见你已修改的实现）
      const res = await authAPI.login(credentials); // 返回 { code, message, data }

      // 双保险：从返回或 tokenUtils 取 token
      const token = res?.data?.token || tokenUtils.getToken();
      if (!token) throw new Error('No token after login');

      try {
        const payload = tokenUtils.getTokenPayload?.(token);
        if (payload) setUser(payload);
      } catch (e) {
        // payload 解析失败不影响登录态
      }
      setIsAuthenticated(true);

      return res;
    } catch (error) {
      // 抛给调用方处理消息
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Register function（保持你的原样）
  const register = async (userData) => {
    try {
      setLoading(true);
      const response = await authAPI.register?.(userData);
      if (response?.user) {
        setUser(response.user);
        setIsAuthenticated(true);
      }
      return response;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    tokenUtils.removeTokens();
    setUser(null);
    setIsAuthenticated(false);
    setLoading(false);
    router.push('/adminlogin?logged-out=true');
  };

  // Update user data（保持原样）
  const updateUser = (userData) => setUser(userData);

  // Check role/permission（保持原样）
  const hasRole = (role) => user?.roles?.includes(role) || false;
  const hasPermission = (permission) => user?.permissions?.includes(permission) || false;

  // Refresh user data from server
  const refreshUser = async () => {
    try {
      // 优先用你在 api-fetch/auth.js 暴露的 getCurrentUser；否则直接打 /api/admin/info
      const res = authAPI.getCurrentUser
        ? await authAPI.getCurrentUser()
        : await (await import('../api-fetch/client')).apiClient.get('/api/admin/info');

      // 你的 apiClient 已统一处理 {code,message,data}
      const info = res?.data;
      if (info) setUser(info);
    } catch (error) {
      console.error('Failed to refresh user data:', error);
    }
  };

  // Context value
  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    updateUser,
    hasRole,
    hasPermission,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
*/