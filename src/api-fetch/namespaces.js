import { apiClient, buildQueryString } from './client';

// Namespace management API endpoints
export const namespacesAPI = {
  // Get namespaces list with pagination
  getNamespacesList: async (params = {}) => {
    const { page = 1, size = 10, ...otherParams } = params;
    const queryString = buildQueryString({ page, size, ...otherParams });
    const url = `/api/namespace/list${queryString ? `?${queryString}` : ''}`;
    
    try {
      const response = await apiClient.get(url, { namespace: 1 });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get namespace by ID
  getNamespaceById: async (id) => {
    try {
      const response = await apiClient.get(`/api/namespace?id=${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Create new namespace
  createNamespace: async (namespaceData) => {
    try {
      const response = await apiClient.post('/api/namespace', namespaceData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update existing namespace
  updateNamespace: async (namespaceData) => {
    try {
      const response = await apiClient.put('/api/namespace', namespaceData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete namespace
  deleteNamespace: async (id) => {
    try {
      const response = await apiClient.put('/api/namespace/del', { id });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get all namespaces (for dropdowns, etc.)
  getAllNamespaces: async () => {
    try {
      const response = await apiClient.get('/api/namespace/list?size=1000');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default namespacesAPI; 