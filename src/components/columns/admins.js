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