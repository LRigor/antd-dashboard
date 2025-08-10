import { apiClient, buildQueryString } from './client';

// Login logs API endpoints
export const loginLogsAPI = {
  // Get login logs list with pagination
  getLoginLogsList: async (params = {}) => {
    const { page = 1, size = 10, ...otherParams } = params;
    const queryString = buildQueryString({ page, size, ...otherParams });
    const url = `/api/admin/loginLog/list${queryString ? `?${queryString}` : ''}`;
    
    try {
      const response = await apiClient.get(url);
      return response.data;
    } catch (error) {
      console.error('Get login logs list error:', error);
      throw error;
    }
  },

  // Get login log by ID
  getLoginLogById: async (id) => {
    try {
      const response = await apiClient.get(`/api/admin/loginLog?id=${id}`);
      return response.data;
    } catch (error) {
      console.error('Get login log by ID error:', error);
      throw error;
    }
  },

  // Delete login log
  deleteLoginLog: async (id) => {
    try {
      const response = await apiClient.put('/api/admin/loginLog', { id });
      return response.data;
    } catch (error) {
      console.error('Delete login log error:', error);
      throw error;
    }
  },

  // Delete multiple login logs
  deleteMultipleLoginLogs: async (ids) => {
    try {
      const response = await apiClient.put('/api/admin/loginLog', { ids });
      return response.data;
    } catch (error) {
      console.error('Delete multiple login logs error:', error);
      throw error;
    }
  },

  // Get login logs by user
  getLoginLogsByUser: async (userId, params = {}) => {
    const { page = 1, size = 10, ...otherParams } = params;
    const queryString = buildQueryString({ page, size, userId, ...otherParams });
    const url = `/api/admin/loginLog/user${queryString ? `?${queryString}` : ''}`;
    
    try {
      const response = await apiClient.get(url);
      return response.data;
    } catch (error) {
      console.error('Get login logs by user error:', error);
      throw error;
    }
  },

  // Get login logs by date range
  getLoginLogsByDateRange: async (startDate, endDate, params = {}) => {
    const { page = 1, size = 10, ...otherParams } = params;
    const queryString = buildQueryString({ 
      page, 
      size, 
      startDate, 
      endDate, 
      ...otherParams 
    });
    const url = `/api/admin/loginLog/date-range${queryString ? `?${queryString}` : ''}`;
    
    try {
      const response = await apiClient.get(url);
      return response.data;
    } catch (error) {
      console.error('Get login logs by date range error:', error);
      throw error;
    }
  },

  // Get login statistics
  getLoginStatistics: async (params = {}) => {
    try {
      const queryString = buildQueryString(params);
      const url = `/api/admin/loginLog/statistics${queryString ? `?${queryString}` : ''}`;
      
      const response = await apiClient.get(url);
      return response.data;
    } catch (error) {
      console.error('Get login statistics error:', error);
      throw error;
    }
  },

  // Export login logs
  exportLoginLogs: async (params = {}) => {
    try {
      const queryString = buildQueryString(params);
      const url = `/api/admin/loginLog/export${queryString ? `?${queryString}` : ''}`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth-token')}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();
      const url2 = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url2;
      a.download = `login-logs-${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url2);
      document.body.removeChild(a);

      return { success: true };
    } catch (error) {
      console.error('Export login logs error:', error);
      throw error;
    }
  },
};

export default loginLogsAPI; 