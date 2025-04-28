// HomePage.js
// Determines whether to show the Customer or Seller home page based on user role.

import React, { useState, useEffect } from "react";
import { Button, Typography, Container } from "@mui/material";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getDecryptedItem } from "../utils/encryptedStore";
import CustomerHomePage from "./CustomerHomePage";
import SellerHomePage from "./SellerHomePage";

const HomePage = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true); // Controls loading screen while decrypting user
  const user = getDecryptedItem("user"); // Fetch decrypted user info from encrypted storage

  useEffect(() => {
    // Wait until user data is available before rendering the page
    if (user) {
      setLoading(false);
    }
  }, [user]);

  /**
   * Logs the user out and redirects back to the login page.
   */
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // If still loading user info, show a loader
  if (loading) {
    return (
      <Container sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <Typography variant="h5">Loading...</Typography>
      </Container>
    );
  }

  // If no valid user is found, redirect to login
  if (!user || !user.role) {
    return <Navigate to="/login" />;
  }

  // Conditionally render the appropriate home page based on user role
  if (user.role === "CUSTOMER") {
    return <CustomerHomePage onLogout={handleLogout} />;
  } else if (user.role === "SELLER") {
    return <SellerHomePage onLogout={handleLogout} />;
  }

  // Fallback redirect to login if something unexpected happens
  return <Navigate to="/login" />;
};

export default HomePage;
