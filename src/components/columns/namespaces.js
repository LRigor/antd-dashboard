import { Tag } from "antd";

export const columns = [
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
    width: 80,
  },
  {
    title: "名称",
    dataIndex: "name",
    key: "name",
    width: 150,
  },
  {
    title: "图标",
    dataIndex: "icon",
    key: "icon",
    width: 100,
    render: (icon) => icon || "-",
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
    title: "排序",
    dataIndex: "sort",
    key: "sort",
    width: 80,
  },
  {
    title: "UTC时间",
    dataIndex: "utc",
    key: "utc",
    width: 180,
    render: (utc) => utc || "-",
  },
]; 