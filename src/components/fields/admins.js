// src/components/fields/admins.jsx
import NamespaceSelect from "@/components/common/namespaceSelect";

export const fields = [
  {
    name: "uname",
    label: "用户名",
    type: "input",
    rules: [{ required: true, message: "请输入用户名" }],
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
    label: "层级ID",
    type: "input",
    inputType: "number",
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
  },
  {
    name: "icon",
    label: "头像URL",
    type: "input",
  },

  // ✅ 命名空间：使用下拉选择器，支持编辑
  {
    name: "namespace",
    label: "命名空间",
    type: "custom",
    rules: [{ required: true, message: "请选择命名空间" }],
    render: (ctx) => {
      const record = ctx?.record;
      
      // 获取当前值
      let value = ctx?.value;
      
      // 如果没值，尝试从 record 推导
      if (value == null && record) {
        // 优先从 record.namespace 获取（如果已经扁平化）
        if (record.namespace != null) {
          value = record.namespace;
        }
        // 否则从 record.namespaces 数组推导
        else if (Array.isArray(record.namespaces) && record.namespaces.length) {
          const def = record.namespaces.find(x => Number(x?.isDefault) === 1) || record.namespaces[0];
          value = def?.namespace;
        }
      }
      
      const handleChange = (val) => ctx?.onChange?.(val);
  
      return (
        <NamespaceSelect
          value={value}
          onChange={handleChange}
          placeholder="请选择命名空间"
          showSearch
          optionFilterProp="label"
        />
      );
    },
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
    rules: [{ required: true, message: "请选择状态" }],
  },
];
