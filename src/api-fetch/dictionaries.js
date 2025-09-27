import { apiClient, buildQueryString } from './client';

// Dictionary management API endpoints
export const dictionariesAPI = {
  // Get dictionaries list with pagination
  getDictionariesList: async (params = {}) => {
    const { page = 1, size = 10, ...otherParams } = params;
    const queryString = buildQueryString({ page, size, ...otherParams });
    const url = `/api/dict/list${queryString ? `?${queryString}` : ''}`;
    
    try {
      const response = await apiClient.get(url, { namespace: 1 });
      return response.data;
    } catch (error) {
      console.error('Get dictionaries list error:', error);
      throw error;
    }
  },

  // Get dictionary by ID
  getDictionaryById: async (id) => {
    try {
      const response = await apiClient.get(`/api/dict?id=${id}`);
      return response.data;
    } catch (error) {
      console.error('Get dictionary by ID error:', error);
      throw error;
    }
  },

  // Create new dictionary
  createDictionary: async (dictData) => {
    try {
      const response = await apiClient.post('/api/dict', dictData);
      return response.data;
    } catch (error) {
      console.error('Create dictionary error:', error);
      throw error;
    }
  },

  // Update existing dictionary
  updateDictionary: async (dictData) => {
    try {
      const response = await apiClient.put('/api/dict', dictData);
      return response.data;
    } catch (error) {
      console.error('Update dictionary error:', error);
      throw error;
    }
  },

  // Delete dictionary
  deleteDictionary: async (id) => {
    try {
      const response = await apiClient.put('/api/dict/del', { ids: [id] });
      return response.data;
    } catch (error) {
      console.error('Delete dictionary error:', error);
      throw error;
    }
  },

  // Get dictionary by type
  getDictionaryByType: async (type) => {
    try {
      const response = await apiClient.get(`/api/dict/type/${type}`);
      return response.data;
    } catch (error) {
      console.error('Get dictionary by type error:', error);
      throw error;
    }
  },

  // Get all dictionary types
  getDictionaryTypes: async () => {
    try {
      const response = await apiClient.get('/api/dict/types');
      return response.data;
    } catch (error) {
      console.error('Get dictionary types error:', error);
      throw error;
    }
  },

  // Get dictionary entries for dropdowns
  getDictionaryEntries: async (type) => {
    try {
      const response = await apiClient.get(`/api/dict/entries/${type}`);
      return response.data;
    } catch (error) {
      console.error('Get dictionary entries error:', error);
      throw error;
    }
  },
};

export default dictionariesAPI; 