import { apiClient, buildQueryString } from './client';

// File management API endpoints
export const filesAPI = {
  // Get files list with pagination
  getFilesList: async (params = {}) => {
    const { page = 1, size = 10, ...otherParams } = params;
    const queryString = buildQueryString({ page, size, ...otherParams });
    const url = `/api/file/list${queryString ? `?${queryString}` : ''}`;
    
    try {
      const response = await apiClient.get(url, { namespace: 1 });
      return response.data;
    } catch (error) {
      console.error('Get files list error:', error);
      throw error;
    }
  },

  // Get file by ID
  getFileById: async (id) => {
    try {
      const response = await apiClient.get(`/api/file?id=${id}`);
      return response.data;
    } catch (error) {
      console.error('Get file by ID error:', error);
      throw error;
    }
  },

  // Upload file
  uploadFile: async (fileData, onProgress = null) => {
    try {
      // For file uploads, we need to handle FormData differently
      const formData = new FormData();
      
      if (fileData.file) {
        formData.append('file', fileData.file);
      }
      
      // Add other metadata
      Object.keys(fileData).forEach(key => {
        if (key !== 'file') {
          formData.append(key, fileData[key]);
        }
      });

      const response = await fetch('/api/file', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth-token')}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.code !== undefined && data.code !== 0) {
        throw new Error(data.message || 'File upload failed');
      }

      return data.data;
    } catch (error) {
      console.error('Upload file error:', error);
      throw error;
    }
  },

  // Update file metadata
  updateFile: async (fileData) => {
    try {
      const response = await apiClient.put('/api/file', fileData);
      return response.data;
    } catch (error) {
      console.error('Update file error:', error);
      throw error;
    }
  },

  // Delete file
  deleteFile: async (id) => {
    try {
      const response = await apiClient.put('/api/file/del', { id });
      return response.data;
    } catch (error) {
      console.error('Delete file error:', error);
      throw error;
    }
  },

  // Download file
  downloadFile: async (id, filename = null) => {
    try {
      const response = await fetch(`/api/file/download/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth-token')}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename || `file-${id}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      return { success: true };
    } catch (error) {
      console.error('Download file error:', error);
      throw error;
    }
  },

  // Get file preview URL
  getFilePreviewUrl: (id) => {
    return `/api/file/preview/${id}`;
  },
};

export default filesAPI; 