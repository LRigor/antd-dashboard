"use client";

import { useState, useEffect } from "react";
import { App } from "antd";
import SystemLayout from "@/components/system";
import DataTable from "@/components/system/DataTable";
import { columns } from "@/components/columns/namespaces";
import { namespacesFields as formFields } from "@/components/fields/namespaces";
import { namespacesAPI } from '@/api-fetch';

export default function NamespacesPage() {
  const [dataSource, setDataSource] = useState([]);
  const [tableLoading, setTableLoading] = useState(false);
  const { message } = App.useApp();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
    pageSizeOptions: ['10', '20', '50', '100'],
    position: ['bottomCenter'],
  });

  // mount
  useEffect(() => {
    console.log("[NamespacesPage] mount");
    loadNamespacesData(1, 10);
  }, []);

  const loadNamespacesData = async (page = 1, size = 10) => {
    console.log("[NamespacesPage] loadNamespacesData -> params", { page, size });
    setTableLoading(true);
    const t0 = performance.now();
    try {
      const result = await namespacesAPI.getNamespacesList({ page, size });
      console.log("[NamespacesPage] getNamespacesList OK", {
        elapsedMs: +(performance.now() - t0).toFixed(1),
        typeOfList: Array.isArray(result?.list) ? "array" : typeof result?.list,
        listLength: Array.isArray(result?.list) ? result.list.length : 0,
        total: result?.total,
        sample: Array.isArray(result?.list) ? result.list[0] : result?.list,
      });

      setDataSource(result.list || []);
      setPagination(prev => ({
        ...prev,
        current: page,
        pageSize: size,
        total: result.total || 0,
      }));
      console.log("[NamespacesPage] state updated", {
        rows: (result.list || []).length,
        pagination: { page, size, total: result.total || 0 },
      });
    } catch (error) {
      console.log("[NamespacesPage] getNamespacesList FAIL", {
        elapsedMs: +(performance.now() - t0).toFixed(1),
        error,
      });
      setDataSource([]);
    } finally {
      setTableLoading(false);
    }
  };

  const handleTableChange = (paginationInfo, filters, sorter) => {
    console.log("[NamespacesPage] handleTableChange", { paginationInfo, filters, sorter });
    const { current, pageSize } = paginationInfo;
    if (pageSize !== pagination.pageSize) {
      console.log("[NamespacesPage] pageSize changed -> reset current to 1");
      setPagination(prev => ({
        ...prev,
        pageSize,
        current: 1,
      }));
    }
    loadNamespacesData(current, pageSize);
  };

  const handleAdd = async (values) => {
    console.log("[NamespacesPage] handleAdd -> values", values);
    const t0 = performance.now();
    try {
      await namespacesAPI.createNamespace(values);
      console.log("[NamespacesPage] createNamespace OK", +(performance.now() - t0).toFixed(1), "ms");
      message.success('命名空间添加成功');
      loadNamespacesData(pagination.current, pagination.pageSize);
    } catch (error) {
      console.log("[NamespacesPage] createNamespace FAIL", {
        elapsedMs: +(performance.now() - t0).toFixed(1),
        error,
      });
      message.error('添加命名空间失败');
      throw error;
    }
  };

  const handleEdit = async (values) => {
    console.log("[NamespacesPage] handleEdit -> values", values);
    const t0 = performance.now();
    try {
      await namespacesAPI.updateNamespace(values);
      console.log("[NamespacesPage] updateNamespace OK", +(performance.now() - t0).toFixed(1), "ms");
      message.success('命名空间更新成功');
      loadNamespacesData(pagination.current, pagination.pageSize);
    } catch (error) {
      console.log("[NamespacesPage] updateNamespace FAIL", {
        elapsedMs: +(performance.now() - t0).toFixed(1),
        error,
      });
      message.error('更新命名空间失败');
      throw error;
    }
  };

  const handleDelete = async (record) => {
    console.log("[NamespacesPage] handleDelete -> record", record);
    const t0 = performance.now();
    try {
      await namespacesAPI.deleteNamespace(record.id);
      console.log("[NamespacesPage] deleteNamespace OK", +(performance.now() - t0).toFixed(1), "ms");
      message.success('命名空间删除成功');
      loadNamespacesData(pagination.current, pagination.pageSize);
    } catch (error) {
      console.log("[NamespacesPage] deleteNamespace FAIL", {
        elapsedMs: +(performance.now() - t0).toFixed(1),
        error,
      });
      message.error('删除命名空间失败');
      throw error;
    }
  };

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
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={tableLoading}
        pagination={pagination}
        onChange={handleTableChange}
        notify={false}
      />
    </SystemLayout>
  );
}
