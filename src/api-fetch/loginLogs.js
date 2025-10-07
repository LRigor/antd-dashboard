import { apiClient, buildQueryString } from './client';

// Login logs API endpoints
export const loginLogsAPI = {
  // Get login logs list with pagination
  getLoginLogsList: async (params = {}) => {
    const { page = 1, size = 10, ...otherParams } = params;
    
    const queryString = buildQueryString({ page, size, ...otherParams });
    const url = `/api/admin/loginLog/list${queryString ? `?${queryString}` : ''}`;

    const response = await apiClient.get(url);
    return response.data;
  },

  // Get login log by ID (注意：当前是 PUT 到 /api/admin/loginLog，行为等同删除接口；仅加日志不改动)
  getLoginLogById: async (id) => {
    const body = { ids: [id] };
    const response = await apiClient.put('/api/admin/loginLog', body);
    return response.data;
  },

  // Delete login log
  deleteLoginLog: async (id) => {
    const body = { ids: [id] };
    const response = await apiClient.put('/api/admin/loginLog', body);
    return response.data;
  },

  // Delete multiple login logs
  deleteMultipleLoginLogs: async (ids) => {
    const body = { ids };
    const response = await apiClient.put('/api/admin/loginLog', body);
    return response.data;
  },

  // Get login logs by user
  getLoginLogsByUser: async (userId, params = {}) => {
    const { page = 1, size = 10, ...otherParams } = params;
    const queryString = buildQueryString({ page, size, userId, ...otherParams });
    const url = `/api/admin/loginLog/user${queryString ? `?${queryString}` : ''}`;

    const response = await apiClient.get(url);
    return response.data;
  },

  // Get login logs by date range
  getLoginLogsByDateRange: async (startDate, endDate, params = {}) => {
    const { page = 1, size = 10, ...otherParams } = params;
    const queryString = buildQueryString({ page, size, startDate, endDate, ...otherParams });
    const url = `/api/admin/loginLog/date-range${queryString ? `?${queryString}` : ''}`;

    const response = await apiClient.get(url);
    return response.data;
  },

  // Get login statistics
  getLoginStatistics: async (params= {}) => {
    const queryString = buildQueryString(params);
    const url = `/api/admin/loginLog/statistics${queryString ? `?${queryString}` : ''}`;

    const response = await apiClient.get(url);
    return response.data;
  },

  // Export login logs
  exportLoginLogs: async (params = {}) => {
    const queryString = buildQueryString(params);
    const url = `/api/admin/loginLog/export${queryString ? `?${queryString}` : ''}`;

    const token = typeof window !== 'undefined' ? localStorage.getItem('auth-token') : '';

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token || ''}`,
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
  },
};

export default loginLogsAPI;
