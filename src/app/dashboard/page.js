"use client";

import BaseLayout from "@/components/layout/BaseLayout";
import Dashboard from "@/components/dashboard";
import SystemLayout from "@/components/system";

export default function DashboardPage() {
  return (
    <SystemLayout title="仪表盘" subtitle="Dashboard">
      <Dashboard />
    </SystemLayout>
  );
}