import { apiClient, buildQueryString } from './client';
import { tokenUtils } from '../utils/auth';

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
      throw error;
    }
  },

  // Get file by ID
  getFileById: async (id) => {
    try {
      const response = await apiClient.get(`/api/file?id=${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Upload file
  uploadFile: async (file, group = 'biz') => {
    // 把 AntD Upload 的 file 安全還原成原生 File
    const raw = (file && file.originFileObj) ? file.originFileObj : file;

    // 構建 FormData
    const fd = new FormData();
    fd.append('file', raw);

    try {
      const resp = await apiClient.post('/api/file/upload', fd, {
        headers: { group },
        raw: true, // 跳過 handleApiResponse 的 {code,data} 檢查
      });

      const data = resp?.data ?? resp;
      return data; // 期望 { prefix, paths }
    } catch (err) {
      // 若 apiClient 有問題，使用原生 fetch 作為備用方案
      try {
        const token = tokenUtils.getToken();
        const resp2 = await fetch('/api/file/upload', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            group,
          },
          body: fd,
        });
        const data2 = await resp2.json().catch(() => ({}));
        if (!resp2.ok) {
          throw new Error(`fallback fetch failed: ${resp2.status}`);
        }
        return data2;
      } catch (e2) {
        throw err; // 回拋原始錯誤
      }
    }
  },

  // Update file metadata
  updateFile: async (fileData) => {
    try {
      const response = await apiClient.put('/api/file', fileData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete file
  deleteFile: async (id) => {
    try {
      const response = await apiClient.put('/api/file/del', { ids: [id] });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Download file
  downloadFile: async (id, filename = null) => {
    try {
      const token = tokenUtils.getToken();
      const response = await fetch(`/api/file/download/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
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
      throw error;
    }
  },

  // Get file preview URL 暫時沒有
  getFilePreviewUrl: (id) => {
    return `/api/file/preview/${id}`;
  },
};

export default filesAPI;
