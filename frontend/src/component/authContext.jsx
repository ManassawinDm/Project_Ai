import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  // Storing only the token in local storage for security
  const [authToken, setAuthToken] = useState(localStorage.getItem("token") || null);

  const login = async (input) => {
    try {
      const res = await axios.post("http://localhost:8800/api/auth/login", input);
      // Assuming the server responds with the token directly
      const token = res.data;
      // console.log(token)
      setAuthToken(token); // Store the token in the state
      localStorage.setItem("token", token); // Store the token in localStorage for persistence
    } catch (error) {
      console.error("Login error:", error);
      // Handle login error (e.g., incorrect credentials, server error)
    }
  };
  
  const logout = async () => {
    // Optional: Inform the server about the logout if necessary
    // await axios.post("http://localhost:8800/api/auth/logout", {}, {
    //   headers: { Authorization: `Bearer ${authToken}` }
    // });
    setAuthToken(null);
    localStorage.removeItem("token"); // Clear the token from localStorage
  };

  useEffect(() => {
    // This effect persists authToken changes to localStorage,
    // but since we're already doing that in login/logout functions,
    // it's mainly useful for additional side effects or cleanup.
  }, [authToken]);

  return (
    <AuthContext.Provider value={{ authToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
