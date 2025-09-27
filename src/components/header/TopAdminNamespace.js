// src/components/header/TopAdminNamespace.js
'use client'
import React, { useEffect, useMemo, useState } from 'react'
import { App, Image, Select } from 'antd'
import Cookies from 'js-cookie'
import { SysAPI } from '@/api-fetch/sys'

export default function TopAdminNamespace({ namespaces = [], className }) {
  const { message } = App.useApp()
  const [value, setValue] = useState('')

  useEffect(() => {
    console.log('[TopAdminNamespace] props.namespaces=', namespaces)
    const fromCookie = Cookies.get('namespace')
    const def = fromCookie
      || (namespaces.find(i => i.isDefault === 'yes')?.namespace)
      || (namespaces[0]?.namespace)
      || ''
    console.log('[TopAdminNamespace] cookie.namespace=', fromCookie, 'decided value=', def)
    setValue(def ? String(def) : '')
  }, [namespaces])

  const options = useMemo(() => {
    const ops = namespaces
      .slice()
      .sort((a, b) => {
        const av = isNaN(a.namespace) ? a.namespace : +a.namespace
        const bv = isNaN(b.namespace) ? b.namespace : +b.namespace
        return av > bv ? 1 : -1
      })
      .map(i => ({
        label: (
          <div className="flex items-center gap-2">
            {i.icon ? <Image src={i.icon} preview={false} width={30} height={30} className="rounded mr-2" /> : null}
            <span>{i.namespace}</span>
          </div>
        ),
        value: String(i.namespace),
        timezone: i.timezone,
      }))
    console.log('[TopAdminNamespace] options=', ops)
    return ops
  }, [namespaces])

  const onChange = async (ns) => {
    console.log('[TopAdminNamespace] onChange ->', ns, 'current=', value)
    if (!ns || ns === value) return
    const picked = namespaces.find(i => String(i.namespace) === String(ns))
    console.log('[TopAdminNamespace] picked=', picked)

    const { code, msg } = await SysAPI.setDefaultNamespace({ namespace: Number(ns) })
    console.log('[TopAdminNamespace] setDefaultNamespace result code=', code, 'msg=', msg)
    if (code === 0) {
      Cookies.set('namespace', String(ns), { path: '/', sameSite: 'Lax' })
      if (picked?.timezone) Cookies.set('timezone', picked.timezone, { path: '/', sameSite: 'Lax' })
      setValue(String(ns))
      message.success({ content: 'ok', duration: 1 })
      setTimeout(() => window.location.reload(), 300)
    } else {
      message.error(msg || 'set namespace failed')
    }
  }

  return (
    <Select
      className={className ?? 'ns-select'}
      size="large"
      style={{ width: 200 }}
      popupMatchSelectWidth={false}
      styles={{                // ✅ 取代 dropdownStyle
        popup: { root: { minWidth: 240 } }
      }}
      options={options}
      value={value || undefined}
      placeholder="命名空間"
      showSearch
      filterOption={(input, opt) =>
        (opt?.value ?? '').toLowerCase().includes(input.toLowerCase())
      }
      onChange={onChange}
    />
  )
  
}
