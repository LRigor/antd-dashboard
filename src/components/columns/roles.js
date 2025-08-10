import { Tag } from "antd";
export const columns = [
  {
    title: "角色名称",
    dataIndex: "name",
    key: "name",
    width: 150,
  },
  {
    title: "标签",
    dataIndex: "tag",
    key: "tag",
    width: 100,
    render: (tag) => (
      <Tag color={tag}>
        {tag}
      </Tag>
    ),
  },
  {
    title: "首页",
    dataIndex: "homePage",
    key: "homePage",
    width: 200,
    render: (homePage) => (
      <span>{homePage || '-'}</span>
    ),
  },
  {
    title: "级别",
    dataIndex: "level",
    key: "level",
    width: 100,
    render: (level) => (
      <Tag color={level === 1 ? 'red' : level === 2 ? 'orange' : level === 3 ? 'blue' : 'green'}>
        {level === 1 ? '最高' : level === 2 ? '高' : level === 3 ? '中' : '低'}
      </Tag>
    ),
  },
  {
    title: "更新次数",
    dataIndex: "updatedCount",
    key: "updatedCount",
    width: 100,
  },
];