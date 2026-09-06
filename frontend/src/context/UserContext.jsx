import React, { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();

export function useUser() {
  return useContext(UserContext);
}

export default function UserProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) setUser(JSON.parse(storedUser));
    } catch (err) {
      console.error("Failed to load user from localStorage:", err);
    }
  }, []);

  const loginUser = (userData, token) => {
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", token);
    setUser(userData);
  };

  const logoutUser = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, setUser, loginUser, logoutUser }}>
      {children}
    </UserContext.Provider>
  );
}
