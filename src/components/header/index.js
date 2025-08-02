import { Layout, Typography, Dropdown, Space, Avatar, Card } from "antd";
import Image from "next/image";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";
import ThemeToggle from "../ThemeToggle";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
const { Title } = Typography;

export default function Header() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const handleLogout = async () => {
    try {
      await logout();
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const userMenuItems = [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: "Profile",
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Logout",
      onClick: handleLogout,
    },
  ];

  return (
    <Layout.Header
      style={{
        padding: "0 24px",
        position: "sticky",
        top: 0,
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "var(--background-color)",
        borderBottom: "1px solid var(--border-color)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center" }}>
        <Image src="/logo.svg" alt="logo" width={32} height={32} />
        <Title level={4} style={{ margin: 0, marginLeft: 16 }}>
          Ant Design
        </Title>
      </div>

      <Space>
        <ThemeToggle />

        <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" arrow>
          <Space style={{ cursor: "pointer" }}>
            <Avatar icon={<UserOutlined />} />
            <Typography.Text strong>{user?.username}</Typography.Text>
          </Space>
        </Dropdown>
      </Space>
    </Layout.Header>
  );
}
