import React, { useState } from "react";
import {
  AlertTriangle,
  BarChartBig,
  Cog,
  Contact,
  DatabaseBackup,
  FileBarChart,
  FileCog,
  GanttChartSquare,
  Gauge,
  Layers3,
  LineChart,
  PackagePlus,
  PackageSearch,
  PercentDiamond,
  PlusCircle,
  Rows4,
  Ruler,
  Settings,
  Target,
  UserCheck,
  UserRoundCog,
  Users,
  UsersRound,
  Wrench,
} from "lucide-react";
import { Menu, Layout } from "antd";
import { useNavigate } from "react-router-dom";
import logo from "../images/logo.png";

const { Header, Footer, Sider, Content } = Layout;

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
        navigate("/products");
        break;
      case "2":
        navigate("/addProduct");
        break;
      case "3":
        navigate("/category");
        break;
      case "4":
        navigate("/units");
        break;
      case "5":
        navigate("/brands");
        break;
      case "6":
        navigate("/orders");
        break;
      case "7":
        navigate("/sales");
        break;
      case "8":
        navigate("/newSale");
        break;
      case "9":
        navigate("/customers");
        break;
      case "10":
        navigate("/users");
        break;
      case "11":
        navigate("/roles");
        break;
      case "12":
        navigate("/salesReport");
        break;
      case "13":
        navigate("/inventoryReport");
        break;
      case "14":
        navigate("/productsReport");
        break;
      case "15":
        navigate("/productQuantityAlerts");
        break;
      case "16":
        navigate("/systemSettings");
        break;
      case "17":
        navigate("/storeSettings");
        break;
      case "18":
        navigate("/emailTemplates");
        break;
      case "19":
        navigate("/backup");
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
      <Layout>
        <Header style={{ color: "#fff", display: "flex" , justifyContent:"center" }}>
            <img src={logo} alt="Logo" width="120px" height="100px"/>
        </Header>
      </Layout>
      <Menu
        theme="dark"
        onClick={onClick}
        selectedKeys={[current]}
        mode="inline"
        style={{
          paddingTop: "60px",
        }}
      >
        <Menu.Item key="dashboard" icon={<Gauge size={20} />}>
          Dashboard
        </Menu.Item>

        {/* Navigation One with sub-items */}
        <Menu.SubMenu
          key="sub1"
          icon={<PackageSearch size={20} />}
          title="Products Management"
        >
          <Menu.Item key="1" icon={<GanttChartSquare size={15} />}>
            Products
          </Menu.Item>
          <Menu.Item key="2" icon={<PackagePlus size={15} />}>
            Add Product
          </Menu.Item>
          <Menu.Item key="3" icon={<Layers3 size={15} />}>
            Category
          </Menu.Item>
          <Menu.Item key="4" icon={<Ruler size={15} />}>
            Units
          </Menu.Item>
          <Menu.Item key="5" icon={<Target size={15} />}>
            Brands
          </Menu.Item>
        </Menu.SubMenu>

        {/* Navigation Two with sub-items */}
        <Menu.SubMenu
          key="sub2"
          icon={<PercentDiamond size={20} />}
          title="Orders Management"
        >
          <Menu.Item key="6" icon={<GanttChartSquare size={15} />}>
            Orders
          </Menu.Item>
        </Menu.SubMenu>

        {/* Navigation Three with sub-items */}
        <Menu.SubMenu
          key="sub3"
          icon={<LineChart size={20} />}
          title="Sales Management"
        >
          <Menu.Item key="7" icon={<Rows4 size={15} />}>
            Sales
          </Menu.Item>
          <Menu.Item key="8" icon={<PlusCircle size={15} />}>
            New Sale
          </Menu.Item>
        </Menu.SubMenu>

        {/* Navigation Four with sub-items */}
        <Menu.SubMenu key="sub4" icon={<Contact size={20} />} title="People">
          <Menu.Item key="9" icon={<UsersRound size={15} />}>
            Customers
          </Menu.Item>
        </Menu.SubMenu>

        {/* Navigation Five with sub-items */}
        <Menu.SubMenu
          key="sub5"
          icon={<UserRoundCog size={20} />}
          title="User Management"
        >
          <Menu.Item key="10" icon={<Users size={15} />}>
            Users
          </Menu.Item>
          <Menu.Item key="11" icon={<UserCheck size={15} />}>
            Roles
          </Menu.Item>
        </Menu.SubMenu>

        {/* Navigation Six with sub-items */}
        <Menu.SubMenu
          key="sub6"
          icon={<BarChartBig size={20} />}
          title="Reports"
        >
          <Menu.Item key="12" icon={<FileBarChart size={15} />}>
            Sales Report
          </Menu.Item>
          <Menu.Item key="13" icon={<FileBarChart size={15} />}>
            Inventory Report
          </Menu.Item>
          <Menu.Item key="14" icon={<FileBarChart size={15} />}>
            Products Report
          </Menu.Item>
          <Menu.Item key="15" icon={<AlertTriangle size={15} />}>
            Product Quantity Alerts
          </Menu.Item>
        </Menu.SubMenu>

        {/* Navigation Seven with sub-items */}
        <Menu.SubMenu key="sub7" icon={<Settings size={20} />} title="Settings">
          <Menu.Item key="16" icon={<Cog size={15} />}>
            System Settings
          </Menu.Item>
          <Menu.Item key="17" icon={<Wrench size={15} />}>
            Store Settings
          </Menu.Item>
          <Menu.Item key="18" icon={<FileCog size={15} />}>
            Email Templates
          </Menu.Item>
          <Menu.Item key="19" icon={<DatabaseBackup size={15} />}>
            Backup
          </Menu.Item>
        </Menu.SubMenu>
      </Menu>
    </Sider>
  );
};

export default SideMenu;
