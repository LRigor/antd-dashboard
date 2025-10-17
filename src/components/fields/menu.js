import { methodOptions, menuTypeOptions } from "@/utils/menuEnums"; // 若无，可用下面注释的内联
import MenuPidSelect from "@/hooks/MenuPidSelect";

export const fields = [
  {
    name: "name",
    label: "菜单名称",
    type: "input",
    rules: [{ required: true, message: "请输入菜单名称" }],
  },
  {
    name: "type",
    label: "类型",
    type: "select",
    // 若没抽枚举，可用：
    // options: [
    //   { value: "group", label: "分组" },
    //   { value: "menu",  label: "菜单" },
    //   { value: "link",  label: "链接" },
    //   { value: "action",label: "操作" },
    // ],
    options: menuTypeOptions,
    rules: [{ required: true, message: "请选择类型" }],
  },
  {
    name: "path",
    label: "路径",
    type: "input",
    placeholder: "例如：/dashboard/sys/menu 或 /api/file/upload",
    // 仅当可路由/可请求的类型必填（menu/link/action）
    dependencies: ["type"],
    rules: [
      ({ getFieldValue }) => ({
        validator(_, v) {
          const t = getFieldValue("type");
          const need = ["menu", "link", "action"].includes(t);
          if (!need) return Promise.resolve();
          return v ? Promise.resolve() : Promise.reject(new Error("请输入路径"));
        },
      }),
    ],
  },
  {
    name: "method",
    label: "请求方法",
    type: "select",
    // 若没抽枚举，可用：
    // options: [
    //   { value: "GET", label: "GET" },
    //   { value: "POST", label: "POST" },
    //   { value: "PUT", label: "PUT" },
    //   { value: "DELETE", label: "DELETE" },
    //   { value: "NONE", label: "NONE" },
    // ],
    options: methodOptions,
    dependencies: ["type"],
    rules: [
      ({ getFieldValue }) => ({
        validator(_, v) {
          const t = getFieldValue("type");
          // action 才强制需要明确的方法；其他默认 NONE 也可
          if (t === "action") {
            return v && v !== "NONE"
              ? Promise.resolve()
              : Promise.reject(new Error("操作类型必须选择请求方法"));
          }
          return Promise.resolve();
        },
      }),
    ],
    initialValue: "NONE",
  },
  {
    name: "icon",
    label: "图标",
    type: "input",
    placeholder: "可填 antd 图标名或图片 URL（可选）",
  },
  {
    name: "sort",
    label: "排序",
    type: "input",
    inputType: "number",           // 你的渲染器若支持
    rules: [
      { required: true, message: "请输入排序" },
      {
        validator(_, v) {
          const n = Number(v);
          return Number.isFinite(n) ? Promise.resolve() : Promise.reject(new Error("排序必须是数字"));
        },
      },
    ],
    initialValue: 0,
  },
  {
    name: "pid",
    label: "父级菜单",
    type: "custom",
    render: (ctx) => <MenuPidSelect ctx={ctx} />,
    rules: [{ required: true, message: "请选择父级（默认顶级）" }],
    initialValue: -1, // 顶级
  },
  {
    name: "desc",
    label: "描述",
    type: "textarea",
  },
  // 可选：把 level 交给后端计算；若保留也建议非必填
  // {
  //   name: "level",
  //   label: "层级",
  //   type: "input",
  //   inputType: "number",
  //   rules: [{ required: false }],
  // },
];
