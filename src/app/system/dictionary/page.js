"use client";

import { useEffect, useState } from "react";
import { Tag } from "antd";
import SystemLayout from "@/components/system";
import DataTable from "@/components/system/DataTable";

export default function DictionaryPage() {
  const [dataSource, setDataSource] = useState([]);
  const [tableLoading, setTableLoading] = useState(false);

  // Load initial data
  useEffect(() => {
    loadDictionaryData();
  }, []);

  const loadDictionaryData = async () => {
    setTableLoading(true);
    // Simulate API call
    setTimeout(() => {
      const mockData = [
        {
          id: 1,
          type: "user_status",
          code: "active",
          label: "启用",
          value: "1",
          sort: 1,
          status: "active",
          description: "用户状态-启用",
          createdAt: "2024-01-15 10:30:00",
        },
        {
          id: 2,
          type: "user_status",
          code: "inactive",
          label: "禁用",
          value: "0",
          sort: 2,
          status: "active",
          description: "用户状态-禁用",
          createdAt: "2024-01-15 10:30:00",
        },
        {
          id: 3,
          type: "system_type",
          code: "web",
          label: "Web系统",
          value: "web",
          sort: 1,
          status: "active",
          description: "系统类型-Web",
          createdAt: "2024-01-15 10:30:00",
        },
        {
          id: 4,
          type: "system_type",
          code: "mobile",
          label: "移动端",
          value: "mobile",
          sort: 2,
          status: "active",
          description: "系统类型-移动端",
          createdAt: "2024-01-15 10:30:00",
        },
        {
          id: 5,
          type: "log_level",
          code: "info",
          label: "信息",
          value: "info",
          sort: 1,
          status: "active",
          description: "日志级别-信息",
          createdAt: "2024-01-15 10:30:00",
        },
        {
          id: 6,
          type: "log_level",
          code: "error",
          label: "错误",
          value: "error",
          sort: 2,
          status: "active",
          description: "日志级别-错误",
          createdAt: "2024-01-15 10:30:00",
        },
      ];
      setDataSource(mockData);
      setTableLoading(false);
    }, 1000);
  };

  const columns = [
    {
      title: "字典类型",
      dataIndex: "type",
      key: "type",
      width: 120,
    },
    {
      title: "字典代码",
      dataIndex: "code",
      key: "code",
      width: 120,
    },
    {
      title: "字典标签",
      dataIndex: "label",
      key: "label",
      width: 120,
    },
    {
      title: "字典值",
      dataIndex: "value",
      key: "value",
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
      title: "描述",
      dataIndex: "description",
      key: "description",
      width: 200,
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
      name: "type",
      label: "字典类型",
      type: "input",
    },
    {
      name: "code",
      label: "字典代码",
      type: "input",
    },
    {
      name: "label",
      label: "字典标签",
      type: "input",
    },
    {
      name: "value",
      label: "字典值",
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
      name: "description",
      label: "描述",
      type: "textarea",
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
    <SystemLayout title="词典管理" subtitle="Dictionary Management">
      <DataTable
        dataSource={dataSource}
        columns={columns}
        title="词典列表"
        formFields={formFields}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={tableLoading}
      />
    </SystemLayout>
  );
} 