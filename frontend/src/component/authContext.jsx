import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(localStorage.getItem("token") || null);
 
  const [username, setUsername] = useState(localStorage.getItem("username") || null);

  const extractUsernameFromEmail = (email) => {
    return email.split('@')[0];
  };
  const login = async (input) => {
    try {
      const res = await axios.post("http://localhost:8800/api/auth/login", input);
      const { token, email } = res.data; 

      setAuthToken(token); 
      const derivedUsername = extractUsernameFromEmail(email);
      setUsername(derivedUsername);
      localStorage.setItem("username", derivedUsername);
      localStorage.setItem("token", token);
    
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const logout = async () => {
    // Optional: Server logout logic here

    // Clear both authToken and userEmail from state and localStorage
    setAuthToken(null);
    setUsername(null);
    localStorage.removeItem("token");
    localStorage.removeItem("username");
  };

  useEffect(() => {
   
  }, [authToken, username]); 

  return (
    <AuthContext.Provider value={{ authToken, username, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
