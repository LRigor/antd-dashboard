"use client";

import { useState, useEffect } from "react";
import SystemLayout from "@/components/system";
import DataTable from "@/components/system/DataTable";
import { columns } from "@/components/columns/files";
import { getFileFields } from "@/components/fields/files";
import { filesAPI } from "@/api-fetch";
import { App } from "antd";

export default function FilesPage() {
  const { message } = App.useApp();
  const [dataSource, setDataSource] = useState([]);
  const [tableLoading, setTableLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
    pageSizeOptions: ["10", "20", "50", "100"],
    position: ["bottomCenter"],
  });

  // ✅ 這裡真正得到陣列
  const formFields = getFileFields({ mode: "edit" });

  useEffect(() => {
    loadFilesData(1, 10);
  }, []);

  const loadFilesData = async (page = 1, size = 10) => {
    setTableLoading(true);
    try {
      const result = await filesAPI.getFilesList({ page, size });
      setDataSource(result.list);
      setPagination((prev) => ({ ...prev, current: page, pageSize: size, total: result.total }));
    } catch (error) {
      message.error("加载文件列表失败");
    } finally {
      setTableLoading(false);
    }
  };

  const handleTableChange = (paginationInfo) => {
    const { current, pageSize } = paginationInfo;
    if (pageSize !== pagination.pageSize) {
      setPagination((prev) => ({ ...prev, pageSize, current: 1 }));
    }
    loadFilesData(current, pageSize);
  };

  const handleAdd = async (values) => {
    try {
      await filesAPI.uploadFile(values);
      message.success("文件上传成功");
      loadFilesData(pagination.current, pagination.pageSize);
    } catch (error) {
      message.error("文件上传失败");
    }
  };

  const handleEdit = async (values) => {
    try {
      await filesAPI.updateFile(values);
      message.success("文件信息更新成功");
      loadFilesData(pagination.current, pagination.pageSize);
    } catch (error) {
      message.error("文件信息更新失败");
    }
  };

  const handleDelete = async (record) => {
    try {
      await filesAPI.deleteFile(record.id);
      message.success("文件删除成功");
      loadFilesData(pagination.current, pagination.pageSize);
    } catch (error) {
      message.error("文件删除失败");
    }
  };

  return (
    <SystemLayout title="文件管理" subtitle="File Management">
      <DataTable
        dataSource={dataSource}
        columns={columns}
        title="文件列表"
        formFields={(mode) => getFileFields({ mode })}   
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
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
