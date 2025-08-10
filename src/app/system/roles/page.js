"use client";

import { useEffect, useState } from "react";
import { Tag } from "antd";
import SystemLayout from "@/components/system";
import DataTable from "@/components/system/DataTable";

export default function RolesPage() {
  const [dataSource, setDataSource] = useState([]);
  const [tableLoading, setTableLoading] = useState(false);

  // Load initial data
  useEffect(() => {
    loadRolesData();
  }, []);

  const loadRolesData = async () => {
    setTableLoading(true);
    // Simulate API call
    setTimeout(() => {
      const mockData = [
        {
          id: 1,
          name: "超级管理员",
          code: "SUPER_ADMIN",
          description: "拥有系统所有权限",
          status: "active",
          permissions: ["all"],
          createdAt: "2024-01-15 10:30:00",
        },
        {
          id: 2,
          name: "系统管理员",
          code: "SYSTEM_ADMIN",
          description: "系统管理权限",
          status: "active",
          permissions: ["system:read", "system:write"],
          createdAt: "2024-01-15 10:30:00",
        },
        {
          id: 3,
          name: "普通用户",
          code: "USER",
          description: "基础用户权限",
          status: "active",
          permissions: ["user:read"],
          createdAt: "2024-01-15 10:30:00",
        },
        {
          id: 4,
          name: "访客",
          code: "GUEST",
          description: "只读权限",
          status: "inactive",
          permissions: ["read"],
          createdAt: "2024-01-15 10:30:00",
        },
      ];
      setDataSource(mockData);
      setTableLoading(false);
    }, 1000);
  };

  const columns = [
    {
      title: "角色名称",
      dataIndex: "name",
      key: "name",
      width: 150,
    },
    {
      title: "角色代码",
      dataIndex: "code",
      key: "code",
      width: 150,
    },
    {
      title: "描述",
      dataIndex: "description",
      key: "description",
      width: 200,
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
      title: "权限",
      dataIndex: "permissions",
      key: "permissions",
      width: 200,
      render: (permissions) => (
        <div>
          {permissions.map((permission, index) => (
            <Tag key={index} color="blue" style={{ marginBottom: 4 }}>
              {permission}
            </Tag>
          ))}
        </div>
      ),
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
      name: "name",
      label: "角色名称",
      type: "input",
    },
    {
      name: "code",
      label: "角色代码",
      type: "input",
    },
    {
      name: "description",
      label: "描述",
      type: "textarea",
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
    {
      name: "permissions",
      label: "权限",
      type: "select",
      options: [
        { value: "all", label: "所有权限" },
        { value: "system:read", label: "系统读取" },
        { value: "system:write", label: "系统写入" },
        { value: "user:read", label: "用户读取" },
        { value: "user:write", label: "用户写入" },
        { value: "read", label: "只读" },
      ],
    },
  ];

  const handleAdd = async (values) => {
    const newRecord = {
      id: Date.now(),
      ...values,
      permissions: Array.isArray(values.permissions) ? values.permissions : [values.permissions],
      createdAt: new Date().toLocaleString(),
    };
    setDataSource([...dataSource, newRecord]);
  };

  const handleEdit = async (values) => {
    setDataSource(dataSource.map(item => 
      item.id === values.id ? { 
        ...item, 
        ...values,
        permissions: Array.isArray(values.permissions) ? values.permissions : [values.permissions],
      } : item
    ));
  };

  const handleDelete = async (record) => {
    setDataSource(dataSource.filter(item => item.id !== record.id));
  };

  return (
    <SystemLayout title="角色管理" subtitle="Role Management">
      <DataTable
        dataSource={dataSource}
        columns={columns}
        title="角色列表"
        formFields={formFields}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={tableLoading}
      />
    </SystemLayout>
  );
} 