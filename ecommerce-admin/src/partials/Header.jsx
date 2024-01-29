import React from "react";
import { Layout, Menu, Dropdown, Avatar, Button } from "antd";
import { UserOutlined, LogoutOutlined  } from "@ant-design/icons";

const { Header: AntHeader } = Layout;

const Header = () => {
  const handleSignOut = () => {
    window.localStorage.removeItem("LoggedIn");
    window.location.href = "/login";
  };

  const handleProfile = () => {
    window.location.href = "/userProfile";
  }

  const menu = (
    <Menu>
      <Menu.Item key="Profile" icon={<UserOutlined />}>
        <Button onClick={handleProfile} style={{border:"none"}}>Profile</Button>
      </Menu.Item>
      <Menu.Item key="sign-out" icon={<LogoutOutlined />}>
        <Button onClick={handleSignOut} style={{border:"none"}}>Sign Out</Button>
      </Menu.Item>
    </Menu>
  );

  return (
    <AntHeader style={{display:"flex", justifyContent:"flex-end", alignItems:"center"}}>
      <div style={{ float: "right", paddingRight: "20px", cursor:"pointer" }}>
        <Dropdown overlay={menu} placement="bottomRight" arrow>
          <Avatar icon={<UserOutlined />} style={{display:"flex", justifyContent:"center", width:"50px", height:"50px"}}/>
        </Dropdown>
      </div>
    </AntHeader>
  );
};

export default Header;
