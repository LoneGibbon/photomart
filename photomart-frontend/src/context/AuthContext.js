import React, { createContext, useContext, useState, useEffect } from "react";

// Create a Context for authentication state
const AuthContext = createContext();

/**
 * AuthProvider component that wraps the app and provides authentication state.
 *
 * Manages whether the user is logged in or not using React Context.
 */
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Tracks if user is logged in
  const [loading, setLoading] = useState(true); // Tracks if auth check is still loading

  // On initial load, check localStorage to see if the user is already authenticated
  useEffect(() => {
    const stored = localStorage.getItem("isAuthenticated");
    setIsAuthenticated(stored === "true");
    setLoading(false);
  }, []);

  /**
   * Function to log the user in.
   * Saves the authenticated state in localStorage.
   */
  const login = () => {
    localStorage.setItem("isAuthenticated", "true");
    setIsAuthenticated(true);
    return true;
  };

  /**
   * Function to log the user out.
   * Clears authentication state and user data from localStorage.
   */
  const logout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("user"); // Also removes the saved user object
    setIsAuthenticated(false);
  };

  // Prevent rendering child components until authentication check is complete
  if (loading) return null;

  // Provide the authentication state and functions to child components
  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Custom hook to access authentication context easily in components.
 */
export const useAuth = () => useContext(AuthContext);
