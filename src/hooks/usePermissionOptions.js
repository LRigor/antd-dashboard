// hooks/usePermissionOptions.js
import useSWR from 'swr'
import { apiClient } from '@/api-fetch/client'

const swrFetcher = (url) =>
  apiClient
    .get(url)
    .then((r) => {
      console.debug('[perm][fetch ok]', url, 'status=', r?.status)
      // 这里 r.data 就是 payload；常见为 { list: [...] }
      return r.data
    })
    .catch((e) => {
      console.debug('[perm][fetch err]', url, e?.response?.status, e?.message)
      throw e
    })

export default function usePermissionOptions() {
  const { data, isLoading, error } = useSWR(
    '/api/menu/list?size=999',
    swrFetcher,
    {
      onSuccess: (d) => console.debug('[perm][swr success] payload =', d),
      onError: (e) => console.debug('[perm][swr error]', e),
      revalidateOnFocus: false,
    }
  )

  // ① 兼容多种返回：优先 data.list，其次 data.data.list，其次 data 本身是数组
  const rawList = Array.isArray(data?.list)
    ? data.list
    : Array.isArray(data?.data?.list)
    ? data.data.list
    : Array.isArray(data)
    ? data
    : []

  console.debug('[perm] raw length =', rawList.length, rawList.slice?.(0, 5))

  // ② 构建 id->item 的索引，方便用 mids 反查
  const byId = new Map()
  const flat = []

  const pushOne = (n) => {
    if (!n) return
    const idNum = Number(n.id)
    if (!Number.isFinite(idNum)) return
    // label 优先级：name -> desc -> "METHOD path" -> id
    const label =
      n.name ||
      n.desc ||
      (n.method && n.path ? `${n.method} ${n.path}` : String(idNum))

    flat.push({
      value: idNum,
      label,
      labelText: label,
      raw: n,
    })
    byId.set(idNum, n)
  }

  // ③ 支持平/树两种形态；你的数据是平的，这里依然兼容
  const walk = (nodes = []) => {
    for (const n of nodes) {
      pushOne(n)
      if (Array.isArray(n.children) && n.children.length) walk(n.children)
    }
  }
  walk(rawList)

  console.debug('[perm] options length =', flat.length, flat.slice(0, 5))

  return { options: flat, byId, loading: isLoading, error }
}
