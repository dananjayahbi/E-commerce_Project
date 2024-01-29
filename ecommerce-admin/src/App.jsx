import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import PwResetSendOTP from "./pages/PwResetSendOTP";
import PwResetVerifyOTP from "./pages/PwResetVerifyOTP";
import PwReset from "./pages/PwReset";
import axios from "axios";
import "./App.css";

function App() {
  const location = useLocation();
  const isLogged = window.localStorage.getItem("LoggedIn");

  useEffect(() => {
    document.querySelector("html").style.scrollBehavior = "auto";
    window.scroll({ top: 0 });
    document.querySelector("html").style.scrollBehavior = "";

    // Check if there are any users in the database
    const checkUsers = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/users/getAllUsers"
        );
        if (!(response.data.length > 0)) {
          createDefaultAdmin();
        }
      } catch (error) {
        console.error("Error checking users", error);
      }
    };

    checkUsers();
  }, [location.pathname]); // triggered on route change

  // Create a default admin user if there are no users in the database
  const createDefaultAdmin = async () => {
    try {
        const defaultAdmin = {
          firstName: "administrator",
          lastName: " ",
          username: "administrator",
          email: "demo@admin.com",
          password: "administrator",
          role: "admin",
          phoneNumber: "0000000000",
          profileImage: " ",
          NIC: " ",
        };

        await axios.post("http://localhost:5000/users/register", defaultAdmin);
    } catch (error) {
      console.error("Error creating default admin", error);
    }
  };

  return (
    <>
      <Routes>
        {isLogged ? (
          <>
            <Route path="*" element={<Dashboard />} />
          </>
        ) : (
          <>
            <Route path="*" element={<Navigate to="/login" />} />
          </>
        )}
        <Route path="/login" element={<Login />} />
        <Route path="/sendOTP" element={<PwResetSendOTP />} />
        <Route path="/verifyOTP" element={<PwResetVerifyOTP />} />
        <Route path="/PwReset" element={<PwReset />} />
      </Routes>
    </>
  );
}

export default App;
