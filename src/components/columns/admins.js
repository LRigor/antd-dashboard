import { Avatar, Tag } from "antd";
import { UserOutlined } from "@ant-design/icons";

export const columns = [
  {
    title: "用户",
    dataIndex: "uname",
    key: "uname",
    width: 120,
    render: (uname, record) => (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Avatar 
          src={record.icon} 
          icon={<UserOutlined />} 
          style={{ marginRight: 8 }} 
        />
        <div>
          <div>{uname}</div>
          <div style={{ fontSize: '12px', color: '#999' }}>ID: {record.id}</div>
        </div>
      </div>
    ),
  },
  {
    title: "角色ID",
    dataIndex: "rid",
    key: "rid",
    width: 80,
  },
  {
    title: "等级",
    dataIndex: "level",
    key: "level",
    width: 80,
    render: (level) => (
      <Tag color={level === 9 ? "red" : level === 8 ? "blue" : "green"}>
        {level}
      </Tag>
    ),
  },
  {
    title: "位置",
    dataIndex: "location",
    key: "location",
    width: 120,
    render: (location) => location || "-",
  },
  {
    title: "状态",
    dataIndex: "status",
    key: "status",
    width: 100,
    render: (status) => (
      <Tag color={status === 1 ? "green" : "red"}>
        {status === 1 ? "启用" : "禁用"}
      </Tag>
    ),
  },
  {
    title: "加入IP",
    dataIndex: "joinIp",
    key: "joinIp",
    width: 120,
  },
  {
    title: "时区",
    dataIndex: "utc",
    key: "utc",
    width: 120,
    render: (utc) => utc || "-",
  },
  {
    title: "更新次数",
    dataIndex: "updatedCount",
    key: "updatedCount",
    width: 100,
  },
  {
    title: "最后操作时间",
    dataIndex: "lastOperationTime",
    key: "lastOperationTime",
    width: 180,
    render: (time) => time || "-",
  },
  {
    title: "创建时间",
    dataIndex: "createdAt",
    key: "createdAt",
    width: 180,
  },
  {
    title: "更新时间",
    dataIndex: "updatedAt",
    key: "updatedAt",
    width: 180,
  },
]; 