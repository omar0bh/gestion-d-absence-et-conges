import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [employeeId, setEmployeeId] = useState(
    localStorage.getItem("employeeId") || ""
  );
  const [loading, setLoading] = useState(false);

  const clearSession = () => {
    setToken("");
    setUser(null);
    setEmployeeId("");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("employeeId");
  };

  const fetchEmployeeId = async (userId) => {
    try {
      const response = await api.get(`/employees/user/${userId}`);
      const empId = response.data?.id || "";
      setEmployeeId(empId);
      localStorage.setItem("employeeId", empId);
    } catch (error) {
      setEmployeeId("");
      localStorage.removeItem("employeeId");
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      clearSession();

      const response = await api.post("/auth/login", { email, password });
      const data = response.data;

      const userData = {
        userId: data.userId,
        fullName: data.fullName,
        email: data.email,
        role: data.role,
      };

      setToken(data.token);
      setUser(userData);

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(userData));

      await fetchEmployeeId(data.userId);

      return { success: true };
    } catch (error) {
      clearSession();

      return {
        success: false,
        message:
          error.response?.data?.message ||
          (typeof error.response?.data === "string" ? error.response.data : "") ||
          "Login failed. Please check your credentials.",
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    clearSession();
  };

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");
    const savedEmployeeId = localStorage.getItem("employeeId");

    if (savedToken) setToken(savedToken);
    if (savedUser) setUser(JSON.parse(savedUser));
    if (savedEmployeeId) setEmployeeId(savedEmployeeId);
  }, []);

  return (
    <AuthContext.Provider
      value={{ token, user, employeeId, loading, login, logout, clearSession }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);