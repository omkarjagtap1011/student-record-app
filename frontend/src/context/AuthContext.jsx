import { createContext, useContext, useState, useEffect } from "react";
import api from "../utils/api";

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within AuthProvider");
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [admin, setAdmin] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        const token = localStorage.getItem("token");
        const savedAdmin = localStorage.getItem("admin");

        if (token && savedAdmin) {
            try {
                const res = await api.get("/api/auth/verify");
                if (res.data.valid) {
                    setAdmin(JSON.parse(savedAdmin));
                } else {
                    logout();
                }
            } catch {
                logout();
            }
        }
        setLoading(false);
    };

    const login = async (email, password) => {
        const res = await api.post("/api/auth/login", { email, password });
        const { token, admin: adminData } = res.data;
        localStorage.setItem("token", token);
        localStorage.setItem("admin", JSON.stringify(adminData));
        setAdmin(adminData);
        return res.data;
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("admin");
        setAdmin(null);
    };

    return (
        <AuthContext.Provider value={{ admin, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
