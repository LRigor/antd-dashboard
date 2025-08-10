import { Tag, Button, Space } from "antd";
import { EyeOutlined, DownloadOutlined } from "@ant-design/icons";

export const columns = [
  {
    title: "文件名",
    dataIndex: "url",
    key: "url",
    width: 200,
    render: (url, record) => (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {getFileIcon(record.contentType)}
        <span style={{ marginLeft: 8 }}>
          {url ? url.split('/').pop() || '未命名文件' : '未命名文件'}
        </span>
      </div>
    ),
  },
  {
    title: "类型",
    dataIndex: "contentType",
    key: "contentType",
    width: 120,
    render: (contentType) => (
      <Tag color="blue">{getFileTypeLabel(contentType)}</Tag>
    ),
  },
  {
    title: "分组",
    dataIndex: "group",
    key: "group",
    width: 100,
  },
  {
    title: "命名空间",
    dataIndex: "namespace",
    key: "namespace",
    width: 100,
  },
  {
    title: "状态",
    dataIndex: "status",
    key: "status",
    width: 100,
    render: (status) => (
      <Tag color={getStatusColor(status)}>
        {getStatusLabel(status)}
      </Tag>
    ),
  },
  {
    title: "操作",
    key: "action",
    width: 150,
    render: (_, record) => (
      <Space size="middle">
        <Button type="link" icon={<EyeOutlined />} size="small">
          预览
        </Button>
        <Button type="link" icon={<DownloadOutlined />} size="small">
          下载
        </Button>
      </Space>
    ),
  },
];

// Helper functions for file operations
export const getStatusLabel = (status) => {
  return status === 1 ? "正常" : "禁用";
};

export const getStatusColor = (status) => {
  return status === 1 ? "green" : "red";
};

export const getFileIcon = (contentType) => {
  // This function should be implemented based on your file icon logic
  return null;
};

export const getFileTypeLabel = (contentType) => {
  // This function should be implemented based on your file type logic
  return contentType || "未知";
}; 