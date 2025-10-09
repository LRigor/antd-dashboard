"use client";

import { useState, useEffect } from "react";
import { Table, Button, Space, Modal, Form, Input, Select, Popconfirm, App } from "antd";

const { Option } = Select;

// ---- options 標準化 ----
function normalizeOptions(src) {
  if (!src) return [];
  if (Array.isArray(src)) return src;
  if (typeof src === "object") {
    return Object.entries(src).map(([value, label]) => ({ value, label }));
  }
  return [];
}

export default function DataTable(props) {
  const {
    dataSource,
    columns,
    title,
    formFields = [],
    onAdd,
    onEdit,
    onDelete,
    loading = false,
    pagination = {},
    onChange,
    rowKey,
    enableAdd = true,
    enableEdit = true,
  } = props;

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [form] = Form.useForm();                  // ✅ 唯一的 form 實例
  const { message } = App.useApp();

  const mode = editingRecord ? "edit" : "add";

  const fieldsInput = typeof formFields === "function" ? formFields(mode) : formFields;
  const fields = Array.isArray(fieldsInput) ? fieldsInput : [];

  useEffect(() => {
    if (dataSource && dataSource.length > 0) {
      const keys = dataSource.map((record, index) => record.id || record.key || `row-${index}`);
      const unique = new Set(keys);
      if (keys.length !== unique.size) {
        console.warn("DataTable: Duplicate keys detected in dataSource:", keys);
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
    } catch {
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
    } catch {
      // 校驗失敗不提示
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
          <Button type="link" onClick={() => handleEdit(record)}>
            编辑
          </Button>
        )}
        <Popconfirm
          title="确定要删除这条记录吗？"
          onConfirm={() => handleDelete(record)}
          okText="确定"
          cancelText="取消"
        >
          <Button type="link" danger>
            删除
          </Button>
        </Popconfirm>
      </Space>
    ),
  };

  const tableColumns = fields.length > 0 ? [...columns, actionColumn] : columns;

  // ---- 渲染欄位 ----
  const renderFormField = (field, index) => {
    const requiredProp = typeof field.required === "boolean" ? { required: field.required } : {};

    if (mode === "add" && field.hiddenOnAdd) return null;
    if (mode === "edit" && field.hiddenOnEdit) return null;
    if (Array.isArray(field.showOn) && !field.showOn.includes(mode)) return null;

    // custom 渲染
    if (typeof field.render === "function") {
      const ctx = { 
        form, 
        record: editingRecord, 
        mode,
        value: editingRecord?.[field.name], // 添加当前字段的值
        onChange: (val) => form.setFieldValue(field.name, val) // 添加 onChange 函数
      };
      const node = field.render(ctx);
      if (!field.name) {
        return (
          <Form.Item key={field.key || field.label || `custom-${index}`} label={field.label} colon={false}>
            {node}
          </Form.Item>
        );
      }
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
      case "input": {
        const it = field.inputType;
        let Node = <Input placeholder={`请输入${field.label}`} />;
        if (it === "password") {
          Node = <Input.Password placeholder={`请输入${field.label}`} />;
        } else if (it === "number") {
          Node = <Input type="number" placeholder={`请输入${field.label}`} />;
          // 或者用 <InputNumber />，看你後端需求
        }
        return (
          <Form.Item
            key={field.name}
            name={field.name}
            label={field.label}
            rules={field.rules || [{ required: true, message: `请输入${field.label}` }]}
            {...(typeof field.required === "boolean" ? { required: field.required } : {})}
          >
            {Node}
          </Form.Item>
        );
      }
      
      case "select": {
        const raw = typeof field.options === "function"
          ? field.options({ mode, record: editingRecord, form })
          : field.options;
        const opts = normalizeOptions(raw);

        return (
          <Form.Item
            key={field.name}
            name={field.name}
            label={field.label}
            rules={field.rules || [{ required: true, message: `请选择${field.label}` }]}
            {...requiredProp}
          >
            <Select placeholder={`请选择${field.label}`} allowClear getPopupContainer={(t) => t.parentNode}>
              {opts.map((opt) => (
                <Option key={opt.value} value={opt.value}>
                  {opt.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
        );
      }

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
          <Button type="primary" onClick={handleAdd}>
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
          destroyOnHidden
          width={600}
        >
          {/* ✅ 同一個 form 實例綁在這裡 */}
          <Form form={form} layout="vertical">
            {fields.map((field, index) => {
              const node = renderFormField(field, index);
              return node ? <div key={`${field.name || field.label || "custom"}-${index}`}>{node}</div> : null;
            })}
          </Form>
        </Modal>
      )}
    </div>
  );
}
