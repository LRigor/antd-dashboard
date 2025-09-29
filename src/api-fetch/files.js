import { useEffect } from 'react';
import { apiClient, buildQueryString } from './client';
import Cookies from 'js-cookie';

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
uploadFile: async (file, group = 'biz') => {
  console.log('[filesAPI] uploadFile:start', { name: file?.name, size: file?.size, type: file?.type, group });

  const fd = new FormData();
  fd.append('file', file);

  let headers; // ← 先在外层声明，catch 才能访问
  try {
    const token =
      (typeof Cookies !== 'undefined' && Cookies.get) ? (Cookies.get('token') || '') :
      (localStorage.getItem('auth-token') || '');

    headers = {
      Authorization: `Bearer ${token}`,
      group,
    };
    console.log('[filesAPI] POST /api/file/upload headers =', headers);

    const resp = await apiClient.post('/api/file/upload', fd, { headers });
    const data = resp?.data ?? resp;

    console.log('[filesAPI] uploadFile:success data =', data);
    return data; // 期望 { prefix, paths }
  } catch (err) {
    console.error('[filesAPI] uploadFile:error', err, ' lastHeaders=', headers);
    throw err;
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
      const response = await apiClient.put('/api/file/del', { ids: [id] });
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

  // Get file preview URL 暫時沒有
  getFilePreviewUrl: (id) => {
    return `/api/file/preview/${id}`;
  },
};

export default filesAPI; 
