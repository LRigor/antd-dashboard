"use client";

import { useEffect } from "react";
import SystemLayout from "@/components/system";
import DataTable from "@/components/system/DataTable";
import { columns } from "@/components/columns/menu";
import { fields as formFields } from "@/components/fields/menu";
import { menusAPI } from "@/api-fetch";
import { useSystemPage } from "@/hooks/useSystemPage";
import { useMemo } from "react";
import { Card, Tree, Space } from "antd";
import { formatMenuData } from "./tree"; // ← 你刚拆出去的工具

// 2) 计算树（dataSource 是扁平 id/pid 列表）
const treeData = useMemo(
  () => formatMenuData(Array.isArray(dataSource) ? dataSource : [], { sortBy: "sort" }),
  [dataSource]
);


export default function MenuPage() {
  // 創建適配器讓菜單 API 與通用 Hook 兼容
  const menusAPIAdapter = {
    getList: menusAPI.getMenusList,
    create: menusAPI.createMenu,
    update: menusAPI.updateMenu,
    delete: menusAPI.deleteMenu,
  };

  // 使用通用系統頁面 Hook
  const {
    dataSource,
    tableLoading,
    loadData,
    createHandler,
    updateHandler,
    deleteHandler,
  } = useSystemPage(menusAPIAdapter, {
    initialFilters: {},
  });

  useEffect(() => {
    loadData();
  }, []);

  return (
    <SystemLayout title="菜单管理" subtitle="Menu Management">
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <Card title="菜单树" size="small">
          <Tree
            treeData={treeData}
            defaultExpandAll
            showLine={{ showLeafIcon: false }}
            selectable={false}
            fieldNames={{ title: "label", key: "key", children: "children" }}
          />
        </Card>
  
        <DataTable
          dataSource={dataSource}
          columns={columns}
          title="菜单列表"
          formFields={formFields}
          onAdd={createHandler}
          onEdit={updateHandler}
          onDelete={deleteHandler}
          loading={tableLoading}
        />
      </Space>
    </SystemLayout>
  )
}