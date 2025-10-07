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
    title: "字典键",
    dataIndex: "k",
    key: "k",
    width: 150,
  },
  {
    title: "字典值",
    dataIndex: "v",
    key: "v",
    width: 120,
  },
  {
    title: "描述",
    dataIndex: "desc",
    key: "desc",
    width: 200,
  },
  {
    title: "分组",
    dataIndex: "group",
    key: "group",
    width: 100,
  },
  {
    title: "类型",
    dataIndex: "type",
    key: "type",
    width: 100,
  },
]; 