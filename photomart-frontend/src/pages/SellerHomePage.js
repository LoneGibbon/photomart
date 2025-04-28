// SellerHomePage.js
// Displays the seller dashboard where sellers can view, add, and delete their products.

import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  InputLabel,
  Select,
  FormControl,
  MenuItem as SelectItem,
  Fab,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AddIcon from "@mui/icons-material/Add";
import { getDecryptedItem } from "../utils/encryptedStore";
import { log } from "../utils/logger";

// Predefined categories sellers can choose from
const initialCategories = [
  "Nature",
  "Urban",
  "Portraits",
  "Abstract",
  "Travel",
  "Minimalism",
];

const SellerHomePage = ({ onLogout }) => {
  const [anchorEl, setAnchorEl] = useState(null); // Menu anchor (for logout menu)
  const [openDialog, setOpenDialog] = useState(false); // Controls open/close of add product dialog
  const [products, setProducts] = useState([]); // Products belonging to the seller
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    image: "",
  });

  // Fetch seller's own products when page loads
  useEffect(() => {
    fetchProducts();
  }, []);

  /**
   * Fetches the products uploaded by the logged-in seller.
   */
  const fetchProducts = async () => {
    const user = getDecryptedItem("user");
    try {
      const res = await axios.post("http://localhost:8080/api/products/mine", {
        email: user.email,
      });
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  // Handles opening the logout/profile menu
  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);

  // Handles closing the logout/profile menu
  const handleMenuClose = () => setAnchorEl(null);

  // Opens the add new product dialog
  const handleOpenDialog = () => {
    // Reset form when opening
    setFormData({
      title: "",
      description: "",
      price: "",
      category: "",
      image: "",
    });
    setOpenDialog(true);
  };

  // Closes the add product dialog
  const handleCloseDialog = () => setOpenDialog(false);

  // Handles changes in the form fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /**
   * Handles adding a new product to the seller's list.
   */
  const handleAddProduct = async () => {
    const user = getDecryptedItem("user");

    try {
      const res = await axios.post("http://localhost:8080/api/products", {
        ...formData,
        sellerEmail: user.email, // Attach seller email when adding
      });

      // Update the UI instantly with the new product
      setProducts((prev) => [...prev, res.data]);
      setOpenDialog(false);
    } catch (err) {
      console.error("Error adding product:", err);
    }
  };

  /**
   * Handles deleting a product.
   */
  const handleDeleteProduct = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/products/${id}`);
      // Remove the product from the list in UI
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Error deleting product:", err);
    }
  };

  return (
    <Box sx={{ backgroundColor: "#F1FAEE", minHeight: "100vh", pb: 6 }}>
      {/* AppBar at the top */}
      <AppBar position="static" color="transparent" elevation={0}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Typography variant="h6" fontWeight={600}>
            PhotoMart Seller Dashboard
          </Typography>

          {/* Profile/Logout Menu */}
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

      {/* Product Listing Section */}
      <Box sx={{ mt: 4, px: 3 }}>
        <Typography variant="h5" fontWeight={600} gutterBottom>
          Your Products
        </Typography>

        {products.length === 0 ? (
          <Typography variant="body1">No products added yet.</Typography>
        ) : (
          <Grid container spacing={3}>
            {products.map((product) => (
              <Grid item xs={12} sm={6} md={4} key={product.id}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  {/* Product Image */}
                  <CardMedia
                    component="img"
                    image={product.image}
                    alt={product.title}
                    height="200"
                    sx={{ objectFit: "cover" }}
                  />
                  {/* Product Details */}
                  <CardContent>
                    <Typography variant="h6">{product.title}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      ${product.price}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {product.category}
                    </Typography>
                  </CardContent>
                  {/* Delete Button */}
                  <CardActions>
                    <Button
                      color="error"
                      onClick={() => handleDeleteProduct(product.id)}
                    >
                      Delete
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      {/* Add New Product Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Add New Product</DialogTitle>
        <DialogContent>
          {/* Title Field */}
          <TextField
            fullWidth
            margin="normal"
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
          />
          {/* Description Field */}
          <TextField
            fullWidth
            margin="normal"
            label="Description"
            name="description"
            multiline
            rows={3}
            value={formData.description}
            onChange={handleInputChange}
          />
          {/* Price Field */}
          <TextField
            fullWidth
            margin="normal"
            label="Price"
            name="price"
            type="number"
            value={formData.price}
            onChange={handleInputChange}
          />
          {/* Category Selector */}
          <FormControl fullWidth margin="normal">
            <InputLabel>Category</InputLabel>
            <Select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              label="Category"
            >
              {initialCategories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </Select>
          </FormControl>
          {/* Image URL Field */}
          <TextField
            fullWidth
            margin="normal"
            label="Image URL"
            name="image"
            value={formData.image}
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button variant="contained" onClick={handleAddProduct}>
            Add Product
          </Button>
        </DialogActions>
      </Dialog>

      {/* Floating Action Button (FAB) */}
      <Fab
        color="primary"
        sx={{ position: "fixed", bottom: 32, right: 32 }}
        onClick={handleOpenDialog}
      >
        <AddIcon />
      </Fab>
    </Box>
  );
};

export default SellerHomePage;
