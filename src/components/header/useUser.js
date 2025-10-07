
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

  const swrKey = !unLogin ? 'adminInfo' : null

  const { data, isLoading, mutate, error } = useSWRImmutable(
    swrKey,
    adminsAPI.getAdminInfo
  )

  const setToken = (t) => {
    Cookies.set('token', t, { path: '/', sameSite: 'Lax' })
  }

  const logout = async () => {
    const url = '/?logged-out=true'
    Cookies.remove('token')
    await mutate() // 清空本地快取
    router.push(url) // 統一用 router.push
  }

  useEffect(() => {
    if (isLoading) return

    if (error) {
      message.error(error.message)
      return
    }

    if (!data) {
      return
    }

    const { code, message: msg, data: info } = data

    if (code !== 0) {
      if (msg) message.error(msg)
      router.push('/?logged-out=true')
      return
    }

    setUser(info)

    if (info?.gmt != null) {
      Cookies.set('gmt', String(info.gmt), { path: '/', sameSite: 'Lax' })
    }

    // 只在 cookie 尚未有 namespace 时初始化
    const hasNsCookie = !!Cookies.get('namespace')
    const namespaces = Array.isArray(info?.namespaces) ? info.namespaces : []

    if (!hasNsCookie && namespaces.length > 0) {
      const def = namespaces.find(n => n.isDefault === 'yes') || namespaces[0]
      if (def?.namespace != null) {
        Cookies.set('namespace', String(def.namespace), { path: '/', sameSite: 'Lax' })
        const tz = def.timezone || info.UTC
        if (tz) Cookies.set('timezone', tz, { path: '/', sameSite: 'Lax' })
      }
    }
  }, [isLoading, data, error, message, router, setUser])


  const isAuthenticated = !!token && !!user
  const hasRole = (role) =>
    Array.isArray(user?.roles) && user.roles.includes(role)
  const hasPermission = (perm) =>
    Array.isArray(user?.permissions) && user.permissions.includes(perm)
  const refreshUser = async () => {
    await mutate()
  }

  return {
    user,
    isLoading,
    mutate,
    refreshUser,     // 新增：語意化刷新
    setToken,
    logout,
    unLogin,
    isAuthenticated, // 新增：是否已登入
    hasRole,         // 新增：角色判斷
    hasPermission,   // 新增：權限判斷
  }
}
