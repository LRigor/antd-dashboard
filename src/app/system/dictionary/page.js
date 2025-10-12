"use client";

import { useState, useEffect } from "react";
import { Form, Input, DatePicker, Button, Space, App } from "antd";
import dayjs from "dayjs";
import SystemLayout from "@/components/system";
import DataTable from "@/components/system/DataTable";
import { columns } from "@/components/columns/dictionary";
import { fields as formFields } from "@/components/fields/dictionary";
import { dictionariesAPI } from "@/api-fetch";

const { RangePicker } = DatePicker;

export default function DictionaryPage() {
  const [searchForm] = Form.useForm(); 
  const [dataSource, setDataSource] = useState([]);
  const [tableLoading, setTableLoading] = useState(false);
  const { message } = App.useApp();

  // ✅ 搜尋條件集中管理
  const [filters, setFilters] = useState({
    k: "",
    group: "",
    type: "",
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

  useEffect(() => {
    loadDictionariesData(1, pagination.pageSize, filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 封裝請求：分頁 + 篩選
  const loadDictionariesData = async (page = 1, size = 10, cond = filters) => {
    setTableLoading(true);
    try {
      const result = await dictionariesAPI.getDictionariesList({
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
      message.error("加载字典列表失败");
    } finally {
      setTableLoading(false);
    }
  };

  // 翻頁/換 pageSize：保留目前 filters
  const handleTableChange = (paginationInfo) => {
    const { current, pageSize } = paginationInfo;
    const nextPage = pageSize !== pagination.pageSize ? 1 : current;
    setPagination((prev) => ({ ...prev, pageSize, current: nextPage }));
    loadDictionariesData(nextPage, pageSize, filters);
  };

  const handleAdd = async (values) => {
    try {
      await dictionariesAPI.createDictionary(values);
      message.success("字典添加成功");
      loadDictionariesData(pagination.current, pagination.pageSize, filters);
    } catch (error) {
      message.error("添加字典失败");
    }
  };

  const handleEdit = async (values) => {
    try {
      await dictionariesAPI.updateDictionary(values);
      message.success("字典更新成功");
      loadDictionariesData(pagination.current, pagination.pageSize, filters);
    } catch (error) {
      message.error("更新字典失败");
    }
  };

  const handleDelete = async (record) => {
    try {
      await dictionariesAPI.deleteDictionary(record.id);
      message.success("字典删除成功");
      loadDictionariesData(pagination.current, pagination.pageSize, filters);
    } catch (error) {
      message.error("删除字典失败");
    }
  };

  // 🔍 搜尋
  const onSearch = async () => {
    const v = await searchForm.validateFields();
    const [start, end] = v.createdAt || [];
    const next = {
      k: v.k?.trim() || "",
      group: v.group?.trim() || "",
      type: v.type?.trim() || "",
      q: v.q?.trim() || "",
      startAt: start ? dayjs(start).format("YYYY-MM-DD HH:mm:ss") : "",
      endAt: end ? dayjs(end).format("YYYY-MM-DD HH:mm:ss") : "",
    };
    setFilters(next);
    setPagination((p) => ({ ...p, current: 1 }));
    loadDictionariesData(1, pagination.pageSize, next);
  };

  // ♻️ 重置
  const onReset = () => {
    searchForm.resetFields();
    const next = { k: "", group: "", type: "", q: "", startAt: "", endAt: "" };
    setFilters(next);
    setPagination((p) => ({ ...p, current: 1 }));
    loadDictionariesData(1, pagination.pageSize, next);
  };

  return (
    <SystemLayout title="词典管理" subtitle="Dictionary Management">
      {/* 搜尋區 */}
      <div style={{ marginBottom: 12 }}>
        <Form
          layout="inline"
          form={searchForm}
          onFinish={onSearch}
          style={{ rowGap: 12 }}
        >
          <Form.Item label="鍵名(k)" name="k">
            <Input placeholder="k" allowClear style={{ width: 180 }} />
          </Form.Item>
          <Form.Item label="分组(group)" name="group">
            <Input placeholder="group" allowClear style={{ width: 160 }} />
          </Form.Item>
          <Form.Item label="类型(type)" name="type">
            <Input placeholder="type" allowClear style={{ width: 160 }} />
          </Form.Item>
          <Form.Item label="關鍵字" name="q">
            <Input
              placeholder="搜尋描述/值等"
              allowClear
              style={{ width: 220 }}
            />
          </Form.Item>
          <Form.Item label="时间范围" name="createdAt">
            <RangePicker showTime allowClear />
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

      {/* 列表 */}
      <DataTable
        dataSource={dataSource}
        columns={columns}
        title="词典列表"
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
