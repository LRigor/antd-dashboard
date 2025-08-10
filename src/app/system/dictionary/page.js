"use client";

import { useState, useEffect } from "react";
import { message } from "antd";
import SystemLayout from "@/components/system";
import DataTable from "@/components/system/DataTable";
import { columns } from "@/components/columns/dictionary";
import { fields as formFields } from "@/components/fields/dictionary";
import { dictionariesAPI } from '@/api-fetch';

export default function DictionaryPage() {
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
    loadDictionariesData(1, 10);
  }, []);

  const loadDictionariesData = async (page = 1, size = 10) => {
    setTableLoading(true);
    try {
      const result = await dictionariesAPI.getDictionariesList({ page, size });
      setDataSource(result.list);
      setPagination(prev => ({
        ...prev,
        current: page,
        pageSize: size,
        total: result.total,
      }));
    } catch (error) {
      console.error('Error loading dictionaries:', error);
      message.error('加载字典列表失败');
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
    loadDictionariesData(current, pageSize);
  };

  const handleAdd = async (values) => {
    try {
      await dictionariesAPI.createDictionary(values);
      message.success('字典添加成功');
      // Reload current page data
      loadDictionariesData(pagination.current, pagination.pageSize);
    } catch (error) {
      console.error('Error adding dictionary:', error);
      message.error('添加字典失败');
    }
  };

  const handleEdit = async (values) => {
    try {
      await dictionariesAPI.updateDictionary(values);
      message.success('字典更新成功');
      // Reload current page data
      loadDictionariesData(pagination.current, pagination.pageSize);
    } catch (error) {
      console.error('Error updating dictionary:', error);
      message.error('更新字典失败');
    }
  };

  const handleDelete = async (record) => {
    try {
      await dictionariesAPI.deleteDictionary(record.id);
      message.success('字典删除成功');
      // Reload current page data
      loadDictionariesData(pagination.current, pagination.pageSize);
    } catch (error) {
      console.error('Error deleting dictionary:', error);
      message.error('删除字典失败');
    }
  };

  return (
    <SystemLayout title="词典管理" subtitle="Dictionary Management">
      <DataTable
        dataSource={dataSource}
        columns={columns}
        title="词典列表"
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