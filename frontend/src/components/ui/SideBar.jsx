import React from 'react'
import { Button, Flex, Menu } from 'antd'
import { GiTakeMyMoney } from "react-icons/gi"
import {
  UserOutlined,
  ProfileOutlined,
  LogoutOutlined,
} from '@ant-design/icons'
import { TbCashRegister } from "react-icons/tb"
import { HiOutlineBanknotes } from "react-icons/hi2"
import { NavLink, useLocation } from 'react-router-dom'

const SideBar = ({ onClose }) => {
  const location = useLocation()
  const currentPath = location.pathname

  const menuItems = [
    {
      key: '/',
      icon: <UserOutlined />,
      label: <NavLink to="/" onClick={onClose}>Dashboard</NavLink>,
    },
    {
      key: '/expenses',
      icon: <TbCashRegister />,
      label: <NavLink to="/expenses" onClick={onClose}>Expenses</NavLink>,
    },
    {
      key: '/budgets',
      icon: <HiOutlineBanknotes />,
      label: <NavLink to="/budgets" onClick={onClose}>Budget</NavLink>,
    },
    {
      key: '/profile',
      icon: <ProfileOutlined />,
      label: <NavLink to="/profile" onClick={onClose}>Profile</NavLink>,
    },
    {
      key: '/logout',
      icon: <LogoutOutlined />,
      label: <Button onClick={onClose}>Logout</Button>,
    },
  ]

  return (
    <>
      <Flex align="center" justify="center">
        <div className="logo">
          <GiTakeMyMoney className="logo-icon" />
        </div>
      </Flex>
      <Menu
        mode="inline"
        selectedKeys={[currentPath]}
        className="menu-bar"
        items={menuItems}
      />
    </>
  )
}

export default SideBar
