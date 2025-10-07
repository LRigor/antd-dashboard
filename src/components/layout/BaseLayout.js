"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Layout, App } from "antd";          // ✅ 引入 App
import Sidebar from "@/components/sidebar";
import Header from "@/components/header";
import { useUser } from "@/components/header/useUser";
import { usePathname } from "next/navigation";

export default function BaseLayout({ children, loading: customLoading }) {
  const router = useRouter();
  const pathname = usePathname(); // 🔎 LOG

  const { isAuthenticated, isLoading } = useUser();

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  useEffect(() => {
    console.log("[BaseLayout:mount] pathname=", pathname);
  }, []); // 🔎 LOG（只在首挂载打一条）
  

  const loading = customLoading !== undefined ? customLoading : isLoading;

  useEffect(() => {
    console.log(
      "[BaseLayout:guard]",
      "mounted=", mounted,
      "loading=", loading,
      "isAuthenticated=", isAuthenticated,
      "pathname=", pathname
    ); // 🔎 LOG：每次依赖变化都打印一次状态
  
    if (mounted && !loading && !isAuthenticated) {
      console.log("[BaseLayout:redirect] to /"); // 🔎 LOG：实际要跳哪里
      router.push("/?redirect=" + pathname);
    }
  }, [mounted, loading, isAuthenticated, pathname, router]); // 🔎 LOG：把 pathname 放进依赖里，便于观察
  

  if (!mounted || loading) {
    console.log("[BaseLayout:render] show <Loading/>", { mounted, loading }); // 🔎 LOG
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
    console.log("[BaseLayout:render] unauthenticated -> null (pathname=", pathname, ")"); // 🔎 LOG
    return null;
  }

  console.log("[BaseLayout:render] authenticated layout (pathname=", pathname, ")"); // 🔎 LOG


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
