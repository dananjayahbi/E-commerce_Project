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
import axios from "axios";

const CustomTextField = ({ field, form, ...props }) => (
  <TextField {...field} {...props} />
);

const PwReset = () => {
  const [resetError, setResetError] = useState("");
  const [loading, setLoading] = useState(false);

  const initialValues = {
    newPassword: "",
    confirmPassword: "",
  };

  const validationSchema = Yup.object().shape({
    newPassword: Yup.string()
      .required("New Password is required")
      .min(8, "Password must be at least 8 characters"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
      .required("Confirm Password is required"),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    setLoading(true);
    try {
      const userId = localStorage.getItem("userId");
      await axios.put(
        "http://localhost:5000/users/resetPassword",
        {
          userId,
          newPassword: values.newPassword,
        }
      );

      console.log("Password reset successful");
      message.success("Password reset successful.");
      // Redirect to login page after password reset
      window.location.href = "./Login";
    } catch (error) {
      console.error("Password reset failed:", error);
      setResetError("Failed to reset password. Please try again.");
      message.error("Failed to reset password. Please try again.");
    } finally {
      setSubmitting(false);
      setLoading(false);
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
        <Typography component="h1" variant="h5">
          Reset Password
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
                id="newPassword"
                label="New Password"
                name="newPassword"
                type="password"
              />
              <Field
                component={CustomTextField}
                variant="outlined"
                margin="normal"
                fullWidth
                id="confirmPassword"
                label="Confirm Password"
                name="confirmPassword"
                type="password"
              />
              {resetError && (
                <Typography color="error">{resetError}</Typography>
              )}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                loading={loading}
                disabled={isSubmitting}
                style={{ margin: "16px 0" }}
              >
                Reset Password
              </Button>
            </Form>
          )}
        </Formik>
      </Paper>
    </Container>
  );
};

export default PwReset;
