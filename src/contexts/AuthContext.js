'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { tokenUtils, authAPI } from '../utils/auth';

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
      console.log('Initializing auth...');
      const token = tokenUtils.getToken();
      console.log('Retrieved token:', token ? 'exists' : 'null');
      
      if (token) {
        console.log('Token exists, checking validity...');
        const isValid = tokenUtils.isTokenValid(token);
        console.log('Token valid:', isValid);
        
        if (isValid) {
          const payload = tokenUtils.getTokenPayload(token);
          console.log('Token payload:', payload);
          setUser(payload);
          setIsAuthenticated(true);
        } else {
          console.log('Token is invalid, attempting refresh...');
          // Token exists but is invalid, try to refresh
          try {
            await authAPI.refreshToken();
            const newToken = tokenUtils.getToken();
            console.log('Refresh successful, new token:', newToken ? 'exists' : 'null');
            const payload = tokenUtils.getTokenPayload(newToken);
            console.log('New token payload:', payload);
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
        console.log('No token found, user not authenticated');
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
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
      }
      
      return response;
    } catch (error) {
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
  const logout = async () => {
    try {
      setLoading(true);
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      setLoading(false);
    }
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