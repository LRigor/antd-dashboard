export const namespacesFields = [
  {
    name: "name",
    label: "名称",
    type: "input",
    rules: [
      { required: true, message: "请输入名称" },
    ],
  },
  {
    name: "icon",
    label: "图标",
    type: "input",
    rules: [
      { required: false, message: "请输入图标" },
    ],
  },
  {
    name: "status",
    label: "状态",
    type: "select",
    options: [
      { value: 1, label: "启用" },
      { value: 0, label: "禁用" },
    ],
    rules: [
      { required: true, message: "请选择状态" },
    ],
  },
  {
    name: "desc",
    label: "描述",
    type: "textarea",
    rules: [
      { required: false, message: "请输入描述" },
    ],
  },
  {
    name: "sort",
    label: "排序",
    type: "input",
    rules: [
      { required: false, message: "请输入排序" },
    ],
  },
];

// For backward compatibility
export const fields = namespacesFields; 