import React, { useState, useEffect } from 'react'
import { Layout, Button, Drawer } from 'antd'
import { MenuOutlined } from '@ant-design/icons'
import { Outlet } from 'react-router-dom'
import SideBar from '../components/ui/SideBar'
import { useAuth } from '../context/auth'


const { Content } = Layout

const MainLayout = () => {
  const { logout } = useAuth()
  const [collapsed, setCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  const handleResize = () => {
    setIsMobile(window.innerWidth < 768)
    if (window.innerWidth >= 768) {
      setCollapsed(false) // Ensure sidebar is always open on desktop
    }
  }

  useEffect(() => {
    window.addEventListener('resize', handleResize)
    handleResize()
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {isMobile ? (
        <>
          <Drawer
            placement="left"
            closable={false}
            onClose={() => setCollapsed(false)}
            open={collapsed}
            bodyStyle={{ padding: 0 }}
            width={240}
          >
            <SideBar onClose={() => setCollapsed(false)} />
          </Drawer>


          <Button
            type="text"
            icon={<MenuOutlined />}
            onClick={() => setCollapsed(true)}
            style={{ position: 'fixed', top: 16, left: 16, zIndex: 1100 }}
          />
          <Button
            type="text"
            icon={<LogoutOutlined />}
            onClick={() => logout()}
            style={{ position: 'fixed', bottom: 16, left: 16, zIndex: 1100 }}
          />
        </>
      ) : (
        <Layout.Sider
          theme="light"
          collapsible
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
          width={240}
          style={{ zIndex: 1001 }}
        >
          <SideBar />
        </Layout.Sider>
      )
      }

      <Layout>
        <Content className="content" style={{ padding: isMobile ? '16px' : '24px' }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout >
  )
}

export default MainLayout
