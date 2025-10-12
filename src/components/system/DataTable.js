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
    notify = true, //是否由DataTable來發布錯誤訊息
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
    // ✅ 新增：可選，按 id 拉詳情用的函式 (id) => Promise<{ code, data }>
    fetchById,
  } = props;

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [form] = Form.useForm();
  const { message } = App.useApp();

  const mode = editingRecord ? "edit" : "add";
  const fieldsInput = typeof formFields === "function" ? formFields(mode) : formFields;
  const fields = Array.isArray(fieldsInput) ? fieldsInput : [];

  // ---- 初始/props 變更觀測 ----
  useEffect(() => {
    // Mount effect
  }, []); // mount

  useEffect(() => {
    // Props change effect
  }, [dataSource, loading, pagination]);

  useEffect(() => {
    if (dataSource && dataSource.length > 0) {
      const keys = dataSource.map((record, index) => record.id || record.key || `row-${index}`);
      const unique = new Set(keys);
      if (keys.length !== unique.size) {
        // Duplicate keys detected
      }
    }
  }, [dataSource]);

  useEffect(() => {
    // Modal state effect
  }, [isModalVisible, mode, editingRecord]);

  const handleAdd = () => {
    setEditingRecord(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  // 🔧 從 record/詳情推導 namespace（字串，方便 Select.value 對上）
  const deriveNamespace = (src) => {
    if (!src) return undefined;
    if (src.namespace != null) return String(src.namespace);
    const nsList = Array.isArray(src.namespaces) ? src.namespaces : [];
    const def = nsList.find((x) => Number(x?.isDefault) === 1) || nsList[0];
    return def?.namespace != null ? String(def.namespace) : undefined;
  };

  const handleEdit = async (record) => {
    setEditingRecord(record);
    form.setFieldsValue({
      ...record,
      namespaces: Array.isArray(record.namespaces)
        ? record.namespaces.map((n) => String(typeof n === 'object' ? n.namespace : n))
        : record.namespace != null ? [String(record.namespace)] : [],
    });
    setIsModalVisible(true);

    // 若當列缺命名空間，且外部提供了 fetchById，則兜底補打一支詳情
    const hasNs =
      record?.namespace != null ||
      (Array.isArray(record?.namespaces) && record.namespaces.length > 0);

    if (!hasNs && typeof fetchById === "function" && record?.id != null) {
      try {
        const res = await fetchById(record.id);
        const detail = res?.data;

        const ns = deriveNamespace(detail);
        const merged = { ...record, ...detail, ...(ns != null ? { namespace: ns } : {}) };

        form.setFieldsValue(merged);
        setEditingRecord(merged); // 同步內部狀態，提交時帶到
      } catch (e) {
        // fetchById error
      }
    }
  };

  const handleDelete = async (record) => {
    try {
      await onDelete?.(record);
      if (notify) message.success("删除成功");
    } catch (e) {
      if (notify) message.error("删除失败");
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingRecord) {
        const payload = { ...editingRecord, ...values };
        await onEdit?.(payload);
        if (notify) message.success("更新成功");
      } else {
        await onAdd?.(values);
        if (notify) message.success("添加成功");
      }
      setIsModalVisible(false);
      form.resetFields();
    } catch (e) {
      // Modal validation failed or handler threw
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
          <Button
            type="link"
            onClick={() => {
              handleEdit(record);
            }}
          >
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
        value: editingRecord?.[field.name],
        onChange: (val) => {
          // 使用 setTimeout 避免循环引用
          setTimeout(() => {
            form.setFieldValue(field.name, val);
          }, 0);
        },
      };
      // Render custom field
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
        }
        // Render input field
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
        const raw =
          typeof field.options === "function"
            ? field.options({ mode, record: editingRecord, form })
            : field.options;
        const opts = normalizeOptions(raw);
        // Render select field

        return (
          <Form.Item
            key={field.name}
            name={field.name}
            label={field.label}
            rules={field.rules || [{ required: true, message: `请选择${field.label}` }]}
            {...requiredProp}
          >
            <Select
              placeholder={`请选择${field.label}`}
              allowClear
              getPopupContainer={(t) => t.parentNode}
              onChange={(v) => {}}
            >
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
        // Render textarea field
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
        // Render default field
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
        columns={fields.length > 0 ? [...columns, actionColumn] : columns}
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
