"use client";

import { useState, useEffect, useMemo } from "react";
import { Form, Input, Select, DatePicker, Button, Space, App } from "antd";
import dayjs from "dayjs";
import SystemLayout from "@/components/system";
import DataTable from "@/components/system/DataTable";
import { columns } from "@/components/columns/operation-logs";
import { operationLogsAPI } from "../../../api-fetch";

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
  const { message } = App.useApp();
  const [dataSource, setDataSource] = useState([]);
  const [tableLoading, setTableLoading] = useState(false);

  // ✅ 查詢條件集中管理
  const [filters, setFilters] = useState({
    uname: "",
    method: "",
    uri: "",
    q: "",
    startAt: "",
    endAt: "",
  });

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
    pageSizeOptions: ["10", "20", "50", "100"],
    position: ["bottomCenter"],
  });

  // 初次載入
  useEffect(() => {
    loadOperationLogsData(1, pagination.pageSize, filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 請求封裝（帶上分頁 + 篩選）
  const loadOperationLogsData = async (
    page = 1,
    size = 10,
    cond = filters
  ) => {
    setTableLoading(true);
    try {
      const result = await operationLogsAPI.getOperationLogsList({
        page,
        size,
        ...cond,
      });
      setDataSource(result.list || []);
      setPagination((prev) => ({
        ...prev,
        current: page,
        pageSize: size,
        total: result.total || 0,
      }));
    } catch (error) {
      message.error("加载操作日志列表失败");
    } finally {
      setTableLoading(false);
    }
  };

  // 分頁/排序改變時：保留目前 filters
  const handleTableChange = (paginationInfo) => {
    const { current, pageSize } = paginationInfo;
    // pageSize 變更時，回到第一頁
    const nextPage = pageSize !== pagination.pageSize ? 1 : current;
    setPagination((prev) => ({ ...prev, pageSize, current: nextPage }));
    loadOperationLogsData(nextPage, pageSize, filters);
  };

  // 刪除後重載
  const handleDelete = async (record) => {
    try {
      await operationLogsAPI.deleteOperationLog(record.id);
      message.success("操作日志删除成功");
      loadOperationLogsData(pagination.current, pagination.pageSize, filters);
    } catch (error) {
      message.error("删除操作日志失败");
    }
  };

  // 🔍 搜尋
  const onSearch = async () => {
    const v = await searchForm.validateFields();
    const [start, end] = v.createdAt || [];
    const next = {
      uname: v.uname?.trim() || "",
      method: v.method || "",
      uri: v.uri?.trim() || "",
      q: v.q?.trim() || "",
      startAt: start ? dayjs(start).format("YYYY-MM-DD HH:mm:ss") : "",
      endAt: end ? dayjs(end).format("YYYY-MM-DD HH:mm:ss") : "",
    };
    setFilters(next);
    // 重置到第 1 頁載入
    setPagination((p) => ({ ...p, current: 1 }));
    loadOperationLogsData(1, pagination.pageSize, next);
  };

  // ♻️ 重置
  const onReset = () => {
    searchForm.resetFields();
    const next = { uname: "", method: "", uri: "", q: "", startAt: "", endAt: "" };
    setFilters(next);
    setPagination((p) => ({ ...p, current: 1 }));
    loadOperationLogsData(1, pagination.pageSize, next);
  };

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
      {/* 搜尋區 */}
      <div style={{ marginBottom: 12 }}>
        <Form form={searchForm} layout="inline" onFinish={onSearch} initialValues={{ method: "" }} style={{ rowGap: 12 }}>
          <Form.Item label="操作用户" name="uname">
            <Input placeholder="uname" allowClear style={{ width: 160 }} />
          </Form.Item>
          <Form.Item label="方法" name="method">
            <Select options={METHOD_OPTIONS} style={{ width: 140 }} />
          </Form.Item>
          <Form.Item label="请求地址" name="uri">
            <Input placeholder="/api/xxx" allowClear style={{ width: 220 }} />
          </Form.Item>
          <Form.Item label="参数包含" name="q">
            <Input placeholder="req 关键字" allowClear style={{ width: 200 }} />
          </Form.Item>
          <Form.Item label="时间范围" name="createdAt">
            <RangePicker showTime allowClear />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">搜尋</Button>
              <Button onClick={onReset}>重置</Button>
            </Space>
          </Form.Item>
        </Form>
        {/* 調試用：目前條件 */}
        {/* <div style={{ marginTop: 6, color: '#999' }}>{condText}</div> */}
      </div>

      {/* 列表 */}
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
