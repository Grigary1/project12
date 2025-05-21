// src/context/UserDataContext.jsx

import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const UserDataContext = createContext();

export const UserDataProvider = ({ children }) => {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      const res = await axios.get(`${backendUrl}/api/admin/showdata`);
      setUsers(res.data);
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <UserDataContext.Provider value={{ users, setUsers, fetchUsers }}>
      {children}
    </UserDataContext.Provider>
  );
};