"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Layout } from "antd";
import { useAuth } from "@/contexts/AuthContext";
import Sidebar from "@/components/sidebar";
import Header from "@/components/header";
export default function DashboardPage() {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
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
    <Layout style={{ minHeight: "100vh" }}>
      <Header />
      <Layout>
        <Sidebar />
      </Layout>
    </Layout>
  );
}
