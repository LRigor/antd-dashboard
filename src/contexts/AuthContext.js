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
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
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
  }, []);

  // Initialize authentication state
  const initializeAuth = async () => {
    try {
      const token = tokenUtils.getToken();
      
      if (token) {
        const isValid = tokenUtils.isTokenValid(token);
        
        if (isValid) {
          const payload = tokenUtils.getTokenPayload(token);
          setUser(payload);
          setIsAuthenticated(true);
        } else {
          // Token exists but is invalid, try to refresh
          try {
            await authAPI.refreshToken();
            const newToken = tokenUtils.getToken();
            const payload = tokenUtils.getTokenPayload(newToken);
            setUser(payload);
            setIsAuthenticated(true);
          } catch (error) {
            console.error('Token refresh failed:', error);
            // Refresh failed, clear tokens
            tokenUtils.removeTokens();
            setUser(null);
            setIsAuthenticated(false);
          }
        }
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
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
      const response = await authAPI.login(credentials);
      
      if (response.user) {
        setUser(response.user);
        setIsAuthenticated(true);
      } else if (response.token) {
        try {
          const payload = tokenUtils.getTokenPayload(response.token);
          if (payload) {
            setUser(payload);
            setIsAuthenticated(true);
          }
        } catch (error) {
          console.error("Failed to decode token payload:", error);
        }
      }
      
      return response;
    } catch (error) {
      console.error("AuthContext login error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      setLoading(true);
      const response = await authAPI.register(userData);
      
      if (response.user) {
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
    router.push('/');
  };

  // Update user data
  const updateUser = (userData) => {
    setUser(userData);
  };

  // Check if user has specific role
  const hasRole = (role) => {
    return user?.roles?.includes(role) || false;
  };

  // Check if user has specific permission
  const hasPermission = (permission) => {
    return user?.permissions?.includes(permission) || false;
  };

  // Refresh user data from server
  const refreshUser = async () => {
    try {
      const response = await authAPI.apiCall('/api/auth/me');
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      }
    } catch (error) {
      console.error('Failed to refresh user data:', error);
    }
  };

  // Value object to be provided by context
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

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 