import React, { useEffect, useRef, useState } from 'react';
import { Upload, Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { filesAPI } from '@/api-fetch';

const joinUrl = (p, s) =>
  `${String(p).replace(/\/+$/, '')}/${String(s).replace(/^\/+/, '')}`;

export default function UploadAny({
  form,
  targetName = 'url',      // 把结果写回哪个字段
  groupField = 'group',     // 从哪个表单字段取 group（没有就用 'biz'）
  accept = '*/*',
}) {
  const [fileList, setFileList] = useState([]);
  const lastUrlRef = useRef('');

  // 首次掛載與 props 快照
  useEffect(() => {
    console.log('[UploadAny] mount props ->', { hasForm: !!form, targetName, groupField, accept });
  }, []);

  // 同步：如果 targetName 的值变化，显示为“已上传”清单（可选）
  useEffect(() => {
    const v = form?.getFieldValue?.(targetName);
    console.log('[UploadAny] effect:target change -> value:', v, ' lastUrlRef:', lastUrlRef.current);
    if (!v || v === lastUrlRef.current) return;
    lastUrlRef.current = v;
    const name = v.substring(v.lastIndexOf('/') + 1);
    setFileList([{ uid: '-1', name, status: 'done', url: v }]);
  }, [form, targetName]);

  return (
    <Upload
      multiple
      showUploadList={false}        // 只要按钮，不显示列表
      accept={accept}
      onChange={(info) => {
        // 僅紀錄，不改邏輯
        console.log('[UploadAny] onChange -> file.status:', info.file?.status, 'file.name:', info.file?.name, 'file:', info.file, 'fileList.len:', info.fileList?.length);
      }}
      customRequest={async ({ file, onSuccess, onError }) => {
        console.log('[UploadAny] customRequest:start -> file:', file);

        try {
          const gFromField = form?.getFieldValue?.(groupField);
          const gFromCN = form?.getFieldValue?.('分组');
          const group = gFromField || gFromCN || 'biz';
          console.log('[UploadAny] customRequest:resolved group ->', { gFromField, gFromCN, group });

          // 發 API 前紀錄
          console.log('[UploadAny] api:uploadFile -> calling with', { name: file?.name, size: file?.size, type: file?.type, group });

          // ✅ 新簽名：uploadFile(file, group)
          const resp = await filesAPI.uploadFile(file, group);
          console.log('[UploadAny] api:uploadFile <- response', resp);

          const { prefix, paths = [] } = resp || {};
          onSuccess && onSuccess({ prefix, paths }, file);
          console.log('[UploadAny] onSuccess called with ->', { prefix, paths });

          if (!paths.length) {
            console.warn('[UploadAny] warning: paths is empty');
            message.warning('上传成功，但未返回 paths');
            return;
          }

          const full = joinUrl(prefix, paths[0]);
          console.log('[UploadAny] setFieldsValue ->', { [targetName]: full });
          form?.setFieldsValue?.({ [targetName]: full });

          message.success(`上传成功${paths.length > 1 ? `：共 ${paths.length} 个文件` : ''}`);
        } catch (e) {
          console.error('[UploadAny] customRequest:error ->', e);
          onError && onError(e);
          message.error('上传失败');
        }
      }}
    >
      <Button
        type="primary"
        icon={<UploadOutlined />}
        onClick={() => console.log('[UploadAny] button click')}
      >
        选择文件
      </Button>
    </Upload>
  );
}
