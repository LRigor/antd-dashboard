import { apiClient, buildQueryString } from './client';

// Operation logs API endpoints
export const operationLogsAPI = {
  // Get operation logs list with pagination
  getOperationLogsList: async (params = {}) => {
    const { page = 1, size = 10, ...otherParams } = params;
    const queryString = buildQueryString({ page, size, ...otherParams });
    const url = `/api/operationLog/list${queryString ? `?${queryString}` : ''}`;
    
    try {
      const response = await apiClient.get(url);
      return response.data;
    } catch (error) {
      console.error('Get operation logs list error:', error);
      throw error;
    }
  },

  // Get operation log by ID
  getOperationLogById: async (id) => {
    try {
      const response = await apiClient.get(`/api/operationLog?id=${id}`);
      return response.data;
    } catch (error) {
      console.error('Get operation log by ID error:', error);
      throw error;
    }
  },

  // Delete operation log
  deleteOperationLog: async (id) => {
    try {
      const response = await apiClient.put('/api/operationLog/del', { id });
      return response.data;
    } catch (error) {
      console.error('Delete operation log error:', error);
      throw error;
    }
  },

  // Delete multiple operation logs
  deleteMultipleOperationLogs: async (ids) => {
    try {
      const response = await apiClient.put('/api/operationLog/del', { ids });
      return response.data;
    } catch (error) {
      console.error('Delete multiple operation logs error:', error);
      throw error;
    }
  },

  // Get operation logs by user
  getOperationLogsByUser: async (userId, params = {}) => {
    const { page = 1, size = 10, ...otherParams } = params;
    const queryString = buildQueryString({ page, size, userId, ...otherParams });
    const url = `/api/operationLog/user${queryString ? `?${queryString}` : ''}`;
    
    try {
      const response = await apiClient.get(url);
      return response.data;
    } catch (error) {
      console.error('Get operation logs by user error:', error);
      throw error;
    }
  },

  // Get operation logs by date range
  getOperationLogsByDateRange: async (startDate, endDate, params = {}) => {
    const { page = 1, size = 10, ...otherParams } = params;
    const queryString = buildQueryString({ 
      page, 
      size, 
      startDate, 
      endDate, 
      ...otherParams 
    });
    const url = `/api/operationLog/date-range${queryString ? `?${queryString}` : ''}`;
    
    try {
      const response = await apiClient.get(url);
      return response.data;
    } catch (error) {
      console.error('Get operation logs by date range error:', error);
      throw error;
    }
  },

  // Export operation logs
  exportOperationLogs: async (params = {}) => {
    try {
      const queryString = buildQueryString(params);
      const url = `/api/operationLog/export${queryString ? `?${queryString}` : ''}`;
      
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
      a.download = `operation-logs-${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url2);
      document.body.removeChild(a);

      return { success: true };
    } catch (error) {
      console.error('Export operation logs error:', error);
      throw error;
    }
  },
};

export default operationLogsAPI; 