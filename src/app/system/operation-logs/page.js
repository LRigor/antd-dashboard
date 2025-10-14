"use client";

import { useEffect, useMemo } from "react";
import { Form, Input, Select, DatePicker } from "antd";
import dayjs from "dayjs";
import SystemLayout from "@/components/system";
import DataTable from "@/components/system/DataTable";
import { columns } from "@/components/columns/operation-logs";
import { operationLogsAPI } from "../../../api-fetch";
import { useSystemPage } from "@/hooks/useSystemPage";
import { SearchForm } from "@/components/common/SearchForm";

const { RangePicker } = DatePicker;

const METHOD_OPTIONS = [
  { value: "", label: "全部" },
  { value: "GET", label: "GET" },
  { value: "POST", label: "POST" },
  { value: "PUT", label: "PUT" },
  { value: "DELETE", label: "DELETE" },
];

export default function OperationLogsPage() {
  const [searchForm] = Form.useForm();

  // 創建適配器讓操作日誌 API 與通用 Hook 兼容
  const operationLogsAPIAdapter = {
    getList: operationLogsAPI.getOperationLogsList,
    delete: operationLogsAPI.deleteOperationLog,
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
  } = useSystemPage(operationLogsAPIAdapter, {
    initialFilters: {
      uname: "",
      method: "",
      uri: "",
      q: "",
      startAt: "",
      endAt: "",
    },
  });

  // 初次載入
  useEffect(() => {
    loadData(1, pagination.pageSize, filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 搜尋欄位配置
  const searchFields = [
    {
      name: "uname",
      label: "操作用户",
      component: <Input placeholder="uname" allowClear style={{ width: 160 }} />,
    },
    {
      name: "method",
      label: "方法",
      component: <Select options={METHOD_OPTIONS} style={{ width: 140 }} />,
    },
    {
      name: "uri",
      label: "请求地址",
      component: <Input placeholder="/api/xxx" allowClear style={{ width: 220 }} />,
    },
    {
      name: "q",
      label: "参数包含",
      component: <Input placeholder="req 关键字" allowClear style={{ width: 200 }} />,
    },
    {
      name: "createdAt",
      label: "时间范围",
      component: <RangePicker showTime allowClear />,
    },
  ];

  // 搜尋值處理
  const processSearchValues = (values) => {
    const [start, end] = values.createdAt || [];
    return {
      uname: values.uname?.trim() || "",
      method: values.method || "",
      uri: values.uri?.trim() || "",
      q: values.q?.trim() || "",
      startAt: start ? dayjs(start).format("YYYY-MM-DD HH:mm:ss") : "",
      endAt: end ? dayjs(end).format("YYYY-MM-DD HH:mm:ss") : "",
    };
  };

  // 搜尋和重置處理
  const onSearch = handleSearch(searchForm, processSearchValues);
  const onReset = handleReset(searchForm, {
    uname: "",
    method: "",
    uri: "",
    q: "",
    startAt: "",
    endAt: "",
  });

  // 可選：把當前條件顯示在頁面標題旁（方便除錯）
  const condText = useMemo(() => {
    const { uname, method, uri, q, startAt, endAt } = filters;
    const parts = [];
    if (uname) parts.push(`uname=${uname}`);
    if (method) parts.push(`method=${method}`);
    if (uri) parts.push(`uri=${uri}`);
    if (q) parts.push(`q=${q}`);
    if (startAt || endAt) parts.push(`time=${startAt || "-"}~${endAt || "-"}`);
    return parts.join(" | ");
  }, [filters]);

  return (
    <SystemLayout title="操作日志" subtitle="Operation Logs">
      <SearchForm
        fields={searchFields}
        onSearch={onSearch}
        onReset={onReset}
        form={searchForm}
        initialValues={{ method: "" }}
      />
      {/* 調試用：目前條件 */}
      {/* <div style={{ marginTop: 6, color: '#999' }}>{condText}</div> */}

      <DataTable
        dataSource={dataSource}
        columns={columns}
        title="操作日志列表"
        onDelete={deleteHandler}
        loading={tableLoading}
        pagination={pagination}
        onChange={handleTableChange}
      />
    </SystemLayout>
  );
}
