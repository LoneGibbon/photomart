import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import { useAuth } from "./context/AuthContext";

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<Navigate to={isAuthenticated ? "/home" : "/login"} />}
        />
        <Route
          path="/login"
          element={!isAuthenticated ? <LoginPage /> : <Navigate to="/home" />}
        />
        <Route
          path="/register"
          element={
            !isAuthenticated ? <RegisterPage /> : <Navigate to="/home" />
          }
        />
        <Route
          path="/home"
          element={isAuthenticated ? <HomePage /> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
}

export default App;
