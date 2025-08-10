"use client";

import { useState, useEffect } from "react";
import { message } from "antd";
import SystemLayout from "@/components/system";
import DataTable from "@/components/system/DataTable";
import { columns } from "@/components/columns/login-logs";
import { loginLogsAPI } from '../../../api-fetch';

export default function LoginLogsPage() {
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
    loadLoginLogsData(1, pagination.pageSize);
  }, []);

  const loadLoginLogsData = async (page = 1, size = 10) => {
    setTableLoading(true);
    try {
      const result = await loginLogsAPI.getLoginLogsList({ page, size });
      
      // Validate and ensure unique IDs
      if (result.list && Array.isArray(result.list)) {
        // Check for duplicate IDs
        const ids = result.list.map(item => item.id);
        const uniqueIds = new Set(ids);
        if (ids.length !== uniqueIds.size) {
          console.warn('LoginLogs: Duplicate IDs detected in API response:', ids);
          // Add unique identifiers to prevent React key conflicts
          const processedList = result.list.map((item, index) => ({
            ...item,
            uniqueKey: `${item.id || 'unknown'}-${index}`
          }));
          setDataSource(processedList);
        } else {
          setDataSource(result.list);
        }
      } else {
        setDataSource([]);
      }
      
      setPagination(prev => ({
        ...prev,
        current: page,
        pageSize: size,
        total: result.total,
      }));
    } catch (error) {
      console.error('Error loading login logs:', error);
      message.error('加载登录日志列表失败');
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
    loadLoginLogsData(current, pageSize);
  };

  const handleDelete = async (record) => {
    try {
      await loginLogsAPI.deleteLoginLog(record.id);
      message.success('登录日志删除成功');
      // Reload current page data
      loadLoginLogsData(pagination.current, pagination.pageSize);
    } catch (error) {
      console.error('Error deleting login log:', error);
      message.error('删除登录日志失败');
    }
  };

  return (
    <SystemLayout title="登录日志" subtitle="Login Logs">
      <DataTable
        dataSource={dataSource}
        columns={columns}
        title="登录日志列表"
        onDelete={handleDelete}
        loading={tableLoading}
        pagination={pagination}
        onChange={handleTableChange}
        rowKey="uniqueKey"
      />
    </SystemLayout>
  );
} 