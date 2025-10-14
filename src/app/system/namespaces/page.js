"use client";

import { useEffect } from "react";
import SystemLayout from "@/components/system";
import DataTable from "@/components/system/DataTable";
import { columns } from "@/components/columns/namespaces";
import { namespacesFields as formFields } from "@/components/fields/namespaces";
import { namespacesAPI } from '@/api-fetch';
import { useSystemPage } from "@/hooks/useSystemPage";

export default function NamespacesPage() {
  // 創建適配器讓命名空間 API 與通用 Hook 兼容
  const namespacesAPIAdapter = {
    getList: namespacesAPI.getNamespacesList,
    create: namespacesAPI.createNamespace,
    update: namespacesAPI.updateNamespace,
    delete: namespacesAPI.deleteNamespace,
  };

  // 使用通用系統頁面 Hook
  const {
    dataSource,
    tableLoading,
    pagination,
    loadData,
    createHandler,
    updateHandler,
    deleteHandler,
    handleTableChange,
  } = useSystemPage(namespacesAPIAdapter, {
    initialFilters: {},
  });

  // mount
  useEffect(() => {
    console.log("[NamespacesPage] mount");
    loadData(1, 10);
  }, []);


  console.log("[NamespacesPage] render -> DataTable props", {
    rows: dataSource.length,
    loading: tableLoading,
    pagination,
    columnsCount: Array.isArray(columns) ? columns.length : 'n/a',
    formFieldsCount: Array.isArray(formFields) ? formFields.length : 'n/a',
  });

  return (
    <SystemLayout title="命名空间管理" subtitle="Namespace Management">
      <DataTable
        dataSource={dataSource}
        columns={columns}
        title="命名空间列表"
        formFields={formFields}
        onAdd={createHandler}
        onEdit={updateHandler}
        onDelete={deleteHandler}
        loading={tableLoading}
        pagination={pagination}
        onChange={handleTableChange}
        notify={false}
      />
    </SystemLayout>
  );
}
