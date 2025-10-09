import { apiClient, buildQueryString } from './client';

// Admin management API endpoints
export const adminsAPI = {
  // Get admins list with pagination
  getAdminsList: async (params = {}) => {
    const { page = 1, size = 10, ...otherParams } = params;
    const queryString = buildQueryString({ page, size, ...otherParams });
    const url = `/api/admin/list${queryString ? `?${queryString}` : ''}`;
    try {
      const res = await apiClient.get(url);
      return res;
    } catch (error) { 
      throw error;
    }
  },

  // Get admin by ID
  getAdminById: async (id) => {
    try {
      const res = await apiClient.get(`/api/admin?id=${id}`);
      return res;
    } catch (error) {
      throw error;
    }
  },

  // Create new admin
  createAdmin: async (adminData) => {
    try {
      const res = await apiClient.post('/api/admin', adminData);
      return res;
    } catch (error) {
      throw error;
    }
  },

  // Update existing admin
  updateAdmin: async (adminData) => {
    try {
      const res = await apiClient.put('/api/admin', adminData);
      return res;
    } catch (error) {
      throw error;
    }
  },

  // Delete admin
  deleteAdmin: async (id) => {
    try {
      const res = await apiClient.put('/api/admin/del', { ids: [id] });
      return res;
    } catch (error) {
      throw error;
    }
  },

  // Change admin password
  changePassword: async (adminId, passwordData) => {
    try {
      const res = await apiClient.put(`/api/admin/${adminId}/password`, passwordData);
      return res;
    } catch (error) {
      throw error;
    }
  },

  // Get admin profile
  getAdminProfile: async (adminId) => {
    try {
      const res = await apiClient.get(`/api/admin/profile/${adminId}`);
      return res;
    } catch (error) {
      throw error;
    }
  },

  // ✅ Get admin info（依賴 apiClient 統一注入 Authorization/namespace）
  getAdminInfo: async () => {
    const url = '/api/admin/info';
    try {
      const res = await apiClient.get(url);
      // res 形如 { code, message, data }
      return res;
    } catch (err) {
      throw err;
    }
  },

  // Update admin profile
  updateAdminProfile: async (adminId, profileData) => {
    try {
      const res = await apiClient.put(`/api/admin/profile/${adminId}`, profileData);
      return res;
    } catch (error) {
      throw error;
    }
  },
};

export default adminsAPI;
