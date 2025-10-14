"use client";

import { Layout, Card, Typography, Space, Row, Col } from "antd";
import { SettingOutlined } from "@ant-design/icons";
import BaseLayout from "@/components/layout/BaseLayout";
import { useRouteTitle } from "@/components/header/RouteTabs"; // ✅ 新增

const { Content } = Layout;
const { Title, Text } = Typography;

export default function SystemLayout({
  children,
  title = "系统管理",
  subtitle = "System Management",
}) {
  useRouteTitle(title || subtitle || ""); // ✅ 把标题同步给页签

  return (
    <BaseLayout>
      <Content
        style={{
          margin: "24px 16px",
          padding: 24,
          minHeight: 280,
          background: "transparent",
        }}
      >
        <Card
          style={{
            borderRadius: "8px",
            border: "1px solid var(--border-color)",
            backgroundColor: "var(--background-color)",
          }}
          styles={{ body: { padding: "24px" } }}
        >
          <Space direction="vertical" size="large" style={{ width: "100%" }}>
            {/* Header Section */}
            <div>
              <Row align="middle" gutter={16}>
                <Col>
                  <SettingOutlined
                    style={{
                      fontSize: "24px",
                      color: "var(--primary-color)",
                      marginRight: "8px",
                    }}
                  />
                </Col>
                <Col flex="auto">
                  <Title level={3} style={{ margin: 0, color: "var(--text-color)" }}>
                    {title}
                  </Title>
                  <Text type="secondary" style={{ fontSize: "14px" }}>
                    {subtitle}
                  </Text>
                </Col>
              </Row>
            </div>

            {/* Content Section */}
            <div style={{ marginTop: "24px" }}>{children}</div>
          </Space>
        </Card>
      </Content>
    </BaseLayout>
  );
}
