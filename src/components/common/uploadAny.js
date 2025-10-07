import React, { useEffect, useRef, useState } from 'react';
import { Upload, Button, message,App } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { filesAPI } from '@/api-fetch';

const joinUrl = (p, s) =>
  `${String(p).replace(/\/+$/, '')}/${String(s).replace(/^\/+/, '')}`;

export default function UploadAny({
  form,
  targetName = 'url',      // 把结果写回哪个字段
  groupField = 'group',     // 从哪个表单字段取 group（没有就用 'biz'）
  accept = '*/*',
  onUploaded,
}) {
  const [fileList, setFileList] = useState([]);
  const lastUrlRef = useRef('');
  const { message } = App.useApp();

  // 同步：如果 targetName 的值变化，显示为"已上传"清单（可选）
  useEffect(() => {
    const v = form?.getFieldValue?.(targetName);
    if (!v || v === lastUrlRef.current) return;
    lastUrlRef.current = v;
    const name = v.substring(v.lastIndexOf('/') + 1);
    setFileList([{ uid: '-1', name, status: 'done', url: v }]);
  }, [form, targetName]);

  return (
    <Upload
      showUploadList={false}        // 只要按钮，不显示列表
      accept={accept}
      customRequest={async ({ file, onSuccess, onError }) => {
        try {
          const gFromField = form?.getFieldValue?.(groupField);
          const gFromCN = form?.getFieldValue?.('分组');
          const group = gFromField || gFromCN || 'biz';

          const resp = await filesAPI.uploadFile(file, group);

          const { prefix, paths = [] } = resp || {};
          onSuccess && onSuccess({ prefix, paths }, file);

          if (!paths.length) {
            message.warning('上传成功，但未返回 paths');
            return;
          }

          const full = joinUrl(prefix, paths[0]);
          form?.setFieldsValue?.({ [targetName]: full, contentType: file?.type });
          onUploaded?.(full, file);

          message.success(`上传成功${paths.length > 1 ? `：共 ${paths.length} 个文件` : ''}`);
        } catch (e) {
          onError && onError(e);
          message.error('上传失败');
        }
      }}
    >
      <Button
        type="primary"
        icon={<UploadOutlined />}
      >
        选择文件
      </Button>
    </Upload>
  );
}
