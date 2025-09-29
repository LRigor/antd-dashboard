
'use client'

import React from 'react'
import { Layout, Typography, Dropdown, Space, Avatar, Button } from 'antd'
import Image from 'next/image'
import { UserOutlined, LogoutOutlined, MenuOutlined } from '@ant-design/icons'
import ThemeToggle from '../ThemeToggle'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useSidebar } from '@/contexts/SidebarContext'
import TopAdminNamespace from '@/components/header/TopAdminNamespace'
import { useUser } from '@/components/header/useUser'  

const { Title } = Typography

export default function Header() {
  const router = useRouter()
  const { user: authUser, logout } = useAuth()
  const { collapsed, setCollapsed, isMobile } = useSidebar()

  // ⭐ 拿到 info
  const { user, isLoading } = useUser()

  const handleLogout = async () => { await logout(); router.push('/') }
  const toggleSidebar = () => setCollapsed(!collapsed)

  const userMenuItems = [
    { key: 'profile', icon: <UserOutlined />, label: 'Profile' },
    { type: 'divider' },
    { key: 'logout', icon: <LogoutOutlined />, label: 'Logout', onClick: handleLogout },
  ]

  return (
    <Layout.Header style={{
      padding: '0 24px', position: 'sticky', top: 0, zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      backgroundColor: 'var(--background-color)', borderBottom: '1px solid var(--border-color)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {isMobile && (
          <Button type="text" icon={<MenuOutlined />} onClick={toggleSidebar}
                  style={{ marginRight: 16, fontSize: 18 }} />
        )}
        <Image src="/logo.svg" alt="logo" width={32} height={32} />
        <Title level={4} style={{ margin: 0, marginLeft: 16 }}>Ant Design</Title>
      </div>

      <Space>
        {/* ⭐ 把 namespaces 傳給下拉；loading 時先不渲染 */}
        {!isLoading && <TopAdminNamespace namespaces={user?.namespaces || []} />}

        <ThemeToggle />
        <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" arrow>
          <Space style={{ cursor: 'pointer' }}>
            <Avatar icon={<UserOutlined />} />
            <Typography.Text strong>{authUser?.username}</Typography.Text>
          </Space>
        </Dropdown>
      </Space>
    </Layout.Header>
  )
}
