"use client";

import { useState, useEffect } from "react";
import { message, App } from "antd";
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

  // Load initial data
  useEffect(() => {
    loadNamespacesData(1, 10);
  }, []);

  const loadNamespacesData = async (page = 1, size = 10) => {
    setTableLoading(true);
    try {
      const result = await namespacesAPI.getNamespacesList({ page, size });
      setDataSource(result.list || []);
      setPagination(prev => ({
        ...prev,
        current: page,
        pageSize: size,
        total: result.total || 0,
      }));
    } catch (error) {
      console.error('Error loading namespaces:', error);
      setDataSource([]);
    } finally {
      setTableLoading(false);
    }
  };

  const handleTableChange = (paginationInfo, filters, sorter) => {
    const { current, pageSize } = paginationInfo;
    // Update pagination state with new pageSize if it changed
    if (pageSize !== pagination.pageSize) {
      setPagination(prev => ({
        ...prev,
        pageSize,
        current: 1, // Reset to first page when page size changes
      }));
    }
    loadNamespacesData(current, pageSize);
  };

  const handleAdd = async (values) => {
    try {
      await namespacesAPI.createNamespace(values);
      message.success('命名空间添加成功');
      loadNamespacesData(pagination.current, pagination.pageSize);
    } catch (error) {
      console.error('Error adding namespace:', error);
      message.error('添加命名空间失败');
      throw error;
    }
  };

  const handleEdit = async (values) => {
    try {
      await namespacesAPI.updateNamespace(values);
      message.success('命名空间更新成功');
      loadNamespacesData(pagination.current, pagination.pageSize);
    } catch (error) {
      console.error('Error updating namespace:', error);
      message.error('更新命名空间失败');
      throw error;
    }
  };

  const handleDelete = async (record) => {
    try {
      await namespacesAPI.deleteNamespace(record.id);
      message.success('命名空间删除成功');
      loadNamespacesData(pagination.current, pagination.pageSize);
    } catch (error) {
      console.error('Error deleting namespace:', error);
      message.error('删除命名空间失败');
      throw error;
    }
  };

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
      />
    </SystemLayout>
  );
} 