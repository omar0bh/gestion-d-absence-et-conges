import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    const isAuthRoute =
      config.url?.includes("/auth/login") ||
      config.url?.includes("/auth/register");

    if (token && !isAuthRoute) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorMessage =
      error.response?.data?.message ||
      error.response?.data ||
      "";

    const isExpiredToken =
      errorMessage.toString().toLowerCase().includes("jwt expired") ||
      errorMessage.toString().toLowerCase().includes("expiredjwtexception");

    if (error.response?.status === 401 || isExpiredToken) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("employeeId");

      if (window.location.pathname !== "/") {
        window.location.href = "/";
      }
    }

    return Promise.reject(error);
  }
);

export default api;