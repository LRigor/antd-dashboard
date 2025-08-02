import React, { useState, useEffect, useRef } from "react";
import { Card, Space, Typography } from "antd";
import { Area } from "@ant-design/plots";
import { InfoCircleOutlined } from "@ant-design/icons";

const { Text } = Typography;

export default function TotalVisits() {
  const [chartReady, setChartReady] = useState(false);
  const chartRef = useRef(null);

  // Initialize chart after component mounts and page is fully rendered
  useEffect(() => {
    // Small delay to ensure DOM is fully rendered
    const timer = setTimeout(() => {
      setChartReady(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const config = {
    data: {
      type: "fetch",
      value: "https://assets.antv.antgroup.com/g2/stocks.json",
      transform: [{ type: "filter", callback: (d) => d.symbol === "GOOG" }],
    },
    xField: (d) => new Date(d.date),
    yField: "price",
    shapeField: "smooth",
    height: 120,
    autoFit: true,
    style: {
      fill: "linear-gradient(-90deg, white 0%, #722ED1 100%)",
    },
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
    line: {
      style: {
        stroke: "#722ED1",
        strokeWidth: 2,
      },
    },
  };

  return (
    <Card
      title={
        <Space>
          <Text style={{ fontSize: "16px", fontWeight: "600" }}>访问量</Text>
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
          <Text
            style={{ fontSize: "14px", color: "#8c8c8c", fontWeight: "500" }}
          >
            访问量
          </Text>
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

        <div
          style={{ position: "relative", width: "100%", overflow: "hidden" }}
        >
          <div
            style={{
              position: "absolute",
              top: 5,
              left: 20,
              right: 20,
              bottom: 0,
            }}
          >
            <Text
              style={{
                fontSize: "32px",
                lineHeight: "1.2",
              }}
            >
              8,846
            </Text>
          </div>

          <div 
            ref={chartRef}
            style={{ width: "100%", height: "100%" }}
          >
            {chartReady ? (
              <Area {...config} />
            ) : (
              <div style={{ 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center", 
                height: "100%",
                color: "#8c8c8c"
              }}>
                加载图表中...
              </div>
            )}
          </div>
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
          日访问量 1,234
        </Text>
      </div>
    </Card>
  );
}
