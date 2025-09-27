import { apiClient, buildQueryString } from './client';
import { tokenUtils } from '../utils/auth';

export const SysAPI = {
  // 取命名空間列表
  listNamespace: async (params) => {
    const res = await apiClient.get('/sys/namespace/list', { params })
    return res.data            // 只回 data，呼叫端更乾淨
  },

  // 設為預設命名空間
  setDefaultNamespace: ({ namespace }) =>
    apiClient.put('/api/admin/setDefaultNamespace', { namespace: Number(namespace) })
      .then(r => r.data),
}
