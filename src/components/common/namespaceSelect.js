// src/components/common/NamespaceSelect.jsx
"use client";
import { useMemo, useEffect } from "react";
import { Select, Spin } from "antd";
import { useNamespaceList } from "@/hooks/usernamespace";

// 🔎 開關 & 簡易 logger
const NS_DEBUG = true;
const dbg = (...args) => NS_DEBUG && console.debug("[NamespaceSelect]", ...args);

export default function NamespaceSelect({
  value,          // 由 Form 注入
  onChange,       // 由 Form 注入
  allowClear = true,
  style,
  placeholder = "请选择命名空间",
  ...rest
}) {
  const { list, loading } = useNamespaceList();

  // —— 原邏輯：把 list 轉成 options（不改行為）
  const options = useMemo(
    () =>
      (list || []).map((n) => ({
        value: String(n.id ?? n.namespace), // 顯示/比對用字串
        label: n.name ?? String(n.id ?? n.namespace),
      })),
    [list]
  );

  // 🔎 log 1：外部傳進來的 value（以及型別）
  useEffect(() => {
    dbg("props.value ->", value, `(type: ${typeof value})`);
  }, [value]);

  // 🔎 log 2：來源清單（原始 list）
  useEffect(() => {
    dbg("list.len =", list?.length ?? 0, "list sample =", (list || []).slice(0, 3));
  }, [list]);

  // 🔎 log 3：轉好的 options 與當前 value 是否命中
  useEffect(() => {
    dbg("options.len =", options.length, "options sample =", options.slice(0, 5));
    if (value != null) {
      const hit = options.find((o) => String(o.value) === String(value));
      dbg("match check -> value:", value, " hit:", hit);
    }
  }, [options, value]);

  // 🔎 log 4：使用者變更時（不改行為，只多印）
  const handleChange = (v) => {
    dbg("onChange fired ->", v, "(string), will pass Number(v) to Form");
    onChange?.(v == null ? undefined : Number(v));
  };

  return (
    <Select
      value={value == null ? undefined : String(value)}  // 顯示用字串
      onChange={handleChange}
      options={options}
      loading={loading}
      disabled={loading}
      allowClear={allowClear}
      showSearch
      optionFilterProp="label"
      placeholder={placeholder}
      style={style}
      getPopupContainer={(t) => t.parentNode}
      notFoundContent={loading ? <Spin size="small" /> : null}
      {...rest}
    />
  );
}
