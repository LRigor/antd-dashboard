import { rolesAPI } from '@/api-fetch';
import React from 'react'
import { Select, App } from 'antd'
import usePermissionOptions from '@/hooks/usePermissionOptions'

function RolePermSelect({ ctx }) {
  const { value, onChange, record } = ctx
  const { options, loading } = usePermissionOptions()

  // 用「最近预填过的 id」取代 didPrefill 布尔值
  const lastPrefilledId = React.useRef(null)

  React.useEffect(() => {
    const rid = record?.id
    if (!rid) return
    if (lastPrefilledId.current === rid) return  // 这个角色已经预填过了

    let ignore = false
    ;(async () => {
      const res = await rolesAPI.getRoleById(rid)
      const mids = Array.isArray(res?.data?.mids) ? res.data.mids.map(Number) : []
      const cur  = Array.isArray(value) ? value : []
      if (!ignore && !cur.length && mids.length) {
        onChange(mids)
        lastPrefilledId.current = rid   // 标记这个角色已预填
      }
    })()

    return () => { ignore = true }
  }, [record?.id])  // 仅依赖 id，时序独立于 options

  return (
    <Select
      mode="multiple"
      allowClear
      showSearch
      style={{ width: '100%' }}
      placeholder="选择此角色拥有的权限"
      options={options}
      value={Array.isArray(value) ? value.map(Number) : []}  // ✅ 始终是 number[]
      loading={loading}
      disabled={loading}
      maxTagCount="responsive"
      onChange={(vals) => onChange((vals || []).map(Number))} // ✅ 强制 number
      optionFilterProp="label"
      filterOption={(input, option) =>
        String(option?.label ?? '').toLowerCase().includes(input.toLowerCase())
      }
    />
  )
}




export const fields = [
  {
    name: "name",
    label: "角色名称",
    type: "input",
    required: true,
  },
  {
    name: "desc",
    label: "描述",
    type: "textarea",
  },
  {
    name: "tag",
    label: "标签",
    type: "select",
    options: [
      { value: "magenta", label: "洋红" },
      { value: "gold", label: "金色" },
      { value: "success", label: "成功" },
      { value: "cyan", label: "青色" },
      { value: "processing", label: "处理中" },
      { value: "default", label: "默认" },
      { value: "red", label: "红色" },
      { value: "blue", label: "蓝色" },
      { value: "green", label: "绿色" },
      { value: "orange", label: "橙色" },
    ],
  },
  {
    name: "homePage",
    label: "首页路径",
    type: "input",
    placeholder: "例如: /dashboard/sys/admin",
  },
  {
    name: "level",
    label: "级别",
    type: "select",
    options: [
      { value: 1, label: "最高" },
      { value: 2, label: "高" },
      { value: 3, label: "中" },
      { value: 4, label: "低" },
    ],
  },
  {
    name: 'mids',
    label: '权限',
    type: 'custom',
    rules: [{ required: true, message: '请选择权限' }],
    render: (ctx) => <RolePermSelect ctx={ctx} />
  }

];


