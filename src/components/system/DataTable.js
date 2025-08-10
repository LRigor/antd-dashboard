"use client";

import { useState, useEffect } from "react";
import { Table, Button, Space, Modal, Form, Input, Select, message, Popconfirm } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";

const { Option } = Select;

export default function DataTable({ 
  dataSource, 
  columns, 
  title, 
  formFields = [], 
  onAdd, 
  onEdit, 
  onDelete,
  loading = false,
  pagination = {},
  onChange
}) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [form] = Form.useForm();

  // Debug: Check for duplicate keys
  useEffect(() => {
    if (dataSource && dataSource.length > 0) {
      const keys = dataSource.map((record, index) => record.id || record.key || `row-${index}`);
      const uniqueKeys = new Set(keys);
      if (keys.length !== uniqueKeys.size) {
        console.warn('DataTable: Duplicate keys detected in dataSource:', keys);
        console.warn('DataSource:', dataSource);
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
      await onDelete(record);
      message.success('删除成功');
    } catch (error) {
      message.error('删除失败');
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingRecord) {
        await onEdit({ ...editingRecord, ...values });
        message.success('更新成功');
      } else {
        await onAdd(values);
        message.success('添加成功');
      }
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error('Form validation failed:', error);
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleTableChange = (paginationInfo, filters, sorter) => {
    if (onChange) {
      onChange(paginationInfo, filters, sorter);
    }
  };

  const actionColumn = {
    title: '操作',
    key: 'action',
    width: 150,
    render: (_, record) => (
      <Space size="middle">
        {formFields && formFields.length > 0 && (
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
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
          <Button type="link" danger icon={<DeleteOutlined />}>
            删除
          </Button>
        </Popconfirm>
      </Space>
    ),
  };

  const tableColumns = formFields && formFields.length > 0 ? [...columns, actionColumn] : columns;

  const renderFormField = (field) => {
    switch (field.type) {
      case 'input':
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
      case 'select':
        return (
          <Form.Item
            key={field.name}
            name={field.name}
            label={field.label}
            rules={field.rules || [{ required: true, message: `请选择${field.label}` }]}
          >
            <Select placeholder={`请选择${field.label}`}>
              {field.options?.map(option => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
        );
      case 'textarea':
        return (
          <Form.Item
            key={field.name}
            name={field.name}
            label={field.label}
            rules={field.rules || [{ required: true, message: `请输入${field.label}` }]}
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
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3>{title}</h3>
        {formFields && formFields.length > 0 && (
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            添加
          </Button>
        )}
      </div>
      
      <Table
        columns={tableColumns}
        dataSource={dataSource}
        rowKey={(record) => {
          // Ensure we always have a unique key
          if (record.uniqueKey !== undefined && record.uniqueKey !== null) {
            return record.uniqueKey;
          }
          if (record.id !== undefined && record.id !== null) {
            return `id-${record.id}`;
          }
          if (record.key !== undefined && record.key !== null) {
            return `key-${record.key}`;
          }
          // Generate a unique key based on record properties
          const recordStr = JSON.stringify(record);
          return `row-${recordStr.length}-${Date.now()}`;
        }}
        loading={loading}
        pagination={pagination}
        onChange={handleTableChange}
      />

      {formFields && formFields.length > 0 && (
        <Modal
          title={editingRecord ? '编辑' : '添加'}
          open={isModalVisible}
          onOk={handleModalOk}
          onCancel={handleModalCancel}
          width={600}
        >
          <Form
            form={form}
            layout="vertical"
          >
            {formFields.map((field, index) => (
              <div key={`${field.name}-${index}`}>
                {renderFormField(field)}
              </div>
            ))}
          </Form>
        </Modal>
      )}
    </div>
  );
} 