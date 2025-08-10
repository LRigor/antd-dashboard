export const fields = [
  {
    name: "k",
    label: "字典键",
    type: "input",
    rules: [
      { required: true, message: "请输入字典键" },
    ],
  },
  {
    name: "v",
    label: "字典值",
    type: "input",
    rules: [
      { required: true, message: "请输入字典值" },
    ],
  },
  {
    name: "desc",
    label: "描述",
    type: "textarea",
    rules: [
      { required: true, message: "请输入描述" },
    ],
  },
  {
    name: "group",
    label: "分组",
    type: "input",
    rules: [
      { required: true, message: "请输入分组" },
    ],
  },
  {
    name: "type",
    label: "类型",
    type: "select",
    options: [
      { value: "text", label: "文本" },
      { value: "html", label: "HTML" },
      { value: "json", label: "JSON" },
      { value: "number", label: "数字" },
    ],
    rules: [
      { required: true, message: "请选择类型" },
    ],
  },
]; 