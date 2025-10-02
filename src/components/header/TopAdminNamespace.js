// src/components/header/TopAdminNamespace.js
'use client'
import React, { useEffect, useMemo, useState } from 'react'
import { App, Image, Select } from 'antd'
import Cookies from 'js-cookie'
import { SysAPI } from '@/api-fetch/sys'

export default function TopAdminNamespace({ namespaces = [], className }) {
  const { message } = App.useApp()
  const [value, setValue] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // 1) 取 cookie；不在清單內則退回預設或第一個
    const fromCookie = Cookies.get('namespace')
    const listValues = new Set(namespaces.map(i => String(i.namespace)))
    const cookieOk = fromCookie && listValues.has(String(fromCookie))

    const decided =
      (cookieOk && fromCookie) ||
      namespaces.find(i => i.isDefault === 'yes')?.namespace ||
      namespaces[0]?.namespace ||
      ''

    setValue(decided ? String(decided) : '')
  }, [namespaces])

  const options = useMemo(() => {
    return namespaces
      .slice()
      .sort((a, b) => {
        const av = isNaN(a.namespace) ? a.namespace : +a.namespace
        const bv = isNaN(b.namespace) ? b.namespace : +b.namespace
        return av > bv ? 1 : -1
      })
      .map(i => ({
        label: (
          <div className="flex items-center gap-2">
            {i.icon ? (
              <Image
                src={i.icon}
                preview={false}
                width={30}
                height={30}
                className="rounded mr-2"
              />
            ) : null}
            <span>{i.namespace}</span>
          </div>
        ),
        value: String(i.namespace),
        timezone: i.timezone,
      }))
  }, [namespaces])

  const onChange = async (ns) => {
    // 已是同值或空值就不打 API
    if (!ns || ns === value) return
    const picked = namespaces.find(i => String(i.namespace) === String(ns))

    try {
      setLoading(true)
      const res = await SysAPI.setDefaultNamespace({ namespace: Number(ns) })

      // 兼容空返回 / 非物件
      if (!res || typeof res !== 'object') {
        message.error('切換命名空間失敗：返回為空')
        return
      }

      const { code = -1, msg = 'unknown error' } = res
      if (code === 0) {
        Cookies.set('namespace', String(ns), { path: '/', sameSite: 'Lax' })
        if (picked?.timezone)
          Cookies.set('timezone', picked.timezone, { path: '/', sameSite: 'Lax' })

        setValue(String(ns))
        message.success({ content: 'ok', duration: 1 })
        setTimeout(() => window.location.reload(), 300)
      } else {
        message.error(msg || 'set namespace failed')
      }
    } catch (err) {
      console.error('[TopAdminNamespace] setDefaultNamespace error:', err)
      message.error(`切換失敗：${err?.message || String(err)}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Select
      className={className ?? 'ns-select'}
      size="large"
      style={{ width: 200 }}
      popupMatchSelectWidth={false}
      styles={{ popup: { root: { minWidth: 240 } } }}
      options={options}
      value={value || undefined}
      placeholder="命名空間"
      showSearch
      filterOption={(input, opt) =>
        (opt?.value ?? '').toLowerCase().includes(input.toLowerCase())
      }
      onChange={onChange}
      loading={loading}
      disabled={loading}
    />
  )
}




