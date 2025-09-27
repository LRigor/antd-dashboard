import React from 'react';
import UploadAny from '@/components/common/uploadAny';


export const fields = [
  {
    name: "url",
    label: "文件URL",
    type: "input",
    rules: [
      { required: true, message: "请输入文件URL" },
    ],
  },
  {
    label: '上传',
    type: 'custom',
    render: (ctx) => (
      <UploadAny
        form={ctx?.form}
        targetName="url"
        groupField="group"
        accept="*/*"
      />
    ),
  },
  
  {
    name: "contentType",
    label: "内容类型",
    type: "select",
    options: [
      { value: "image/jpeg", label: "JPEG图片" },
      { value: "image/png", label: "PNG图片" },
      { value: "image/gif", label: "GIF图片" },
      { value: "application/pdf", label: "PDF文档" },
      { value: "text/plain", label: "纯文本" },
      { value: "application/json", label: "JSON文件" },
      { value: "application/zip", label: "ZIP压缩包" },
    ],
    rules: [
      { required: true, message: "请选择内容类型" },
    ],
  },
  {
    name: "group",
    label: "分组",
    type: "input",
    rules: [
      { required: true, message: "请输入分组" },
    ],
  },
  {
    name: "namespace",
    label: "命名空间",
    type: "input",
    rules: [
      { required: true, message: "请输入命名空间" },
    ],
  },
  {
    name: "status",
    label: "状态",
    type: "select",
    options: [
      { value: 1, label: "正常" },
      { value: 0, label: "禁用" },
    ],
    rules: [
      { required: true, message: "请选择状态" },
    ],
  },
  {
    name: "description",
    label: "描述",
    type: "textarea",
  },
]; 