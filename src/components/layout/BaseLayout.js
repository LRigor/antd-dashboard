"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Layout, App } from "antd";          // ✅ 引入 App
import Sidebar from "@/components/sidebar";
import Header from "@/components/header";
import { useUser } from "@/components/header/useUser";

export default function BaseLayout({ children, loading: customLoading }) {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useUser();

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const loading = customLoading !== undefined ? customLoading : isLoading;

  useEffect(() => {
    if (mounted && !loading && !isAuthenticated) {
      router.push("/");
    }
  }, [mounted, loading, isAuthenticated, router]);

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

  if (!isAuthenticated) return null;

  return (
    <App>                                        {/* ✅ 用 App 包住全局一次 */}
      <Layout style={{ minHeight: "100vh" }}>
        <Header />
        <Layout>
          <Sidebar />
          {children}
        </Layout>
      </Layout>
    </App>
  );
}
