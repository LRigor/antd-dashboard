// utils/auth.js
'use client';

import { jwtDecode } from 'jwt-decode';

// Token 鍵值
const TOKEN_KEY = 'token';
const REFRESH_TOKEN_KEY = 'refresh-token';


// Token 工具函數
export const tokenUtils = {
  // 同時寫入 LocalStorage 和 Cookie
  setTokens: (accessToken, refreshToken = null) => {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem(TOKEN_KEY, accessToken);
      if (refreshToken) localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);

      // 設置 Cookie 供跨標籤頁存取
      document.cookie = `${TOKEN_KEY}=${accessToken}; Path=/; Max-Age=3600; SameSite=Lax`;
      if (refreshToken) {
        document.cookie = `${REFRESH_TOKEN_KEY}=${refreshToken}; Path=/; Max-Age=604800; SameSite=Lax`;
      }
    } catch (e) {
      // 靜默錯誤處理
    }
  },

  // 先從 LocalStorage 讀取，沒有再從 Cookie 讀取
  getToken: () => {
    if (typeof window === 'undefined') return null;
    const ls = localStorage.getItem('token');
    const ck = (document.cookie.match(/(?:^|; )token=([^;]+)/)?.[1]) || '';
    const val = ls || (ck ? decodeURIComponent(ck) : '');
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
      // 靜默錯誤處理
    }
  },

  // 檢查 Token 是否有效（沒有 exp 欄位視為有效）
  isTokenValid: (token) => {
    if (!token) return false;
    try {
      const decoded = jwtDecode(token);
      if (!decoded || typeof decoded.exp !== 'number') return true;
      return decoded.exp > Date.now() / 1000;
    } catch (error) {
      return false;
    }
  },

  getTokenPayload: (token) => {
    if (!token) return null;
    try {
      return jwtDecode(token);
    } catch (error) {
      return null;
    }
  },

  // 檢查 Token 是否在 5 分鐘內過期
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


export default tokenUtils;

  