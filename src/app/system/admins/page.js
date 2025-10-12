"use client";

import { useState, useEffect } from "react";
import { Form, Input, Button, Space, App } from "antd";
import SystemLayout from "@/components/system";
import DataTable from "@/components/system/DataTable";
import { columns } from "@/components/columns/admins";
import { fields as formFields } from "@/components/fields/admins";
import { adminsAPI } from "@/api-fetch";
import { useUser } from "@/components/header/useUser";

/** 從 row.namespaces[] 提取單一 namespace 值（字串），優先 isDefault=1，否則取第一個 */
function extractNamespaceId(row) {
  console.log("[AdminsPage] extractNamespaceId -> row.id:", row?.id, "namespaces:", row?.namespaces, "namespace:", row?.namespace);
  if (row?.namespace != null) {
    const v = String(row.namespace);
    console.log("[AdminsPage] extractNamespaceId -> use row.namespace =", v);
    return v;
  }

  const nsList = Array.isArray(row?.namespaces) ? row.namespaces : [];
  const def = nsList.find((x) => Number(x?.isDefault) === 1);
  if (def?.namespace != null) {
    const v = String(def.namespace);
    console.log("[AdminsPage] extractNamespaceId -> use default namespaces =", v, "raw default:", def);
    return v;
  }

  if (nsList[0]?.namespace != null) {
    const v = String(nsList[0].namespace);
    console.log("[AdminsPage] extractNamespaceId -> use first namespaces =", v);
    return v;
  }

  console.log("[AdminsPage] extractNamespaceId -> no namespace found");
  return undefined;
}

/** 把資料扁平化，補上 row.namespace（字串）供表格/表單使用 */
function normalizeAdminRow(row) {
  const ns = extractNamespaceId(row);
  const out = { ...row, namespace: ns };
  console.log("[AdminsPage] normalizeAdminRow -> id:", row?.id, "=> namespace:", ns);
  return out;
}

/** 處理 namespaces 陣列，轉成純 ID 陣列（number[]） */
function processNamespaces(values) {
  console.log("[AdminsPage] processNamespaces <- values.namespaces:", values?.namespaces, "values.namespace:", values?.namespace);
  let namespaces = Array.isArray(values.namespaces) ? values.namespaces : [];
  if (!namespaces.length && values.namespace != null && values.namespace !== "") {
    namespaces = [values.namespace];
  }
  const out = namespaces
    .map((n) => (typeof n === "object" ? Number(n.namespace ?? n.id ?? n.value) : Number(n)))
    .filter((n) => Number.isFinite(n));
  console.log("[AdminsPage] processNamespaces ->", out);
  return out;
}

export default function AdminsPage() {
  const { user } = useUser(); // 取得當前管理員 ID 當 operator_id
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
    console.log("[AdminsPage] mount -> initial load");
    loadAdminsData(1, pagination.pageSize, filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 取得列表
  const loadAdminsData = async (page = 1, size = 10, cond = filters) => {
    console.log("[AdminsPage] loadAdminsData -> params", { page, size, cond });
    setTableLoading(true);
    const t0 = performance.now();
    try {
      const result = await adminsAPI.getAdminsList({ page, size, ...cond });
      const data = result?.data || result;
      const list = Array.isArray(data?.list) ? data.list : [];
      const total = Number(data?.total) || 0;
      console.log("[AdminsPage] getAdminsList OK", {
        elapsedMs: +(performance.now() - t0).toFixed(1),
        listLen: list.length,
        total,
        sample: list[0],
      });

      // 扁平化 namespace
      const normalizedList = list.map(normalizeAdminRow);

      // 檢視前 3 筆扁平化結果
      console.log("[AdminsPage] normalizedList sample(3) =", normalizedList.slice(0, 3));

      setDataSource(normalizedList);
      setPagination((prev) => ({
        ...prev,
        current: page,
        pageSize: size,
        total,
      }));
      console.log("[AdminsPage] state updated -> pagination", { page, size, total });
    } catch (e) {
      console.log("[AdminsPage] getAdminsList FAIL", e);
      message.error("加载管理员列表失败");
    } finally {
      setTableLoading(false);
    }
  };

  // 分頁/排序/篩選變更
  const handleTableChange = (paginationInfo) => {
    console.log("[AdminsPage] handleTableChange", { paginationInfo });
    const { current, pageSize } = paginationInfo;
    const nextPage = pageSize !== pagination.pageSize ? 1 : current;
    setPagination((prev) => ({ ...prev, pageSize, current: nextPage }));
    loadAdminsData(nextPage, pageSize, filters);
  };

  // 新增
  const handleAdd = async (values) => {
    console.log("[AdminsPage] handleAdd <- form values", values);
    const namespaces = processNamespaces(values);
    if (!namespaces.length) {
      message.error("請至少選擇一個命名空間");
      return;
    }

    if (!values.pass || String(values.pass).startsWith("$2a$")) {
      message.error("請輸入明文密碼");
      return;
    }

    const payload = {
      operator_id: Number(user?.id ?? 0),
      rid: Number(values.rid),
      uname: values.uname,
      pass: values.pass,
      icon: values.icon || "",
      desc: values.desc || "",
      status: String(values.status ?? ""),
      level: values.level != null ? String(values.level) : "",
      utc: values.utc || "",
      namespaces,
    };
    console.log("[AdminsPage] handleAdd -> payload", payload);

    try {
      await adminsAPI.createAdmin(payload);
      console.log("[AdminsPage] createAdmin OK");
      message.success("管理员添加成功");
      loadAdminsData(pagination.current, pagination.pageSize, filters);
    } catch (e) {
      console.log("[AdminsPage] createAdmin FAIL", e);
      message.error(e?.message || "添加管理员失败");
    }
  };

  // 編輯
  const handleEdit = async (values) => {
    console.log("[AdminsPage] handleEdit <- form values", values);
    const namespaces = processNamespaces(values);
    if (!namespaces.length) {
      message.error('請至少選擇一個命名空間');
      return;
    }

    const passPart =
      values.pass && !String(values.pass).startsWith('$2a$')
        ? { pass: values.pass }
        : {};

    const payload = {
      operator_id: Number(user?.id ?? 0),
      id: Number(values.id),
      rid: Number(values.rid),
      icon: values.icon || '',
      desc: values.desc || '',
      status: String(values.status ?? ''),
      level: values.level != null ? String(values.level) : '',
      utc: values.utc || '',
      namespaces,
      ...passPart,
    };
    console.log("[AdminsPage] handleEdit -> payload", payload);

    try {
      await adminsAPI.updateAdmin(payload);
      console.log("[AdminsPage] updateAdmin OK");
      message.success('管理员更新成功');
      loadAdminsData(pagination.current, pagination.pageSize, filters);
    } catch (e) {
      console.log("[AdminsPage] updateAdmin FAIL", e);
      message.error('更新管理员失败');
    }
  };

  // 刪除
  const handleDelete = async (record) => {
    console.log("[AdminsPage] handleDelete -> record", record);
    try {
      await adminsAPI.deleteAdmin(record.id);
      console.log("[AdminsPage] deleteAdmin OK");
      message.success("管理员删除成功");
      loadAdminsData(pagination.current, pagination.pageSize, filters);
    } catch (e) {
      console.log("[AdminsPage] deleteAdmin FAIL", e);
      message.error("删除管理员失败");
    }
  };

  // 搜尋
  const onSearch = async () => {
    const v = await searchForm.validateFields();
    const next = { uname: (v.uname || "").trim() };
    console.log("[AdminsPage] onSearch -> filters", next);
    setFilters(next);
    setPagination((p) => ({ ...p, current: 1 }));
    loadAdminsData(1, pagination.pageSize, next);
  };

  // 重置搜尋
  const onReset = () => {
    searchForm.resetFields();
    const next = { uname: "" };
    console.log("[AdminsPage] onReset -> filters", next);
    setFilters(next);
    setPagination((p) => ({ ...p, current: 1 }));
    loadAdminsData(1, pagination.pageSize, next);
  };

  console.log("[AdminsPage] render -> DataTable props", {
    rows: dataSource.length,
    loading: tableLoading,
    pagination,
    columnsCount: Array.isArray(columns) ? columns.length : "n/a",
    formFieldsCount: Array.isArray(formFields) ? formFields.length : "n/a",
    fetchById: typeof (adminsAPI?.getAdminById) === "function" ? "function" : typeof (adminsAPI?.getAdminById),
  });

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
        // 這是為了拉出編輯時的資料
        fetchById={adminsAPI.getAdminById}
      />
    </SystemLayout>
  );
}
