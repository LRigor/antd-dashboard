import { Avatar, Tag } from "antd";
import { UserOutlined } from "@ant-design/icons";

export const columns = [
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