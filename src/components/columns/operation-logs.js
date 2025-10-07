import { Avatar, Tag } from "antd";
import { UserOutlined } from "@ant-design/icons";

export const columns = [
  {
    title: "操作用户",
    dataIndex: "uname",
    key: "uname",
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
    dataIndex: "uri",
    key: "uri",
    width: 200,
  }, 
  {
    title: "请求参数",
    dataIndex: "req",
    key: "req",
    width: 200,
  },
  {
    title: "耗时(ms)",
    dataIndex: "useTime",
    key: "useTime",
    width: 100,
  },
  {
    title: "操作时间",
    dataIndex: "createdAt",
    key: "createdAt",
    width: 180,
  },
]; 