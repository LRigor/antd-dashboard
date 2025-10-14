// RouteTabs.js
'use client';

import { useEffect, useState } from 'react';
import { Tabs, Button, App, Space, Tooltip } from 'antd';
import { usePathname, useRouter } from 'next/navigation';
import { CloseOutlined } from '@ant-design/icons';

const STORAGE_TABS = 'route-tabs';
const TITLE_KEY = (path) => `route-title:${path}`;

// ✅ 统一取标题：优先 storage（由页面登记），再 fallback 为 path
function getTitle(path) {
  if (!path) return '';
  try {
    const t = sessionStorage.getItem(TITLE_KEY(path));
    if (t) return t;
  } catch {}
  return path; // fallback
}

export default function RouteTabs() {
  const pathname = usePathname();
  const router = useRouter();
  const { message } = App.useApp();

  const [items, setItems] = useState([]);
  const [activeKey, setActiveKey] = useState('');

  // 恢复 tabs
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_TABS);
      if (raw) {
        const restored = JSON.parse(raw).map((t) => ({
          ...t,
          label: getTitle(t.key), // 恢复时同步标题
        }));
        setItems(restored);
      }
    } catch {}
  }, []);

  // 同步当前路由到 tabs（用登记的标题）
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

  // 🔔 监听页面标题变更事件，实时更新当前 tab 文案
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
    setItems((old) => {
      const idx = old.findIndex((t) => t.key === targetKey);
      if (idx === -1) return old;
      const next = old.filter((t) => t.key !== targetKey);

      if (targetKey === activeKey) {
        const fallback = next[idx - 1] ?? next[idx] ?? null;
        const to = fallback?.key ?? '/';
        setActiveKey(to);
        if (to !== pathname) router.push(to);
      }
      sessionStorage.setItem(STORAGE_TABS, JSON.stringify(next));
      return next;
    });
  };

  const closeOthers = () => {
    if (!activeKey) return;
    setItems((old) => {
      const me = old.find((t) => t.key === activeKey);
      const next = me ? [{ ...me, label: getTitle(activeKey) }] : [];
      sessionStorage.setItem(STORAGE_TABS, JSON.stringify(next));
      return next;
    });
    message.success('已关闭其他页签');
  };

  return (
    <div className="bg-white px-3 pt-2 pb-0 border-b" style={{ borderColor: 'var(--ant-color-border)' }}>
      <Space align="center" style={{ width: '100%' }}>
      <Tooltip title="关闭其他页签">
  <button
    className="tab-kawaii-close"
    onClick={closeOthers}
    aria-label="关闭其他页签"
  >
    <svg width="14" height="14" viewBox="0 0 24 24"
         stroke="currentColor" strokeWidth="2.2"
         strokeLinecap="round" strokeLinejoin="round" fill="none">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  </button>
</Tooltip>

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
        />
      </Space>
    </div>
  );
}

/** ✅ 对外导出一个页面登记标题的小钩子 */
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
