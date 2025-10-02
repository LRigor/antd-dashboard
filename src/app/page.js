"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Form, Input, Button, Tabs, Space, Typography, App } from "antd";
import {
  UserOutlined,
  LockOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  AudioOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import Image from "next/image";

// ⬇️ 改這裡：用 useUser + authAPI
import { useUser } from "@/components/header/useUser";
import { authAPI } from "../api-fetch"; // 路徑依你專案，和原 AuthContext 相同

const { Title, Text } = Typography;

export default function LoginPage() {
  const [form] = Form.useForm();
  const [activeTab, setActiveTab] = useState("account");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { message } = App.useApp();

  // ⬇️ 取代 useAuth：從 useUser 取得狀態與工具
  const {
    isAuthenticated,
    isLoading: authLoading,
    mutate,
    setToken,
  } = useUser();

  // 已登录则自动跳转
  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      const redirectTo = searchParams.get("redirect") || "/dashboard";
      console.log("[LoginPage] already authed, redirect to:", redirectTo);
      router.push(redirectTo);
    }
  }, [isAuthenticated, authLoading, router, searchParams]);

  const onFinish = async (values) => {
    console.log("[LoginPage] submit ->", values);
    try {
      setLoading(true);

      // ⬇️ 直接打登入 API（會寫入 token；若未寫入則用 setToken 作雙保險）
      const res = await authAPI.login(values); // 預期返回 { code, message, data: { token } }
      console.log("[LoginPage] login ok, res =", res);

      const tok = res?.data?.token;
      if (tok) setToken(tok); // 若你的 authAPI.login 已處理 cookie，這行也可保留當保險

      // 立刻刷新 /api/admin/info，讓全站拿到 user
      await mutate();

      message.success("Login successful!");

      const redirectTo = searchParams.get("redirect") || "/dashboard";
      console.log("[LoginPage] redirect to:", redirectTo);
      router.replace(redirectTo); // 用 replace 防止返回到登录页
    } catch (error) {
      console.error("Login error:", error);
      message.error("Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const items = [
    {
      key: "account",
      label: "Account Login",
      children: (
        <Form
          form={form}
          name="login"
          onFinish={onFinish}
          autoComplete="off"
          size="large"
        >
          <Form.Item name="location" initialValue="japan" hidden>
            <Input />
          </Form.Item>
          <Form.Item name="otp_code" initialValue="" hidden>
            <Input />
          </Form.Item>

          <Form.Item
            name="uname"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Username: admin or user"
              value="admin"
            />
          </Form.Item>

          <Form.Item
            name="pass"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Password: 1"
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
              value="1"
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              Login
            </Button>
          </Form.Item>
        </Form>
      ),
    },
  ];

  if (authLoading) {
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

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        padding: "20px",
        marginTop: "32px",
      }}
    >
      <div>
        {/* Logo and Title */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "16px",
              gap: "16px",
            }}
          >
            <Image src="/logo.svg" alt="logo" width={44} height={44} />
            <Title
              level={3}
              style={{ margin: 0, fontSize: "32px", fontWeight: "bold" }}
            >
              Ant Design
            </Title>
          </div>
          <Text type="secondary">
            Ant Design is the most influential web design specification in Xihu
            district
          </Text>
        </div>

        {/* Login Form */}
        <Tabs activeKey={activeTab} onChange={setActiveTab} items={items} centered />
      </div>

      {/* Footer */}
      <div
        style={{
          textAlign: "center",
          color: "#8c8c8c",
          fontSize: "12px",
          position: "fixed",
          bottom: "20px",
        }}
      >
        <div style={{ marginBottom: "8px" }}>
          <Space>
            <span>
              <AudioOutlined style={{ marginRight: "4px" }} />
              Ant Design Pro
            </span>
            <span>
              <SettingOutlined style={{ marginRight: "4px" }} />
              Ant Design
            </span>
          </Space>
        </div>
        <div>© Powered by Ant Design</div>
      </div>
    </div>
  );
}
