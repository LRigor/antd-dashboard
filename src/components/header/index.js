'use client'

import React from 'react'
import { Layout, Typography, Dropdown, Space, Avatar, Button } from 'antd'
import Image from 'next/image'
import { UserOutlined, LogoutOutlined, MenuOutlined } from '@ant-design/icons'
import ThemeToggle from '../ThemeToggle'
import { useSidebar } from '@/contexts/SidebarContext'
import TopAdminNamespace from '@/components/header/TopAdminNamespace'

// ⬇️ 改這裡：統一使用你的 hooks/sys/useUser
import { useUser } from '@/components/header/useUser'

const { Title, Text } = Typography

export default function Header() {
  const { collapsed, setCollapsed, isMobile } = useSidebar()
  const { user, isLoading, logout } = useUser()

  const handleLogout = async () => {
    await logout() // useUser 內部已處理 token 清除與導轉
  }
  const toggleSidebar = () => setCollapsed(!collapsed)

  const displayName = user?.username ?? user?.uname ?? user?.name ?? 'User'

  const userMenuItems = [
    { key: 'profile', icon: <UserOutlined />, label: 'Profile' },
    { type: 'divider' },
    { key: 'logout', icon: <LogoutOutlined />, label: 'Logout', onClick: handleLogout },
  ]

  return (
    <Layout.Header
      style={{
        padding: '0 24px',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'var(--background-color)',
        borderBottom: '1px solid var(--border-color)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {isMobile && (
          <Button
            type="text"
            icon={<MenuOutlined />}
            onClick={toggleSidebar}
            style={{ marginRight: 16, fontSize: 18 }}
          />
        )}
        <Image src="/logo.svg" alt="logo" width={32} height={32} />
        <Title level={4} style={{ margin: 0, marginLeft: 16 }}>
          Ant Design
        </Title>
      </div>

      <Space>
        {/* 加載中先不渲染命名空間切換器，避免閃爍 */}
        {!isLoading && <TopAdminNamespace namespaces={user?.namespaces || []} />}

        <ThemeToggle />
        <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" arrow>
          <Space style={{ cursor: 'pointer' }}>
            <Avatar icon={<UserOutlined />} />
            <Text strong>{displayName}</Text>
          </Space>
        </Dropdown>
      </Space>
    </Layout.Header>
  )
}
