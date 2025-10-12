// src/components/fields/admins.jsx
import NamespaceSelect from "@/components/common/namespaceSelect";

// ==== Debug（可切換）====
const NSF_DEBUG = true;
const nsfdbg  = (...args) => NSF_DEBUG && console.debug("[Admins.fields/NS]", ...args);
const nsfwarn = (...args) => NSF_DEBUG && console.warn("[Admins.fields/NS]", ...args);

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
    rules: [{ required: true, message: "请输入密码" }],
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

  // ✅ 命名空间
  {
    name: "namespaces",
    label: "命名空间",
    type: "custom",
    rules: [{ required: true, message: "请选择命名空间" }],
render: (ctx) => {
  const record = ctx?.record;
  const raw = ctx?.value;

  let value = [];

  // 你原本的判斷保留...
  if (raw) {
    if (Array.isArray(raw)) {
      value = raw.map((item) => {
        if (typeof item === "object" && item !== null) {
          const val = item.id ?? item.namespace ?? item.value;
          return val != null ? String(val) : "";
        }
        return String(item);
      }).filter(Boolean);
    } else if (typeof raw === "object" && raw !== null) {
      const val = raw.id ?? raw.namespace ?? raw.value;
      value = val != null ? [String(val)] : [];
    } else if (raw !== null && raw !== undefined) {
      value = [String(raw)];
    }
  } else if (record) {
    if (Array.isArray(record.namespaces) && record.namespaces.length) {
      value = record.namespaces.map((n) => {
        if (typeof n === "object" && n !== null) {
          const val = n.id ?? n.namespace ?? n.value;
          return val != null ? String(val) : "";
        }
        return String(n);
      }).filter(Boolean);
    } else if (record.namespace != null) {
      value = [String(record.namespace)];
    }
  }

  // ✅ 最終保險：不論上面怎麼來，統一轉成 string[]
  const valueNormalized = Array.isArray(value)
    ? value.map((v) =>
        typeof v === "object" && v !== null
          ? String(v.id ?? v.namespace ?? v.value ?? "")
          : String(v ?? "")
      ).filter(Boolean)
    : (value == null ? [] : [String(value)]);

  const handleChange = (vals) => {
    // 受控回寫：保持為 string[]
    if (vals && vals.length > 0) {
      ctx?.onChange?.(vals.map(String));
    } else {
      ctx?.onChange?.([]);
    }
  };

  // （可留一行 log 觀察）
  console.log("[Admins.fields/NS] send to NamespaceSelect ->", valueNormalized);

  return (
    <NamespaceSelect
      mode="multiple"
      value={valueNormalized}    // ← 用正規化後的值
      onChange={handleChange}
      allowClear
      placeholder="请选择命名空间"
      showSearch
      optionFilterProp="label"
      maxTagCount="responsive"
      labelInValue={false}
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
