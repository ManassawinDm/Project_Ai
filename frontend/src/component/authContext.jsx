import { createContext, useState, useEffect } from "react";
import axios from "axios";
import {jwtDecode} from "jwt-decode";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(localStorage.getItem("token") || null);

  // Decode token to get user details on the fly
  // If authToken is null, userDetails will also be null
  const [userDetails, setUserDetails] = useState(() => {
    if (authToken) {
      try {
        const decoded = jwtDecode(authToken);
        return { email: decoded.email, role: decoded.role };
      } catch (error) {
        console.error('Error decoding token:', error);
        return null;
      }
    }
    return null;
  });

  const login = async (input) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, input);
      const { token } = response.data;
      if (token) {
        localStorage.setItem("token", token);
        setAuthToken(token);
      }
    } catch (error) {
      console.error("Login error:", error.response?.data);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setAuthToken(null);
  };

  // Update userDetails when authToken changes
  useEffect(() => {
    if (authToken) {
      try {
        const decoded = jwtDecode(authToken);
        setUserDetails({ email: decoded.email, role: decoded.role });
      } catch (error) {
        console.error('Error decoding token:', error);
        setUserDetails(null);
      }
    } else {
      setUserDetails(null);
    }
  }, [authToken]);

  return (
    <AuthContext.Provider value={{ authToken, userDetails, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
