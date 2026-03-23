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
      return {
        success: false,
        message:
          error.response?.data?.message ||
          "Login failed. Please check your credentials.",
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken("");
    setUser(null);
    setEmployeeId("");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("employeeId");
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
      value={{ token, user, employeeId, loading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);