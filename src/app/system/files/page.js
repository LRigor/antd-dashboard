"use client";

import { useEffect } from "react";
import SystemLayout from "@/components/system";
import DataTable from "@/components/system/DataTable";
import { columns } from "@/components/columns/files";
import { getFileFields } from "@/components/fields/files";
import { filesAPI } from "@/api-fetch";
import { useSystemPage } from "@/hooks/useSystemPage";

export default function FilesPage() {
  // 創建適配器讓文件 API 與通用 Hook 兼容
  const filesAPIAdapter = {
    getList: filesAPI.getFilesList,
    create: filesAPI.uploadFile,
    update: filesAPI.updateFile,
    delete: filesAPI.deleteFile,
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
  } = useSystemPage(filesAPIAdapter, {
    initialFilters: {},
  });

  useEffect(() => {
    loadData(1, 10);
  }, []);


  return (
    <SystemLayout title="文件管理" subtitle="File Management">
      <DataTable
        dataSource={dataSource}
        columns={columns}
        title="文件列表"
        formFields={(mode) => getFileFields({ mode })}   
        onAdd={createHandler}
        onEdit={updateHandler}
        onDelete={deleteHandler}
        loading={tableLoading}
        pagination={pagination}
        onChange={handleTableChange}
        rowKey="id"
        /* 若 DataTable 有開關：取消隱藏 */
        enableAdd 
        enableEdit
      />
    </SystemLayout>
  );
}
