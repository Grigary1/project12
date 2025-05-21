import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const UserDataContext = createContext();

export const UserDataProvider = ({ children }) => {
    const [users, setUsers] = useState([]);
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const fetchUsers = async () => {
        try {
            const res = await axios.get(`${backendUrl}/api/admin/showdata`);
            setUsers(res.data);
        } catch (err) {
            console.error("Failed to fetch users:", err);
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

export const useUserData = () => useContext(UserDataContext);
