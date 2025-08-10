"use client";

import { useEffect, useState } from "react";
import { Tag, Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";
import SystemLayout from "@/components/system";
import DataTable from "@/components/system/DataTable";

export default function AdminsPage() {
  const [dataSource, setDataSource] = useState([]);
  const [tableLoading, setTableLoading] = useState(false);

  // Load initial data
  useEffect(() => {
    loadAdminsData();
  }, []);

  const loadAdminsData = async () => {
    setTableLoading(true);
    // Simulate API call
    setTimeout(() => {
      const mockData = [
        {
          id: 1,
          username: "admin",
          name: "系统管理员",
          email: "admin@example.com",
          phone: "13800138000",
          role: "超级管理员",
          status: "active",
          lastLogin: "2024-01-15 10:30:00",
          createdAt: "2024-01-15 10:30:00",
        },
        {
          id: 2,
          username: "manager",
          name: "部门经理",
          email: "manager@example.com",
          phone: "13800138001",
          role: "系统管理员",
          status: "active",
          lastLogin: "2024-01-15 09:15:00",
          createdAt: "2024-01-15 10:30:00",
        },
        {
          id: 3,
          username: "operator",
          name: "操作员",
          email: "operator@example.com",
          phone: "13800138002",
          role: "普通用户",
          status: "active",
          lastLogin: "2024-01-14 16:45:00",
          createdAt: "2024-01-15 10:30:00",
        },
        {
          id: 4,
          username: "guest",
          name: "访客用户",
          email: "guest@example.com",
          phone: "13800138003",
          role: "访客",
          status: "inactive",
          lastLogin: "2024-01-10 14:20:00",
          createdAt: "2024-01-15 10:30:00",
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
      title: "邮箱",
      dataIndex: "email",
      key: "email",
      width: 180,
    },
    {
      title: "电话",
      dataIndex: "phone",
      key: "phone",
      width: 130,
    },
    {
      title: "角色",
      dataIndex: "role",
      key: "role",
      width: 120,
      render: (role) => (
        <Tag color={role === "超级管理员" ? "red" : role === "系统管理员" ? "blue" : "green"}>
          {role}
        </Tag>
      ),
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      width: 100,
      render: (status) => (
        <Tag color={status === "active" ? "green" : "red"}>
          {status === "active" ? "启用" : "禁用"}
        </Tag>
      ),
    },
    {
      title: "最后登录",
      dataIndex: "lastLogin",
      key: "lastLogin",
      width: 180,
    },
    {
      title: "创建时间",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 180,
    },
  ];

  const formFields = [
    {
      name: "username",
      label: "用户名",
      type: "input",
    },
    {
      name: "name",
      label: "姓名",
      type: "input",
    },
    {
      name: "email",
      label: "邮箱",
      type: "input",
      rules: [
        { required: true, message: "请输入邮箱" },
        { type: "email", message: "请输入有效的邮箱地址" },
      ],
    },
    {
      name: "phone",
      label: "电话",
      type: "input",
    },
    {
      name: "role",
      label: "角色",
      type: "select",
      options: [
        { value: "超级管理员", label: "超级管理员" },
        { value: "系统管理员", label: "系统管理员" },
        { value: "普通用户", label: "普通用户" },
        { value: "访客", label: "访客" },
      ],
    },
    {
      name: "status",
      label: "状态",
      type: "select",
      options: [
        { value: "active", label: "启用" },
        { value: "inactive", label: "禁用" },
      ],
    },
  ];

  const handleAdd = async (values) => {
    const newRecord = {
      id: Date.now(),
      ...values,
      lastLogin: "-",
      createdAt: new Date().toLocaleString(),
    };
    setDataSource([...dataSource, newRecord]);
  };

  const handleEdit = async (values) => {
    setDataSource(dataSource.map(item => 
      item.id === values.id ? { ...item, ...values } : item
    ));
  };

  const handleDelete = async (record) => {
    setDataSource(dataSource.filter(item => item.id !== record.id));
  };

  return (
    <SystemLayout title="管理员管理" subtitle="Admin Management">
      <DataTable
        dataSource={dataSource}
        columns={columns}
        title="管理员列表"
        formFields={formFields}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={tableLoading}
      />
    </SystemLayout>
  );
} 