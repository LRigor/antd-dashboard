import { Tag, Button, Space, message } from "antd";
import { EyeOutlined, DownloadOutlined, FileOutlined, FileImageOutlined, FilePdfOutlined, FileZipOutlined } from "@ant-design/icons";

// 把相對路徑補成完整域名；已是 http(s) 直接回傳
const ensureHttp = (u) => {
  const out =
    !u ? '' :
    /^https?:\/\//i.test(u) ? u :
    `${(process.env.NEXT_PUBLIC_STATIC_ORIGIN || '').replace(/\/+$/, '')}/${String(u).replace(/^\/+/, '')}`;

  console.log('[files/columns] ensureHttp -> input:', u, ' output:', out);
  return out;
};

const pickUrl = (record) => {
  const picked = record?.url || record?.path || record?.fileUrl || record?.name || '';
  console.log('[files/columns] pickUrl -> picked:', picked, ' record.id:', record?.id);
  return picked;
};

const onPreview = (record) => {
  const raw = pickUrl(record);
  const url = ensureHttp(raw);
  console.log('[files/columns] onPreview click -> raw:', raw, ' url:', url, ' record:', record);
  if (!url) {
    message.error('URL 不存在');
    return;
  }
  window.open(url, '_blank', 'noopener,noreferrer');
};

export const columns = [
  {
    title: "文件名",
    dataIndex: "url",
    key: "url",
    width: 260,
    render: (_, record) => {
      const raw = pickUrl(record);
      const name = raw ? raw.split('/').pop() || '未命名文件' : '未命名文件';
      console.log('[files/columns] render:fileName -> name:', name, ' raw:', raw, ' id:', record?.id);
      return (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {getFileIcon(record.contentType)}
          <span style={{ marginLeft: 8 }}>{name}</span>
        </div>
      );
    },
  },
  {
    title: "类型",
    dataIndex: "contentType",
    key: "contentType",
    width: 140,
    render: (contentType) => {
      console.log('[files/columns] render:contentType ->', contentType);
      return <Tag color="blue">{getFileTypeLabel(contentType)}</Tag>;
    },
  },
  {
    title: "分组",
    dataIndex: "group",
    key: "group",
    width: 120,
    render: (group) => {
      console.log('[files/columns] render:group ->', group);
      return group;
    }
  },
  {
    title: "命名空间",
    dataIndex: "namespace",
    key: "namespace",
    width: 120,
    render: (ns) => {
      console.log('[files/columns] render:namespace ->', ns);
      return ns;
    }
  },
  {
    title: "状态",
    dataIndex: "status",
    key: "status",
    width: 100,
    render: (status) => {
      console.log('[files/columns] render:status ->', status);
      return (
        <Tag color={getStatusColor(status)}>
          {getStatusLabel(status)}
        </Tag>
      );
    },
  },
  {
    title: '操作',
    key: 'action',
    width: 180,
    render: (_, record) => {
      const raw = pickUrl(record);
      const url = ensureHttp(raw);
      const disabled = !raw;
      console.log('[files/columns] render:action -> raw:', raw, ' url:', url, ' disabled:', disabled, ' id:', record?.id);
      return (
        <Space size="middle">
          <Button
            type="link"
            icon={<EyeOutlined />}
            size="small"
            onClick={() => onPreview(record)}
            disabled={disabled}
          >
            預覽
          </Button>
          {disabled ? (
            <span style={{ color: '#999' }}>
              <DownloadOutlined /> 下載
            </span>
          ) : (
            <a href={url} target="_blank" rel="noopener noreferrer" download onClick={() => {
              console.log('[files/columns] download click -> url:', url, ' id:', record?.id);
            }}>
              <DownloadOutlined /> 下載
            </a>
          )}
        </Space>
      );
    },
  },
];

// Helper functions
export const getStatusLabel = (status) => (status === 1 ? "正常" : "禁用");

export const getStatusColor = (status) => (status === 1 ? "green" : "red");

// 簡單版 Icon：可依你的實際需求再擴充
export const getFileIcon = (contentType) => {
  if (!contentType) {
    console.log('[files/columns] getFileIcon -> default FileOutlined');
    return <FileOutlined />;
  }
  if (contentType.startsWith('image/')) {
    console.log('[files/columns] getFileIcon -> image', contentType);
    return <FileImageOutlined />;
  }
  if (contentType === 'application/pdf') {
    console.log('[files/columns] getFileIcon -> pdf');
    return <FilePdfOutlined />;
  }
  if (contentType.includes('zip') || contentType.includes('compressed')) {
    console.log('[files/columns] getFileIcon -> zip/compressed');
    return <FileZipOutlined />;
  }
  console.log('[files/columns] getFileIcon -> default', contentType);
  return <FileOutlined />;
};

// 簡單版類型顯示
export const getFileTypeLabel = (contentType) => {
  const label =
    !contentType ? "未知" :
    contentType.startsWith('image/') ? '圖片' :
    contentType.startsWith('video/') ? '影片' :
    contentType.startsWith('audio/') ? '音訊' :
    contentType === 'application/pdf' ? 'PDF' :
    (contentType.includes('zip') || contentType.includes('compressed')) ? '壓縮包' :
    contentType;

  console.log('[files/columns] getFileTypeLabel ->', contentType, ' => ', label);
  return label;
};
