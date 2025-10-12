import { tokenUtils } from '../utils/auth';

// ===== Base URL：預設走 /api（讓 Next middleware 注入 header 並轉發到 8000）=====
const API_BASE_URL = (process.env.NEXT_PUBLIC_BASE_API || '/api').replace(/\/+$/, '');

// ---------- helpers ----------
const pruneUndefined = (obj = {}) =>
  Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined && v !== null));

function getCookie(name) {
  if (typeof document === 'undefined') return undefined;
  const m = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
  return m ? decodeURIComponent(m[1]) : undefined;
}
const getNamespace = () => getCookie('namespace') || '1';
const getTimezone  = () => getCookie('timezone');

// ===== Common headers（合併外部 headers，並統一注入 token/namespace）=====
const getCommonHeaders = (extra = {}) => {
  const base = { 'Content-Type': 'application/json' };
  const token = tokenUtils.getToken();
  // Auth token length debug removed
  if (token) base['Authorization'] = `Bearer ${token}`;
  base['namespace'] = getNamespace();
  const tz = getTimezone();
  if (tz) base['timezone'] = tz;

  const ext = extra?.headers ? extra.headers : extra;
  return { ...base, ...(ext || {}) };
};

// 針對 FormData 的 header 統一處理：去掉 Content-Type 讓瀏覽器自帶 boundary
const makeHeaders = (extra, isFormData) => {
  const hdr = getCommonHeaders(extra);
  if (isFormData) {
    delete hdr['Content-Type'];
    delete hdr['content-type'];
  }
  return pruneUndefined(hdr);
};

// 可選：更好除錯（保留後端 code / payload）
class ApiError extends Error {
  constructor(message, { code, status, payload } = {}) {
    super(message || 'Request failed');
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
    this.payload = payload;
  }
}

export const handleApiResponse = async (response) => {
  // 先嘗試解析 JSON；若不是 JSON 再退回純文字
  let data = null;
  try {
    data = await response.clone().json();
  } catch {
    // ignore
  }
  const text = data ? null : await response.text().catch(() => null);

  // HTTP 非 2xx
  if (!response.ok) {
    if (response.status === 401) {
      tokenUtils.removeTokens();
      if (typeof window !== 'undefined') window.location.href = '/adminlogin';
      throw new ApiError('Unauthorized', { status: 401 });
    }
    const msg = (data && (data.message || data.msg)) || text || response.statusText || 'Request failed';
    throw new ApiError(msg, { code: data?.code, status: response.status, payload: data?.data });
  }

  // 業務碼不為 0：直接拋後端 message
  if (data?.code !== undefined && data.code !== 0) {
    const msg = data.message || data.msg || 'API request failed';
    throw new ApiError(msg, { code: data.code, status: response.status, payload: data?.data });
  }

  // 正常返回
  return data ?? text;
};


// ===== 主 client =====
export const apiClient = {
  get: async (url, options = {}) => {
    const { headers, ...rest } = options;
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method: 'GET',
      headers: getCommonHeaders(headers),
      ...rest,
    });
    return handleApiResponse(response);
  },

  post: async (url, data = null, options = {}) => {
    const { headers, raw, ...rest } = options;
    const isFormData = typeof FormData !== 'undefined' && data instanceof FormData;

    const resp = await fetch(`${API_BASE_URL}${url}`, {
      method: 'POST',
      headers: makeHeaders(headers, isFormData),
      body: isFormData ? data : (data ? JSON.stringify(data) : undefined),
      ...rest,
    });

    if (raw) {
      const ct = resp.headers.get('content-type') || '';
      return ct.includes('application/json') ? await resp.json() : await resp.text();
    }
    return handleApiResponse(resp);
  },

  put: async (url, data = null, options = {}) => {
    const { headers, raw, ...rest } = options;
    const isFormData = typeof FormData !== 'undefined' && data instanceof FormData;

    const resp = await fetch(`${API_BASE_URL}${url}`, {
      method: 'PUT',
      headers: makeHeaders(headers, isFormData),
      body: isFormData ? data : (data ? JSON.stringify(data) : undefined),
      ...rest,
    });

    if (raw) {
      const ct = resp.headers.get('content-type') || '';
      return ct.includes('application/json') ? await resp.json() : await resp.text();
    }
    return handleApiResponse(resp);
  },

  patch: async (url, data = null, options = {}) => {
    const { headers, raw, ...rest } = options;
    const isFormData = typeof FormData !== 'undefined' && data instanceof FormData;

    const resp = await fetch(`${API_BASE_URL}${url}`, {
      method: 'PATCH',
      headers: makeHeaders(headers, isFormData),
      body: isFormData ? data : (data ? JSON.stringify(data) : undefined),
      ...rest,
    });

    if (raw) {
      const ct = resp.headers.get('content-type') || '';
      return ct.includes('application/json') ? await resp.json() : await resp.text();
    }
    return handleApiResponse(resp);
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
};

// 查詢字串工具
export const buildQueryString = (params) => {
  if (!params || Object.keys(params).length === 0) return '';
  const sp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') sp.append(k, v);
  });
  return sp.toString();
};




export { API_BASE_URL };
