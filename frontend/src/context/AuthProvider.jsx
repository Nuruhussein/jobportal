// AuthProvider.js
import { useState, useEffect } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { AuthContext } from "./AuthContext"; // Import the context


export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const API_BASE_URL = 'http://localhost:5000/auth'; // Adjust base URL as needed
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const res = await axios.get(`${API_BASE_URL}/verify`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          setUser(res.data.user);
          setIsAuthenticated(res.data.isAuthenticated);
        }
        setLoading(false);
      } catch (error) {
        setIsAuthenticated(false);
        setLoading(false);
        console.log(error)
      }
    };

    checkAuth();
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
  };

  const login = (token) => {
    localStorage.setItem("token", token);
    setIsAuthenticated(true);
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, loading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
