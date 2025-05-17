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
import Avatar from "@mui/material/Avatar";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

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
  const [openProfileDialog, setOpenProfileDialog] = useState(false);
  const [profile, setProfile] = useState({
    email: "",
    fullName: "",
    phone: "",
    address: "",
    profileImage: "",
  });

  // Fetch seller's own products when page loads
  useEffect(() => {
    fetchProducts();

    const fetchProfile = async () => {
      try {
        const email = getDecryptedItem("user").email;
        const res = await axios.get(
          `http://localhost:8080/api/profile?email=${email}`
        );
        setProfile(res.data);
      } catch (err) {
        console.error("Failed to load profile on mount", err);
      }
    };

    fetchProfile();
  }, []);

  // Fetch profile when dialog opens
  const handleOpenProfile = async () => {
    try {
      const email = getDecryptedItem("user").email;
      // log("Email is: ", email);
      const res = await axios.get(
        `http://localhost:8080/api/profile?email=${email}`
      );
      log("Profile: ", res.data);
      setProfile(res.data);
      setOpenProfileDialog(true);
    } catch (err) {
      console.error("Failed to load profile", err);
    }
  };

  const handleCloseProfile = () => setOpenProfileDialog(false);

  const handleProfileChange = (field, value) => {
    setProfile({ ...profile, [field]: value });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setProfile((prev) => ({ ...prev, profileImage: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = async () => {
    try {
      log("Profile : ", profile);
      await axios.put("http://localhost:8080/api/profile", profile);
      setOpenProfileDialog(false);
    } catch (err) {
      console.error("Failed to save profile", err);
    }
  };

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
    <Box sx={{ backgroundColor: "#FFFFFF", minHeight: "100vh", pb: 6 }}>
      {/* AppBar at the top */}
      <AppBar position="static" color="transparent" elevation={0}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Typography variant="h6" fontWeight={600}>
            PhotoMart Seller Dashboard
          </Typography>

          {/* Profile/Logout Menu */}
          <Box>
            <IconButton onClick={handleMenuOpen}>
              <Avatar
                alt="Profile"
                src={profile.profileImage || ""}
                sx={{ width: 36, height: 36 }}
              >
                {profile.fullName ? (
                  profile.fullName.charAt(0)
                ) : (
                  <AccountCircleIcon />
                )}
              </Avatar>
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem
                onClick={() => {
                  handleMenuClose();
                  handleOpenProfile();
                }}
              >
                Profile
              </MenuItem>
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

      <Dialog
        open={openProfileDialog}
        onClose={handleCloseProfile}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
            <label htmlFor="upload-photo">
              <input
                style={{ display: "none" }}
                id="upload-photo"
                name="upload-photo"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
              />
              <Avatar
                src={profile.profileImage || ""}
                sx={{ width: 80, height: 80, cursor: "pointer" }}
              >
                {profile.fullName ? (
                  profile.fullName.charAt(0)
                ) : (
                  <AccountCircleIcon />
                )}
              </Avatar>
            </label>
          </Box>
          <TextField
            margin="dense"
            label="Email"
            value={profile.email}
            fullWidth
            disabled
          />
          <TextField
            margin="dense"
            label="Full Name"
            value={profile.fullName}
            onChange={(e) => handleProfileChange("fullName", e.target.value)}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Phone Number"
            value={profile.phoneNumber}
            onChange={(e) => handleProfileChange("phoneNumber", e.target.value)}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Address"
            value={profile.address}
            onChange={(e) => handleProfileChange("address", e.target.value)}
            fullWidth
            multiline
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseProfile}>Cancel</Button>
          <Button onClick={handleSaveProfile} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SellerHomePage;
