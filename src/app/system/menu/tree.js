import { Tag } from 'antd'
// 如果你在组件外调用，需要把 t 从外部传进来；下面默认全局有 t()
/** 颜色配置 */
export const menuTypeColor = {
  group: 'error',
  menu: '#5696ce',
  link: 'success',
  action: 'purple',
}
const methodColor = {
  GET: 'success',
  POST: 'processing',
  PUT: 'warning',
  DELETE: 'error',
  NONE: 'default',
}

/** 生成节点标题（ReactNode） */
function makeLabel(item) {
  const m = String(item?.method || 'NONE').toUpperCase()
  const type = String(item?.type || 'menu')
  const name = item?.name || item?.desc || `${m} ${item?.path || ''}`

  return (
    <>
      <Tag color={methodColor[m] || 'default'} style={{ marginRight: 6 }}>
        {m}
      </Tag>
      <Tag color={menuTypeColor[type] || 'default'} style={{ marginRight: 6 }}>
        {type}
      </Tag>
      {t ? t(name) : name}
    </>
  )
}

/**
 * 将扁平菜单转为树
 * @param {Array} data 原始数组：[{id,pid,name,method,type,sort,...}]
 * @param {Object} opts { sortBy: 'sort'|'name'|null, rootPids: [-1,0,null,undefined] }
 * @returns {Array} treeData 适配 AntD Tree/TreeSelect 的数据
 */
export function formatMenuData(data = [], opts = {}) {
  const { sortBy = 'sort', rootPids = [-1, 0, null, undefined] } = opts

  // 建索引
  const map = new Map()
  data.forEach((raw) => {
    const id = Number(raw.id)
    map.set(id, {
      ...raw,
      id,
      pid: raw.pid !== undefined ? Number(raw.pid) : undefined,
      key: String(id),
      value: id,
      label: makeLabel(raw),
      children: [],
    })
  })

  // 组装
  const roots = []
  data.forEach((raw) => {
    const node = map.get(Number(raw.id))
    const pid = node.pid
    const isRoot = rootPids.includes(pid)
    if (isRoot) {
      roots.push(node)
    } else {
      const parent = map.get(pid)
      if (parent) parent.children.push(node)
      else roots.push(node) // 父缺失 → 挂到根，避免丢数据
    }
  })

  // 排序函数
  const sorter = (a, b) => {
    if (!sortBy) return 0
    if (sortBy === 'name') return String(a.name || '').localeCompare(String(b.name || ''))
    // 默认按 sort，再按 name
    const sa = Number(a.sort ?? 0)
    const sb = Number(b.sort ?? 0)
    if (sa !== sb) return sa - sb
    return String(a.name || '').localeCompare(String(b.name || ''))
  }

  const pruneAndSort = (nodes) => {
    nodes.sort(sorter)
    for (const n of nodes) {
      if (n.children && n.children.length) {
        pruneAndSort(n.children)
      } else {
        delete n.children
      }
    }
  }
  pruneAndSort(roots)

  // 调试日志（可保留，定位结构）
  console.debug('[menu][format] input=', data.length, 'roots=', roots.length)

  return roots
}
