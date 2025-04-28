// CustomerHomePage.js
// Displays the customer home page with product listings, categories, search, and a logout menu.

import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Tabs,
  Tab,
  Container,
  TextField,
  InputAdornment,
  Menu,
  MenuItem,
  IconButton,
  Snackbar,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { setEncryptedItem, getDecryptedItem } from "../utils/encryptedStore";
import { log } from "../utils/logger";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Available product categories
const categories = [
  "All",
  "Nature",
  "Urban",
  "Portraits",
  "Abstract",
  "Travel",
  "Minimalism",
];

const CustomerHomePage = ({ onLogout }) => {
  const [selectedCategory, setSelectedCategory] = useState("All"); // Selected tab/category
  const [filteredProducts, setFilteredProducts] = useState([]); // Products shown on UI
  const [anchorEl, setAnchorEl] = useState(null); // For profile menu
  const [searchTerm, setSearchTerm] = useState(""); // Text in the search bar
  const navigate = useNavigate();
  const [products, setProducts] = useState([]); // All fetched products
  const [openSnackbar, setOpenSnackbar] = useState(false); // Toast for "coming soon" message

  /**
   * Fetches all products from backend API.
   */
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/products");
        setProducts(res.data);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };
    fetchProducts();
  }, []);

  /**
   * Applies filters whenever category, search term, or products change.
   */
  useEffect(() => {
    let filtered = products;
    if (selectedCategory !== "All") {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }
    if (searchTerm.trim()) {
      filtered = filtered.filter((p) =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredProducts(filtered);
  }, [selectedCategory, searchTerm, products]);

  /**
   * Shows "coming soon" toast when add to cart is clicked.
   */
  const handleAddToCart = (product) => {
    setOpenSnackbar(true);
  };

  /**
   * Handles profile menu open.
   */
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  /**
   * Closes the profile menu.
   */
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ backgroundColor: "#F1FAEE", minHeight: "100vh" }}>
      {/* Top App Bar */}
      <AppBar position="static" color="transparent" elevation={0}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          {/* Logo/Title */}
          <Typography
            variant="h6"
            onClick={() => navigate("/home")}
            sx={{ cursor: "pointer", fontWeight: 600 }}
          >
            PhotoMart
          </Typography>

          {/* Search Bar */}
          <TextField
            placeholder="Search photos..."
            variant="outlined"
            size="small"
            sx={{ width: "50%" }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />

          {/* Profile Menu */}
          <Box>
            <IconButton onClick={handleMenuOpen}>
              <MoreVertIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem
                onClick={() => {
                  handleMenuClose();
                  onLogout();
                }}
              >
                Logout
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Category Tabs */}
      <Container sx={{ mt: 4 }}>
        <Tabs
          value={selectedCategory}
          onChange={(e, newValue) => setSelectedCategory(newValue)}
          variant="scrollable"
          scrollButtons
          allowScrollButtonsMobile
          textColor="primary"
          indicatorColor="primary"
          sx={{ mb: 4 }}
        >
          {categories.map((cat) => (
            <Tab key={cat} label={cat} value={cat} />
          ))}
        </Tabs>

        {/* Product Grid */}
        <Grid container spacing={4}>
          {filteredProducts.map((product) => (
            <Grid item xs={12} sm={6} md={4} key={product.id}>
              <Card
                sx={{
                  borderRadius: 3,
                  boxShadow: "none",
                  border: "1px solid #e0e0e0",
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                  overflow: "hidden",
                }}
              >
                {/* Product Image */}
                <Box
                  sx={{
                    position: "relative",
                    width: "100%",
                    aspectRatio: "4 / 3",
                  }}
                >
                  <CardMedia
                    component="img"
                    image={product.image}
                    alt={product.title}
                    loading="lazy"
                    sx={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      position: "absolute",
                      top: 0,
                      left: 0,
                    }}
                  />
                </Box>

                {/* Product Info */}
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    {product.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    ${product.price.toFixed(2)}
                  </Typography>
                </CardContent>

                {/* Add to Cart Button */}
                <CardActions sx={{ px: 2, pb: 2 }}>
                  <Button
                    variant="contained"
                    fullWidth
                    size="large"
                    onClick={() => handleAddToCart(product)}
                  >
                    Add to Cart
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Snackbar for "coming soon" */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        message="Add to cart is coming soon!"
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      />
    </Box>
  );
};

export default CustomerHomePage;
