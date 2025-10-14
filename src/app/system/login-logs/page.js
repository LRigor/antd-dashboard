"use client";

import { useEffect } from "react";
import { Form, Input } from "antd";
import SystemLayout from "@/components/system";
import DataTable from "@/components/system/DataTable";
import { columns } from "@/components/columns/login-logs";
import { loginLogsAPI } from '../../../api-fetch';
import { useSystemPage } from "@/hooks/useSystemPage";
import { SearchForm } from "@/components/common/SearchForm";



export default function LoginLogsPage() {
  const [searchForm] = Form.useForm();

  // 創建適配器讓登錄日誌 API 與通用 Hook 兼容
  const loginLogsAPIAdapter = {
    getList: loginLogsAPI.getLoginLogsList,
    delete: loginLogsAPI.deleteLoginLog,
  };

  // 使用通用系統頁面 Hook
  const {
    dataSource,
    tableLoading,
    filters,
    pagination,
    loadData,
    deleteHandler,
    handleTableChange,
    handleSearch,
    handleReset,
  } = useSystemPage(loginLogsAPIAdapter, {
    initialFilters: { uid: '', ip: '', uname: '', location: '' },
    transformData: (list) => {
      // 處理重複 ID 的邏輯
      if (list && Array.isArray(list)) {
        const ids = list.map((item) => item.id);
        const uniqueIds = new Set(ids);
        if (ids.length !== uniqueIds.size) {
          return list.map((item, index) => ({
            ...item,
            uniqueKey: `${item.id ?? "unknown"}-${index}`,
          }));
        }
      }
      return list || [];
    },
  });

  // Load initial data
  useEffect(() => {
    // 1) 监听来自 columns 的删除事件
    const onDeleteEvt = (e) => {
      const rec = e && e.detail;
      // Received delete event
      if (rec) {
        deleteHandler(rec); // 使用通用的删除函数
      }
    };
    window.addEventListener('loginLogs:delete', onDeleteEvt);
  
    // 2) 首次加载列表
    loadData(1, pagination.pageSize, { sortField: 'createdAt', sortOrder: 'desc' });
  
    // 3) 清理监听器
    return () => {
      window.removeEventListener('loginLogs:delete', onDeleteEvt);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  

  // 搜尋欄位配置
  const searchFields = [
    {
      name: "ip",
      label: "IP",
      component: <Input allowClear placeholder="例如 8.8.8.8 / ::1" />,
    },
    {
      name: "uname",
      label: "用户",
      component: <Input allowClear placeholder="用户名" />,
    },
  ];

  // 搜尋值處理
  const processSearchValues = (values) => ({
    uid: (values.uid || '').trim(),
    ip: (values.ip || '').trim(),
    uname: (values.uname || '').trim(),
    location: (values.location || '').trim(),
  });

  // 搜尋和重置處理
  const onSearch = handleSearch(searchForm, processSearchValues);
  const onReset = handleReset(searchForm, { uid: '', ip: '', uname: '', location: '' });
  

  return (
    <SystemLayout title="登录日志" subtitle="Login Logs">
      <SearchForm
        fields={searchFields}
        onSearch={onSearch}
        onReset={onReset}
        form={searchForm}
      />

      <DataTable
        dataSource={dataSource}
        columns={columns}
        title="登录日志列表"
        onDelete={deleteHandler}
        loading={tableLoading}
        pagination={pagination}
        onChange={handleTableChange}
        rowKey={(r) => r.uniqueKey ?? r.id ?? r.key}
      />
    </SystemLayout>
  );
}