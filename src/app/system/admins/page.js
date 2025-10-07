"use client";

import { useState, useEffect } from "react";
import { Form, Input, Button, Space, message } from "antd";
import SystemLayout from "@/components/system";
import DataTable from "@/components/system/DataTable";
import { columns } from "@/components/columns/admins";
import { fields as formFields } from "@/components/fields/admins";
import { adminsAPI } from "@/api-fetch";

export default function AdminsPage() {
  const [form] = Form.useForm();
  const [dataSource, setDataSource] = useState([]);
  const [tableLoading, setTableLoading] = useState(false);

  // ✅ 只要 uname
  const [filters, setFilters] = useState({ uname: "" });

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
    loadAdminsData(1, pagination.pageSize, filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadAdminsData = async (page = 1, size = 10, cond = filters) => {
    setTableLoading(true);
    try {
      const result = await adminsAPI.getAdminsList({ page, size, ...cond });
      const data = result?.data || result;
      setDataSource(Array.isArray(data?.list) ? data.list : []);
      setPagination((prev) => ({
        ...prev,
        current: page,
        pageSize: size,
        total: Number(data?.total) || 0,
      }));
    } catch (error) {
      console.error("Error loading admins:", error);
      message.error("加载管理员列表失败");
    } finally {
      setTableLoading(false);
    }
  };

  // 換頁保留 uname 條件
  const handleTableChange = (paginationInfo) => {
    const { current, pageSize } = paginationInfo;
    const nextPage = pageSize !== pagination.pageSize ? 1 : current;
    setPagination((prev) => ({ ...prev, pageSize, current: nextPage }));
    loadAdminsData(nextPage, pageSize, filters);
  };

  const handleAdd = async (values) => {
    try {
      await adminsAPI.createAdmin(values);
      message.success("管理员添加成功");
      loadAdminsData(pagination.current, pagination.pageSize, filters);
    } catch (error) {
      console.error("Error adding admin:", error);
      message.error("添加管理员失败");
    }
  };

  const handleEdit = async (values) => {
    try {
      await adminsAPI.updateAdmin(values);
      message.success("管理员更新成功");
      loadAdminsData(pagination.current, pagination.pageSize, filters);
    } catch (error) {
      console.error("Error updating admin:", error);
      message.error("更新管理员失败");
    }
  };

  const handleDelete = async (record) => {
    try {
      await adminsAPI.deleteAdmin(record.id);
      message.success("管理员删除成功");
      loadAdminsData(pagination.current, pagination.pageSize, filters);
    } catch (error) {
      console.error("Error deleting admin:", error);
      message.error("删除管理员失败");
    }
  };

  // 🔍 搜尋（只有 uname）
  const onSearch = async () => {
    const v = await form.validateFields();
    const next = { uname: v.uname?.trim() || "" };
    setFilters(next);
    setPagination((p) => ({ ...p, current: 1 }));
    loadAdminsData(1, pagination.pageSize, next);
  };

  const onReset = () => {
    form.resetFields();
    const next = { uname: "" };
    setFilters(next);
    setPagination((p) => ({ ...p, current: 1 }));
    loadAdminsData(1, pagination.pageSize, next);
  };

  return (
    <SystemLayout title="管理员管理" subtitle="Admin Management">
      {/* 搜尋欄位：uname */}
      <div style={{ marginBottom: 12 }}>
        <Form layout="inline" form={form} onFinish={onSearch} style={{ rowGap: 12 }}>
          <Form.Item label="用户名" name="uname">
            <Input placeholder="uname" allowClear style={{ width: 200 }} />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">搜尋</Button>
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
