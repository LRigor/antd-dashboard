import { jwtDecode } from 'jwt-decode';

// Token storage keys
const TOKEN_KEY = 'auth-token';
const REFRESH_TOKEN_KEY = 'refresh-token';

// Helper function to create mock JWT tokens for development
const createMockJWT = (payload, expiresIn = 3600) => {
  const header = {
    alg: 'HS256',
    typ: 'JWT'
  };
  
  const now = Math.floor(Date.now() / 1000);
  const exp = now + expiresIn;
  
  const tokenPayload = {
    ...payload,
    iat: now,
    exp: exp
  };
  
  // Create base64 encoded header and payload using a more robust method
  const encodedHeader = btoa(unescape(encodeURIComponent(JSON.stringify(header))));
  const encodedPayload = btoa(unescape(encodeURIComponent(JSON.stringify(tokenPayload))));
  
  // Create a mock signature (this is just for development)
  const mockSignature = btoa(unescape(encodeURIComponent('mock-signature-for-development')));
  
  // Combine to create JWT token
  return `${encodedHeader}.${encodedPayload}.${mockSignature}`;
};

// Token management functions
export const tokenUtils = {
  // Store tokens in cookies and localStorage
  setTokens: (accessToken, refreshToken = null) => {
    if (typeof window !== 'undefined') {
      // Store in localStorage for client-side access
      localStorage.setItem(TOKEN_KEY, accessToken);
      if (refreshToken) {
        localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
      }
      
      document.cookie = `${TOKEN_KEY}=${accessToken}; path=/; max-age=3600; SameSite=Strict`;
      if (refreshToken) {
        document.cookie = `${REFRESH_TOKEN_KEY}=${refreshToken}; path=/; max-age=604800; SameSite=Strict`;
      }
    }
  },

  // Get token from localStorage
  getToken: () => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem(TOKEN_KEY);
      return token;
    }
    return null;
  },

  // Get refresh token from localStorage
  getRefreshToken: () => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem(REFRESH_TOKEN_KEY);
      return token;
    }
    return null;
  },

  // Remove all tokens
  removeTokens: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      
      // Remove cookies
      document.cookie = `${TOKEN_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
      document.cookie = `${REFRESH_TOKEN_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    }
  },

  // Check if token is valid
  isTokenValid: (token) => {
    if (!token) {
      return false;
    }
    
    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      
      const isValid = decoded.exp > currentTime;
      return isValid;
    } catch (error) {
      console.error('Token validation error:', error);  
      return false;
    }
  },

  // Get token payload
  getTokenPayload: (token) => {
    if (!token) return null;
    
    try {
      return jwtDecode(token);
    } catch (error) {
      console.error('Token decode error:', error);
      return null;
    }
  },

  // Check if token is about to expire (within 5 minutes)
  isTokenExpiringSoon: (token) => {
    if (!token) return true;
    
    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      const fiveMinutes = 5 * 60;
      
      return decoded.exp - currentTime < fiveMinutes;
    } catch (error) {
      return true;
    }
  }
};

// API functions for authentication
export const authAPI = {
  // Login function
  login: async (credentials) => {
    try {
      // Production mode: use actual API
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      
      if (data.code !== 0) {
        throw new Error(data.message);
      }

      if (data.data.token) {
        tokenUtils.setTokens(data.data.token);
      }
      
      return data.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  // Refresh token function
  refreshToken: async () => {
    try {
      const refreshToken = tokenUtils.getRefreshToken();
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      // Check if we're in development mode
      const isDevelopment = true; // Force development mode for now
      
      if (isDevelopment) {
        // In development mode, create new mock tokens
        try {
          const decoded = jwtDecode(refreshToken);
          
          // Create new access token with the same user data
          const newAccessToken = createMockJWT({
            sub: decoded.sub,
            username: decoded.username || 'admin',
            email: decoded.email || 'admin@example.com',
            roles: decoded.roles || ['admin'],
            permissions: decoded.permissions || ['read', 'write', 'delete']
          }, 3600); // 1 hour
          
          const newRefreshToken = createMockJWT({
            sub: decoded.sub,
            type: 'refresh'
          }, 604800); // 7 days
          
          tokenUtils.setTokens(newAccessToken, newRefreshToken);
          return newAccessToken;
        } catch (error) {
          console.error('Development token refresh error:', error);
          throw new Error('Invalid refresh token');
        }
      }

      // Production mode: call actual API
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        throw new Error('Token refresh failed');
      }

      const data = await response.json();
      
      if (data.accessToken) {
        tokenUtils.setTokens(data.accessToken, data.refreshToken);
        return data.accessToken;
      }
      
      throw new Error('No new token received');
    } catch (error) {
      console.error('Token refresh error:', error);
      tokenUtils.removeTokens();
      throw error;
    }
  },

  // Make authenticated API calls
  apiCall: async (url, options = {}) => {
    let token = tokenUtils.getToken();
    
    // Check if token is valid
    if (!tokenUtils.isTokenValid(token)) {
      // Try to refresh token
      try {
        token = await authAPI.refreshToken();
      } catch (error) {
        // Redirect to login if refresh fails
        window.location.href = '/login';
        throw error;
      }
    }

    // Add authorization header
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
      'Authorization': `Bearer ${token}`,
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    // Handle 401 responses
    if (response.status === 401) {
      tokenUtils.removeTokens();
      window.location.href = '/login';
      throw new Error('Unauthorized');
    }

    return response;
  }
}; 