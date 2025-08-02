import React, { useState } from "react";
import { Card, Space, Typography, Button, Dropdown } from "antd";
import { MoreOutlined } from "@ant-design/icons";
import { Pie } from "@ant-design/plots";
import { useTheme } from "@/contexts/ThemeContext";

const { Text, Title } = Typography;

export default function SalesCategory() {
  const [selectedChannel, setSelectedChannel] = useState("all");
  const { isDarkMode } = useTheme();

  // Sample data for the donut chart
  const data = [
    { type: "其他", online: 111, stores: 65, all: 176 },
    { type: "母婴产品", online: 121, stores: 0, all: 121 },
    { type: "服饰箱包", online: 41, stores: 255, all: 296 },
    { type: "个护健康", online: 311, stores: 344, all: 655 },
    { type: "食用酒水", online: 321, stores: 188, all: 509 },
    { type: "家用电器", online: 244, stores: 99, all: 343 },
  ];

  const channelOptions = {
    all: "全部渠道",
    online: "线上",
    stores: "门店",
  };

  const chartConfig = {
    theme: isDarkMode ? "classicDark" : "classic",
    data,
    angleField: selectedChannel,
    colorField: "type",
    radius: 0.8,
    innerRadius: 0.4,
    label: {
      text: (d) => `${d.type}\n ${d[selectedChannel]}`,
      position: "spider",
    },
    legend: false,
  };

  const menuItems = [
    {
      key: "operation1",
      label: "操作一",
    },
    {
      key: "operation2",
      label: "操作二",
    },
  ];

  return (
    <Card
      title={
        <Space>
          <Title level={4} style={{ margin: 0 }}>
            销售额类别占比
          </Title>
        </Space>
      }
      style={{
        height: "100%",
        borderRadius: "8px",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
        border: "1px solid var(--border-color)",
      }}
      styles={{
        header: {
          borderBottom: "1px solid var(--border-color)",
          padding: "16px 20px 12px",
        },
        body: {
          padding: "16px 20px",
        },
      }}
      extra={
        <Space>
          {Object.keys(channelOptions).map((option) => (
            <Button
              key={option}
              type={selectedChannel === option ? "primary" : "text"}
              size="small"
              onClick={() => setSelectedChannel(option)}
              style={{
                fontSize: "12px",
                height: "24px",
                padding: "0 8px",
              }}
            >
              {channelOptions[option]}
            </Button>
          ))}
          <Dropdown
            menu={{
              items: menuItems,
              style: {
                borderRadius: "6px",
                border: "1px solid var(--border-color)",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
              },
            }}
            placement="bottomRight"
            trigger={["click", "hover"]}
          >
            <Button
              type="text"
              icon={<MoreOutlined />}
              size="small"
              style={{
                fontSize: "12px",
                height: "24px",
                padding: "0 8px",
                rotate: "90deg",
              }}
            />
          </Dropdown>
        </Space>
      }
    >
      <Text
        style={{
          fontSize: "14px",
          color: "#8c8c8c",
          fontWeight: "500",
          marginTop: "16px",
          display: "block",
        }}
      >
        销售额
      </Text>
      <div style={{ height: 400 }}>
        <Pie {...chartConfig} />
      </div>
    </Card>
  );
}
