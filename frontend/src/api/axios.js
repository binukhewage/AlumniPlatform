import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
});

// Attach token + API key automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  //  ADD THIS LINE
  config.headers["x-api-key"] =
    "b3c7eed45814f78e684053da37bc250a2dfdf0d16b17c307c22c3283e593c2fc";

  return config;
});

export default api;