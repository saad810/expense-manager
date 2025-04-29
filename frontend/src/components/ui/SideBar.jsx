import React from 'react'
import { Button, Flex, Menu } from 'antd'
import { GiTakeMyMoney } from "react-icons/gi"
import {
    UserOutlined,
    ProfileOutlined,
    CarryOutOutlined,
    OrderedListOutlined,
    SettingOutlined,
    LogoutOutlined
} from '@ant-design/icons'
import { NavLink, useLocation } from 'react-router-dom'
import { TbCashRegister } from "react-icons/tb";
import { HiOutlineBanknotes } from "react-icons/hi2";
const SideBar = () => {
    const location = useLocation()
    const currentPath = location.pathname

    const menuItems = [
        {
            key: '/',
            icon: <UserOutlined />,
            label: <NavLink to="/">Dashboard</NavLink>,
        },
        {
            key: '/expenses',
            icon: <TbCashRegister />,
            label: <NavLink to="/expenses">Expenses</NavLink>,
        },
        {
            key: '/budgets',
            icon: <HiOutlineBanknotes />,
            label: <NavLink to="/budgets">Budget</NavLink>,
        },
        {
            key: '/profile',
            icon: <ProfileOutlined />,
            label: <NavLink to="/profile">Profile</NavLink>,
        },
        {
            key: '/logout',
            icon: <LogoutOutlined />,
            label: <Button>Logout</Button>,
        },
    ]

    return (
        <>
            <Flex align='center' justify='center'>
                <div className="logo">
                    <GiTakeMyMoney className='logo-icon' />
                    {/* <h1 className='logo-text'>Expense Tracker</h1> */}
                </div>
            </Flex>
            <Menu
                mode='inline'
                selectedKeys={[currentPath]}
                className='menu-bar'
                items={menuItems}
            />
        </>
    )
}

export default SideBar
