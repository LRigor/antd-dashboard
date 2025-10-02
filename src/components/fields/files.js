import React from 'react';
import UploadAny from '@/components/common/uploadAny';
import { Form } from 'antd';

export function getFileFields({ mode } = { mode: 'edit' }) {
  const isAdd = mode === 'add';

  return [
    {
      name: 'url',
      label: '文件URL',
      type: 'input',
      rules: [{ required: true, message: '请输入文件URL' }],
    },
    {
      label: '上传',
      type: 'custom',
      render: (ctx) => {
        const FormItem = Form.Item; // ✅ 用 antd 的 Form.Item
    
        const withPrefix = (u) => {
          if (!u) return '';
          if (/^https?:\/\//i.test(u)) return u;
          const PREFIX = 'https://file.earnquest.id/'; 
          return `${PREFIX}${String(u).replace(/^\/+/, '')}`;
        };
    
        const PreviewBox = ({ url, ct }) => {
          if (!url) {
            return (
              <div style={{
                border: '1px dashed #d9d9d9', borderRadius: 8, height: 140, width: 260,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: '#fafafa', color: '#888'
              }}>暂无预览</div>
            );
          }
          const isImg   = /^image\//i.test(ct) || /\.(png|jpe?g|gif|webp|svg)$/i.test(url);
          const isPdf   = /pdf/i.test(ct) || /\.pdf$/i.test(url);
          const isVideo = /^video\//i.test(ct) || /\.(mp4|mov|webm|ogg)$/i.test(url);
    
          return (
            <div style={{
              border: '1px dashed #d9d9d9', borderRadius: 8, height: 140, width: 260,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              overflow: 'hidden', background: '#fafafa'
            }}>
              {isImg ? (
                <img src={url} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
              ) : isPdf ? (
                <iframe src={url} style={{ width: '100%', height: '100%', border: 0 }} />
              ) : isVideo ? (
                <video src={url} controls style={{ maxHeight: '100%' }} />
              ) : (
                <a href={url} target="_blank" rel="noopener noreferrer">打开预览</a>
              )}
            </div>
          );
        };
    
        return (
          <FormItem
            noStyle
            shouldUpdate={(prev, curr) =>
              prev.url !== curr.url || prev.contentType !== curr.contentType
            }
          >
            {() => {
              const raw = ctx.form?.getFieldValue('url');
              const ct  = ctx.form?.getFieldValue('contentType') || '';
              const url = withPrefix(raw);
    
              return (
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  {/* 左：上传按钮（保持 UploadAny 不变） */}
                  <UploadAny
                    form={ctx?.form}
                    targetName="url"
                    groupField="group"
                    accept="*/*"
                  />
                  {/* 右：预览盒 */}
                  <PreviewBox url={url} ct={ct} />
                </div>
              );
            }}
          </FormItem>
        );
      },
    },
    {
      name: 'contentType',
      label: '内容类型',
      type: 'select',
      hiddenOnAdd: true,
      options: [
        { value: 'image/jpeg', label: 'JPEG图片' },
        { value: 'image/png', label: 'PNG图片' },
        { value: 'image/gif', label: 'GIF图片' },
        { value: 'application/pdf', label: 'PDF文档' },
        { value: 'text/plain', label: '纯文本' },
        { value: 'application/json', label: 'JSON文件' },
        { value: 'application/zip', label: 'ZIP压缩包' },
        { value: 'audio/mpeg', label: 'MP3音频' },
        { value: 'audio/aac', label: 'AAC音频' },
        { value: 'audio/wav', label: 'WAV音频' },
        { value: 'audio/ogg', label: 'OGG音频' },
        { value: 'audio/flac', label: 'FLAC无损音频' },
        { value: 'audio/webm', label: 'WEBM音频' },
      ],
      rules: [{ required: true, message: '请选择内容类型' }],
    },
    {
      name: 'group',
      label: '分组',
      type: 'input',
      hiddenOnAdd: true,
      rules: [{ required: !isAdd, message: '请输入分组' }],
    },
    {
      name: 'status',
      label: '状态',
      type: 'select',
      hiddenOnAdd: true,
      options: [
        { value: 1, label: '正常' },
        { value: 0, label: '禁用' },
      ],
      rules: [{ required: !isAdd, message: '请选择状态' }],
    },
    {
      name: 'description',
      label: '描述',
      type: 'textarea',
      hiddenOnAdd: true,
      required: false,
      rules: [{ required: false, message: '请输入描述' }],
    },
  ];
}
