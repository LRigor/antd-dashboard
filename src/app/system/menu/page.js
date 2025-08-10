"use client";

import { useEffect, useState } from "react";
import { Tag } from "antd";
import SystemLayout from "@/components/system";
import DataTable from "@/components/system/DataTable";

export default function MenuPage() {
  const [dataSource, setDataSource] = useState([]);
  const [tableLoading, setTableLoading] = useState(false);

  // Load initial data
  useEffect(() => {
    loadMenuData();
  }, []);

  const loadMenuData = async () => {
    setTableLoading(true);
    // Simulate API call
    setTimeout(() => {
      const mockData = [
        {
          id: 1,
          name: "系统管理",
          path: "/system",
          icon: "SettingOutlined",
          sort: 1,
          status: "active",
          parentId: null,
          createdAt: "2024-01-15 10:30:00",
        },
        {
          id: 2,
          name: "菜单管理",
          path: "/system/menu",
          icon: "MenuOutlined",
          sort: 1,
          status: "active",
          parentId: 1,
          createdAt: "2024-01-15 10:30:00",
        },
        {
          id: 3,
          name: "角色管理",
          path: "/system/roles",
          icon: "TeamOutlined",
          sort: 2,
          status: "active",
          parentId: 1,
          createdAt: "2024-01-15 10:30:00",
        },
        {
          id: 4,
          name: "用户管理",
          path: "/system/users",
          icon: "UserOutlined",
          sort: 3,
          status: "inactive",
          parentId: 1,
          createdAt: "2024-01-15 10:30:00",
        },
      ];
      setDataSource(mockData);
      setTableLoading(false);
    }, 1000);
  };

  const columns = [
    {
      title: "菜单名称",
      dataIndex: "name",
      key: "name",
      width: 150,
    },
    {
      title: "路径",
      dataIndex: "path",
      key: "path",
      width: 200,
    },
    {
      title: "图标",
      dataIndex: "icon",
      key: "icon",
      width: 120,
    },
    {
      title: "排序",
      dataIndex: "sort",
      key: "sort",
      width: 80,
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
      title: "父级菜单",
      dataIndex: "parentId",
      key: "parentId",
      width: 120,
      render: (parentId) => {
        if (!parentId) return "顶级菜单";
        const parent = dataSource.find(item => item.id === parentId);
        return parent ? parent.name : "未知";
      },
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
      label: "菜单名称",
      type: "input",
    },
    {
      name: "path",
      label: "路径",
      type: "input",
    },
    {
      name: "icon",
      label: "图标",
      type: "input",
    },
    {
      name: "sort",
      label: "排序",
      type: "input",
      rules: [
        { required: true, message: "请输入排序" },
        { type: "number", message: "排序必须为数字", transform: (value) => Number(value) },
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
    {
      name: "parentId",
      label: "父级菜单",
      type: "select",
      options: [
        { value: null, label: "顶级菜单" },
        ...dataSource
          .filter(item => !item.parentId)
          .map(item => ({ value: item.id, label: item.name })),
      ],
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
    <SystemLayout title="菜单管理" subtitle="Menu Management">
      <DataTable
        dataSource={dataSource}
        columns={columns}
        title="菜单列表"
        formFields={formFields}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={tableLoading}
      />
    </SystemLayout>
  );
} 