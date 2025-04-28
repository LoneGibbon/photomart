// RegisterPage.js
// Displays the registration page where users can create a new customer or seller account.

import {
  Grid,
  TextField,
  Button,
  Typography,
  MenuItem,
  Paper,
  Snackbar,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import React, { useEffect, useState } from "react";
import LandingPageSVG from "../assets/landing.svg";
import { useAuth } from "../context/AuthContext";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const { login, isAuthenticated } = useAuth();

  /**
   * Handles registration form submission.
   * Sends user details to backend and redirects to login page on success.
   */
  const handleRegister = async (values) => {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/auth/register",
        values,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      setOpenSnackbar(true);
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      const msg = error.response?.data?.error || "Registration failed";
      alert(msg);
    }
  };

  /**
   * If already authenticated, redirect to home page.
   */
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/home");
    }
  }, []);

  return (
    <Grid container sx={{ minHeight: "100vh" }}>
      {/* Left section - Visual/Illustration */}
      <Grid
        item
        xs={12}
        md={6}
        sx={{
          backgroundColor: "#A8DADC",
          backgroundImage:
            "url('https://www.toptal.com/designers/subtlepatterns/patterns/memphis-mini.png')",
          backgroundRepeat: "repeat",
          backgroundSize: "auto",
          color: "#1D3557",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          p: 4,
        }}
      >
        <img
          src={LandingPageSVG}
          alt="Register Illustration"
          style={{ width: "80%", maxWidth: 400 }}
        />
        <Typography variant="h4" fontWeight={700} align="center" mt={4}>
          Join the PhotoMart Community
        </Typography>
        <Typography variant="body1" align="center" mt={2} maxWidth="80%">
          Upload, sell, and discover breathtaking images — powered by AI, fueled
          by creativity.
        </Typography>
      </Grid>

      {/* Right section - Registration form */}
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
          sx={{ borderRadius: 4, padding: 4, width: "100%", maxWidth: 450 }}
        >
          <Typography variant="h5" align="center" fontWeight={600} gutterBottom>
            Create an Account
          </Typography>

          {/* Formik - handles form state, validation, and submission */}
          <Formik
            initialValues={{
              name: "",
              email: "",
              password: "",
              role: "customer",
            }}
            validationSchema={Yup.object({
              name: Yup.string().required("Full name is required"),
              email: Yup.string()
                .email("Invalid email address")
                .required("Email is required"),
              password: Yup.string()
                .min(4, "Password must be at least 4 characters")
                .required("Password is required"),
              role: Yup.string()
                .oneOf(["customer", "seller"], "Invalid role")
                .required("Role is required"),
            })}
            onSubmit={handleRegister}
          >
            {({ values, errors, touched, handleChange }) => (
              <Form>
                <TextField
                  fullWidth
                  label="Full Name"
                  name="name"
                  margin="normal"
                  value={values.name}
                  onChange={handleChange}
                  error={touched.name && Boolean(errors.name)}
                  helperText={touched.name && errors.name}
                />
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
                <TextField
                  fullWidth
                  select
                  label="Role"
                  name="role"
                  margin="normal"
                  value={values.role}
                  onChange={handleChange}
                  error={touched.role && Boolean(errors.role)}
                  helperText={touched.role && errors.role}
                >
                  <MenuItem value="customer">Customer</MenuItem>
                  <MenuItem value="seller">Seller</MenuItem>
                </TextField>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 2 }}
                >
                  Register
                </Button>
              </Form>
            )}
          </Formik>

          <Typography variant="body2" align="center" sx={{ mt: 2 }}>
            Already have an account?{" "}
            <Link to="/login" style={{ color: "#1D3557" }}>
              Login here
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
          Registration successful!
        </MuiAlert>
      </Snackbar>
    </Grid>
  );
};

export default RegisterPage;
