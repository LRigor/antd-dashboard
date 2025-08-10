"use client";

import { useEffect, useState } from "react";
import { Tag } from "antd";
import SystemLayout from "@/components/system";
import DataTable from "@/components/system/DataTable";

export default function NamespacesPage() {
  const [dataSource, setDataSource] = useState([]);
  const [tableLoading, setTableLoading] = useState(false);

  // Load initial data
  useEffect(() => {
    loadNamespacesData();
  }, []);

  const loadNamespacesData = async () => {
    setTableLoading(true);
    // Simulate API call
    setTimeout(() => {
      const mockData = [
        {
          id: 1,
          name: "default",
          displayName: "默认命名空间",
          description: "系统默认命名空间",
          status: "active",
          owner: "admin",
          createdAt: "2024-01-15 10:30:00",
        },
        {
          id: 2,
          name: "development",
          displayName: "开发环境",
          description: "开发环境命名空间",
          status: "active",
          owner: "developer",
          createdAt: "2024-01-15 10:30:00",
        },
        {
          id: 3,
          name: "production",
          displayName: "生产环境",
          description: "生产环境命名空间",
          status: "active",
          owner: "admin",
          createdAt: "2024-01-15 10:30:00",
        },
        {
          id: 4,
          name: "testing",
          displayName: "测试环境",
          description: "测试环境命名空间",
          status: "inactive",
          owner: "tester",
          createdAt: "2024-01-15 10:30:00",
        },
      ];
      setDataSource(mockData);
      setTableLoading(false);
    }, 1000);
  };

  const columns = [
    {
      title: "命名空间名称",
      dataIndex: "name",
      key: "name",
      width: 150,
    },
    {
      title: "显示名称",
      dataIndex: "displayName",
      key: "displayName",
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
      title: "所有者",
      dataIndex: "owner",
      key: "owner",
      width: 120,
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
      label: "命名空间名称",
      type: "input",
    },
    {
      name: "displayName",
      label: "显示名称",
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
      name: "owner",
      label: "所有者",
      type: "input",
    },
  ];

  const handleAdd = async (values) => {
    const newRecord = {
      id: Date.now(),
      ...values,
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
    <SystemLayout title="命名空间管理" subtitle="Namespace Management">
      <DataTable
        dataSource={dataSource}
        columns={columns}
        title="命名空间列表"
        formFields={formFields}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={tableLoading}
      />
    </SystemLayout>
  );
} 