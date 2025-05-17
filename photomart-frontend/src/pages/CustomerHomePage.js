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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import Drawer from "@mui/material/Drawer";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { setEncryptedItem, getDecryptedItem } from "../utils/encryptedStore";
import { log } from "../utils/logger";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Avatar from "@mui/material/Avatar";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ToastAlert from "../utils/toastAlert";
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
  const [openProfileDialog, setOpenProfileDialog] = useState(false);
  const [profile, setProfile] = useState({
    email: "",
    fullName: "",
    phone: "",
    address: "",
    profileImage: "",
  });
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [checkoutForm, setCheckoutForm] = useState({
    address: "",
    phoneNumber: "",
    paymentMethod: "Credit Card",
  });

  const [openOrdersDialog, setOpenOrdersDialog] = useState(false);
  const [orders, setOrders] = useState([]);

  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "info",
  });
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

    fetchProducts();

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
    const errors = validateProfile();
    if (Object.keys(errors).length > 0) {
      const firstError = Object.values(errors)[0]; // Get the first error message
      setToast({
        open: true,
        message: firstError,
        severity: "error",
      });
      return;
    }

    try {
      await axios.put("http://localhost:8080/api/profile", profile);
      setOpenProfileDialog(false);
    } catch (err) {
      console.error("Failed to save profile", err);
    }
  };

  const validateProfile = () => {
    const errors = {};

    if (!profile.fullName.trim()) {
      errors.fullName = "Full Name is required";
    } else if (profile.fullName.trim().length < 3) {
      errors.fullName = "Full Name must be at least 3 characters";
    }

    if (!profile.phoneNumber.trim()) {
      errors.phoneNumber = "Phone Number is required";
    } else if (!/^\d{10}$/.test(profile.phoneNumber.trim())) {
      errors.phoneNumber = "Phone Number must be exactly 10 digits";
    }

    if (!profile.address.trim()) {
      errors.address = "Address is required";
    } else if (profile.address.trim().length < 5) {
      errors.address = "Address must be at least 5 characters";
    }

    return errors;
  };

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
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      let updatedCart;
      if (existing) {
        updatedCart = prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        updatedCart = [...prev, { ...product, quantity: 1 }];
      }
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      return updatedCart;
    });
  };

  const validateCheckout = () => {
    const errors = {};

    if (!checkoutForm.address.trim()) {
      errors.address = "Address is required";
    } else if (checkoutForm.address.trim().length < 5) {
      errors.address = "Address must be at least 5 characters";
    }

    if (!checkoutForm.phoneNumber.trim()) {
      errors.phoneNumber = "Phone Number is required";
    } else if (!/^\d{10}$/.test(checkoutForm.phoneNumber.trim())) {
      errors.phoneNumber = "Phone Number must be exactly 10 digits";
    }

    return errors;
  };

  const fetchOrders = async () => {
    try {
      const email = getDecryptedItem("user").email;
      const res = await axios.get(
        `http://localhost:8080/api/orders?email=${email}`
      );
      setOrders(res.data);
    } catch (err) {
      console.error("Failed to fetch orders", err);
    }
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
    <Box sx={{ backgroundColor: "#FFFFFF", minHeight: "100vh" }}>
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
            <IconButton onClick={() => setCartOpen(true)} sx={{ ml: 2 }}>
              <ShoppingCartIcon />
            </IconButton>
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
                  fetchOrders(); // new function we’ll define
                  setOpenOrdersDialog(true);
                }}
              >
                Orders
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleMenuClose();
                  localStorage.removeItem("cart");
                  setCartItems([]);
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
        message="Order placed successfully!"
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      />

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
      <Drawer anchor="right" open={cartOpen} onClose={() => setCartOpen(false)}>
        <Box sx={{ width: 350, p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Shopping Cart
          </Typography>
          {cartItems.length === 0 ? (
            <Typography>No items in cart.</Typography>
          ) : (
            cartItems.map((item) => (
              <Box
                key={item.id}
                sx={{ mb: 2, borderBottom: "1px solid #ccc", pb: 1 }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <img
                    src={item.image}
                    alt={item.title}
                    style={{
                      width: 64,
                      height: 48,
                      objectFit: "cover",
                      marginRight: 8,
                    }}
                  />
                  <Box>
                    <Typography variant="subtitle1">{item.title}</Typography>
                    <Typography variant="body2">
                      Qty: {item.quantity}
                    </Typography>
                    <Typography variant="body2">
                      ${(item.price * item.quantity).toFixed(2)}
                    </Typography>
                  </Box>
                </Box>
                <IconButton
                  onClick={() =>
                    setCartItems((prev) => {
                      const updated = prev.filter((p) => p.id !== item.id);
                      localStorage.setItem("cart", JSON.stringify(updated));
                      return updated;
                    })
                  }
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            ))
          )}
          <Typography sx={{ mt: 2, fontWeight: "bold" }}>
            Total: $
            {cartItems
              .reduce((acc, item) => acc + item.price * item.quantity, 0)
              .toFixed(2)}
          </Typography>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            onClick={() => setCheckoutOpen(true)}
          >
            Checkout
          </Button>
        </Box>
      </Drawer>
      <Dialog
        open={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        fullWidth
      >
        <DialogTitle>Checkout</DialogTitle>
        <DialogContent>
          <Typography variant="subtitle1" gutterBottom>
            Order Summary
          </Typography>
          {cartItems.map((item) => (
            <Box key={item.id} sx={{ mb: 1 }}>
              <Typography>
                {item.title} x {item.quantity} — ${item.price * item.quantity}
              </Typography>
            </Box>
          ))}
          <Typography sx={{ mt: 2, fontWeight: "bold" }}>
            Total: $
            {cartItems
              .reduce((acc, item) => acc + item.price * item.quantity, 0)
              .toFixed(2)}
          </Typography>
          <TextField
            label="Delivery Address"
            fullWidth
            margin="dense"
            value={checkoutForm.address}
            onChange={(e) =>
              setCheckoutForm({ ...checkoutForm, address: e.target.value })
            }
          />
          <TextField
            label="Phone Number"
            fullWidth
            margin="dense"
            value={checkoutForm.phoneNumber}
            onChange={(e) =>
              setCheckoutForm({ ...checkoutForm, phoneNumber: e.target.value })
            }
          />
          <TextField
            label="Payment Method"
            fullWidth
            margin="dense"
            value={checkoutForm.paymentMethod}
            disabled
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCheckoutOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={async () => {
              const user = getDecryptedItem("user");
              try {
                const errors = validateCheckout();
                if (Object.keys(errors).length > 0) {
                  // alert(Object.values(errors).join("\n"));
                  const firstError = Object.values(errors)[0]; // Get the first error message
                  setToast({
                    open: true,
                    message: firstError,
                    severity: "error",
                  });
                  return;
                }

                await axios.post("http://localhost:8080/api/orders", {
                  email: user.email,
                  address: checkoutForm.address,
                  phoneNumber: checkoutForm.phoneNumber,
                  paymentMethod: checkoutForm.paymentMethod,
                  items: cartItems,
                });
                setCartItems([]);
                localStorage.removeItem("cart");
                setCheckoutOpen(false);
                setOpenSnackbar(true);
              } catch (err) {
                console.error("Order submission failed", err);
              }
            }}
          >
            Place Order
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openOrdersDialog}
        onClose={() => setOpenOrdersDialog(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Order History</DialogTitle>
        <DialogContent dividers>
          {orders.length === 0 ? (
            <Typography>No previous orders found.</Typography>
          ) : (
            orders.map((order) => (
              <Box
                key={order.id}
                sx={{
                  borderBottom: "1px solid #ddd",
                  pb: 2,
                  mb: 2,
                }}
              >
                <Typography variant="subtitle1" fontWeight="bold">
                  Order ID: {order.id}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  Address: {order.address} | Phone: {order.phoneNumber} |
                  Payment: {order.paymentMethod}
                </Typography>
                {order.items.map((item, idx) => (
                  <Box key={idx} sx={{ ml: 2 }}>
                    <Typography variant="body2">
                      • {item.title} x {item.quantity} — $
                      {item.price * item.quantity}
                    </Typography>
                  </Box>
                ))}
                <Typography sx={{ mt: 1 }} fontWeight="bold">
                  Total: $
                  {order.items
                    .reduce((acc, item) => acc + item.price * item.quantity, 0)
                    .toFixed(2)}
                </Typography>
              </Box>
            ))
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenOrdersDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
      <ToastAlert
        open={toast.open}
        onClose={() => setToast({ ...toast, open: false })}
        message={toast.message}
        severity={toast.severity}
      />
    </Box>
  );
};

export default CustomerHomePage;
