import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(localStorage.getItem("token") || null);
  const [userole,setrole] = useState(null);
 
  const [username, setUsername] = useState(localStorage.getItem("username") || null);

  const extractUsernameFromEmail = (email) => {
    return email.split('@')[0];
  };
  const login = async (input) => {
    try {
      const res = await axios.post("http://localhost:8800/api/auth/login", input);
      const { token, email , role } = res.data; 

      setAuthToken(token); 
      setrole(role)
      const derivedUsername = extractUsernameFromEmail(email);
      setUsername(derivedUsername);
      localStorage.setItem("username", derivedUsername);
      localStorage.setItem("token", token);
    
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const logout = async () => {
    setAuthToken(null);
    setUsername(null);
    setrole(null);
    localStorage.removeItem("token");
    localStorage.removeItem("username");
  };

  useEffect(() => {
   
  }, [authToken, username,userole]); 

  return (
    <AuthContext.Provider value={{ authToken, username,userole, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
