"use client";

import { useEffect, useState } from "react";
import { message } from "antd";
import SystemLayout from "@/components/system";
import DataTable from "@/components/system/DataTable";
import { rolesAPI } from '@/api-fetch';
import { fields as formFields } from "@/components/fields/roles";
import { columns } from "@/components/columns/roles";

export default function RolesPage() {
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

  useEffect(() => {
    loadRolesData(1, 10);
  }, []);

  const loadRolesData = async (page = 1, size = 10) => {
    setTableLoading(true);
    try {
      const result = await rolesAPI.getRolesList({ page, size });
      setDataSource(result.list);
      setPagination(prev => ({
        ...prev,
        current: page,
        pageSize: size,
        total: result.total,
      }));
    } catch (error) {
      console.error('Error loading roles:', error);
      message.error('加载角色列表失败');
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
    loadRolesData(current, pageSize);
  };

  const handleAdd = async (values) => {
    try {
      await rolesAPI.createRole(values);
      message.success('角色添加成功');
      loadRolesData(pagination.current, pagination.pageSize);
    } catch (error) {
      console.error('Error adding role:', error);
      message.error('添加角色失败');
    }
  };

  const handleEdit = async (values) => {
    try {
      await rolesAPI.updateRole(values);
      message.success('角色更新成功');
      loadRolesData(pagination.current, pagination.pageSize);
    } catch (error) {
      console.error('Error updating role:', error);
      message.error('更新角色失败');
    }
  };

  const handleDelete = async (record) => {
    try {
      await rolesAPI.deleteRole(record.id);
      message.success('角色删除成功');
      loadRolesData(pagination.current, pagination.pageSize);
    } catch (error) {
      console.error('Error deleting role:', error);
      message.error('删除角色失败');
    }
  };

  return (
    <SystemLayout title="角色管理" subtitle="Role Management">
      <DataTable
        dataSource={dataSource}
        columns={columns}
        title="角色列表"
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