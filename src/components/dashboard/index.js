import { Card, Row, Col, Statistic, Divider, Space, Text, Select, Tabs, Progress, AreaChart, BarChart, PieChart, Table } from 'antd';
import { RiseOutlined, FallOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';

// Dynamically import charts to avoid SSR issues
const LineChart = dynamic(() => import('../../components/charts/LineChart'), { ssr: false });
const BarChart = dynamic(() => import('../../components/charts/BarChart'), { ssr: false });
const PieChart = dynamic(() => import('../../components/charts/PieChart'), { ssr: false });
const AreaChart = dynamic(() => import('../../components/charts/AreaChart'), { ssr: false });


export default function Dashboard() {

  // Mock data for the dashboard
  const salesData = [
    { month: '1月', sales: 1200, visits: 800 },
    { month: '2月', sales: 900, visits: 600 },
    { month: '3月', sales: 1400, visits: 1000 },
    { month: '4月', sales: 1100, visits: 700 },
    { month: '5月', sales: 1000, visits: 800 },
    { month: '6月', sales: 1300, visits: 900 },
    { month: '7月', sales: 1500, visits: 1100 },
    { month: '8月', sales: 800, visits: 500 },
    { month: '9月', sales: 1200, visits: 900 },
    { month: '10月', sales: 1100, visits: 800 },
    { month: '11月', sales: 1300, visits: 1000 },
    { month: '12月', sales: 1600, visits: 1200 }
  ];

  // Data for mini charts in metric cards
  const visitsData = salesData.slice(0, 7).map(item => ({ month: item.month, sales: item.visits }));
  const paymentsData = salesData.slice(0, 7).map(item => ({ month: item.month, sales: item.sales }));

  const storeRanking = [
    { rank: 1, name: '工专路0号店', sales: 323234 },
    { rank: 2, name: '工专路1号店', sales: 323234 },
    { rank: 3, name: '工专路2号店', sales: 323234 },
    { rank: 4, name: '工专路3号店', sales: 323234 },
    { rank: 5, name: '工专路4号店', sales: 323234 },
    { rank: 6, name: '工专路5号店', sales: 323234 },
    { rank: 7, name: '工专路6号店', sales: 323234 }
  ];

  const searchKeywords = [
    { rank: 1, keyword: '搜索关键词-0', users: 390, change: -25 },
    { rank: 2, keyword: '搜索关键词-1', users: 733, change: 55 },
    { rank: 3, keyword: '搜索关键词-2', users: 457, change: 26 },
    { rank: 4, keyword: '搜索关键词-3', users: 634, change: 48 },
    { rank: 5, keyword: '搜索关键词-4', users: 5, change: -62 }
  ];

  const categoryData = [
    { name: '家用电器', value: 4544, color: '#1890ff' },
    { name: '食用酒水', value: 3321, color: '#13c2c2' },
    { name: '个护健康', value: 3113, color: '#fa8c16' },
    { name: '服饰箱包', value: 2341, color: '#722ed1' },
    { name: '母婴产品', value: 1231, color: '#eb2f96' },
    { name: '其他', value: 1231, color: '#52c41a' }
  ];
  const searchColumns = [
    {
      title: '排名',
      dataIndex: 'rank',
      key: 'rank',
      width: 60,
      render: (rank) => (
        <Badge 
          count={rank} 
          style={{ 
            backgroundColor: rank <= 3 ? '#1890ff' : '#d9d9d9',
            color: rank <= 3 ? '#fff' : '#666'
          }} 
        />
      ),
    },
    {
      title: '搜索关键词',
      dataIndex: 'keyword',
      key: 'keyword',
    },
    {
      title: '用户数',
      dataIndex: 'users',
      key: 'users',
      width: 100,
    },
    {
      title: '周涨幅',
      dataIndex: 'change',
      key: 'change',
      width: 100,
      render: (change) => (
        <Space>
          {change > 0 ? (
            <RiseOutlined style={{ color: '#f5222d' }} />
          ) : (
            <FallOutlined style={{ color: '#52c41a' }} />
          )}
          <Text style={{ color: change > 0 ? '#f5222d' : '#52c41a' }}>
            {Math.abs(change)}%
          </Text>
        </Space>
      ),
    },
  ];

  const storeColumns = [
    {
      title: '排名',
      dataIndex: 'rank',
      key: 'rank',
      width: 60,
      render: (rank) => (
        <Badge 
          count={rank} 
          style={{ 
            backgroundColor: rank <= 3 ? '#1890ff' : '#d9d9d9',
            color: rank <= 3 ? '#fff' : '#666'
          }} 
        />
      ),
    },
    {
      title: '门店名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '销售额',
      dataIndex: 'sales',
      key: 'sales',
      width: 120,
      render: (sales) => `¥${sales.toLocaleString()}`,
    },
  ];
  return (
    <Content
      style={{
        borderRadius: "6px",
        padding: "30px",
        minHeight: 280,
        overflowY: "auto",
        overflowX: "hidden",
        height: "calc(100vh - 70px)",
      }}
    >
      {/* Overview Metrics */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24, flexGrow: 1 }}>
        <Col xs={24} sm={12} lg={6} style={{ flexGrow: 1 }}>
          <Card>
            <Card.Meta title="总销售额" />
            <Divider />
            <Statistic
              title="总销售额"
              value={126560}
              prefix="¥"
              valueStyle={{ color: "#3f8600" }}
              suffix={
                <Space>
                  <Text type="secondary" style={{ fontSize: "12px" }}>
                    周同比
                    <RiseOutlined style={{ color: "#f5222d", marginLeft: 4 }} />
                    12%
                  </Text>
                  <Text type="secondary" style={{ fontSize: "12px" }}>
                    日同比
                    <FallOutlined style={{ color: "#52c41a", marginLeft: 4 }} />
                    11%
                  </Text>
                </Space>
              }
            />
            <Divider />
            <Card.Meta title="日销售额 ¥12,423" />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6} style={{ flexGrow: 1 }}>
          <Card>
            <Statistic
              title="访问量"
              value={8846}
              valueStyle={{ color: "#1890ff" }}
            />
            <div style={{ height: 40, marginTop: 8 }}>
              <AreaChart data={visitsData} height={40} color="#1890ff" />
            </div>
            <Text type="secondary" style={{ fontSize: "12px" }}>
              日访问量 1,234
            </Text>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6} style={{ flexGrow: 1 }}>
          <Card>
            <Statistic
              title="支付笔数"
              value={6560}
              valueStyle={{ color: "#722ed1" }}
            />
            <div style={{ height: 40, marginTop: 8 }}>
              <BarChart data={paymentsData} height={40} color="#722ed1" />
            </div>
            <Text type="secondary" style={{ fontSize: "12px" }}>
              转化率 60%
            </Text>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6} style={{ flexGrow: 1 }}>
          <Card>
            <Statistic
              title="运营活动效果"
              value={78}
              suffix="%"
              valueStyle={{ color: "#fa8c16" }}
            />
            <Progress
              percent={78}
              strokeColor="#fa8c16"
              showInfo={false}
              style={{ marginTop: 8 }}
            />
            <Space style={{ marginTop: 8 }}>
              <Text type="secondary" style={{ fontSize: "12px" }}>
                周同比
                <RiseOutlined style={{ color: "#f5222d", marginLeft: 4 }} />
                12%
              </Text>
              <Text type="secondary" style={{ fontSize: "12px" }}>
                日同比
                <FallOutlined style={{ color: "#52c41a", marginLeft: 4 }} />
                11%
              </Text>
            </Space>
          </Card>
        </Col>
      </Row>

      {/* Charts Section */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card
            title={
              <Space>
                <Tabs
                  activeKey={activeTab}
                  onChange={setActiveTab}
                  items={[
                    { key: "sales", label: "销售额" },
                    { key: "visits", label: "访问量" },
                  ]}
                  size="small"
                />
              </Space>
            }
            extra={
              <Space>
                <Select
                  value={timeRange}
                  onChange={setTimeRange}
                  style={{ width: 100 }}
                  options={[
                    { value: "today", label: "今日" },
                    { value: "week", label: "本周" },
                    { value: "month", label: "本月" },
                    { value: "year", label: "本年" },
                  ]}
                />
                <RangePicker
                  value={dateRange}
                  onChange={setDateRange}
                  style={{ width: 200 }}
                />
              </Space>
            }
          >
            <div style={{ height: 300 }}>
              <BarChart
                data={
                  activeTab === "sales"
                    ? salesData
                    : salesData.map((item) => ({
                        month: item.month,
                        sales: item.visits,
                      }))
                }
                height={300}
                color="#1890ff"
              />
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card title="门店销售额排名">
            <Table
              dataSource={storeRanking}
              columns={storeColumns}
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
      </Row>

      {/* Bottom Section */}
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} lg={12}>
          <Card
            title="线上热门搜索"
            extra={
              <Space>
                <Statistic
                  title="搜索用户数"
                  value={17.1}
                  suffix={<RiseOutlined style={{ color: "#f5222d" }} />}
                  valueStyle={{ fontSize: "16px" }}
                />
                <Statistic
                  title="人均搜索次数"
                  value={26.2}
                  suffix={<FallOutlined style={{ color: "#52c41a" }} />}
                  valueStyle={{ fontSize: "16px" }}
                />
              </Space>
            }
          >
            <Table
              dataSource={searchKeywords}
              columns={searchColumns}
              pagination={{
                total: 50,
                pageSize: 5,
                showSizeChanger: false,
                showQuickJumper: true,
              }}
              size="small"
            />
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card
            title="销售额类别占比"
            extra={
              <Tabs
                size="small"
                items={[
                  { key: "all", label: "全部渠道" },
                  { key: "online", label: "线上" },
                  { key: "store", label: "门店" },
                ]}
              />
            }
          >
            <div style={{ height: 300 }}>
              <PieChart data={categoryData} height={300} />
            </div>
          </Card>
        </Col>
      </Row>
    </Content>
  );
}
