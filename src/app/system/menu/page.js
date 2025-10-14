"use client";

import { useEffect } from "react";
import SystemLayout from "@/components/system";
import DataTable from "@/components/system/DataTable";
import { columns } from "@/components/columns/menu";
import { fields as formFields } from "@/components/fields/menu";
import { menusAPI } from "@/api-fetch";
import { useSystemPage } from "@/hooks/useSystemPage";

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
    </SystemLayout>
  );
}
