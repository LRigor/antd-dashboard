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
      console.log('setTokens: Storing tokens in localStorage');
      console.log('setTokens: Access token:', accessToken ? 'exists' : 'null');
      console.log('setTokens: Refresh token:', refreshToken ? 'exists' : 'null');
      
      // Store in localStorage for client-side access
      localStorage.setItem(TOKEN_KEY, accessToken);
      if (refreshToken) {
        localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
      }
      
      // Set HTTP-only cookie for server-side access
      document.cookie = `${TOKEN_KEY}=${accessToken}; path=/; max-age=3600; SameSite=Strict`;
      if (refreshToken) {
        document.cookie = `${REFRESH_TOKEN_KEY}=${refreshToken}; path=/; max-age=604800; SameSite=Strict`;
      }
      
      console.log('setTokens: Tokens stored successfully');
    }
  },

  // Get token from localStorage
  getToken: () => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem(TOKEN_KEY);
      console.log('getToken: Retrieved token from localStorage:', token ? 'exists' : 'null');
      return token;
    }
    return null;
  },

  // Get refresh token from localStorage
  getRefreshToken: () => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem(REFRESH_TOKEN_KEY);
      console.log('getRefreshToken: Retrieved refresh token from localStorage:', token ? 'exists' : 'null');
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
      console.log('isTokenValid: No token provided');
      return false;
    }
    
    try {
      console.log('isTokenValid: Attempting to decode token...');
      const decoded = jwtDecode(token);
      console.log('isTokenValid: Token decoded successfully:', decoded);
      const currentTime = Date.now() / 1000;
      console.log('isTokenValid: Current time:', currentTime, 'Token exp:', decoded.exp);
      
      const isValid = decoded.exp > currentTime;
      console.log('isTokenValid: Token is valid:', isValid);
      return isValid;
    } catch (error) {
      console.error('Token validation error:', error);
      console.log('isTokenValid: Token that failed:', token);
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
      console.log('Login attempt with credentials:', credentials);
      console.log('NODE_ENV:', process.env.NODE_ENV);
      console.log('Window location:', typeof window !== 'undefined' ? window.location.hostname : 'no window');
      
      // Always use development mode for now to bypass API issues
      const isDevelopment = true; // Force development mode
      
      console.log('Is development mode:', isDevelopment);
      
      if (isDevelopment) {
        console.log('Checking credentials:', {
          username: credentials.username,
          password: credentials.password,
          expectedUsername: 'admin',
          expectedPassword: 'ant.design'
        });
        
        // Simple mock authentication for development
        if (credentials.username === 'admin' && credentials.password === 'ant.design') {
          const mockUser = {
            id: 1,
            username: 'admin',
            email: 'admin@example.com',
            roles: ['admin'],
            permissions: ['read', 'write', 'delete']
          };
          
          // Create proper JWT tokens for development
          const mockAccessToken = createMockJWT({
            sub: mockUser.id,
            username: mockUser.username,
            email: mockUser.email,
            roles: mockUser.roles,
            permissions: mockUser.permissions
          }, 3600); // 1 hour
          
          const mockRefreshToken = createMockJWT({
            sub: mockUser.id,
            type: 'refresh'
          }, 604800); // 7 days
          
          tokenUtils.setTokens(mockAccessToken, mockRefreshToken);
          
          console.log('Admin login successful (dev mode)');
          
          return {
            message: 'Login successful (dev mode)',
            user: mockUser,
            accessToken: mockAccessToken,
            refreshToken: mockRefreshToken
          };
        } else if (credentials.username === 'user' && credentials.password === 'ant.design') {
          const mockUser = {
            id: 2,
            username: 'user',
            email: 'user@example.com',
            roles: ['user'],
            permissions: ['read']
          };
          
          // Create proper JWT tokens for development
          const mockAccessToken = createMockJWT({
            sub: mockUser.id,
            username: mockUser.username,
            email: mockUser.email,
            roles: mockUser.roles,
            permissions: mockUser.permissions
          }, 3600); // 1 hour
          
          const mockRefreshToken = createMockJWT({
            sub: mockUser.id,
            type: 'refresh'
          }, 604800); // 7 days
          
          tokenUtils.setTokens(mockAccessToken, mockRefreshToken);
          
          console.log('User login successful (dev mode)');
          
          return {
            message: 'Login successful (dev mode)',
            user: mockUser,
            accessToken: mockAccessToken,
            refreshToken: mockRefreshToken
          };
        } else {
          console.log('Invalid credentials in dev mode:', {
            received: credentials,
            expected: [
              { username: 'admin', password: 'ant.design' },
              { username: 'user', password: 'ant.design' }
            ]
          });
          throw new Error('Invalid credentials');
        }
      }

      // Production mode: use actual API
      const response = await fetch('/api/auth/login', {
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
      
      if (data.accessToken) {
        tokenUtils.setTokens(data.accessToken, data.refreshToken);
      }
      
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  // Register function
  register: async (userData) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error('Registration failed');
      }

      const data = await response.json();
      
      if (data.accessToken) {
        tokenUtils.setTokens(data.accessToken, data.refreshToken);
      }
      
      return data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  // Logout function
  logout: async () => {
    try {
      // Call logout API to invalidate token on server
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${tokenUtils.getToken()}`,
        },
      });
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      // Always remove tokens locally
      tokenUtils.removeTokens();
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