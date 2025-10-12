import { apiClient, buildQueryString } from './client';

// Role management API endpoints
export const rolesAPI = {
  // Get roles list with pagination
  getRolesList: async (params = {}) => {
    const { page = 1, size = 10, ...otherParams } = params;
    const queryString = buildQueryString({ page, size, ...otherParams });
    const url = `/api/role/list${queryString ? `?${queryString}` : ''}`;
    
    try {
      const response = await apiClient.get(url);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get role by ID
  getRoleById: async (id) => {
    try {
      const response = await apiClient.get(`/api/role?id=${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Create new role
  createRole: async (roleData) => {
    try {
      const response = await apiClient.post('/api/role', roleData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update existing role
  updateRole: async (roleData) => {
    try {
      const response = await apiClient.put('/api/role', roleData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete role
  deleteRole: async (id) => {
    try {
      const response = await apiClient.put('/api/role/del', { id });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get all roles (for dropdowns, etc.)
  getAllRoles: async () => {
    try {
      const response = await apiClient.get('/api/role/list?size=1000');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default rolesAPI; 