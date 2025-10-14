"use client";

import { useEffect } from "react";
import { Form, Input, DatePicker } from "antd";
import dayjs from "dayjs";
import SystemLayout from "@/components/system";
import DataTable from "@/components/system/DataTable";
import { columns } from "@/components/columns/dictionary";
import { fields as formFields } from "@/components/fields/dictionary";
import { dictionariesAPI } from "@/api-fetch";
import { useSystemPage } from "@/hooks/useSystemPage";
import { SearchForm } from "@/components/common/SearchForm";

const { RangePicker } = DatePicker;

export default function DictionaryPage() {
  const [searchForm] = Form.useForm();

  // 創建適配器讓字典 API 與通用 Hook 兼容
  const dictionariesAPIAdapter = {
    getList: dictionariesAPI.getDictionariesList,
    create: dictionariesAPI.createDictionary,
    update: dictionariesAPI.updateDictionary,
    delete: dictionariesAPI.deleteDictionary,
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
  } = useSystemPage(dictionariesAPIAdapter, {
    initialFilters: {
      k: "",
      group: "",
      type: "",
      q: "",
      startAt: "",
      endAt: "",
    },
  });

  useEffect(() => {
    loadData(1, pagination.pageSize, filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 搜尋欄位配置
  const searchFields = [
    {
      name: "k",
      label: "鍵名(k)",
      component: <Input placeholder="k" allowClear style={{ width: 180 }} />,
    },
    {
      name: "group",
      label: "分组(group)",
      component: <Input placeholder="group" allowClear style={{ width: 160 }} />,
    },
    {
      name: "type",
      label: "类型(type)",
      component: <Input placeholder="type" allowClear style={{ width: 160 }} />,
    },
    {
      name: "q",
      label: "關鍵字",
      component: (
        <Input
          placeholder="搜尋描述/值等"
          allowClear
          style={{ width: 220 }}
        />
      ),
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
      k: values.k?.trim() || "",
      group: values.group?.trim() || "",
      type: values.type?.trim() || "",
      q: values.q?.trim() || "",
      startAt: start ? dayjs(start).format("YYYY-MM-DD HH:mm:ss") : "",
      endAt: end ? dayjs(end).format("YYYY-MM-DD HH:mm:ss") : "",
    };
  };

  // 搜尋和重置處理
  const onSearch = handleSearch(searchForm, processSearchValues);
  const onReset = handleReset(searchForm, {
    k: "",
    group: "",
    type: "",
    q: "",
    startAt: "",
    endAt: "",
  });

  return (
    <SystemLayout title="词典管理" subtitle="Dictionary Management">
      <SearchForm
        fields={searchFields}
        onSearch={onSearch}
        onReset={onReset}
        form={searchForm}
      />

      <DataTable
        dataSource={dataSource}
        columns={columns}
        title="词典列表"
        formFields={formFields}
        onAdd={createHandler}
        onEdit={updateHandler}
        onDelete={deleteHandler}
        loading={tableLoading}
        pagination={pagination}
        onChange={handleTableChange}
      />
    </SystemLayout>
  );
}
