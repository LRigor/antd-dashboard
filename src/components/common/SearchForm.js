"use client";

import { Form, Button, Space } from "antd";

/**
 * 通用搜尋表單組件
 * 封裝了系統頁面的搜尋表單邏輯
 * 
 * @param {Array} fields - 搜尋欄位配置陣列
 * @param {Function} onSearch - 搜尋回調函數
 * @param {Function} onReset - 重置回調函數
 * @param {Object} form - Antd Form 實例
 * @param {Object} props - 其他 Form 屬性
 */
export function SearchForm({ 
  fields = [], 
  onSearch, 
  onReset, 
  form, 
  ...props 
}) {
  return (
    <div style={{ marginBottom: 12 }}>
      <Form
        layout="inline"
        form={form}
        onFinish={onSearch}
        style={{ rowGap: 12 }}
        {...props}
      >
        {fields.map(field => (
          <Form.Item 
            key={field.name} 
            label={field.label} 
            name={field.name}
            {...field.formItemProps}
          >
            {field.component}
          </Form.Item>
        ))}
        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit">
              搜尋
            </Button>
            <Button onClick={onReset}>
              重置
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
}
