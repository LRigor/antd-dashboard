import React, { useState, useEffect, useRef } from "react";
import {
  Card,
  Tabs,
  Button,
  DatePicker,
  Space,
  List,
  Avatar,
  Typography,
  Row,
  Col,
} from "antd";
import { Column } from "@ant-design/plots";
import { CalendarOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import weekOfYear from "dayjs/plugin/weekOfYear";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import { useTheme } from "../../contexts/ThemeContext";

// Configure dayjs plugins
dayjs.extend(weekOfYear);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

const { Text, Title } = Typography;
const { RangePicker } = DatePicker;

export default function SalesVisits() {
  const { isDarkMode } = useTheme();
  const [activeTab, setActiveTab] = useState("sales");
  const [timeFilter, setTimeFilter] = useState("month");
  const [dateRange, setDateRange] = useState([
    dayjs().startOf("month"),
    dayjs().endOf("month"),
  ]);
  const [chartReady, setChartReady] = useState(false);
  const chartRef = useRef(null);

  // Initialize chart after component mounts
  useEffect(() => {
    // Small delay to ensure DOM is fully rendered
    const timer = setTimeout(() => {
      setChartReady(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Re-initialize chart when theme changes
  useEffect(() => {
    if (chartReady && chartRef.current) {
      // Force chart re-render when theme changes
      setChartReady(false);
      setTimeout(() => setChartReady(true), 50);
    }
  }, [isDarkMode]);

  // Sample data for the bar chart
  const chartData = [
    { month: "1月", value: 600 },
    { month: "2月", value: 1050 },
    { month: "3月", value: 1150 },
    { month: "4月", value: 300 },
    { month: "5月", value: 320 },
    { month: "6月", value: 620 },
    { month: "7月", value: 850 },
    { month: "8月", value: 500 },
    { month: "9月", value: 380 },
    { month: "10月", value: 520 },
    { month: "11月", value: 1080 },
    { month: "12月", value: 450 },
  ];

  // Store ranking data
  const storeRanking = [
    { rank: 1, name: "工专路0号店", sales: 323234 },
    { rank: 2, name: "工专路1号店", sales: 323234 },
    { rank: 3, name: "工专路2号店", sales: 323234 },
    { rank: 4, name: "工专路3号店", sales: 323234 },
    { rank: 5, name: "工专路4号店", sales: 323234 },
    { rank: 6, name: "工专路5号店", sales: 323234 },
    { rank: 7, name: "工专路6号店", sales: 323234 },
  ];

  const chartConfig = {
    theme: isDarkMode ? "classicDark" : "classic",
    data: chartData,
    xField: "month",
    yField: "value",
    height: 300,
    autoFit: true,
    axis: {
      x: {
        tick: false,
      },
      y: {
        tick: false,
      },
    },
    chart: {
      type: "bar",
    },
    label: false,
  };

  const timeFilterOptions = [
    { label: "今日", value: "today" },
    { label: "本周", value: "week" },
    { label: "本月", value: "month" },
    { label: "本年", value: "year" },
  ];

  const getRankStyle = (rank) => {
    if (rank <= 3) {
      return {
        backgroundColor: "#262626",
        color: "white",
      };
    }
    return {
      backgroundColor: isDarkMode ? "#434343" : "#f5f5f5",
      color: isDarkMode ? "#ffffff" : "#666",
    };
  };

  const handleTimeFilterChange = (filterValue) => {
    setTimeFilter(filterValue);

    // Update date range based on selected filter
    let startDate, endDate;

    switch (filterValue) {
      case "today":
        startDate = dayjs().startOf("day");
        endDate = dayjs().endOf("day");
        break;
      case "week":
        startDate = dayjs().startOf("week");
        endDate = dayjs().endOf("week");
        break;
      case "month":
        startDate = dayjs().startOf("month");
        endDate = dayjs().endOf("month");
        break;
      case "year":
        startDate = dayjs().startOf("year");
        endDate = dayjs().endOf("year");
        break;
      default:
        startDate = dayjs().startOf("month");
        endDate = dayjs().endOf("month");
    }

    setDateRange([startDate, endDate]);
  };

  return (
    <Card
      title={
        <div>
          <Row justify="space-between" align="middle">
            <Col>
              <Tabs
                activeKey={activeTab}
                onChange={setActiveTab}
                items={[
                  {
                    key: "sales",
                    label: "销售额",
                  },
                  {
                    key: "visits",
                    label: "访问量",
                  },
                ]}
                style={{
                  borderBottom: "none",
                }}
              />
            </Col>
            <Col>
              <Space size="middle">
                {timeFilterOptions.map((option) => (
                  <Button
                    key={option.value}
                    type={timeFilter === option.value ? "primary" : "default"}
                    style={{
                      border: "none",
                      backgroundColor: "transparent",
                      color: timeFilter === option.value ? "#1890ff" : "#666",
                      boxShadow: "none",
                    }}
                    onClick={() => handleTimeFilterChange(option.value)}
                  >
                    {option.label}
                  </Button>
                ))}
                <RangePicker
                  value={dateRange}
                  onChange={setDateRange}
                  format="YYYY-MM-DD"
                  suffixIcon={<CalendarOutlined />}
                  style={{ width: "250px" }}
                  placeholder={["开始日期", "结束日期"]}
                />
              </Space>
            </Col>
          </Row>
        </div>
      }
      style={{
        borderRadius: "8px",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
      }}
      styles={{
        body: {
          padding: "24px",
        },
      }}
    >
      {/* Main content area */}
      <Row gutter={24}>
        {/* Chart area */}
        <Col xs={24} lg={16}>
          <div
            ref={chartRef}
            style={{
              backgroundColor: isDarkMode ? "#1f1f1f" : "#ffffff",
              borderRadius: "8px",
              padding: "24px",
            }}
          >
            <Column {...chartConfig} />
          </div>
        </Col>

        {/* Store ranking */}
        <Col xs={24} lg={8}>
          <Title
            level={4}
            style={{
              margin: 0,
              fontSize: "24px",
              fontWeight: "600",
              margin: "12px 0",
              color: isDarkMode ? "#ffffff" : "#262626",
            }}
          >
            门店销售额排名
          </Title>
          <List
            dataSource={storeRanking}
            renderItem={(item) => (
              <List.Item
                style={{
                  padding: "6px 0",
                  border: "none",
                }}
              >
                <List.Item.Meta
                  avatar={
                    <Avatar style={getRankStyle(item.rank)} size={24}>
                      {item.rank}
                    </Avatar>
                  }
                  title={
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: "14px",
                          fontWeight: "500",
                          color: isDarkMode ? "#ffffff" : "#262626",
                        }}
                      >
                        {item.name}
                      </Text>
                      <Text
                        style={{
                          fontSize: "16px",
                          fontWeight: "600",
                          color: "#1890ff",
                        }}
                      >
                        {item.sales.toLocaleString()}
                      </Text>
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        </Col>
      </Row>
    </Card>
  );
}
