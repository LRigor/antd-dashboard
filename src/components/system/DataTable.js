"use client";

import { useState, useEffect } from "react";
import { Table, Button, Space, Modal, Form, Input, Select, message, Popconfirm, App } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";

const { Option } = Select;

export default function DataTable({
  dataSource,
  columns,
  title,
  // formFields: [] 或 (mode) => []
  formFields = [],
  onAdd,
  onEdit,
  onDelete,
  loading = false,
  pagination = {},
  onChange,
  rowKey,
  // 只控制「按鈕」是否顯示；不影響欄位顯示
  enableAdd = true,
  enableEdit = true,
}) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [form] = Form.useForm();
  const { message } = App.useApp();
  // ---- mode: 供欄位條件顯示使用 ----
  const mode = editingRecord ? "edit" : "add";

  // ---- 讓 formFields 同時支援陣列或函式 ----
  const fieldsInput =
    typeof formFields === "function" ? formFields(mode) : formFields;
  const fields = Array.isArray(fieldsInput) ? fieldsInput : [];

  useEffect(() => {
    if (dataSource && dataSource.length > 0) {
      const keys = dataSource.map((record, index) => record.id || record.key || `row-${index}`);
      const uniqueKeys = new Set(keys);
      if (keys.length !== uniqueKeys.size) {
        console.warn("DataTable: Duplicate keys detected in dataSource:", keys);
        console.warn("DataSource:", dataSource);
      }
    }
  }, [dataSource]);

  const handleAdd = () => {
    setEditingRecord(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingRecord(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleDelete = async (record) => {
    try {
      await onDelete?.(record);
      message.success("删除成功");
    } catch (error) {
      message.error("删除失败");
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingRecord) {
        await onEdit?.({ ...editingRecord, ...values });
        message.success("更新成功");
      } else {
        await onAdd?.(values);
        message.success("添加成功");
      }
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      // 校驗失敗就不提示
      console.error("Form validation failed:", error);
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleTableChange = (paginationInfo, filters, sorter) => {
    onChange?.(paginationInfo, filters, sorter);
  };

  const actionColumn = {
    title: "操作",
    key: "action",
    width: 150,
    render: (_, record) => (
      <Space size="middle">
        {enableEdit && fields.length > 0 && (
          <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            编辑
          </Button>
        )}
        <Popconfirm
          title="确定要删除这条记录吗？"
          onConfirm={() => handleDelete(record)}
          okText="确定"
          cancelText="取消"
        >
          <Button type="link" danger icon={<DeleteOutlined />}>
            删除
          </Button>
        </Popconfirm>
      </Space>
    ),
  };

  const tableColumns = fields.length > 0 ? [...columns, actionColumn] : columns;

  // ---- 渲染單一欄位（支援 type:'custom' + render(ctx)）----
  const renderFormField = (field, index) => {
    const requiredProp = typeof field.required === 'boolean' ? { required: field.required } : {};

    // 先依據模式過濾可見性
    if (mode === "add" && field.hiddenOnAdd) return null;
    if (mode === "edit" && field.hiddenOnEdit) return null;
    if (Array.isArray(field.showOn) && !field.showOn.includes(mode)) return null;

    // 自定義渲染
    if (typeof field.render === "function") {
      const ctx = { form, record: editingRecord, mode };
      const node = field.render(ctx);

      // 沒有 name：當作純展示節點（例如上傳按鈕）
      if (!field.name) {
        return (
          <Form.Item
            key={field.key || field.label || `custom-${index}`}
            label={field.label}
            colon={false}
          >
            {node}
          </Form.Item>
        );
      }
      // 有 name：受控欄位
      return (
        <Form.Item
          key={field.name}
          name={field.name}
          label={field.label}
          rules={field.rules || [{ required: true, message: `请输入${field.label}` }]}
          {...requiredProp}
        >
          {node}
        </Form.Item>
      );
    }

    // 內建型別
    switch (field.type) {
      case "input":
        return (
          <Form.Item
            key={field.name}
            name={field.name}
            label={field.label}
            rules={field.rules || [{ required: true, message: `请输入${field.label}` }]}
            {...requiredProp}
          >
            <Input placeholder={`请输入${field.label}`} />
          </Form.Item>
        );
      case "select":
        return (
          <Form.Item
            key={field.name}
            name={field.name}
            label={field.label}
            rules={field.rules || [{ required: true, message: `请选择${field.label}` }]}
            {...requiredProp}
          >
            <Select placeholder={`请选择${field.label}`}>
              {field.options?.map((opt) => (
                <Option key={opt.value} value={opt.value}>
                  {opt.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
        );
      case "textarea":
        return (
          <Form.Item
            key={field.name}
            name={field.name}
            label={field.label}
            rules={field.rules || [{ required: true, message: `请输入${field.label}` }]}
            {...requiredProp}
          >
            <Input.TextArea rows={4} placeholder={`请输入${field.label}`} />
          </Form.Item>
        );
      default:
        return (
          <Form.Item
            key={field.name}
            name={field.name}
            label={field.label}
            rules={field.rules || [{ required: true, message: `请输入${field.label}` }]}
          >
            <Input placeholder={`请输入${field.label}`} />
          </Form.Item>
        );
    }
  };

  return (
    <div>
      <div style={{ marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h3>{title}</h3>
        {enableAdd && fields.length > 0 && (
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            添加
          </Button>
        )}
      </div>

      

      <Table
        columns={tableColumns}
        dataSource={dataSource}
        rowKey={rowKey || ((record) => record.id || record.key)}
        loading={loading}
        pagination={pagination}
        onChange={handleTableChange}
      />

      {fields.length > 0 && (
        <Modal
          title={editingRecord ? "编辑" : "添加"}
          open={isModalVisible}
          onOk={handleModalOk}
          onCancel={handleModalCancel}
          width={600}
        >
          <Form form={form} layout="vertical">
            {fields.map((field, index) => {
              const node = renderFormField(field, index);
              return node ? (
                <div key={`${field.name || field.label || "custom"}-${index}`}>{node}</div>
              ) : null;
            })}
          </Form>
        </Modal>
      )}
    </div>
  );
}
