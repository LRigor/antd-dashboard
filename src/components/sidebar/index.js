"use client";
import { Layout, Menu, Card, Button } from "antd";
import { useState } from "react";
import {
  DashboardOutlined,
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";

export default function Sidebar() {
  const menuItems = [
    {
      key: "dashboard",
      icon: <DashboardOutlined />,
      label: "系统",
      children: [
        { key: "11", label: "菜单" },
        { key: "12", label: "角色" },
        { key: "13", label: "命名空间" },
        { key: "14", label: "管理员" },
        { key: "15", label: "登录日志" },
        { key: "16", label: "词典" },
        { key: "17", label: "操作日志" },
        { key: "18", label: "文件" },
        { key: "19", label: "白名单" },
      ],
    },
  ];
  const [collapsed, setCollapsed] = useState(false);
  return (
    <>
      <style jsx>{`
        .collapse-btn:hover {
          background-color: transparent !important;
          border-color: transparent !important;
          color: inherit !important;
        }
        .collapse-btn:focus {
          background-color: transparent !important;
          border-color: transparent !important;
          color: inherit !important;
        }
        .collapse-btn:active {
          background-color: transparent !important;
          border-color: transparent !important;
          color: inherit !important;
        }
      `}</style>
      <Layout.Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        theme="light"
        style={{
          position: "relative",
          background: "transparent",
        }}
      >
        <Card
          style={{
            height: "100%",
            borderRadius: "8px",
            borderTop: "none",
            borderBottom: "none",
            borderLeft: "none",
            borderRadius: "0",
          }}
          styles={{
            body: {
              padding: "16px",
              height: "100%",
              backgroundColor: "var(--background-color)",
            },
          }}
        >
          <Card
            style={{
              fontSize: "16px",
              position: "absolute",
              top: "20px",
              right: "-15px",
              borderRadius: "50%",
              backgroundColor: "var(--background-color)",
              zIndex: 1000,
              width: "30px",
              height: "30px",
              boxShadow: "none",
            }}
          >
            <Button
              type="text"
              icon={!collapsed ? <LeftOutlined /> : <RightOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              className="collapse-btn"
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "100%",
                height: "100%",
                backgroundColor: "transparent",
                border: "none",
                boxShadow: "none",
              }}
            />
          </Card>
          <Menu
            mode="inline"
            defaultSelectedKeys={["dashboard"]}
            items={menuItems}
            style={{
              borderRight: 0,
              background: "transparent",
            }}
          />
        </Card>
      </Layout.Sider>
    </>
  );
}
