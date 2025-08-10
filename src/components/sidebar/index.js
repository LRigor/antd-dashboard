"use client";
import { Layout, Menu, Card, Button } from "antd";
import { useEffect } from "react";
import {
  DashboardOutlined,
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";
import { useRouter, usePathname } from "next/navigation";
import { useSidebar } from "@/contexts/SidebarContext";

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { collapsed, setCollapsed, isMobile, expandedKeys, setExpandedKeys } = useSidebar();

  const handleCollapse = (collapsed) => {
    setCollapsed(collapsed);
  };

  const handleOverlayClick = () => {
    if (isMobile && !collapsed) {
      setCollapsed(true);
    }
  };

  const handleMenuExpand = (keys) => {
    setExpandedKeys(keys);
  };

  useEffect(() => {
    if (pathname.startsWith("/system") && !collapsed) {
      const subPath = pathname.split("/")[2];
      if (subPath && !expandedKeys.includes("system")) {
        setExpandedKeys([...expandedKeys, "system"]);
      }
    }
  }, [pathname, collapsed, expandedKeys, setExpandedKeys]);

  const getSelectedKey = () => {
    if (pathname.startsWith("/system")) {
      const subPath = pathname.split("/")[2];
      if (subPath) {
        return [subPath];
      }
      return ["system"];
    }
    return [];
  };

  const menuItems = [
    {
      key: "system",
      icon: <DashboardOutlined />,
      label: "系统",
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
        .mobile-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          z-index: 999;
          display: none;
        }
        .mobile-overlay.visible {
          display: block;
        }
        .sidebar-mobile {
          position: fixed;
          top: 0;
          left: 0;
          height: 100vh;
          z-index: 1000;
        }
        .sidebar-desktop {
          position: relative;
        }
      `}</style>
      
      {/* Mobile Overlay */}
      <div 
        className={`mobile-overlay ${isMobile && !collapsed ? 'visible' : ''}`}
        onClick={handleOverlayClick}
      />
      
      <Layout.Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        theme="light"
        className={isMobile ? 'sidebar-mobile' : 'sidebar-desktop'}
        style={{
          position: isMobile ? "fixed" : "relative",
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
            openKeys={expandedKeys}
            onOpenChange={handleMenuExpand}
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
