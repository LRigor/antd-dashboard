"use client";
import { Layout, Menu, Card, Button } from "antd";
import { useState, useEffect } from "react";
import {
  DashboardOutlined,
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";
import { useRouter, usePathname } from "next/navigation";

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const handleCollapse = (collapsed) => {
    setCollapsed(collapsed);
  };

  useEffect(() => {
    if (pathname.match(/^\/system\/.*/)) {
      setCollapsed(true);
    }
  }, [pathname]);

  const menuItems = [
    {
      key: "dashboard",
      icon: <DashboardOutlined />,
      label: "系统",
      onClick: () => router.push("/dashboard"),
      children: [
        { 
          key: "menu", 
          label: "菜单", 
          onClick: () => router.push("/system/menu")
        },
        { 
          key: "roles", 
          label: "角色", 
          onClick: () => router.push("/system/roles")
        },
        { 
          key: "namespaces", 
          label: "命名空间", 
          onClick: () => router.push("/system/namespaces")
        },
        { 
          key: "admins", 
          label: "管理员", 
          onClick: () => router.push("/system/admins")
        },
        { 
          key: "login-logs", 
          label: "登录日志", 
          onClick: () => router.push("/system/login-logs")
        },
        { 
          key: "dictionary", 
          label: "词典", 
          onClick: () => router.push("/system/dictionary")
        },
        { 
          key: "operation-logs", 
          label: "操作日志", 
          onClick: () => router.push("/system/operation-logs")
        },
        { 
          key: "files", 
          label: "文件", 
          onClick: () => router.push("/system/files")
        },
      ],
    },
  ];

  // Determine selected key based on current pathname
  const getSelectedKey = () => {
    if (pathname === "/dashboard") return ["dashboard"];
    if (pathname.startsWith("/system/")) {
      const subPath = pathname.split("/")[2];
      return [subPath];
    }
    if (pathname === "/system") return ["dashboard"];
    return ["dashboard"];
  };

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
              onClick={() => handleCollapse(!collapsed)}
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
            selectedKeys={getSelectedKey()}
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
