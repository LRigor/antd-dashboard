export const fields = [
  {
    name: "name",
    label: "角色名称",
    type: "input",
    required: true,
  },
  {
    name: "desc",
    label: "描述",
    type: "textarea",
  },
  {
    name: "tag",
    label: "标签",
    type: "select",
    options: [
      { value: "magenta", label: "洋红" },
      { value: "gold", label: "金色" },
      { value: "success", label: "成功" },
      { value: "cyan", label: "青色" },
      { value: "processing", label: "处理中" },
      { value: "default", label: "默认" },
      { value: "red", label: "红色" },
      { value: "blue", label: "蓝色" },
      { value: "green", label: "绿色" },
      { value: "orange", label: "橙色" },
    ],
  },
  {
    name: "homePage",
    label: "首页路径",
    type: "input",
    placeholder: "例如: /dashboard/sys/admin",
  },
  {
    name: "level",
    label: "级别",
    type: "select",
    options: [
      { value: 1, label: "最高" },
      { value: 2, label: "高" },
      { value: 3, label: "中" },
      { value: 4, label: "低" },
    ],
  },
];