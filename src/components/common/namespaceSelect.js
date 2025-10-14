// src/components/common/NamespaceSelect.jsx
"use client";
import { useMemo, useEffect } from "react";
import { Select, Spin } from "antd";
import { useNamespaceList } from "@/hooks/usernamespace";

// ===== Debug 開關與方法（僅輸出日誌，不改行為）=====
const NS_DEBUG = true; // ← 需要時改成 false
const dbg = (...args) => NS_DEBUG && console.debug("[NamespaceSelect]", ...args);
const warn = (...args) => NS_DEBUG && console.warn("[NamespaceSelect]", ...args);

export default function NamespaceSelect({
  value,          // 由 Form 注入
  onChange,       // 由 Form 注入
  allowClear = true,
  style,
  placeholder = "请选择命名空间",
  mode,           // 支持 multiple 模式
  labelInValue = false, // 明确设置默认值
  ...rest
}) {
  // 首次渲染打印 props 概況
  useEffect(() => {
    dbg("mount props summary =>", {
      mode,
      labelInValue,
      allowClear,
      placeholder,
      restKeys: Object.keys(rest || {}),
    });
  }, []);

  const { list, loading } = useNamespaceList();
  useEffect(() => {
    dbg("useNamespaceList => loading:", loading, "list:", list);
  }, [list, loading]);

  // —— 原邏輯：把 list 轉成 options（不改行為）
  const options = useMemo(
    () =>
      (list || []).map((n, index) => ({
        key: String(n.id ?? n.namespace ?? index), // 添加唯一的 key
        value: String(n.id ?? n.namespace),        // 顯示/比對用字串
        label: n.name ?? String(n.id ?? n.namespace),
      })),
    [list]
  );

  useEffect(() => {
    dbg("options computed ->", options);
  }, [options]);

  // 处理 value 格式（不改行為，僅加日誌）
  useEffect(() => {
    const type =
      value == null ? "nullish" :
      Array.isArray(value) ? "array" :
      typeof value;
    dbg("incoming value prop -> type:", type, "value:", value);
  }, [value]);

  const processedValue = useMemo(() => {
    if (value == null) return undefined;
  
    if (labelInValue) {
      // ……你原本的 labelInValue 分支保持不變……
      /* ... */
    } else {
      // 普通模式：只返回 value
      if (mode === "multiple") {
        if (Array.isArray(value)) {
          return value
            .map((item) => {
              if (typeof item === "object" && item !== null) {
                const v = item.namespace ?? item.id ?? item.value;  // ← 以 namespace 為主
                return v != null ? String(v) : "";
              }
              return String(item);
            })
            .filter(Boolean);
        } else {
          if (typeof value === "object" && value !== null) {
            const v = item.namespace ?? item.id ?? item.value;  // ← 以 namespace 為主
            return v != null ? [String(v)] : [];
          }
          return [String(value)];
        }
      } else {
        return String(value);
      }
    }
  }, [value, mode, labelInValue, options]);
  

  useEffect(() => {
    console.log("[NamespaceSelect] processedValue ->", processedValue);
  }, [processedValue]);

  const handleChange = (v) => {
    dbg("onChange fired with raw v =", v, " (mode:", mode, ", labelInValue:", labelInValue, ")");
    if (labelInValue) {
      if (mode === "multiple") {
        onChange?.(v == null ? [] : v);
      } else {
        onChange?.(v == null ? undefined : v);
      }
    } else {
      if (mode === "multiple") {
        onChange?.(v == null ? [] : v.map(String));
      } else {
        onChange?.(v == null ? undefined : String(v));
      }
    }
  };

  return (
    <Select
      value={processedValue}
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
      mode={mode}
      labelInValue={labelInValue}
      {...rest}
    />
  );
}


