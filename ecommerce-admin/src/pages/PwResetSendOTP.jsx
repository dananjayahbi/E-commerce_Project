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
import { MailOutline as MailOutlineIcon } from "@mui/icons-material";
import axios from "axios";

const CustomTextField = ({ field, form, ...props }) => (
  <TextField {...field} {...props} />
);

const PwResetSendOTP = () => {
  const initialValues = { email: "" };
  const [loading, setLoading] = useState(false);

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    setLoading(true);
    try {
      await axios.post("http://localhost:5000/users/handleOTP", {
        email: values.email, // Pass email in the request body
      });
      console.log("Email sent successfully to backend for OTP handling.");
      // Redirect to verifyOTP page
      message.success("Check your email for the OTP.");
      window.location.href = "/verifyOTP"; // Change the URL to the appropriate route
    } catch (error) {
      console.error("Failed to send email to backend for OTP handling:", error);
      message.error("Failed to send the otp.");
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
        <MailOutlineIcon />
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
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                loading={loading}
                disabled={isSubmitting}
                style={{ margin: "16px 0" }}
              >
                Submit
              </Button>
            </Form>
          )}
        </Formik>
      </Paper>
    </Container>
  );
};

export default PwResetSendOTP;
