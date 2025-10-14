"use client";

import { useEffect } from "react";
import { Form, Input, App } from "antd";
import SystemLayout from "@/components/system";
import DataTable from "@/components/system/DataTable";
import { columns } from "@/components/columns/admins";
import { fields as formFields } from "@/components/fields/admins";
import { adminsAPI } from "@/api-fetch";
import { useUser } from "@/components/header/useUser";
import { useSystemPage } from "@/hooks/useSystemPage";
import { SearchForm } from "@/components/common/SearchForm";


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
  const [searchForm] = Form.useForm();
  const { message } = App.useApp();

  // 創建適配器讓管理員 API 與通用 Hook 兼容
  const adminsAPIAdapter = {
    getList: async (params) => {
      const res = await adminsAPI.getAdminsList(params);
      const list =
        res?.data?.list ?? res?.list ?? (Array.isArray(res?.data) ? res.data : []);
      const total = res?.data?.total ?? res?.total ?? list.length;
      return { list, total };
    },
    create: adminsAPI.createAdmin,
    update: adminsAPI.updateAdmin,
    delete: adminsAPI.deleteAdmin,
  };

  // 使用通用系統頁面 Hook
  const {
    dataSource,
    tableLoading,
    filters,
    pagination,
    loadData,
    createHandler,
    updateHandler,
    deleteHandler,
    handleTableChange,
    handleSearch,
    handleReset,
  } = useSystemPage(adminsAPIAdapter, {
    initialFilters: { uname: "" },
    transformData: (data) => {
      console.log("[AdminsPage] transformData <-", data);
      const rows =
        Array.isArray(data) ? data
        : Array.isArray(data?.list) ? data.list
        : Array.isArray(data?.List) ? data.List
        : Array.isArray(data?.data?.list) ? data.data.list
        : Array.isArray(data?.data) ? data.data
        : [];
    
      return rows.map(normalizeAdminRow);
    },
  });

  // 首次載入
  useEffect(() => {
    console.log("[AdminsPage] mount -> initial load");
    loadData(1, pagination.pageSize, filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 搜尋欄位配置
  const searchFields = [
    {
      name: "uname",
      label: "用户名",
      component: (
        <Input
          placeholder="uname"
          allowClear
          style={{ width: 200 }}
          data-field="search-uname"
        />
      ),
    },
  ];

  // 搜尋值處理
  const processSearchValues = (values) => ({
    uname: (values.uname || "").trim(),
  });

  // 新增（包含特殊邏輯）
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

    await createHandler(payload, "管理员添加成功", "添加管理员失败");
  };

  // 編輯（包含特殊邏輯）
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

    await updateHandler(payload, '管理员更新成功', '更新管理员失败');
  };

  // 搜尋和重置處理
  const onSearch = handleSearch(searchForm, processSearchValues);
  const onReset = handleReset(searchForm, { uname: "" });

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
      <SearchForm
        fields={searchFields}
        onSearch={onSearch}
        onReset={onReset}
        form={searchForm}
        data-form="search"
      />

      <DataTable
        dataSource={dataSource}
        columns={columns}
        title="管理员列表"
        formFields={formFields}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={deleteHandler}
        loading={tableLoading}
        pagination={pagination}
        onChange={handleTableChange}
        // 這是為了拉出編輯時的資料
        fetchById={adminsAPI.getAdminById}
      />
    </SystemLayout>
  );
}
