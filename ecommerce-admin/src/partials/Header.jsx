import React from 'react';
import { Layout, Menu } from 'antd';

const { Header: AntHeader } = Layout;

const Header = () => {
  return (
    <AntHeader>
      <div className="logo" />
      <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>
        <Menu.Item key="1">Home</Menu.Item>
        <Menu.Item key="2">About</Menu.Item>
        <Menu.Item key="3">Services</Menu.Item>
        {/* Add more menu items as needed */}
      </Menu>
    </AntHeader>
  );
}

export default Header;
