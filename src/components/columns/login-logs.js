import { Avatar, Tag, Button, Popconfirm } from "antd";
import { UserOutlined, DeleteOutlined } from "@ant-design/icons";

export const columns = [
  {
    title: "用户",
    dataIndex: "uname",
    key: "uname",
    width: 120,
    render: (uname, record) => (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Avatar icon={<UserOutlined />} style={{ marginRight: 8 }} />
        <div>
          <div>{uname}</div>
          <div style={{ fontSize: '12px', color: '#999' }}>@{record.role}</div>
        </div>
      </div>
    ),
  },
  {
    title: "IP地址",
    dataIndex: "ip",
    key: "ip",
    width: 130,
  },
  {
    title: "登录地点",
    dataIndex: "location",
    key: "location",
    width: 120,
  },
  {
    title: "角色",
    dataIndex: "role",
    key: "role",
    width: 100,
    render: (role) => (
      <Tag color={role === "ROOT" ? "red" : "blue"}>
        {role}
      </Tag>
    ),
  },
  {
    title: "登录时间",
    dataIndex: "createdAt",
    key: "createdAt",
    width: 180,
  },
  {
    title: "操作",
    key: "action",
    width: 100,
    render: (_, record) => (
      <Popconfirm
        title="确定要删除这条记录吗？"
        okText="确定"
        cancelText="取消"
      >
        <Button type="link" danger icon={<DeleteOutlined />}>
          删除
        </Button>
      </Popconfirm>
    ),
  },
]; 