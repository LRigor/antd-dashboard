import { Tag } from "antd";

export const logColumns = [
  { title: "时间", dataIndex: "time", key: "time" },
  { title: "用户", dataIndex: "user", key: "user" },
  { title: "操作", dataIndex: "action", key: "action" },
  {
    title: "状态",
    dataIndex: "status",
    key: "status",
    render: (status) => (
      <Tag color={status === "成功" ? "green" : "red"}>
        {status}
      </Tag>
    ),
  },
]; 