import React, { useState, useEffect } from "react";
import { Layout, Menu, Dropdown, Avatar, Badge, Button } from "antd";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";

const { Header: AntHeader } = Layout;

const Header = () => {
  const [isOnline, setIsOnline] = useState(null);

  const handleSignOut = () => {
    window.localStorage.removeItem("LoggedIn");
    window.location.href = "/login";
  };

  const handleProfile = () => {
    window.location.href = "/userProfile";
  };

  const checkSystemStatus = async () => {
    try {
      const response = await fetch('http://localhost:5000/systemSettings/checkSystemOnline');
      if (response.status === 200) {
        setIsOnline(true);
      } else {
        setIsOnline(false);
      }
    } catch (error) {
      console.error('Error checking system status:', error);
      setIsOnline(false);
    }
  };

  useEffect(() => {
    // Initial check when the component mounts
    checkSystemStatus();

    // Set up a timer to check the system status every 5 minutes
    const intervalId = setInterval(() => {
      checkSystemStatus();
      console.log("Checking system status...");
    }, 5 * 60 * 1000);

    // Cleanup the interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  const statusBadge = (
    <Badge
      status={isOnline ? "success" : "error"}
      text={<span style={{ color: "#ffffff" }}>{isOnline ? "Online" : "Offline"}</span>}
    />
  );

  const menu = (
    <Menu>
      <Menu.Item key="Profile" icon={<UserOutlined />}>
        <Button onClick={handleProfile} style={{ border: "none" }}>
          Profile
        </Button>
      </Menu.Item>
      <Menu.Item key="sign-out" icon={<LogoutOutlined />}>
        <Button onClick={handleSignOut} style={{ border: "none" }}>
          Sign Out
        </Button>
      </Menu.Item>
    </Menu>
  );

  return (
    <AntHeader
      style={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}
    >
      <div style={{ display:"flex", alignItems:"center", float: "right", paddingRight: "20px", cursor: "pointer" }}>
        {statusBadge}
        <Dropdown overlay={menu} placement="bottomRight" arrow>
          <Avatar
            icon={<UserOutlined />}
            style={{
              display: "flex",
              justifyContent: "center",
              marginLeft: "20px",
              width: "50px",
              height: "50px",
            }}
          />
        </Dropdown>
      </div>
    </AntHeader>
  );
};

export default Header;
