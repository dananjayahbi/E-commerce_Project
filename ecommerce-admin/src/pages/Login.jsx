import React, { useState } from "react";
import { Formik, Form, Field } from "formik";
import { message } from "antd";
import * as Yup from "yup";
import {
  Button,
  Typography,
  Container,
  CssBaseline,
  TextField,
  Paper,
} from "@mui/material";
import { LockOutlined as LockOutlinedIcon } from "@mui/icons-material";
import axios from "axios";

const CustomTextField = ({ field, form, ...props }) => (
  <TextField {...field} {...props} />
);

const Login = () => {
  const [error, setError] = useState("");
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);

  const initialValues = { emailOrUsername: "", password: "" };

  const validationSchema = Yup.object({
    emailOrUsername: Yup.string().required("Username is required"),
    password: Yup.string().required("Password is required"),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/users/login",
        values
      );
  
      console.log("Login successful");
  
      // Store only the token in local storage
      window.localStorage.setItem("token", response.data.token);
      setToken(response.data.token);
  
      // Store the user id in local storage
      window.localStorage.setItem("userId", response.data.user.id);
  
      // Store the role in local storage
      const role = response.data.user.role; // Get role from response
      window.localStorage.setItem("role", role);
      setRole(role);
  
      // Set LoggedIn to true
      window.localStorage.setItem("LoggedIn", true);
  
      // Get role permissions
      const roleData = await axios.get(`http://localhost:5000/roles/getRoleByRoleName/${role}`,{
        headers: {
          Authorization: `Bearer ${response.data.token}`, // Use response token
        },
      });
  
      // Convert permissions object to array of key-value pairs, excluding the "_id" field
      const permissionsArray = Object.entries(roleData.data.permissions[0])
        .filter(([key]) => key !== "_id")
        .map(([key, value]) => `${key}:${value}`);
  
      // Store the role permissions in local storage as a JSON array
      window.localStorage.setItem("rolePermissions",permissionsArray); // Stringify permissions array
  
      console.log(localStorage.getItem("rolePermissions"));
  
      window.location.href = "/";
    } catch (error) {
      console.error("Login failed", error);
      message.error(error.response.data.message);
      setError("Invalid username or password");
    } finally {
      setSubmitting(false);
    }
  };     

  return (
    <Container
      component="main"
      maxWidth="xs"
      style={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <CssBaseline />
      <Paper
        elevation={3}
        style={{
          padding: "16px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.2)",
        }}
      >
        <LockOutlinedIcon />
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form noValidate>
              <Field
                component={CustomTextField}
                variant="outlined"
                margin="normal"
                fullWidth
                id="emailOrUsername"
                label="Username"
                name="emailOrUsername"
                autoComplete="emailOrUsername"
              />
              <Field
                component={CustomTextField}
                variant="outlined"
                margin="normal"
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
              />
              {error && <Typography color="error">{error}</Typography>}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                disabled={isSubmitting}
                style={{ margin: "16px 0" }}
              >
                Sign In
              </Button>

              {/* forgot password */}
              <Typography
                variant="body2"
                align="center"
                style={{ textDecoration: "none" }}
              >
                <a href="/sendOTP" style={{ textDecoration: "none" }}>Forgot password?</a>
              </Typography>
            </Form>
          )}
        </Formik>
      </Paper>
    </Container>
  );
};

export default Login;
