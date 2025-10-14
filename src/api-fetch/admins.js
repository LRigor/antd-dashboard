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
      const data = res?.data || {};
      const list = Array.isArray(data?.list) ? data.list : [];
      const total = Number(data?.total) || 0;
      return res;
    } catch (error) { 
      throw error;
    }
  },

  // Get admin by ID
  getAdminById: async (id) => {
    const url = `/api/admin?id=${id}`;
    try {
      const res = await apiClient.get(url);
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
    const t0 = performance.now();
  
    // ▶️ 發請求前
    console.log('[adminsAPI.getAdminInfo] ->', url);
  
    try {
      const res = await apiClient.get(url);
  
      // ◀️ 拿到回應後（只列關鍵欄位，避免太吵）
      const ms = (performance.now() - t0).toFixed(1);
      console.log('[adminsAPI.getAdminInfo] <-', url, `${ms}ms`, {
        code: res?.code,
        hasData: !!res?.data,
        namespacesBrief: Array.isArray(res?.data?.namespaces)
          ? res.data.namespaces.map(n => ({
              ns: n?.namespace,
              icon: n?.icon,
            }))
          : res?.data?.namespaces
      });
  
      return res; // ✅ 保持原本行為
    } catch (err) {
      const ms = (performance.now() - t0).toFixed(1);
      console.error('[adminsAPI.getAdminInfo] x', url, `${ms}ms`, {
        message: err?.message,
        status: err?.response?.status,
      });
      throw err; // ✅ 保持原本行為
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




