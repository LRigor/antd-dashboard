"use client";

import { useState, useEffect } from "react";
import { message } from "antd";
import SystemLayout from "@/components/system";
import DataTable from "@/components/system/DataTable";
import { columns } from "@/components/columns/operation-logs";
import { operationLogsAPI } from '../../../api-fetch';

export default function OperationLogsPage() {
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
    loadOperationLogsData(1, pagination.pageSize);
  }, []);

  const loadOperationLogsData = async (page = 1, size = 10) => {
    setTableLoading(true);
    try {
      const result = await operationLogsAPI.getOperationLogsList({ page, size });
      setDataSource(result.list);
      setPagination(prev => ({
        ...prev,
        current: page,
        pageSize: size,
        total: result.total,
      }));
    } catch (error) {
      console.error('Error loading operation logs:', error);
      message.error('加载操作日志列表失败');
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
    loadOperationLogsData(current, pageSize);
  };

  const handleDelete = async (record) => {
    try {
      await operationLogsAPI.deleteOperationLog(record.id);
      message.success('操作日志删除成功');
      // Reload current page data
      loadOperationLogsData(pagination.current, pagination.pageSize);
    } catch (error) {
      console.error('Error deleting operation log:', error);
      message.error('删除操作日志失败');
    }
  };

  return (
    <SystemLayout title="操作日志" subtitle="Operation Logs">
      <DataTable
        dataSource={dataSource}
        columns={columns}
        title="操作日志列表"
        onDelete={handleDelete}
        loading={tableLoading}
        pagination={pagination}
        onChange={handleTableChange}
      />
    </SystemLayout>
  );
} 