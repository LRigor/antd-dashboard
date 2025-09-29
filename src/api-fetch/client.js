import { tokenUtils } from '../utils/auth';

// ===== Base URL：預設走 /api（讓 Next middleware 注入 header 並轉發到 8000）=====
const API_BASE_URL = (process.env.NEXT_PUBLIC_BASE_API || '/api').replace(/\/+$/, '');


// 小工具：讀 cookie（不想用 js-cookie 時）
function getCookie(name) {
  if (typeof document === 'undefined') return undefined;
  const m = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
  return m ? decodeURIComponent(m[1]) : undefined;
}
const getNamespace = () => getCookie('namespace') || '1';
const getTimezone  = () => getCookie('timezone'); // 若後端要

// ===== Common headers（合併外部 headers，並統一注入 token/namespace）=====
const getCommonHeaders = (extra = {}) => {
  const base = {
    'Content-Type': 'application/json',
  };
  const token = tokenUtils.getToken();
  console.log('[apiClient] auth.len =', token ? token.length : 0);
  if (token) base['Authorization'] = `Bearer ${token}`;
  base['namespace'] = getNamespace();           // ⭐ 關鍵：帶上 namespace
  const tz = getTimezone();
  if (tz) base['timezone'] = tz;                // 需要就帶

  // 允許呼叫端傳 headers 或直接傳 key/value
  const ext = extra.headers ? extra.headers : extra;
  return { ...base, ...(ext || {}) };
};

// ===== 統一處理回應 =====
const handleApiResponse = async (response) => {
  if (!response.ok) {
    if (response.status === 401) {
      tokenUtils.removeTokens();
      if (typeof window !== 'undefined') window.location.href = '/adminlogin';
      throw new Error('Unauthorized');
    }
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = await response.json();
  if (data.code !== undefined && data.code !== 0) {
    throw new Error(data.message || 'API request failed');
  }
  return data;
};

// ===== 主 client（確保 options.headers 會被合併，而不是整個 options 傳進 headers）=====
export const apiClient = {
  get: async (url, options = {}) => {
    console.log('[apiClient.GET]', url);
    const { headers, ...rest } = options;
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method: 'GET',
      headers: getCommonHeaders(headers),
      ...rest,
    });
    return handleApiResponse(response);
  },

 // 在 apiClient.post / apiClient.put 內都做這個判斷（post 必要，put 視需求）
post: async (url, data = null, options = {}) => {
  const { headers, ...rest } = options;
  const isFormData = typeof FormData !== 'undefined' && data instanceof FormData;

  const response = await fetch(`${API_BASE_URL}${url}`, {
    method: 'POST',
    // 若是 FormData：不要設 Content-Type；否則就走原有 headers
    headers: isFormData ? getCommonHeaders({ ...headers, 'Content-Type': undefined })
                        : getCommonHeaders(headers),
    body: isFormData ? data : (data ? JSON.stringify(data) : undefined),
    ...rest,
  });
  return handleApiResponse(response);
},


  put: async (url, data = null, options = {}) => {
    const { headers, ...rest } = options;
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method: 'PUT',
      headers: isFormData ? getCommonHeaders({ ...headers, 'Content-Type': undefined })
      : getCommonHeaders(headers),
      body: data ? JSON.stringify(data) : undefined,
      ...rest,
    });
    return handleApiResponse(response);
  },

  delete: async (url, options = {}) => {
    const { headers, ...rest } = options;
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method: 'DELETE',
      headers: getCommonHeaders(headers),
      ...rest,
    });
    return handleApiResponse(response);
  },

  patch: async (url, data = null, options = {}) => {
    const { headers, ...rest } = options;
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method: 'PATCH',
      headers: getCommonHeaders(headers),
      body: data ? JSON.stringify(data) : undefined,
      ...rest,
    });
    return handleApiResponse(response);
  },
};

// 查詢字串工具保留不動
export const buildQueryString = (params) => {
  if (!params || Object.keys(params).length === 0) return '';
  const sp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') sp.append(k, v);
  });
  return sp.toString();
};

export { API_BASE_URL };
