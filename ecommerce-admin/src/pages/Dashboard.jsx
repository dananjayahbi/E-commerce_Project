import React, { useEffect, useState } from "react";
import { Layout } from "antd";
import SideMenu from "../partials/SideMenu";
import Footer from "../partials/Footer";
import Header from "../partials/Header";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/Home";
import Products from "../pages/ProductsManagement/Products";
import Category from "../pages/ProductsManagement/Category";
import Units from "../pages/ProductsManagement/Units";
import Brands from "../pages/ProductsManagement/Brands";
import Orders from "../pages/OrdersManagement/Orders";
import Sales from "../pages/SalesManagement/Sales";
import NewSale from "../pages/SalesManagement/NewSale";
import Customers from "../pages/People/Customers";
import Users from "../pages/UserManagement/Users";
import Roles from "../pages/UserManagement/Roles";
import SalesReport from "../pages/Reports/SalesReport";
import InventoryReport from "../pages/Reports/InventoryReport";
import ProductsReport from "../pages/Reports/ProductsReport";
import ProductQuantityAlerts from "../pages/Reports/PeoductQuantityAlerts";
import SystemSettings from "../pages/Settings/SystemSettings";
import StoreSettings from "../pages/Settings/StoreSettings";
import EmailTemplates from "../pages/Settings/EmailTemplates";
import Backup from "../pages/Settings/Backup";
import LowWidth from "../pages/LowWidth";
import UserProfile from "../pages/UserManagement/UserProfile";

const { Content, Header: AntHeader, Footer: AntFooter } = Layout;

const Dashboard = () => {
  const isLogged = window.localStorage.getItem("LoggedIn");
  const [redirectToError, setRedirectToError] = useState(false);

  // If not logged in, redirect to login page
  useEffect(() => {
    // Define the effect to monitor changes in localStorage
    const handleStorageChange = () => {
      const updatedIsLogged = window.localStorage.getItem("LoggedIn");
      if (!updatedIsLogged) {
        // If not logged in, redirect to login page
        window.location.href = "/login";
      }
    };

    // Listen for changes in localStorage
    window.addEventListener("storage", handleStorageChange);

    return () => {
      // Clean up the event listener when the component unmounts
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [500]);

  useEffect(() => {
    const handleResize = () => {
      const deviceWidth = window.innerWidth;
      if (!redirectToError && deviceWidth < 768) {
        setRedirectToError(true);
      } else if (redirectToError && deviceWidth >= 768) {
        setRedirectToError(false);
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [redirectToError]);

  if (isLogged === "false") {
    // If not logged in, redirect to login page
    return <Navigate to="/login" />;
  }

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {!redirectToError && (
        <>
          <SideMenu />
          <Layout>
            <Header />
            <Content style={{ padding: "50px" }}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/category" element={<Category />} />
                <Route path="/units" element={<Units />} />
                <Route path="/brands" element={<Brands />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/sales" element={<Sales />} />
                <Route path="/newSale" element={<NewSale />} />
                <Route path="/customers" element={<Customers />} />
                <Route path="/users" element={<Users />} />
                <Route path="/roles" element={<Roles />} />
                <Route path="/salesReport" element={<SalesReport />} />
                <Route path="/inventoryReport" element={<InventoryReport />} />
                <Route path="/productsReport" element={<ProductsReport />} />
                <Route
                  path="/productQuantityAlerts"
                  element={<ProductQuantityAlerts />}
                />
                <Route path="/systemSettings" element={<SystemSettings />} />
                <Route path="/storeSettings" element={<StoreSettings />} />
                <Route path="/emailTemplates" element={<EmailTemplates />} />
                <Route path="/backup" element={<Backup />} />
                <Route path="/userProfile" element={<UserProfile />} />
              </Routes>
            </Content>
            <AntFooter>
              <Footer />
            </AntFooter>
          </Layout>
        </>
      )}
  
      {redirectToError && <LowWidth />} {/* Render LowWidth page conditionally */}
    </Layout>
  );
  
};

export default Dashboard;
