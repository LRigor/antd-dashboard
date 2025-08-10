import { tokenUtils } from '../utils/auth';

// Base API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';

// Common headers
const getCommonHeaders = (options) => {
  const headers = {
    'Content-Type': 'application/json',
  };
  
  const token = tokenUtils.getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return { ...headers, ...options };
};

// API response handler
const handleApiResponse = async (response) => {
  if (!response.ok) {
    if (response.status === 401) {
      // Handle unauthorized - redirect to login
      tokenUtils.removeTokens();
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      throw new Error('Unauthorized');
    }
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  const data = await response.json();
  
  // Check if the API returns a standard response format
  if (data.code !== undefined && data.code !== 0) {
    throw new Error(data.message || 'API request failed');
  }
  
  return data;
};

// Main API client
export const apiClient = {
  // GET request
  get: async (url, options = {}) => {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method: 'GET',
      headers: getCommonHeaders(options),
      ...options,
    });
    return handleApiResponse(response);
  },

  // POST request
  post: async (url, data = null, options = {}) => {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method: 'POST',
      headers: getCommonHeaders(options),
      body: data ? JSON.stringify(data) : undefined,
    });
    return handleApiResponse(response);
  },

  // PUT request
  put: async (url, data = null, options = {}) => {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method: 'PUT',
      headers: getCommonHeaders(options),
      body: data ? JSON.stringify(data) : undefined,
    });
    return handleApiResponse(response);
  },

  // DELETE request
  delete: async (url, options = {}) => {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method: 'DELETE',
      headers: getCommonHeaders(options),
    });
    return handleApiResponse(response);
  },

  // PATCH request
  patch: async (url, data = null, options = {}) => {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method: 'PATCH',
      headers: getCommonHeaders(options),
      body: data ? JSON.stringify(data) : undefined,
    });
    return handleApiResponse(response);
  },
};

// Utility function to build query parameters
export const buildQueryString = (params) => {
  if (!params || Object.keys(params).length === 0) return '';
  
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, value);
    }
  });
  
  return searchParams.toString();
};

// Export the base URL for use in other modules
export { API_BASE_URL }; 