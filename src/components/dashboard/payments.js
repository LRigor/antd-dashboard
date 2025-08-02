import React, { useState, useEffect } from "react";
import { Card, Space, Typography } from "antd";
import { Column } from "@ant-design/plots";
import { InfoCircleOutlined } from "@ant-design/icons";

const { Text } = Typography;

export default function Payments() {
  const [chartReady, setChartReady] = useState(false);

  useEffect(() => {
    // Set a small delay to ensure the component is fully mounted
    const timer = setTimeout(() => {
      setChartReady(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const config = {
    data: {
      type: "fetch",
      value:
        "https://render.alipay.com/p/yuyan/180020010001215413/antd-charts/column-column.json",
    },
    xField: "letter",
    yField: "frequency",
    height: 120,
    label: false,
    autoFit: true,
    axis: {
      x: {
        label: false,
        tick: false,
      },
      y: {
        label: false,
        tick: false,
      },
    },
  };
  return (
    <Card
      title={
        <Space>
          <Text style={{ fontSize: "16px", fontWeight: "600" }}>支付笔数</Text>
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
          padding: 0,
        },
      }}
    >
      <div style={{ height: 180, width: "100%", overflow: "hidden" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 20px 12px",
          }}
        >
          <Text style={{ fontSize: "14px", fontWeight: "500" }}>支付笔数</Text>
          <InfoCircleOutlined
            style={{
              color: "#8c8c8c",
              fontSize: "16px",
              cursor: "pointer",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => (e.target.style.color = "#262626")}
            onMouseLeave={(e) => (e.target.style.color = "#8c8c8c")}
          />
        </div>

        <div style={{ position: "relative" }}>
          <div
            style={{
              position: "absolute",
              top: 5,
              left: 20,
              right: 0,
              bottom: 0,
            }}
          >
            <Text
              style={{
                fontSize: "32px",
                lineHeight: "1.2",
              }}
            >
              6,560
            </Text>
          </div>

          {chartReady && <Column {...config} />}
        </div>
      </div>

      <div
        style={{
          height: 50,
          borderTop: "1px solid var(--border-color)",
          display: "flex",
          alignItems: "center",
          gap: 16,
          padding: "16px 20px 16px",
        }}
      >
        <Text style={{ fontSize: "14px", color: "#8c8c8c", fontWeight: "500" }}>
          转化率 60%
        </Text>
      </div>
    </Card>
  );
}
