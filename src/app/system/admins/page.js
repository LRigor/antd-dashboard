"use client";

import { useState, useEffect } from "react";
import { message } from "antd";
import SystemLayout from "@/components/system";
import DataTable from "@/components/system/DataTable";
import { columns } from "@/components/columns/admins";
import { fields as formFields } from "@/components/fields/admins";
import { adminsAPI } from '@/api-fetch';

export default function AdminsPage() {
  const [dataSource, setDataSource] = useState([]);
  const [tableLoading, setTableLoading] = useState(false);
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
    loadAdminsData(1, 10);
  }, []);

  const loadAdminsData = async (page = 1, size = 10) => {
    setTableLoading(true);
    try {
      const result = await adminsAPI.getAdminsList({ page, size });
      const data = result?.data || result; // 兼容两种写法
  
      setDataSource(Array.isArray(data?.list) ? data.list : []);
      setPagination(prev => ({
        ...prev,
        current: page,
        pageSize: size,
        total: Number(data?.total) || 0,
      }));
    } catch (error) {
      console.error('Error loading admins:', error);
      message.error('加载管理员列表失败');
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
    loadAdminsData(current, pageSize);
  };

  const handleAdd = async (values) => {
    try {
      await adminsAPI.createAdmin(values);
      message.success('管理员添加成功');
      // Reload current page data
      loadAdminsData(pagination.current, pagination.pageSize);
    } catch (error) {
      console.error('Error adding admin:', error);
      message.error('添加管理员失败');
    }
  };

  const handleEdit = async (values) => {
    try {
      await adminsAPI.updateAdmin(values);
      message.success('管理员更新成功');
      // Reload current page data
      loadAdminsData(pagination.current, pagination.pageSize);
    } catch (error) {
      console.error('Error updating admin:', error);
      message.error('更新管理员失败');
    }
  };

  const handleDelete = async (record) => {
    try {
      await adminsAPI.deleteAdmin(record.id);
      message.success('管理员删除成功');
      // Reload current page data
      loadAdminsData(pagination.current, pagination.pageSize);
    } catch (error) {
      console.error('Error deleting admin:', error);
      message.error('删除管理员失败');
    }
  };

  return (
    <SystemLayout title="管理员管理" subtitle="Admin Management">
      <DataTable
        dataSource={dataSource}
        columns={columns}
        title="管理员列表"
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