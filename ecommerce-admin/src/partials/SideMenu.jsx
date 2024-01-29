import React, { useState, useEffect } from "react";
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
import { fetchDashboardLogo } from "../utils/globalExports";
import errorImage from "../images/error_img.png";

const { Header, Sider } = Layout;

const SideMenu = () => {
  const navigate = useNavigate();
  const [current, setCurrent] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const [dashboardLogo, setDashboardLogo] = useState(null);
  const [role, setRole] = useState(null);
  const [rolePermissions, setRolePermissions] = useState(null);

  useEffect(() => {
    const getDashboardLogo = async () => {
      const imageUrl = await fetchDashboardLogo();
      setDashboardLogo(imageUrl);
    };

    setRole(localStorage.getItem("role"));
    setRolePermissions(localStorage.getItem("rolePermissions"));

    getDashboardLogo();
  }, []);

  // Function to check if a specific permission is true or false
  const checkPermission = (permission) => {
    if (!rolePermissions) {
      return false;
    }

    // Split the rolePermissions string into an array of permissions
    const permissionsArray = rolePermissions.split(",");

    // Loop through the permissionsArray
    for (const perm of permissionsArray) {
      // Split each permission into key and value
      const [key, value] = perm.split(":");

      if (key === permission && value.trim().toLowerCase() === "true") {
        return true;
      }
    }
    return false;
  };

  const onClick = (e) => {
    console.log("click ", e);
    setCurrent(e.key);

    // Use navigate to go to the desired page based on the key
    switch (e.key) {
      case "dashboard":
        navigate("/");
        break;
      case "1":
        if (checkPermission("products") === true) {
          navigate("/products");
        }
        break;
      case "3":
        if (checkPermission("category") === true) {
          navigate("/category");
        }
        break;
      case "4":
        if (checkPermission("units") === true) {
          navigate("/units");
        }
        break;
      case "5":
        if (checkPermission("brands") === true) {
          navigate("/brands");
        }
        break;
      case "6":
        if (checkPermission("orders") === true) {
          navigate("/orders");
        }
        break;
      case "7":
        if (checkPermission("sales") === true) {
          navigate("/sales");
        }
        break;
      case "8":
        if (checkPermission("newSale") === true) {
          navigate("/newSale");
        }
        break;
      case "9":
        if (checkPermission("customers") === true) {
          navigate("/customers");
        }
        break;
      case "10":
        if (checkPermission("users") === true) {
          navigate("/users");
        }
        break;
      case "11":
        if (checkPermission("roles") === true) {
          navigate("/roles");
        }
        break;
      case "12":
        if (checkPermission("salesReport") === true) {
          navigate("/salesReport");
        }
        break;
      case "13":
        if (checkPermission("inventoryReport") === true) {
          navigate("/inventoryReport");
        }
        break;
      case "14":
        if (checkPermission("productsReport") === true) {
          navigate("/productsReport");
        }
        break;
      case "15":
        if (checkPermission("productQuantityAlerts") === true) {
          navigate("/productQuantityAlerts");
        }
        break;
      case "16":
        if (checkPermission("systemSettings") === true) {
          navigate("/systemSettings");
        }
        break;
      case "17":
        if (checkPermission("storeSettings") === true) {
          navigate("/storeSettings");
        }
        break;
      case "18":
        if (checkPermission("emailTemplates") === true) {
          navigate("/emailTemplates");
        }
        break;
      case "19":
        if (checkPermission("backup") === true) {
          navigate("/backup");
        }
        break;
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
        <Header
          style={{ color: "#fff", display: "flex", justifyContent: "center" }}
        >
          <img
            src={dashboardLogo ? dashboardLogo : errorImage}
            alt="Logo"
            width="120px"
            height="120px"
            style={{ borderRadius: errorImage ? "20%" : "0" }}
          />
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
        {(checkPermission("products") === true ||
          checkPermission("category") === true ||
          checkPermission("units") === true ||
          checkPermission("brands") === true) && (
          <Menu.SubMenu
            key="sub1"
            icon={<PackageSearch size={20} />}
            title="Products Management"
          >
            {checkPermission("products") === true && (
              <Menu.Item key="1" icon={<GanttChartSquare size={15} />}>
                Products
              </Menu.Item>
            )}
            {checkPermission("category") === true && (
              <Menu.Item key="3" icon={<Layers3 size={15} />}>
                Category
              </Menu.Item>
            )}
            {checkPermission("units") === true && (
              <Menu.Item key="4" icon={<Ruler size={15} />}>
                Units
              </Menu.Item>
            )}
            {checkPermission("brands") === true && (
              <Menu.Item key="5" icon={<Target size={15} />}>
                Brands
              </Menu.Item>
            )}
          </Menu.SubMenu>
        )}

        {/* Navigation Two with sub-items */}
        {checkPermission("orders") === true && (
          <Menu.SubMenu
            key="sub2"
            icon={<PercentDiamond size={20} />}
            title="Orders Management"
          >
            {checkPermission("orders") === true && (
              <Menu.Item key="6" icon={<GanttChartSquare size={15} />}>
                Orders
              </Menu.Item>
            )}
          </Menu.SubMenu>
        )}

        {(checkPermission("sales") === true ||
          checkPermission("newSale") === true) && (
          <Menu.SubMenu
            key="sub3"
            icon={<LineChart size={20} />}
            title="Sales Management"
          >
            {checkPermission("sales") === true && (
              <Menu.Item key="7" icon={<Rows4 size={15} />}>
                Sales
              </Menu.Item>
            )}
            {checkPermission("newSale") === true && (
              <Menu.Item key="8" icon={<PlusCircle size={15} />}>
                New Sale
              </Menu.Item>
            )}
          </Menu.SubMenu>
        )}

        {/* Navigation Four with sub-items */}
        {checkPermission("customers") === true && (
          <Menu.SubMenu key="sub4" icon={<Contact size={20} />} title="People">
            {checkPermission("customers") === true && (
              <Menu.Item key="9" icon={<UsersRound size={15} />}>
                Customers
              </Menu.Item>
            )}
          </Menu.SubMenu>
        )}

        {/* Navigation Five with sub-items */}
        {(checkPermission("users") === true ||
          checkPermission("roles") === true) && (
          <Menu.SubMenu
            key="sub5"
            icon={<UserRoundCog size={20} />}
            title="User Management"
          >
            {checkPermission("users") === true && (
              <Menu.Item key="10" icon={<Users size={15} />}>
                Users
              </Menu.Item>
            )}
            {checkPermission("roles") === true && (
              <Menu.Item key="11" icon={<UserCheck size={15} />}>
                Roles
              </Menu.Item>
            )}
          </Menu.SubMenu>
        )}

        {/* Navigation Six with sub-items */}
        {(checkPermission("salesReport") === true ||
          checkPermission("inventoryReport") === true ||
          checkPermission("productsReport") === true ||
          checkPermission("productQuantityAlerts") === true) && (
          <Menu.SubMenu
            key="sub6"
            icon={<BarChartBig size={20} />}
            title="Reports"
          >
            {checkPermission("salesReport") === true && (
              <Menu.Item key="12" icon={<FileBarChart size={15} />}>
                Sales Report
              </Menu.Item>
            )}
            {checkPermission("inventoryReport") === true && (
              <Menu.Item key="13" icon={<FileBarChart size={15} />}>
                Inventory Report
              </Menu.Item>
            )}
            {checkPermission("productsReport") === true && (
              <Menu.Item key="14" icon={<FileBarChart size={15} />}>
                Products Report
              </Menu.Item>
            )}
            {checkPermission("productQuantityAlerts") === true && (
              <Menu.Item key="15" icon={<AlertTriangle size={15} />}>
                Product Quantity Alerts
              </Menu.Item>
            )}
          </Menu.SubMenu>
        )}

        {/* Navigation Seven with sub-items */}
        {(checkPermission("systemSettings") === true ||
          checkPermission("storeSettings") === true ||
          checkPermission("emailTemplates") === true ||
          checkPermission("backup") === true) && (
          <Menu.SubMenu
            key="sub7"
            icon={<Settings size={20} />}
            title="Settings"
          >
            {checkPermission("systemSettings") === true && (
              <Menu.Item key="16" icon={<Cog size={15} />}>
                System Settings
              </Menu.Item>
            )}
            {checkPermission("storeSettings") === true && (
              <Menu.Item key="17" icon={<Wrench size={15} />}>
                Store Settings
              </Menu.Item>
            )}
            {checkPermission("emailTemplates") === true && (
              <Menu.Item key="18" icon={<FileCog size={15} />}>
                Email Templates
              </Menu.Item>
            )}
            {checkPermission("backup") === true && (
              <Menu.Item key="19" icon={<DatabaseBackup size={15} />}>
                Backup
              </Menu.Item>
            )}
          </Menu.SubMenu>
        )}
      </Menu>
    </Sider>
  );
};

export default SideMenu;
