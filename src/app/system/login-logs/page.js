"use client";

import { useEffect, useState } from "react";
import { Tag, Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";
import SystemLayout from "@/components/system";
import DataTable from "@/components/system/DataTable";

export default function LoginLogsPage() {
  const [dataSource, setDataSource] = useState([]);
  const [tableLoading, setTableLoading] = useState(false);

  // Load initial data
  useEffect(() => {
    loadLoginLogsData();
  }, []);

  const loadLoginLogsData = async () => {
    setTableLoading(true);
    // Simulate API call
    setTimeout(() => {
      const mockData = [
        {
          id: 1,
          username: "admin",
          name: "系统管理员",
          ip: "192.168.1.100",
          location: "北京市",
          device: "Chrome 120.0.0.0",
          status: "success",
          loginTime: "2024-01-15 10:30:00",
          logoutTime: "2024-01-15 12:45:00",
        },
        {
          id: 2,
          username: "manager",
          name: "部门经理",
          ip: "192.168.1.101",
          location: "上海市",
          device: "Firefox 121.0",
          status: "success",
          loginTime: "2024-01-15 09:15:00",
          logoutTime: "2024-01-15 11:30:00",
        },
        {
          id: 3,
          username: "operator",
          name: "操作员",
          ip: "192.168.1.102",
          location: "广州市",
          device: "Safari 17.0",
          status: "failed",
          loginTime: "2024-01-15 08:45:00",
          logoutTime: "-",
        },
        {
          id: 4,
          username: "guest",
          name: "访客用户",
          ip: "192.168.1.103",
          location: "深圳市",
          device: "Edge 120.0.0.0",
          status: "success",
          loginTime: "2024-01-14 16:20:00",
          logoutTime: "2024-01-14 18:15:00",
        },
        {
          id: 5,
          username: "admin",
          name: "系统管理员",
          ip: "192.168.1.100",
          location: "北京市",
          device: "Chrome 120.0.0.0",
          status: "success",
          loginTime: "2024-01-14 14:30:00",
          logoutTime: "2024-01-14 17:45:00",
        },
      ];
      setDataSource(mockData);
      setTableLoading(false);
    }, 1000);
  };

  const columns = [
    {
      title: "用户",
      dataIndex: "username",
      key: "username",
      width: 120,
      render: (username, record) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Avatar icon={<UserOutlined />} style={{ marginRight: 8 }} />
          <div>
            <div>{record.name}</div>
            <div style={{ fontSize: '12px', color: '#999' }}>@{username}</div>
          </div>
        </div>
      ),
    },
    {
      title: "IP地址",
      dataIndex: "ip",
      key: "ip",
      width: 130,
    },
    {
      title: "登录地点",
      dataIndex: "location",
      key: "location",
      width: 120,
    },
    {
      title: "设备信息",
      dataIndex: "device",
      key: "device",
      width: 180,
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      width: 100,
      render: (status) => (
        <Tag color={status === "success" ? "green" : "red"}>
          {status === "success" ? "成功" : "失败"}
        </Tag>
      ),
    },
    {
      title: "登录时间",
      dataIndex: "loginTime",
      key: "loginTime",
      width: 180,
    },
    {
      title: "登出时间",
      dataIndex: "logoutTime",
      key: "logoutTime",
      width: 180,
    },
  ];

  const handleDelete = async (record) => {
    setDataSource(dataSource.filter(item => item.id !== record.id));
  };

  return (
    <SystemLayout title="登录日志" subtitle="Login Logs">
      <DataTable
        dataSource={dataSource}
        columns={columns}
        title="登录日志列表"
        onDelete={handleDelete}
        loading={tableLoading}
      />
    </SystemLayout>
  );
} 