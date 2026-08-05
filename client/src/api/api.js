import axios from "axios";

const API = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    (import.meta.env.MODE === "development" ? "http://localhost:5000/api" : "/api"),
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor: attach token if present
API.interceptors.request.use(
  (config) => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error("Failed to read token from localStorage", error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle 401/403 centrally
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    if (status === 401 || status === 403) {
      try {
        localStorage.removeItem("token");
      } catch (removeError) {
        console.error("Failed to remove token after auth error", removeError);
      }
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default API;