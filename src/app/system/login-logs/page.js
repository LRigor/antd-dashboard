"use client";

import { useState, useEffect } from "react";
import { Form, App, Button, Space, Input } from "antd";
import SystemLayout from "@/components/system";
import DataTable from "@/components/system/DataTable";
import { columns } from "@/components/columns/login-logs";
import { loginLogsAPI } from '../../../api-fetch';

const DEBUG = false;

function dbg(...args) {
  // Debug disabled
}
async function withTrace(label, fn) {
  try {
    const res = await fn();
    return res;
  } catch (e) {
    throw e;
  }
}

export default function LoginLogsPage() {
  const [dataSource, setDataSource] = useState([]);
  const [filters, setFilters] = useState({uid:'',ip:'',uname:'',});
  const [searchForm] = Form.useForm(); 
  const { message } = App.useApp();
  const [tableLoading, setTableLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total, range ) =>
      `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
    pageSizeOptions: ["10", "20", "50", "100"],
    position: ["bottomCenter"] ,
  });

  // Load initial data
  useEffect(() => {
    // 1) 监听来自 columns 的删除事件
    const onDeleteEvt = (e) => {
      const rec = e && e.detail;
      // Received delete event
      if (rec) {
        handleDelete(rec); // 直接用你已有的删除函数
      }
    };
    window.addEventListener('loginLogs:delete', onDeleteEvt);
  
    // 2) 首次加载列表
    // Mount effect
    loadLoginLogsData(1, pagination.pageSize, { sortField: 'createdAt', sortOrder: 'desc' });
  
    // 3) 清理监听器
    return () => {
      window.removeEventListener('loginLogs:delete', onDeleteEvt);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  

  const loadLoginLogsData = async (
    page = 1,
    size = 10,
    extra = {},
    filters = {} // ✅ 只保留 filters
  ) => {
    setTableLoading(true);
    // Load start
  
    try {
      const effSortField = extra.sortField || 'createdAt';
      const effSortOrder = extra.sortOrder || 'desc';
      const result = await withTrace(
        `API getLoginLogsList page=${page} size=${size}`,
        () =>
          loginLogsAPI.getLoginLogsList({
            page,
            size,
            sortBy: effSortField,
            sortOrder: effSortOrder,
            ...filters,
          })
      );

      // API result processed

      // Validate and ensure unique IDs
      if (result?.list && Array.isArray(result.list)) {
        const ids = result.list.map((item) => item.id);
        const uniqueIds = new Set(ids);
        if (ids.length !== uniqueIds.size) {
          // Duplicate IDs detected
          // Add unique identifiers to prevent React key conflicts
          const processedList = result.list.map((item, index) => ({
            ...item,
            uniqueKey: `${item.id ?? "unknown"}-${index}`,
          }));
          setDataSource(processedList);
          // Processed list
        } else {
          setDataSource(result.list);
          // Set data source
        }
      } else {
        setDataSource([]);
        // Set empty data source
      }

      setPagination((prev) => ({
        ...prev,
        current: page,
        pageSize: size,
        total: result?.total ?? 0,
      }));
      
      // Pagination updated
    } catch (error) {
      // Error loading login logs
      message.error("加载登录日志列表失败");
    } finally {
      setTableLoading(false);
      // Load end
    }
  };

  const handleTableChange = (paginationInfo, filters2, sorter) => {
    const { current, pageSize } = paginationInfo || {};
  
    // sorter 可能是对象或数组（多列排序时）
    const s = Array.isArray(sorter) ? sorter[0] : sorter;
    const sortField = s?.field; // 比如 'createdAt'
    const sortOrder =
      s?.order === 'ascend' ? 'asc' :
      s?.order === 'descend' ? 'desc' :
      undefined;
  
    // Handle table change
  
    if (pageSize !== pagination.pageSize) {
      setPagination(prev => ({ ...prev, pageSize, current: 1 }));
      loadLoginLogsData(1, pageSize, { sortField, sortOrder }, filters); // 👈 加 filters
    } else {
      loadLoginLogsData(current, pageSize, { sortField, sortOrder }, filters); // 👈 加 filters
    }
  };
  
  

  const handleDelete = async (record) => {
    // Handle delete
    if (!record) {
      // No record provided
      return;
    }
    if (!record.id && record.id !== 0) {
      // Invalid record ID
    }

    try {
      await withTrace(`API deleteLoginLog id=${record.id}`, () =>
        loginLogsAPI.deleteLoginLog(record.id)
      );
      message.success("登录日志删除成功");
      // Reload current page data
      // Reload after delete
      loadLoginLogsData(pagination.current, pagination.pageSize);
    } catch (error) {
      // Error deleting login log
      message.error("删除登录日志失败");
    }
  };

  // Render effect

  const onSearch = async () => {
    const v = await searchForm.validateFields();
    // 可选：清理空格
    const f = {
      uid: (v.uid || '').trim(),
      ip: (v.ip || '').trim(),
      uname: (v.uname || '').trim(),
      location: (v.location || '').trim(),
    };
    setFilters(f); // 更新 state（给后续翻页/排序用）
    // 本次请求直接带 f，避免用到旧的 filters
    loadLoginLogsData(1, pagination.pageSize, { sortField: 'createdAt', sortOrder: 'desc' }, f);
  };
  
  const onReset = () => {
    searchForm.resetFields();
    const empty = { uid: '', ip: '', uname: '', location: '' };
    setFilters(empty);
    loadLoginLogsData(1, pagination.pageSize, { sortField: 'createdAt', sortOrder: 'desc' }, empty);
  };
  

    return (
      <SystemLayout title="登录日志" subtitle="Login Logs">
        {/* 🔴 这块就是你图里红框的位置：搜索栏 */}
        <div style={{ marginBottom: 16 }}>
          <Form form={searchForm} layout="inline" onFinish={onSearch}>
            <Form.Item name="ip" label="IP">
              <Input allowClear placeholder="例如 8.8.8.8 / ::1" onPressEnter={onSearch} />
            </Form.Item>
            <Form.Item name="uname" label="用户">
              <Input allowClear placeholder="用户名" onPressEnter={onSearch} />
            </Form.Item>
            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit">搜索</Button>
                <Button onClick={onReset}>重置</Button>
              </Space>
            </Form.Item>
          </Form>
        </div>
  
        <DataTable
          dataSource={dataSource}
          columns={columns}
          title="登录日志列表"
          onDelete={handleDelete}
          loading={tableLoading}
          pagination={pagination}
          onChange={handleTableChange}
          rowKey={(r) => r.uniqueKey ?? r.id ?? r.key}
        />
      </SystemLayout>
    );
  }