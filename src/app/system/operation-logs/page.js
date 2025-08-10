"use client";

import { useEffect, useState } from "react";
import { Tag, Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";
import SystemLayout from "@/components/system";
import DataTable from "@/components/system/DataTable";

export default function OperationLogsPage() {
  const [dataSource, setDataSource] = useState([]);
  const [tableLoading, setTableLoading] = useState(false);

  // Load initial data
  useEffect(() => {
    loadOperationLogsData();
  }, []);

  const loadOperationLogsData = async () => {
    setTableLoading(true);
    // Simulate API call
    setTimeout(() => {
      const mockData = [
        {
          id: 1,
          username: "admin",
          name: "系统管理员",
          module: "用户管理",
          operation: "创建用户",
          method: "POST",
          url: "/api/users",
          ip: "192.168.1.100",
          status: "success",
          duration: 150,
          operationTime: "2024-01-15 10:30:00",
        },
        {
          id: 2,
          username: "manager",
          name: "部门经理",
          module: "角色管理",
          operation: "更新角色",
          method: "PUT",
          url: "/api/roles/1",
          ip: "192.168.1.101",
          status: "success",
          duration: 200,
          operationTime: "2024-01-15 09:15:00",
        },
        {
          id: 3,
          username: "operator",
          name: "操作员",
          module: "菜单管理",
          operation: "删除菜单",
          method: "DELETE",
          url: "/api/menus/5",
          ip: "192.168.1.102",
          status: "failed",
          duration: 300,
          operationTime: "2024-01-15 08:45:00",
        },
        {
          id: 4,
          username: "admin",
          name: "系统管理员",
          module: "系统配置",
          operation: "修改配置",
          method: "PUT",
          url: "/api/config",
          ip: "192.168.1.100",
          status: "success",
          duration: 180,
          operationTime: "2024-01-14 16:20:00",
        },
        {
          id: 5,
          username: "guest",
          name: "访客用户",
          module: "文件管理",
          operation: "上传文件",
          method: "POST",
          url: "/api/files/upload",
          ip: "192.168.1.103",
          status: "success",
          duration: 2500,
          operationTime: "2024-01-14 14:30:00",
        },
        {
          id: 6,
          username: "admin",
          name: "系统管理员",
          module: "日志管理",
          operation: "查询日志",
          method: "GET",
          url: "/api/logs",
          ip: "192.168.1.100",
          status: "success",
          duration: 120,
          operationTime: "2024-01-14 12:15:00",
        },
      ];
      setDataSource(mockData);
      setTableLoading(false);
    }, 1000);
  };

  const columns = [
    {
      title: "操作用户",
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
      title: "模块",
      dataIndex: "module",
      key: "module",
      width: 120,
    },
    {
      title: "操作",
      dataIndex: "operation",
      key: "operation",
      width: 120,
    },
    {
      title: "请求方法",
      dataIndex: "method",
      key: "method",
      width: 100,
      render: (method) => (
        <Tag color={
          method === "GET" ? "blue" : 
          method === "POST" ? "green" : 
          method === "PUT" ? "orange" : 
          method === "DELETE" ? "red" : "default"
        }>
          {method}
        </Tag>
      ),
    },
    {
      title: "请求地址",
      dataIndex: "url",
      key: "url",
      width: 200,
    },
    {
      title: "IP地址",
      dataIndex: "ip",
      key: "ip",
      width: 130,
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
      title: "耗时(ms)",
      dataIndex: "duration",
      key: "duration",
      width: 100,
    },
    {
      title: "操作时间",
      dataIndex: "operationTime",
      key: "operationTime",
      width: 180,
    },
  ];

  const handleDelete = async (record) => {
    setDataSource(dataSource.filter(item => item.id !== record.id));
  };

  return (
    <SystemLayout title="操作日志" subtitle="Operation Logs">
      <DataTable
        dataSource={dataSource}
        columns={columns}
        title="操作日志列表"
        onDelete={handleDelete}
        loading={tableLoading}
      />
    </SystemLayout>
  );
} 