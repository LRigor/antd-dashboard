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

  // Upload file（已加最小必要的 log／穩定性處理）
  uploadFile: async (file, group = 'biz') => {
    // ★ 把 AntD Upload 的 file 安全還原成原生 File
    const raw = (file && file.originFileObj) ? file.originFileObj : file;

    // ★ 基本資訊
    console.log('[filesAPI] uploadFile:start', {
      name: raw?.name || file?.name,
      size: raw?.size || file?.size,
      type: raw?.type || file?.type,
      hasOriginFileObj: !!file?.originFileObj,
      isFile: (typeof File !== 'undefined') ? (raw instanceof File) : 'no-File-ctor',
      group,
    });

    // ★ 構建 FormData
    const fd = new FormData();
    fd.append('file', raw);

    // ★ 列出 FormData 內容（只顯示鍵名與檔案摘要）
    try {
      const table = [];
      // entries() 在瀏覽器可用
      // eslint-disable-next-line no-undef
      for (const [k, v] of fd.entries()) {
        if (v instanceof File) {
          table.push({ key: k, type: 'File', name: v.name, size: v.size });
        } else {
          table.push({ key: k, type: typeof v, value: String(v).slice(0, 80) });
        }
      }
      console.table(table);
    } catch (e) {
      console.warn('[filesAPI] dump FormData failed:', e);
    }

    // ★ 組 Header（千萬不要自己設 Content-Type）
    let headers;
    try {
      const token =
        (typeof Cookies !== 'undefined' && Cookies.get)
          ? (Cookies.get('token') || '')
          : (localStorage.getItem('auth-token') || '');

      headers = {
        Authorization: `Bearer ${token}`,
        group,
      };
      console.log('[filesAPI] POST /api/file/upload headers =', headers);

      // ★ 關鍵：不覆寫 Content-Type；並避免 transformRequest 把 FormData 轉 JSON
      const axiosLikeBypass = { transformRequest: [(d) => d] };

      const resp = await apiClient.post('/api/file/upload', fd, {
        headers: { group: 'biz' },
        raw: true, // 跳過 handleApiResponse 的 {code,data} 檢查
      });

      // ★ 可觀察最終請求頭（若是 axios，常掛在 resp.config.headers）
      console.log('[filesAPI] uploadFile:response meta =', {
        status: resp?.status,
        reqCT:
          resp?.config?.headers?.['Content-Type'] ??
          resp?.config?.headers?.['content-type'] ??
          '(not set here, should be auto with boundary)',
      });

      const data = resp?.data ?? resp;
      console.log('[filesAPI] uploadFile:success data =', data);
      return data; // 期望 { prefix, paths }
    } catch (err) {
      console.error('[filesAPI] uploadFile:error', err, ' lastHeaders=', headers);

      // ★ 若懷疑是 apiClient 轉型問題，可退回原生 fetch 再試一次（不影響原本流程）
      try {
        console.warn('[filesAPI] fallback: trying native fetch once');
        const token =
          (typeof Cookies !== 'undefined' && Cookies.get)
            ? (Cookies.get('token') || '')
            : (localStorage.getItem('auth-token') || '');

        const resp2 = await fetch('/api/file/upload', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            group,
            // 刻意不設 Content-Type，讓瀏覽器自動帶 boundary
          },
          body: fd,
        });
        const data2 = await resp2.json().catch(() => ({}));
        console.log('[filesAPI] fallback fetch result:', resp2.status, data2);
        if (!resp2.ok) {
          throw new Error(`fallback fetch failed: ${resp2.status}`);
        }
        return data2;
      } catch (e2) {
        console.error('[filesAPI] fallback fetch error:', e2);
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
