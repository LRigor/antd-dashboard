"use client";

import { useEffect, useState } from "react";
import { Tag, Button, Space } from "antd";
import { DownloadOutlined, EyeOutlined, FileOutlined, FolderOutlined } from "@ant-design/icons";
import SystemLayout from "@/components/system";
import DataTable from "@/components/system/DataTable";

export default function FilesPage() {
  const [dataSource, setDataSource] = useState([]);
  const [tableLoading, setTableLoading] = useState(false);

  // Load initial data
  useEffect(() => {
    loadFilesData();
  }, []);

  const loadFilesData = async () => {
    setTableLoading(true);
    // Simulate API call
    setTimeout(() => {
      const mockData = [
        {
          id: 1,
          name: "系统文档",
          type: "folder",
          size: "-",
          path: "/documents",
          owner: "admin",
          status: "active",
          uploadTime: "2024-01-15 10:30:00",
        },
        {
          id: 2,
          name: "用户手册.pdf",
          type: "pdf",
          size: "2.5MB",
          path: "/documents/user-manual.pdf",
          owner: "admin",
          status: "active",
          uploadTime: "2024-01-15 10:30:00",
        },
        {
          id: 3,
          name: "系统配置.json",
          type: "json",
          size: "15KB",
          path: "/config/system.json",
          owner: "admin",
          status: "active",
          uploadTime: "2024-01-15 09:15:00",
        },
        {
          id: 4,
          name: "logo.png",
          type: "image",
          size: "150KB",
          path: "/images/logo.png",
          owner: "manager",
          status: "active",
          uploadTime: "2024-01-14 16:20:00",
        },
        {
          id: 5,
          name: "临时文件",
          type: "folder",
          size: "-",
          path: "/temp",
          owner: "system",
          status: "inactive",
          uploadTime: "2024-01-14 14:30:00",
        },
        {
          id: 6,
          name: "备份数据.zip",
          type: "zip",
          size: "50MB",
          path: "/backup/data.zip",
          owner: "admin",
          status: "active",
          uploadTime: "2024-01-14 12:15:00",
        },
      ];
      setDataSource(mockData);
      setTableLoading(false);
    }, 1000);
  };

  const getFileIcon = (type) => {
    switch (type) {
      case "folder":
        return <FolderOutlined style={{ color: "#1890ff" }} />;
      case "pdf":
        return <FileOutlined style={{ color: "#ff4d4f" }} />;
      case "image":
        return <FileOutlined style={{ color: "#52c41a" }} />;
      case "json":
        return <FileOutlined style={{ color: "#faad14" }} />;
      case "zip":
        return <FileOutlined style={{ color: "#722ed1" }} />;
      default:
        return <FileOutlined />;
    }
  };

  const getFileTypeLabel = (type) => {
    switch (type) {
      case "folder":
        return "文件夹";
      case "pdf":
        return "PDF文档";
      case "image":
        return "图片文件";
      case "json":
        return "JSON文件";
      case "zip":
        return "压缩文件";
      default:
        return "文件";
    }
  };

  const columns = [
    {
      title: "文件名",
      dataIndex: "name",
      key: "name",
      width: 200,
      render: (name, record) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {getFileIcon(record.type)}
          <span style={{ marginLeft: 8 }}>{name}</span>
        </div>
      ),
    },
    {
      title: "类型",
      dataIndex: "type",
      key: "type",
      width: 100,
      render: (type) => (
        <Tag color="blue">{getFileTypeLabel(type)}</Tag>
      ),
    },
    {
      title: "大小",
      dataIndex: "size",
      key: "size",
      width: 100,
    },
    {
      title: "路径",
      dataIndex: "path",
      key: "path",
      width: 200,
    },
    {
      title: "所有者",
      dataIndex: "owner",
      key: "owner",
      width: 120,
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      width: 100,
      render: (status) => (
        <Tag color={status === "active" ? "green" : "red"}>
          {status === "active" ? "正常" : "禁用"}
        </Tag>
      ),
    },
    {
      title: "上传时间",
      dataIndex: "uploadTime",
      key: "uploadTime",
      width: 180,
    },
    {
      title: "操作",
      key: "action",
      width: 150,
      render: (_, record) => (
        <Space size="middle">
          {record.type !== "folder" && (
            <>
              <Button type="link" icon={<EyeOutlined />} size="small">
                预览
              </Button>
              <Button type="link" icon={<DownloadOutlined />} size="small">
                下载
              </Button>
            </>
          )}
        </Space>
      ),
    },
  ];

  const formFields = [
    {
      name: "name",
      label: "文件名",
      type: "input",
    },
    {
      name: "type",
      label: "文件类型",
      type: "select",
      options: [
        { value: "folder", label: "文件夹" },
        { value: "pdf", label: "PDF文档" },
        { value: "image", label: "图片文件" },
        { value: "json", label: "JSON文件" },
        { value: "zip", label: "压缩文件" },
        { value: "other", label: "其他文件" },
      ],
    },
    {
      name: "path",
      label: "文件路径",
      type: "input",
    },
    {
      name: "owner",
      label: "所有者",
      type: "input",
    },
    {
      name: "status",
      label: "状态",
      type: "select",
      options: [
        { value: "active", label: "正常" },
        { value: "inactive", label: "禁用" },
      ],
    },
  ];

  const handleAdd = async (values) => {
    const newRecord = {
      id: Date.now(),
      ...values,
      size: values.type === "folder" ? "-" : "0KB",
      uploadTime: new Date().toLocaleString(),
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
    <SystemLayout title="文件管理" subtitle="File Management">
      <DataTable
        dataSource={dataSource}
        columns={columns}
        title="文件列表"
        formFields={formFields}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={tableLoading}
      />
    </SystemLayout>
  );
} 