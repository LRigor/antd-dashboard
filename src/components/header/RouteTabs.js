// RouteTabs.js
'use client';

import { useEffect, useState, useMemo } from 'react';
import { Tabs, Button, App, Tooltip } from 'antd';
import { usePathname, useRouter } from 'next/navigation';
import { CloseOutlined } from '@ant-design/icons';



const STORAGE_TABS = 'route-tabs';
const TITLE_KEY = (path) => `route-title:${path}`;
// 可選：固定保留的首頁 key（若不需要就設為 null）
const PINNED_KEY = null; // 例如 '/dashboard'

function getTitle(path) {
  if (!path) return '';
  try {
    const t = sessionStorage.getItem(TITLE_KEY(path));
    if (t) return t;
  } catch {}
  return path;
}

export default function RouteTabs() {
  const pathname = usePathname();
  const router = useRouter();
  const { message } = App.useApp();

  const [items, setItems] = useState([]);
  const [activeKey, setActiveKey] = useState('');
  const [pendingNav, setPendingNav] = useState(null);

  // 恢復 tabs
  useEffect(() => {
    if (!pendingNav) return;
    if (pendingNav !== pathname) router.push(pendingNav);
    setPendingNav(null);
  }, [pendingNav, pathname, router]);

  // 同步當前路由到 tabs
  useEffect(() => {
    if (!pathname) return;
    setItems((old) => {
      const exists = old.some((t) => t.key === pathname);
      const label = getTitle(pathname);
      const next = exists
        ? old.map((t) => (t.key === pathname ? { ...t, label } : t))
        : [...old, { key: pathname, label, path: pathname }];
      sessionStorage.setItem(STORAGE_TABS, JSON.stringify(next));
      return next;
    });
    setActiveKey(pathname);
  }, [pathname]);

  // 監聽頁面標題更新
  useEffect(() => {
    const handler = (e) => {
      const { path, title } = e.detail || {};
      if (!path || !title) return;
      setItems((old) => {
        const next = old.map((t) => (t.key === path ? { ...t, label: title } : t));
        sessionStorage.setItem(STORAGE_TABS, JSON.stringify(next));
        return next;
      });
    };
    window.addEventListener('route-title-updated', handler);
    return () => window.removeEventListener('route-title-updated', handler);
  }, []);

  const onChange = (key) => {
    setActiveKey(key);
    if (key !== pathname) router.push(key);
  };

  const remove = (targetKey) => {
    let nextRoute = null;
  
    setItems((old) => {
      const idx = old.findIndex((t) => t.key === targetKey);
      if (idx === -1) return old;
  
      const next = old.filter((t) => t.key !== targetKey);
  
      if (targetKey === activeKey) {
        const fallback = next[idx - 1] ?? next[idx] ?? null;
        nextRoute = fallback?.key ?? '/';
      }
      sessionStorage.setItem(STORAGE_TABS, JSON.stringify(next));
      return next;
    });
  
    if (nextRoute) {
      setActiveKey(nextRoute);   // ← 放到更新器外
      setPendingNav(nextRoute);  // ← 交给 effect 里统一 router.push
    }
  };
  

  // ✅ 正確版：只保留當前（可選保留固定首頁）
  function closeOther() {
    let nextRoute = null;
  
    setItems((old) => {
      const keep = new Set([activeKey]);
      if (PINNED_KEY) keep.add(PINNED_KEY);
      const next = old.filter((t) => keep.has(t.key));
  
      sessionStorage.setItem(STORAGE_TABS, JSON.stringify(next));
  
      // 计算收敛后的有效页签
      const to = next.find((t) => t.key === activeKey)?.key ?? next[0]?.key ?? '/';
      nextRoute = to;
  
      return next;
    });
  
    if (nextRoute) {
      setActiveKey(nextRoute);    // ← 更新器外
      setPendingNav(nextRoute);   // ← 交给 effect 里统一 router.push
    }
  }
  

  // 把「關閉其它」按鈕放到 Tabs 右側，避免被裁切
  const extraRight = useMemo(
    () =>
      items.length > 1 ? (
        <Tooltip title="关闭其它页签">
          <Button
            type="text"
            shape="circle"
            size="small"
            icon={<CloseOutlined />}
            onClick={closeOther}
            className="tab-close-others-btn"
          />
        </Tooltip>
      ) : null,
    [items, activeKey]
  );

  return (
    <div
      className="bg-white px-3 pt-2 pb-0 border-b"
      style={{ borderColor: 'var(--ant-color-border)' }}
    >
      <Tabs
        hideAdd
        type="editable-card"
        items={items.map((t) => ({ key: t.key, label: t.label }))}
        activeKey={activeKey}
        onChange={onChange}
        onEdit={(targetKey, action) => {
          if (action === 'remove' && typeof targetKey === 'string') {
            if (items.length <= 1) return;
            remove(targetKey);
          }
        }}
        tabBarExtraContent={{ right: extraRight }}
      />
    </div>
  );
}

export function useRouteTitle(title) {
  const pathname = usePathname();
  useEffect(() => {
    if (!pathname || !title) return;
    try {
      sessionStorage.setItem(TITLE_KEY(pathname), title);
    } catch {}
    window.dispatchEvent(
      new CustomEvent('route-title-updated', { detail: { path: pathname, title } })
    );
  }, [pathname, title]);
}
