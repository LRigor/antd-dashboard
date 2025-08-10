export const fields = [
  {
    name: "uname",
    label: "用户名",
    type: "input",
    rules: [
      { required: true, message: "请输入用户名" },
    ],
  },
  {
    name: "pass",
    label: "密码",
    type: "input",
    inputType: "password",
    rules: [
      { required: true, message: "请输入密码" },
      { min: 6, message: "密码长度至少6位" },
    ],
  },
  {
    name: "rid",
    label: "角色ID",
    type: "input",
    inputType: "number",
    rules: [
      { required: true, message: "请输入角色ID" },
    ],
  },
  {
    name: "level",
    label: "等级",
    type: "select",
    options: [
      { value: 9, label: "超级管理员" },
      { value: 8, label: "系统管理员" },
      { value: 7, label: "高级用户" },
      { value: 6, label: "普通用户" },
      { value: 5, label: "访客" },
    ],
    rules: [
      { required: true, message: "请选择等级" },
    ],
  },
  {
    name: "icon",
    label: "头像URL",
    type: "input",
  },
  {
    name: "location",
    label: "位置",
    type: "input",
  },
  {
    name: "utc",
    label: "时区",
    type: "input",
  },
  {
    name: "desc",
    label: "描述",
    type: "textarea",
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
]; 