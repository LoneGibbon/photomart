import React, { createContext, useContext } from "react";
import {
  createTheme,
  ThemeProvider as MuiThemeProvider,
} from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

// Create a ThemeContext, in case we want to expand theme control in the future
const ThemeContext = createContext();

// Define a pastel-inspired MUI theme for the whole app
const pastelTheme = createTheme({
  palette: {
    primary: { main: "#A8DADC" }, // Light teal
    secondary: { main: "#B8E2D0" }, // Soft green
    success: { main: "#B7E4C7" }, // Mint green
    warning: { main: "#FFE5B4" }, // Soft orange
    error: { main: "#FFADAD" }, // Light red
    background: {
      default: "#F1FAEE", // Soft very light teal
      paper: "#FFFFFF", // White cards/paper
    },
    text: {
      primary: "#1D3557", // Deep navy for main text
      secondary: "#457B9D", // Softer blue for secondary text
    },
  },
  typography: {
    fontFamily: "Inter, sans-serif",
    fontSize: 14, // Base font size
    h1: { fontSize: "2rem", fontWeight: 600 },
    h2: { fontSize: "1.5rem", fontWeight: 500 },
    body1: { fontSize: "1rem" },
    button: { textTransform: "none" }, // Keep button text normal case
  },
});

/**
 * ThemeProvider wrapper for the whole app.
 *
 * It provides both:
 * - The pastel MUI theme
 * - A custom ThemeContext (currently empty, but we can add dynamic theming later)
 */
export const ThemeProvider = ({ children }) => {
  return (
    <ThemeContext.Provider value={{}}>
      <MuiThemeProvider theme={pastelTheme}>
        <CssBaseline /> {/* Resets default browser CSS for consistency */}
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

/**
 * Hook to use the ThemeContext easily inside components.
 */
export const useThemeContext = () => useContext(ThemeContext);
