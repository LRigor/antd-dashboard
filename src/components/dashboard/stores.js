import React, { useState, useEffect, useRef } from "react";
import { Card } from "antd";
import { Line } from "@ant-design/plots";
import { useTheme } from "@/contexts/ThemeContext";
import ProgressChart from "./progress-chart";


export default function Stores() {
  const { isDarkMode } = useTheme();
  const [chartReady, setChartReady] = useState(false);
  const chartRef = useRef(null);

  // Initialize chart after component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      setChartReady(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Re-initialize chart when theme changes
  useEffect(() => {
    if (chartReady && chartRef.current) {
      setChartReady(false);
      setTimeout(() => setChartReady(true), 50);
    }
  }, [isDarkMode]);

  // Time series data for customer traffic and payment transactions
  const generateTimeSeriesData = () => {
    const data = [];
    const startTime = new Date();
    startTime.setHours(23, 33, 0, 0);

    for (let i = 0; i < 24; i++) {
      const time = new Date(startTime.getTime() + i * 30 * 60 * 1000); // 30 minutes intervals
      const timeStr = time.toTimeString().slice(0, 5);

      // Generate realistic fluctuating data
      const baseTraffic = 50 + Math.sin(i * 0.5) * 30 + Math.random() * 20;
      const basePayments = 40 + Math.sin(i * 0.3) * 25 + Math.random() * 15;

      data.push({
        time: timeStr,
        type: "客流量",
        value: Math.max(0, Math.round(baseTraffic)),
      });
      data.push({
        time: timeStr,
        type: "支付笔数",
        value: Math.max(0, Math.round(basePayments)),
      });
    }
    return data;
  };

  const timeSeriesData = generateTimeSeriesData();

  // Line chart configuration
  const lineConfig = {
    theme: isDarkMode ? "classicDark" : "classic",
    data: timeSeriesData,
    xField: "time",
    yField: "value",
    colorField: "type",
    height: 300,
    autoFit: true,
    scale: { color: { range: ["#2585fc", "#30cecd", "#FAAD14"] } },
    legend: {
      color: {
        position: "top",
        layout: {
          justifyContent: "center",
        },
      },
    },
    xAxis: {
      type: "time",
      tickCount: 8,
    },
    slider: {
      x: true,
    },
  };

  return (
    <>
      <Card>
        <ProgressChart />

        {/* Second Chart: Line Plot with Slider */}
        {chartReady && (
          <div ref={chartRef}>
            <Line {...lineConfig} />
          </div>
        )}
      </Card>
    </>
  );
}
