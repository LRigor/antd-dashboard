
"use client";
import { TreeSelect } from "antd";
import useSWR from "swr";
import { apiClient } from "@/api-fetch/client";
import { formatMenuData } from "@/utils/formatMenuData";

export default function MenuPidSelect({ ctx }) {
  const { value, onChange, record } = ctx; // record.id 用来避免选择自己
  const { data } = useSWR("/api/menu/list?size=999", (url) => apiClient.get(url).then(r => r.data));
  const list = Array.isArray(data?.list) ? data.list : (Array.isArray(data) ? data : []);

  // 过滤掉“自己”，避免选成自己的父级
  const filtered = record?.id ? list.filter((x) => Number(x.id) !== Number(record.id)) : list;
  const treeData = formatMenuData(filtered, { sortBy: "sort" }); // 你已抽出的工具函数

  return (
    <TreeSelect
      style={{ width: "100%" }}
      treeData={[
        { key: "-1", value: -1, label: "顶级菜单" },
        ...treeData,
      ]}
      fieldNames={{ label: "label", value: "value", children: "children" }}
      value={typeof value === "number" ? value : (value ?? -1)}
      onChange={(v) => onChange(typeof v === "number" ? v : Number(v))}
      showSearch
      treeDefaultExpandAll
      placeholder="选择父级（默认顶级）"
      allowClear
    />
  );
}
