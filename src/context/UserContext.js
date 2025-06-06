import { createContext, useState, useEffect } from "react";
import { setToken } from "../frontend/utils/auth";

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    const storedToken = sessionStorage.getItem("token");
    
    if (storedUser && storedToken) {
      setCurrentUser(JSON.parse(storedUser));
      setToken(storedToken);
    }
  }, []);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("currentUser");
    }
  }, [currentUser]);

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </UserContext.Provider>
  );
}
