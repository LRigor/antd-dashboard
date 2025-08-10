"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Layout, Card, Row, Col, Statistic, Button, Space, Table, Tag } from "antd";
import { useAuth } from "@/contexts/AuthContext";
import Sidebar from "@/components/sidebar";
import Header from "@/components/header";
import SystemLayout from "@/components/system";

export default function SystemPage() {
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

  // Sample data for demonstration
  const systemStats = [
    { title: "在线用户", value: 156, suffix: "人" },
    { title: "系统负载", value: 23.5, suffix: "%" },
    { title: "内存使用", value: 67.2, suffix: "%" },
    { title: "磁盘空间", value: 45.8, suffix: "%" },
  ];

  const recentLogs = [
    { key: "1", time: "2024-01-15 10:30:25", user: "admin", action: "登录系统", status: "成功" },
    { key: "2", time: "2024-01-15 10:28:15", user: "user001", action: "修改配置", status: "成功" },
    { key: "3", time: "2024-01-15 10:25:42", user: "user002", action: "删除文件", status: "失败" },
    { key: "4", time: "2024-01-15 10:22:18", user: "admin", action: "创建用户", status: "成功" },
  ];

  const logColumns = [
    { title: "时间", dataIndex: "time", key: "time" },
    { title: "用户", dataIndex: "user", key: "user" },
    { title: "操作", dataIndex: "action", key: "action" },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "成功" ? "green" : "red"}>
          {status}
        </Tag>
      ),
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header />
      <Layout>
        <Sidebar />
        <SystemLayout title="系统概览" subtitle="System Overview">
          {/* System Statistics */}
          <Row gutter={[16, 16]}>
            {systemStats.map((stat, index) => (
              <Col xs={24} sm={12} lg={6} key={index}>
                <Card
                  style={{
                    borderRadius: "8px",
                    border: "1px solid var(--border-color)",
                    backgroundColor: "var(--background-color)",
                  }}
                >
                  <Statistic
                    title={stat.title}
                    value={stat.value}
                    suffix={stat.suffix}
                    valueStyle={{ color: "var(--primary-color)" }}
                  />
                </Card>
              </Col>
            ))}
          </Row>

          {/* Quick Actions */}
          <Card
            title="快速操作"
            style={{
              marginTop: "24px",
              borderRadius: "8px",
              border: "1px solid var(--border-color)",
              backgroundColor: "var(--background-color)",
            }}
          >
            <Space wrap>
              <Button type="primary">用户管理</Button>
              <Button>角色管理</Button>
              <Button>权限设置</Button>
              <Button>系统配置</Button>
              <Button>日志查看</Button>
            </Space>
          </Card>

          {/* Recent Activity Logs */}
          <Card
            title="最近活动日志"
            style={{
              marginTop: "24px",
              borderRadius: "8px",
              border: "1px solid var(--border-color)",
              backgroundColor: "var(--background-color)",
            }}
          >
            <Table
              columns={logColumns}
              dataSource={recentLogs}
              pagination={false}
              size="small"
            />
          </Card>
        </SystemLayout>
      </Layout>
    </Layout>
  );
}
