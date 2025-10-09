// src/app/xxxx/admins/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Form, Input, Button, Space, App } from "antd";
import SystemLayout from "@/components/system";
import DataTable from "@/components/system/DataTable";
import { columns } from "@/components/columns/admins";
import { fields as formFields } from "@/components/fields/admins";
import { adminsAPI } from "@/api-fetch";

// ===== Debug 開關 & 小工具 =====
const ADMIN_DEBUG = true; // 關閉改成 false
const dbg = (...args) => ADMIN_DEBUG && console.debug("[AdminsPage]", ...args);
const err = (...args) => console.error("[AdminsPage]", ...args);

/** 從 row.namespaces[] 提取單一 namespace 值（字串），優先 isDefault=1，否則取第一個 */
function extractNamespaceId(row) {
  if (row?.namespace != null) return String(row.namespace);

  const nsList = Array.isArray(row?.namespaces) ? row.namespaces : [];
  const def = nsList.find((x) => Number(x?.isDefault) === 1);
  if (def?.namespace != null) return String(def.namespace);

  if (nsList[0]?.namespace != null) return String(nsList[0].namespace);

  return undefined;
}

/** 把資料扁平化，補上 row.namespace（字串）供表格/表單使用 */
function normalizeAdminRow(row) {
  return {
    ...row,
    namespace: extractNamespaceId(row), // 統一字串，方便 Select.value 對得上
  };
}

export default function AdminsPage() {
  // 搜尋表單
  const [searchForm] = Form.useForm();

  // 表格資料
  const [dataSource, setDataSource] = useState([]);
  const { message } = App.useApp();
  const [tableLoading, setTableLoading] = useState(false);

  // 搜尋條件
  const [filters, setFilters] = useState({ uname: "" });

  // 分頁
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total, range) =>
      `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
    pageSizeOptions: ["10", "20", "50", "100"],
    position: ["bottomCenter"],
  });

  // 首次載入
  useEffect(() => {
    dbg("mount -> init load with", { page: 1, size: pagination.pageSize, filters });
    loadAdminsData(1, pagination.pageSize, filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 取得列表
  const loadAdminsData = async (
    page = 1,
    size = 10,
    cond = filters
  ) => {
    setTableLoading(true);
    try {
      dbg("loadAdminsData -> req", { page, size, cond });
      const result = await adminsAPI.getAdminsList({ page, size, ...cond });
      dbg("loadAdminsData <- raw", result);

      const data = result?.data || result;
      const list = Array.isArray(data?.list) ? data.list : [];
      const total = Number(data?.total) || 0;

      // ✅ 扁平化 namespace
      const normalizedList = list.map(normalizeAdminRow);

      if (ADMIN_DEBUG) {
        const sample = normalizedList[0];
        dbg("loadAdminsData <- parsed", {
          total,
          listLen: list.length,
          sample: sample ? { id: sample.id, uname: sample.uname, namespace: sample.namespace } : null,
        });
      }

      setDataSource(normalizedList);
      setPagination((prev) => ({
        ...prev,
        current: page,
        pageSize: size,
        total,
      }));
    } catch (e) {
      err("Error loading admins:", e);
      message.error("加载管理员列表失败");
    } finally {
      setTableLoading(false);
    }
  };

  // 分頁/排序/篩選變更
  const handleTableChange = (paginationInfo) => {
    const { current, pageSize } = paginationInfo;
    const nextPage = pageSize !== pagination.pageSize ? 1 : current;
    dbg("handleTableChange", {
      from: { current: pagination.current, pageSize: pagination.pageSize },
      to: { current, pageSize },
      finalNextPage: nextPage,
      filters,
    });
    setPagination((prev) => ({ ...prev, pageSize, current: nextPage }));
    loadAdminsData(nextPage, pageSize, filters);
  };

  // 新增
  const handleAdd = async (values) => {
    // 若後端期望 number，把字串轉回 number
    const payload = {
      ...values,
      namespace:
        values?.namespace != null && values.namespace !== ""
          ? Number(values.namespace)
          : values?.namespace,
    };

    dbg("handleAdd -> payload", payload);
    try {
      const res = await adminsAPI.createAdmin(payload);
      dbg("handleAdd <- res", res);
      message.success("管理员添加成功");
      loadAdminsData(pagination.current, pagination.pageSize, filters);
    } catch (e) {
      err("Error adding admin:", e);
      message.error("添加管理员失败");
    }
  };

  // 編輯
  const handleEdit = async (values) => {
    // 同上：namespace 轉回 number
    const payload = {
      ...values,
      namespace:
        values?.namespace != null && values.namespace !== ""
          ? Number(values.namespace)
          : values?.namespace,
    };

    dbg("handleEdit -> payload", payload);
    try {
      const res = await adminsAPI.updateAdmin(payload);
      dbg("handleEdit <- res", res);
      message.success("管理员更新成功");
      loadAdminsData(pagination.current, pagination.pageSize, filters);
    } catch (e) {
      err("Error updating admin:", e);
      message.error("更新管理员失败");
    }
  };

  // 刪除
  const handleDelete = async (record) => {
    dbg("handleDelete -> id", record?.id);
    try {
      const res = await adminsAPI.deleteAdmin(record.id);
      dbg("handleDelete <- res", res);
      message.success("管理员删除成功");
      loadAdminsData(pagination.current, pagination.pageSize, filters);
    } catch (e) {
      err("Error deleting admin:", e);
      message.error("删除管理员失败");
    }
  };

  // 搜尋
  const onSearch = async () => {
    const v = await searchForm.validateFields();
    const next = { uname: (v.uname || "").trim() };
    dbg("onSearch -> next filters", next);
    setFilters(next);
    setPagination((p) => ({ ...p, current: 1 }));
    loadAdminsData(1, pagination.pageSize, next);
  };

  // 重置搜尋
  const onReset = () => {
    dbg("onReset");
    searchForm.resetFields();
    const next = { uname: "" };
    setFilters(next);
    setPagination((p) => ({ ...p, current: 1 }));
    loadAdminsData(1, pagination.pageSize, next);
  };

  // 方便臨時在 Console 呼叫
  if (ADMIN_DEBUG && typeof window !== "undefined") {
    window.__ADMINS__ = {
      reload: (p = pagination.current, s = pagination.pageSize) =>
        loadAdminsData(p, s, filters),
      setFilters,
      getFilters: () => filters,
      getPagination: () => pagination,
    };
  }

  return (
    <SystemLayout title="管理员管理" subtitle="Admin Management">
      <div style={{ marginBottom: 12 }}>
        <Form
          data-form="search"
          layout="inline"
          form={searchForm}
          onFinish={onSearch}
          style={{ rowGap: 12 }}
        >
          <Form.Item label="用户名" name="uname">
            <Input
              placeholder="uname"
              allowClear
              style={{ width: 200 }}
              data-field="search-uname"
            />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                搜尋
              </Button>
              <Button onClick={onReset}>重置</Button>
            </Space>
          </Form.Item>
        </Form>
      </div>

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
