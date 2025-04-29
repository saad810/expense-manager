// components/layout/MainLayout.jsx
import React, { useState } from 'react'
import { Layout, Button } from 'antd'

import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons'
import { Outlet } from 'react-router-dom'

import SideBar from '../components/ui/SideBar'

const { Sider, Content } = Layout

const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider theme="light" trigger={null} collapsible collapsed={collapsed} className="sider">
        <SideBar />
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => setCollapsed(!collapsed)}
          className="trigger-btn"
        />
      </Sider>

      <Layout>
       
        <Content className="content">
          <Outlet /> 
        </Content>
      </Layout>
    </Layout>
  )
}

export default MainLayout
