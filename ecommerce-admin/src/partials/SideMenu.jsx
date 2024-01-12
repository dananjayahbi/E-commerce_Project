import React, { useState } from "react";
import {
  AppstoreOutlined,
  MailOutlined,
  DashboardOutlined,
  CompassFilled, //components icon
  CompassOutlined , //component categories icon
  BulbFilled , //learning nodes icon
  FileImageFilled , //ref images icon
  FileImageOutlined , //ref images categories icon
  UserOutlined, //users icon   
  SettingFilled, //site settings icon
} from "@ant-design/icons";
import { Menu, Layout } from "antd";
import { useNavigate } from "react-router-dom";

const { Sider } = Layout;

const SideMenu = () => {
  const navigate = useNavigate();
  const [current, setCurrent] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);

  const onClick = (e) => {
    console.log("click ", e);
    setCurrent(e.key);

    // Use navigate to go to the desired page based on the key
    switch (e.key) {
      case "dashboard":
        navigate("/");
        break;
      case "1":
        navigate("/components");
        break;
      case "2":
        navigate("/componentCategories");
        break;
      case "3":
        navigate("/learningNodes");
        break;
      case "5":
        navigate("/refImages");
        break;
      case "6":
        navigate("/refImagesCategories");
        break;
      case "7":
        navigate("/users");
        break;
      case "8":
        navigate("/siteSettings");
        break;
      // Add more cases as needed
      default:
        break;
    }
  };

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={() => setCollapsed(!collapsed)}
      width={288}
      style={{ minHeight: "100vh" }}
      breakpoint="md"
      collapsedWidth={0}
    >
      <Menu
        theme="dark"
        onClick={onClick}
        selectedKeys={[current]}
        mode="inline"
      >
        <Menu.Item key="dashboard" icon={<DashboardOutlined />}>
          Dashboard
        </Menu.Item>

        {/* Navigation One with sub-items */}
        <Menu.SubMenu key="sub1" icon={<MailOutlined />} title="Manage">
          <Menu.Item key="1" icon={<CompassFilled/>}>Components</Menu.Item>
          <Menu.Item key="2" icon={<CompassOutlined  />}>Component Categories</Menu.Item>
          <Menu.Item key="3" icon={<BulbFilled  />}>Learning Nodes</Menu.Item>
          <Menu.Item key="5" icon={<FileImageFilled  />}>Ref. Images</Menu.Item>
          <Menu.Item key="6" icon={<FileImageOutlined  />}>Ref. Images Categories</Menu.Item>
        </Menu.SubMenu>

        {/* Navigation Two with sub-items */}
        <Menu.SubMenu key="sub2" icon={<AppstoreOutlined />} title="Settings">
          <Menu.Item key="7" icon={<UserOutlined  />}>Users</Menu.Item>
          <Menu.Item key="8" icon={<SettingFilled  />}>Site Settings</Menu.Item>
        </Menu.SubMenu>
      </Menu>
    </Sider>
  );
};

export default SideMenu;
