import axios, { AxiosError, AxiosResponse } from "axios";
import { API_BASE_URL } from "@/lib/constants";

/**
 * Central Axios instance with interceptors for the FastAPI backend.
 */
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// ─── Request interceptor ──────────────────────────────────────────────────────
apiClient.interceptors.request.use(
  (config) => {
    // TODO: Attach auth token when authentication is added
    // const token = getToken();
    // if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// ─── Response interceptor ─────────────────────────────────────────────────────
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // TODO: Redirect to login / refresh token
    }
    return Promise.reject(error);
  }
);

export default apiClient;
