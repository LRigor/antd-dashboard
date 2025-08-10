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

// Legacy API functions - now imported from api-fetch
// These are kept for backward compatibility but will be removed in future versions
export const authAPI = {
  // This is now handled by the new api-fetch structure
  // The actual implementation is in src/api-fetch/auth.js
  
  // Make authenticated API calls (legacy function)
  apiCall: async (url, options = {}) => {
    // Import the new API client dynamically to avoid circular dependencies
    const { apiClient } = await import('../api-fetch/client');
    
    let token = tokenUtils.getToken();
    
    // Check if token is valid
    if (!tokenUtils.isTokenValid(token)) {
      // Try to refresh token using the new auth API
      try {
        const { authAPI } = await import('../api-fetch/auth');
        token = await authAPI.refreshToken();
      } catch (error) {
        // Redirect to login if refresh fails
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        throw error;
      }
    }

    // Use the new API client
    return apiClient.get(url, options);
  }
}; 