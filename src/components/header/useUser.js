// src/hooks/useUser.js
'use client'

import Cookies from 'js-cookie'
import { App } from 'antd'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useImmer } from 'use-immer'
import useSWRImmutable from 'swr/immutable'
import { adminsAPI } from '@/api-fetch/admins'

export const useUser = () => {
  const router = useRouter()
  const { message } = App.useApp()

  const token = Cookies.get('token')
  const unLogin = !token
  const [user, setUser] = useImmer(null)

  // --- LOG: 首屏 cookie / key 情况
  console.log('[useUser] init token exists?', !!token, 'token.len=', token?.length || 0)
  const swrKey = !unLogin ? 'adminInfo' : null
  console.log('[useUser] SWR key =', swrKey)

  const { data, isLoading, mutate, error } = useSWRImmutable(
    swrKey,
    adminsAPI.getAdminInfo
  )

  const setToken = (t) => {
    Cookies.set('token', t, { path: '/', sameSite: 'Lax' })
    console.log('[useUser] setToken done, len=', t?.length || 0)
  }

  const logout = async () => {
    const url = '/adminlogin?logged-out=true'
    console.log('[useUser] logout() -> remove token and goto', url)
    Cookies.remove('token')
    await mutate()
    if (typeof window !== 'undefined') window.location.href = url
  }

  useEffect(() => {
    console.log('[useUser][effect] isLoading=', isLoading, 'error=', error, 'hasData=', !!data)

    if (isLoading) return

    if (error) {
      console.error('[useUser][effect] SWR error:', error)
      message.error(error.message)
      return
    }

    if (!data) {
      console.log('[useUser][effect] no data yet, return')
      return
    }

    const { code, message: msg, data: info } = data
    console.log('[useUser][effect] response code=', code, 'msg=', msg, 'info=', info)

    if (code !== 0) {
      if (msg) message.error(msg)
      console.warn('[useUser][effect] non-zero code, redirect /adminlogin')
      router.push('/adminlogin')
      return
    }

    setUser(info)
    console.log('[useUser][effect] setUser ok. namespaces.count=',
      Array.isArray(info?.namespaces) ? info.namespaces.length : 0
    )

    if (info?.gmt != null) {
      Cookies.set('gmt', String(info.gmt), { path: '/', sameSite: 'Lax' })
      console.log('[useUser] set gmt cookie =', info.gmt)
    }

    // 只在 cookie 尚未有 namespace 时初始化
    const hasNsCookie = !!Cookies.get('namespace')
    const namespaces = Array.isArray(info?.namespaces) ? info.namespaces : []
    console.log('[useUser] init namespace? hasNsCookie=', hasNsCookie, 'namespaces=', namespaces)

    if (!hasNsCookie && namespaces.length > 0) {
      const def = namespaces.find(n => n.isDefault === 'yes') || namespaces[0]
      if (def?.namespace != null) {
        Cookies.set('namespace', String(def.namespace), { path: '/', sameSite: 'Lax' })
        const tz = def.timezone || info.UTC
        if (tz) Cookies.set('timezone', tz, { path: '/', sameSite: 'Lax' })
        console.log('[useUser] set initial namespace=', def.namespace, 'timezone=', tz)
      }
    }
  }, [isLoading, data, error, message, router, setUser])

  return {
    user,
    isLoading,
    mutate,
    setToken,
    logout,
    unLogin,
  }
}
