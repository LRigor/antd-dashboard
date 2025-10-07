import { Avatar, Tag, Button, Popconfirm } from "antd";
import { UserOutlined, DeleteOutlined } from "@ant-design/icons";

export const columns = [
  {
    title: "序号",
    key: "__index",
    dataIndex: "__index",
    width: 70,
    align: "center",
    // antd 的 render 第3个参数是当前页的行号（从0开始）
    render: (_, __, index) => index + 1,
      // 仅当前页序号：index + 1
    fixed: "left",
  },
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
    sorter: true,
    defaultSortOrder: 'descend',
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
        // ✅ 关键：确认时触发删除
        onConfirm={() => {
          console.debug('[login-logs columns] confirm delete -> id=', record?.id, 'record=', record);
          // 如果你的 DataTable 会把 onDelete 作为 prop 传进来并在 render 里闭包不到，
          // 这里可以直接派发一个自定义事件，或（推荐）直接调用页面传入的回调：
          // ——最小改动：直接触发全局事件（不依赖 DataTable）
          const evt = new CustomEvent('loginLogs:delete', { detail: record });
          window.dispatchEvent(evt);
        }}
        onCancel={() => {
          console.debug('[login-logs columns] cancel delete -> id=', record?.id);
        }}
      >
        <Button
          type="link"
          danger
          icon={<DeleteOutlined />}
          onClick={() => console.debug('[login-logs columns] click delete -> id=', record?.id)}
        >
          删除
        </Button>
      </Popconfirm>
    ),
  }
  
]; 