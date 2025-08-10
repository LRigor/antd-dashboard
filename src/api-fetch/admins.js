import { apiClient, buildQueryString } from './client';

// Admin management API endpoints
export const adminsAPI = {
  // Get admins list with pagination
  getAdminsList: async (params = {}) => {
    const { page = 1, size = 10, ...otherParams } = params;
    const queryString = buildQueryString({ page, size, ...otherParams });
    const url = `/api/admin/list${queryString ? `?${queryString}` : ''}`;
    
    try {
      const response = await apiClient.get(url);
      return response.data;
    } catch (error) {
      console.error('Get admins list error:', error);
      throw error;
    }
  },

  // Get admin by ID
  getAdminById: async (id) => {
    try {
      const response = await apiClient.get(`/api/admin?id=${id}`);
      return response.data;
    } catch (error) {
      console.error('Get admin by ID error:', error);
      throw error;
    }
  },

  // Create new admin
  createAdmin: async (adminData) => {
    try {
      const response = await apiClient.post('/api/admin', adminData);
      return response.data;
    } catch (error) {
      console.error('Create admin error:', error);
      throw error;
    }
  },

  // Update existing admin
  updateAdmin: async (adminData) => {
    try {
      const response = await apiClient.put('/api/admin', adminData);
      return response.data;
    } catch (error) {
      console.error('Update admin error:', error);
      throw error;
    }
  },

  // Delete admin
  deleteAdmin: async (id) => {
    try {
      const response = await apiClient.put('/api/admin/del', { id });
      return response.data;
    } catch (error) {
      console.error('Delete admin error:', error);
      throw error;
    }
  },

  // Change admin password
  changePassword: async (adminId, passwordData) => {
    try {
      const response = await apiClient.put(`/api/admin/${adminId}/password`, passwordData);
      return response.data;
    } catch (error) {
      console.error('Change password error:', error);
      throw error;
    }
  },

  // Get admin profile
  getAdminProfile: async (adminId) => {
    try {
      const response = await apiClient.get(`/api/admin/profile/${adminId}`);
      return response.data;
    } catch (error) {
      console.error('Get admin profile error:', error);
      throw error;
    }
  },

  // Update admin profile
  updateAdminProfile: async (adminId, profileData) => {
    try {
      const response = await apiClient.put(`/api/admin/profile/${adminId}`, profileData);
      return response.data;
    } catch (error) {
      console.error('Update admin profile error:', error);
      throw error;
    }
  },
};

export default adminsAPI; 