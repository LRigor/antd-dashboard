'use client';

import { Tag, Button, Space, Modal, message,App } from "antd";
import {
  EyeOutlined, DownloadOutlined,
  FileOutlined, FileImageOutlined, FilePdfOutlined, FileZipOutlined
} from "@ant-design/icons";
import React, { useState } from 'react';
const { message } = App.useApp();

/** ---------- URL 补全：非 http(s) 统一补成固定前缀 ---------- */
const STATIC_PREFIX = 'https://file.earnquest.id/';
function ensureHttp(u) {
  if (!u) return '';
  if (/^https?:\/\//i.test(u)) return u;
  return `${STATIC_PREFIX.replace(/\/+$/, '')}/${String(u).replace(/^\/+/, '')}`;
}

/** ---------- 从记录中挑 URL ---------- */
function pickUrl(record) {
  return record?.url || record?.path || record?.fileUrl || record?.name || '';
}

/** ---------- 小型预览组件（根据类型渲染） ---------- */
// 预览内容：带 onError 回退、no-referrer、防盗链更友好
function PreviewContent({ url, contentType }) {
  const [fallback, setFallback] = useState(false);
  const ct = (contentType || '').toLowerCase();
  const h = '80vh';

  const isImg = () =>
    ct.startsWith('image/') ||
    /\.(png|jpe?g|gif|webp|svg|bmp|ico)(\?.*)?$/i.test(url);

  const isVideo = () =>
    ct.startsWith('video/') ||
    /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(url);

  const isAudio = () =>
    ct.startsWith('audio/') ||
    /\.(mp3|wav|ogg|m4a)(\?.*)?$/i.test(url);

  const isPdf = () =>
    ct === 'application/pdf' || /\.pdf(\?.*)?$/i.test(url);

  if (!fallback) {
    if (isImg()) {
      return (
        <img
          src={url}
          alt=""
          referrerPolicy="no-referrer"
          style={{ maxWidth: '100%', maxHeight: h, display: 'block' }}
          onError={() => setFallback(true)}
          loading="lazy"
        />
      );
    }
    if (isVideo()) {
      return (
        <video
          src={url}
          controls
          style={{ width: '100%', height: 'auto', maxHeight: h }}
          referrerPolicy="no-referrer"
          onError={() => setFallback(true)}
        />
      );
    }
    if (isAudio()) {
      return (
        <audio
          src={url}
          controls
          style={{ width: '100%' }}
          referrerPolicy="no-referrer"
          onError={() => setFallback(true)}
        />
      );
    }
    if (isPdf()) {
      // 有些站点会用 X-Frame-Options 拦 iframe，失败会自动 fallback
      return (
        <iframe
          src={url}
          style={{ width: '100%', height: h, border: 0 }}
          onError={() => setFallback(true)}
        />
      );
    }
  }

  // 通用回退：尝试 iframe；仍不行提示外开
  return (
    <div>
      <iframe
        src={url}
        style={{ width: '100%', height: h, border: 0 }}
        sandbox=""           // 如需更宽权限可移除或按需配置
      />
      <div style={{ marginTop: 8 }}>
        如果无法预览，可在新窗口打开：{' '}
        <a href={url} target="_blank" rel="noreferrer">打开</a>
      </div>
    </div>
  );
}

function InlinePreview({ url, contentType, disabled }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button
        type="link"
        icon={<EyeOutlined />}
        size="small"
        disabled={disabled}
        onClick={() => (url ? setOpen(true) : message.error('URL 不存在'))}
      >
        预览
      </Button>
      <Modal
        title="预览"
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
        width={980}
        destroyOnClose
        maskClosable
      >
        <PreviewContent url={url} contentType={contentType} />
      </Modal>
    </>
  );
}



/** ---------- 你的列定义（只展示与预览/下载相关的几列） ---------- */
export const columns = [
  {
    title: "文件名",
    dataIndex: "url",
    key: "url",
    width: 420,
    render: (_, record) => {
      const full = ensureHttp(pickUrl(record));
      return (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {getFileIcon(record.contentType)}
          {/* 可复制纯文本显示 */}
          <span
            title={full}
            style={{
              marginLeft: 8, maxWidth: 360, overflow: 'hidden',
              textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'inline-block'
            }}
            onClick={() => navigator.clipboard?.writeText(full).then(() => message.success('已复制URL'))}
          >
            {full || '（无URL）'}
          </span>
        </div>
      );
    },
  },
  // ... 其他列
  {
    title: "操作",
    key: "action",
    width: 200,
    render: (_, record) => {
      const url = ensureHttp(pickUrl(record));
      const disabled = !url;
      return (
        <Space size="middle">
          <InlinePreview url={url} contentType={record?.contentType} disabled={disabled} />
          {disabled ? (
            <span style={{ color: "#999" }}>
              <DownloadOutlined /> 下载
            </span>
          ) : (
            <a href={url} target="_blank" rel="noopener noreferrer" download>
              <DownloadOutlined /> 下载
            </a>
          )}
        </Space>
      );
    },
  },
];

/** ---------- 其他小工具（保持原样即可） ---------- */
export const getFileIcon = (contentType) => {
  if (!contentType) return <FileOutlined />;
  if (contentType.startsWith('image/')) return <FileImageOutlined />;
  if (contentType === 'application/pdf') return <FilePdfOutlined />;
  if (contentType.includes('zip') || contentType.includes('compressed')) return <FileZipOutlined />;
  return <FileOutlined />;
};
