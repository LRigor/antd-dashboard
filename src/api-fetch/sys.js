// src/api/sys.js
import { apiClient } from '@/api-fetch/client';

export const SysAPI = {
  async setDefaultNamespace(payload) {
    const resp = await apiClient.put('/sys/setDefaultNamespace', payload, { raw: true });
    // 兼容空体 / 文本：保证返回对象
    if (!resp) return { code: 0, msg: 'ok' };           // 后端若 204，当成功处理
    if (typeof resp === 'string' && resp.trim() === '') return { code: 0, msg: 'ok' };
    if (typeof resp === 'string') {
      try { return JSON.parse(resp); } catch { return { code: 0, msg: 'ok' }; }
    }
    return resp; // 正常 JSON
  },
};
