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

const PwResetVerifyOTP = () => {
  const [verificationError, setVerificationError] = useState("");
  const [loading, setLoading] = useState(false);

  const initialValues = {
    otp: "",
  };

  const validationSchema = Yup.object().shape({
    otp: Yup.string()
      .matches(/^\d{6}$/, "OTP must be exactly 6 digits")
      .required("OTP is required"),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/users/verifyOTP",
        { otp: values.otp }
      );

      if (response.data.status === true) {
        console.log("OTP verification successful");
        message.success("OTP verified successfully.");
        localStorage.setItem("userId", (response.data.user._id))

        // Redirect to password reset page if OTP verification is successful
        window.location.href = "./PwReset";
      } else {
        setVerificationError("Incorrect OTP. Please try again.");
        message.error("Incorrect OTP. Please try again.");
      }
    } catch (error) {
      console.error("OTP verification failed:", error);
      setVerificationError("Error verifying OTP. Please try again.");
      message.error("Error verifying OTP. Please try again.");
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
          OTP Verification
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
                id="otp"
                name="otp"
                label="Enter OTP"
                type="text"
                inputProps={{
                  maxLength: 6,
                  pattern: "[0-9]*",
                  inputMode: "numeric",
                }}
              />
              {verificationError && (
                <Typography color="error">{verificationError}</Typography>
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
                Verify OTP
              </Button>
            </Form>
          )}
        </Formik>
      </Paper>
    </Container>
  );
};

export default PwResetVerifyOTP;
