import React, { useState, useEffect } from "react";
import {
  Card,
  Space,
  Typography,
  Table,
  Pagination,
  Row,
  Col,
  Dropdown,
  Button,
} from "antd";
import {
  InfoCircleOutlined,
  MoreOutlined,
  CaretUpOutlined,
  CaretDownOutlined,
} from "@ant-design/icons";
import { Area } from "@ant-design/plots";

const { Text, Title } = Typography;

export default function Popular() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5);
  const [sortedInfo, setSortedInfo] = useState({});
  const [chartsVisible, setChartsVisible] = useState(false);

  // Show charts after component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      setChartsVisible(true);
    }, 100); // Small delay to ensure DOM is ready

    return () => clearTimeout(timer);
  }, []);

  // Generate 50 random table data entries
  const generateTableData = () => {
    const data = [];
    for (let i = 0; i < 50; i++) {
      data.push({
        key: i.toString(),
        rank: i + 1,
        keyword: `搜索关键词-${i}`,
        users: Math.floor(Math.random() * 1000) + 50, // Random users between 50-1050
        weeklyChange: Math.floor(Math.random() * 200) - 100, // Random change between -100 and 100
      });
    }
    return data;
  };

  const allTableData = generateTableData();

  // Handle dropdown menu operations
  const handleMenuClick = ({ key }) => {
    switch (key) {
      case "operation1":
        // Add your operation one logic here
        break;
      case "operation2":
        // Add your operation two logic here
        break;
      default:
        break;
    }
  };

  // Dropdown menu items
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

  // Sample data for the summary cards
  const summaryData = [
    {
      title: "搜索用户数",
      value: "17.1",
      trend: "up",
      color: "#1890ff",
    },
    {
      title: "人均搜索次数",
      value: "26.2",
      trend: "down",
      color: "#1890ff",
    },
  ];

  // Chart data for the summary cards
  const chartData = [
    { x: 0, y: 1, type: "搜索量" },
    { x: 1, y: 6, type: "搜索量" },
    { x: 2, y: 4, type: "搜索量" },
    { x: 3, y: 8, type: "搜索量" },
    { x: 4, y: 3, type: "搜索量" },
    { x: 5, y: 7, type: "搜索量" },
    { x: 6, y: 2, type: "搜索量" },
  ];

  // Enhanced chart data with multiple data types
  const enhancedChartData = [
    // 食用酒水 (Food and Beverages)
    { x: 0, y: 85, type: "食用酒水" },
    { x: 1, y: 92, type: "食用酒水" },
    { x: 2, y: 78, type: "食用酒水" },
    { x: 3, y: 95, type: "食用酒水" },
    { x: 4, y: 88, type: "食用酒水" },
    { x: 5, y: 96, type: "食用酒水" },
    { x: 6, y: 89, type: "食用酒水" },
    
    // 个护健康 (Personal Care and Health)
    { x: 0, y: 72, type: "个护健康" },
    { x: 1, y: 78, type: "个护健康" },
    { x: 2, y: 85, type: "个护健康" },
    { x: 3, y: 91, type: "个护健康" },
    { x: 4, y: 87, type: "个护健康" },
    { x: 5, y: 93, type: "个护健康" },
    { x: 6, y: 86, type: "个护健康" },
    
    // 家用电器 (Home Appliances)
    { x: 0, y: 45, type: "家用电器" },
    { x: 1, y: 52, type: "家用电器" },
    { x: 2, y: 48, type: "家用电器" },
    { x: 3, y: 61, type: "家用电器" },
    { x: 4, y: 55, type: "家用电器" },
    { x: 5, y: 68, type: "家用电器" },
    { x: 6, y: 62, type: "家用电器" },
    
    // 母婴产品 (Maternity and Baby Products)
    { x: 0, y: 28, type: "母婴产品" },
    { x: 1, y: 32, type: "母婴产品" },
    { x: 2, y: 35, type: "母婴产品" },
    { x: 3, y: 38, type: "母婴产品" },
    { x: 4, y: 41, type: "母婴产品" },
    { x: 5, y: 44, type: "母婴产品" },
    { x: 6, y: 42, type: "母婴产品" },
    
    // 服饰箱包 (Apparel and Bags)
    { x: 0, y: 15, type: "服饰箱包" },
    { x: 1, y: 18, type: "服饰箱包" },
    { x: 2, y: 22, type: "服饰箱包" },
    { x: 3, y: 25, type: "服饰箱包" },
    { x: 4, y: 28, type: "服饰箱包" },
    { x: 5, y: 31, type: "服饰箱包" },
    { x: 6, y: 29, type: "服饰箱包" },
    
    // 其他 (Other)
    { x: 0, y: 12, type: "其他" },
    { x: 1, y: 15, type: "其他" },
    { x: 2, y: 18, type: "其他" },
    { x: 3, y: 21, type: "其他" },
    { x: 4, y: 24, type: "其他" },
    { x: 5, y: 27, type: "其他" },
    { x: 6, y: 25, type: "其他" },
  ];

  const config = {
    data: chartData,
    xField: "x",
    yField: "y",
    shapeField: "smooth",
    height: 100,
    autoFit: true,
    style: {
      fill: "linear-gradient(-90deg, white 0%, #4d87ff 100%)",
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
    line: false,
  };

  // Handle sorting
  const handleTableChange = (pagination, filters, sorter) => {
    setSortedInfo(sorter);
  };

  // Sort data based on current sort state
  const getSortedData = () => {
    let sortedData = [...allTableData];

    if (sortedInfo.columnKey && sortedInfo.order) {
      sortedData.sort((a, b) => {
        const aValue = a[sortedInfo.columnKey];
        const bValue = b[sortedInfo.columnKey];

        if (sortedInfo.order === "ascend") {
          return aValue - bValue;
        } else {
          return bValue - aValue;
        }
      });
    }

    return sortedData;
  };

  // Get paginated data
  const getPaginatedData = () => {
    const sortedData = getSortedData();
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return sortedData.slice(startIndex, endIndex);
  };

  // Table columns configuration
  const columns = [
    {
      title: "排名",
      dataIndex: "rank",
      key: "rank",
      width: 80,
      render: (rank) => (
        <Text style={{ fontSize: "14px", fontWeight: "500" }}>{rank}</Text>
      ),
    },
    {
      title: "搜索关键词",
      dataIndex: "keyword",
      key: "keyword",
      render: (keyword) => (
        <Text
          style={{
            color: "#1890ff",
            fontSize: "14px",
            cursor: "pointer",
          }}
        >
          {keyword}
        </Text>
      ),
    },
    {
      title: <Text>用户数</Text>,
      dataIndex: "users",
      key: "users",
      width: 100,
      sorter: (a, b) => a.users - b.users,
      sortOrder: sortedInfo.columnKey === "users" && sortedInfo.order,
      render: (users) => (
        <Text style={{ fontSize: "14px" }}>{users.toLocaleString()}</Text>
      ),
    },
    {
      title: <Text>周涨幅</Text>,
      dataIndex: "weeklyChange",
      key: "weeklyChange",
      width: 120,
      sorter: (a, b) => a.weeklyChange - b.weeklyChange,
      sortOrder: sortedInfo.columnKey === "weeklyChange" && sortedInfo.order,
      render: (change) => (
        <Space>
          <Text
            style={{
              color: change >= 0 ? "#ff4d4f" : "#52c41a",
              fontSize: "14px",
            }}
          >
            {Math.abs(change)}%
          </Text>
          {change >= 0 ? (
            <CaretUpOutlined style={{ fontSize: "12px", color: "#ff4d4f" }} />
          ) : (
            <CaretDownOutlined style={{ fontSize: "12px", color: "#52c41a" }} />
          )}
        </Space>
      ),
    },
  ];

  return (
    <Card
      title={
        <Space>
          <Title level={4} style={{ margin: 0 }}>
            线上热门搜索
          </Title>
        </Space>
      }
      extra={
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
          padding: "20px",
        },
      }}
    >
      {/* Summary Cards */}
      <Row gutter={16} style={{ marginBottom: "24px" }}>
        {summaryData.map((item) => (
          <Col span={12} key={item.title}>
            <Card
              style={{
                border: "none",
                position: "relative",
                height: "150px",
              }}
              styles={{
                body: {
                  padding: "16px",
                },
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "8px",
                }}
              >
                <Text
                  style={{
                    fontSize: "14px",
                    fontWeight: "500",
                    marginRight: "4px",
                  }}
                >
                  {item.title}
                </Text>
                <InfoCircleOutlined
                  style={{
                    color: "#8c8c8c",
                    fontSize: "14px",
                    cursor: "pointer",
                  }}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "8px",
                }}
              >
                <Text
                  style={{
                    fontSize: "24px",
                    fontWeight: "600",
                    marginRight: "8px",
                  }}
                >
                  {item.value}
                </Text>
                {item.trend === "up" ? (
                  <CaretUpOutlined style={{ fontSize: "12px" }} />
                ) : (
                  <CaretDownOutlined style={{ fontSize: "12px" }} />
                )}
              </div>
              <div
                style={{ position: "absolute", bottom: -10, left: 0, right: 0 }}
              >
                {chartsVisible && <Area {...config} />}
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Data Table */}
      <Table
        columns={columns}
        dataSource={getPaginatedData()}
        pagination={false}
        size="small"
        style={{ marginBottom: "16px" }}
        onChange={handleTableChange}
        styles={{
          header: {
            background: "#fafafa",
          },
        }}
      />

      {/* Pagination */}
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Pagination
          current={currentPage}
          total={allTableData.length}
          pageSize={pageSize}
          showSizeChanger={false}
          showQuickJumper={false}
          onChange={setCurrentPage}
          itemRender={(page, type, originalElement) => {
            if (type === "page") {
              return (
                <span
                  style={{
                    padding: "4px 8px",
                    margin: "0 2px",
                    borderRadius: "4px",
                    cursor: "pointer",
                    backgroundColor:
                      page === currentPage ? "#1890ff" : "transparent",
                  }}
                >
                  {page}
                </span>
              );
            }
            return originalElement;
          }}
        />
      </div>
    </Card>
  );
}
