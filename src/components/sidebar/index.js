"use client";
import { Layout, Menu, Card, Button } from "antd";
import { useState } from "react";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  DashboardOutlined,
  BarChartOutlined,
  LineChartOutlined,
  PieChartOutlined,
  SettingOutlined,
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";

export default function Sidebar() {
  const menuItems = [
    {
      key: "dashboard",
      icon: <DashboardOutlined />,
      label: "Dashboard",
      children: [
        { key: "13", label: "Analysis" },
        { key: "14", label: "Monitor" },
        { key: "15", label: "Workplace" },
      ],
    },
  ];
  const [collapsed, setCollapsed] = useState(false);
  return (
    <Layout.Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      theme="light"
      style={{
        boxShadow: "2px 0 8px 0 rgba(29,35,41,.05)",
        padding: "10px",
        position: "relative",
      }}
    >
      <Button
        type="text"
        icon={!collapsed ? <LeftOutlined /> : <RightOutlined />}
        onClick={() => setCollapsed(!collapsed)}
        style={{
          fontSize: "16px",
          position: "absolute",
          top: "20px",
          right: "-15px",
          borderRadius: "50%",
          backgroundColor: "var(--background-color)",
        }}
      />
      <Menu
        mode="inline"
        defaultSelectedKeys={["dashboard"]}
        items={menuItems}
        style={{ borderRight: 0 }}
      />
    </Layout.Sider>
  );
}
