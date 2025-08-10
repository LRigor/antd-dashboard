export const fields = [
  {
    name: "name",
    label: "菜单名称",
    type: "input",
    rules: [{ required: true, message: "请输入菜单名称" }],
  },
  {
    name: "path",
    label: "路径",
    type: "input",
    rules: [{ required: true, message: "请输入路径" }],
  },
  {
    name: "method",
    label: "请求方法",
    type: "select",
    options: [{ value: "GET", label: "GET" }, { value: "POST", label: "POST" }, { value: "PUT", label: "PUT" }, { value: "DELETE", label: "DELETE" }],
  },
  {
    name: "type",
    label: "类型",
    type: "select",
    options: [{ value: "menu", label: "菜单" }, { value: "action", label: "操作" }, { value: "page", label: "hwhui" }],
  },
  {
    name: "icon",
    label: "图标",
    type: "input",
  },
  {
    name: "level",
    label: "层级",  
    type: "input",
    rules: [{ required: true, message: "请输入层级" }],
  },
  {
    name: "sort",
    label: "排序",  
    type: "input",
    rules: [{ required: true, message: "请输入排序" }],
  },
  {
    name: "desc",
    label: "描述",
    type: "textarea",
  },
  {
    name: "pid",
    label: "父级菜单",
    type: "select",
    options: [{ value: 0, label: "顶级菜单" }, { value: 1, label: "子菜单" }],
  },
];