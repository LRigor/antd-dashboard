// utils/auth.js
'use client';

import { jwtDecode } from 'jwt-decode';

/** ==== Keys（統一成同一把鑰匙） ==== */
const TOKEN_KEY = 'token';
const REFRESH_TOKEN_KEY = 'refresh-token';

/** ==== 開發用：產生 mock JWT（可保留） ==== */
export const createMockJWT = (payload, expiresIn = 3600) => {
  const header = { alg: 'HS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const tokenPayload = { ...payload, iat: now, exp: now + expiresIn };
  const enc = (obj) => btoa(unescape(encodeURIComponent(JSON.stringify(obj))));
  const encodedHeader = enc(header);
  const encodedPayload = enc(tokenPayload);
  const mockSignature = btoa(unescape(encodeURIComponent('mock-signature-for-development')));
  return `${encodedHeader}.${encodedPayload}.${mockSignature}`;
};

/** ==== Token Utils ==== */
export const tokenUtils = {
  /** 同時寫入 LocalStorage + Cookie（供不同讀取路徑使用） */
  setTokens: (accessToken, refreshToken = null) => {
    console.log('[tokenUtils.setTokens] len=', accessToken?.length || 0);
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem(TOKEN_KEY, accessToken);
      if (refreshToken) localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);

      // Cookie：本地/同站用 Lax；不要設 HttpOnly 才能被前端讀取
      document.cookie = `${TOKEN_KEY}=${accessToken}; Path=/; Max-Age=3600; SameSite=Lax`;
      if (refreshToken) {
        document.cookie = `${REFRESH_TOKEN_KEY}=${refreshToken}; Path=/; Max-Age=604800; SameSite=Lax`;
      }
      // console.log('[tokenUtils] setTokens len=', accessToken?.length || 0);
    } catch (e) {
      console.error('[tokenUtils] setTokens error:', e);
    }
  },

  /** 先讀 LS，沒有再從 Cookie 讀 */
  getToken: () => {
    if (typeof window === 'undefined') return null;
    const ls = localStorage.getItem('token');
    const ck = (document.cookie.match(/(?:^|; )token=([^;]+)/)?.[1]) || '';
    const val = ls || (ck ? decodeURIComponent(ck) : '');
    console.log('[tokenUtils.getToken] ls.len=', ls?.length || 0, 'ck.len=', ck?.length || 0, 'ret.len=', val?.length || 0);
    return val;
  },

  getRefreshToken: () => {
    if (typeof window === 'undefined') return null;
    const ls = localStorage.getItem(REFRESH_TOKEN_KEY);
    if (ls) return ls;
    const m = document.cookie.match(/(?:^|; )refresh-token=([^;]+)/);
    return m ? decodeURIComponent(m[1]) : null;
  },

  removeTokens: () => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      document.cookie = `${TOKEN_KEY}=; Path=/; Max-Age=0`;
      document.cookie = `${REFRESH_TOKEN_KEY}=; Path=/; Max-Age=0`;
    } catch (e) {
      console.error('[tokenUtils] removeTokens error:', e);
    }
  },

  /** 沒有 exp 視為有效（部分後端不帶 exp） */
  isTokenValid: (token) => {
    if (!token) return false;
    try {
      const decoded = jwtDecode(token);
      if (!decoded || typeof decoded.exp !== 'number') return true;
      return decoded.exp > Date.now() / 1000;
    } catch (error) {
      // console.error('Token validation error:', error);
      return false;
    }
  },

  getTokenPayload: (token) => {
    if (!token) return null;
    try {
      return jwtDecode(token);
    } catch (error) {
      console.error('Token decode error:', error);
      return null;
    }
  },

  /** 距到期 <5 分鐘 */
  isTokenExpiringSoon: (token) => {
    if (!token) return true;
    try {
      const decoded = jwtDecode(token);
      if (!decoded || typeof decoded.exp !== 'number') return false;
      return decoded.exp - Date.now() / 1000 < 5 * 60;
    } catch {
      return true;
    }
  },
};

/** ====（Legacy）相容舊呼叫；實作仍走新的 api-fetch ==== */
export const authAPI = {
  apiCall: async (url, options = {}) => {
    const { apiClient } = await import('../api-fetch/client');

    let token = tokenUtils.getToken();
    if (!tokenUtils.isTokenValid(token)) {
      try {
        const { authAPI: newAuth } = await import('../api-fetch/auth');
        token = await newAuth.refreshToken(); // 可能沒有也沒關係
      } catch (error) {
        if (typeof window !== 'undefined') window.location.href = '/adminlogin';
        throw error;
      }
    }

    // 交給新的 apiClient（它會自動從 tokenUtils 取 token 並加 Authorization）
    return apiClient.get(url, options);
  },
};

export default tokenUtils;
