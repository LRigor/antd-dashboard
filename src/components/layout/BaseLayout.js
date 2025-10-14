"use client";

import { useEffect, useState } from 'react';
import { Layout, App } from 'antd';
import { useRouter, usePathname } from 'next/navigation';   
import Sidebar from '@/components/sidebar';
import Header from '@/components/header';
import { useUser } from '@/components/header/useUser';
import RouteTabs from '@/components/header/RouteTabs';

export default function BaseLayout({ children, loading: customLoading }) {
  const router = useRouter();
  const pathname = usePathname(); // 🔎 LOG

  const { isAuthenticated, isLoading } = useUser();

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  useEffect(() => {
    // Mount effect
  }, []);
  

  const loading = customLoading !== undefined ? customLoading : isLoading;

  useEffect(() => {
    if (mounted && !loading && !isAuthenticated) {
      router.push("/?redirect=" + pathname);
    }
  }, [mounted, loading, isAuthenticated, pathname, router]);
  

  if (!mounted || loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div>Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }


  return (
    <App>                                        {/* ✅ 用 App 包住全局一次 */}
      <Layout style={{ minHeight: "100vh" }}>
        <Header />
        <RouteTabs />  
        <Layout>
          <Sidebar />
          {children}
        </Layout>
      </Layout>
    </App>
  );
}
