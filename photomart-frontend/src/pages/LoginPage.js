// LoginPage.js
// Displays the main login page for PhotoMart with a landing illustration and form

import { useNavigate, Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Typography,
  TextField,
  Button,
  Paper,
  Snackbar,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import LandingPageSVG from "../assets/landing.svg";
import { setEncryptedItem } from "../utils/encryptedStore";
import { log } from "../utils/logger"; // Custom logger for dev-friendly logs

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const [openSnackbar, setOpenSnackbar] = useState(false);

  // If already authenticated, redirect to home page
  useEffect(() => {
    if (isAuthenticated) navigate("/home");
  }, [isAuthenticated, navigate]);

  /**
   * Handles login form submission.
   * Sends user credentials to backend, saves user info and token on success.
   */
  const handleLogin = async (values) => {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/auth/login",
        values,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      log("Login response:", response);

      const { token, role, email } = response.data;

      localStorage.setItem("isAuthenticated", "true");
      setEncryptedItem("user", { email, role });
      setEncryptedItem("token", token);
      login();
      navigate("/home");
    } catch (error) {
      if (error.response && error.response.status === 401) {
        // alert("Invalid credentials");
        setOpenSnackbar(true);
      } else {
        // alert("An error occurred. Please try again.");
        setOpenSnackbar(true);
      }
    }
  };

  return (
    <Grid container sx={{ minHeight: "100vh" }}>
      {/* Left section - Landing Illustration and Tagline */}
      <Grid
        item
        xs={12}
        md={6}
        sx={{
          backgroundColor: "#A8DADC",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 4,
        }}
      >
        <img
          src={LandingPageSVG}
          alt="Photography Illustration"
          style={{ width: "80%", maxWidth: 400 }}
        />
        <Typography
          variant="h4"
          fontWeight={700}
          align="center"
          mt={4}
          color="#1D3557"
        >
          Discover, Buy & Sell Stunning Photography
        </Typography>
        <Typography
          variant="body1"
          align="center"
          mt={2}
          color="#1D3557"
          maxWidth="80%"
        >
          PhotoMart is your AI-powered marketplace for digital and physical
          prints. Join the creative revolution.
        </Typography>
      </Grid>

      {/* Right section - Login Form */}
      <Grid
        item
        xs={12}
        md={6}
        sx={{
          backgroundColor: "#F1FAEE",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 4,
        }}
      >
        <Paper
          elevation={4}
          sx={{
            borderRadius: 4,
            p: 4,
            width: "100%",
            maxWidth: 400,
          }}
        >
          <Typography
            variant="h5"
            align="center"
            fontWeight={600}
            color="primary"
            gutterBottom
          >
            Login to Your Account
          </Typography>

          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={Yup.object({
              email: Yup.string().email("Invalid email").required("Required"),
              password: Yup.string().required("Required"),
            })}
            onSubmit={handleLogin}
          >
            {({ values, errors, touched, handleChange }) => (
              <Form>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  margin="normal"
                  value={values.email}
                  onChange={handleChange}
                  error={touched.email && Boolean(errors.email)}
                  helperText={touched.email && errors.email}
                />
                <TextField
                  fullWidth
                  label="Password"
                  type="password"
                  name="password"
                  margin="normal"
                  value={values.password}
                  onChange={handleChange}
                  error={touched.password && Boolean(errors.password)}
                  helperText={touched.password && errors.password}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  sx={{ mt: 3 }}
                >
                  Login
                </Button>
              </Form>
            )}
          </Formik>

          <Typography variant="body2" align="center" sx={{ mt: 2 }}>
            Don’t have an account?{" "}
            <Link to="/register" style={{ color: "#1D3557" }}>
              Register here
            </Link>
          </Typography>
        </Paper>
      </Grid>
      {/* Snackbar - shows success message on successful registration */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={2000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MuiAlert
          onClose={() => setOpenSnackbar(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          Invalid credentials!
        </MuiAlert>
      </Snackbar>
    </Grid>
  );
};

export default LoginPage;
