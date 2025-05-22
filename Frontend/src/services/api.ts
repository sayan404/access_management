import axios, { AxiosRequestHeaders } from "axios";
import { setUser } from "../stores/userStore";

// Use type assertion for import.meta.env
const API_URL =
  (import.meta.env.VITE_API_URL as string) || "http://localhost:5000/api";
console.log("API_URL:", API_URL);

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    if (!config.headers) {
      config.headers = {} as AxiosRequestHeaders;
    }
    config.headers.Authorization = `Bearer ${token}`;
    console.log("Adding token to request:", config.headers.Authorization); // Debug log
  } else {
    console.log("No token found in localStorage"); // Debug log
  }
  console.log("config.headers:", config.headers);

  return config;
});

export enum AccessLevel {
  READ = "READ",
  WRITE = "WRITE",
  ADMIN = "ADMIN",
}

export const auth = {
  login: async (username: string, password: string) => {
    try {
      const response = await api.post("/auth/login", {
        username,
        password,
      });

      const { user, token } = response.data;

      // Store token in localStorage
      localStorage.setItem("token", token);
      console.log("Token stored:", token); // Debug log

      // Store user data in nano store
      setUser({
        id: user.id,
        username: user.username,
        role: user.role,
        token,
      });

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || "Login failed");
      }
      throw error;
    }
  },

  signup: async (
    username: string,
    password: string,
    department: string,
    userType: string
  ) => {
    const response = await api.post("auth/signup", {
      username,
      password,
      department,
      userType,
    });
    return response.data;
  },

  logout: () => {
    localStorage.removeItem("token"); // Clear token on logout
    setUser(null);
  },
};

export const software = {
  create: async (data: {
    name: string;
    description: string;
    accessLevels: string[];
  }) => {
    return api.post("/software", data);
  },

  getAll: async () => {
    return api.get("/software");
  },
};

export const requests = {
  getPending: async () => {
    console.log("Getting pending requests");
    try {
      const response = await api.get("/software/requests", {
        params: { status: "PENDING" },
      });
      console.log("Response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching pending requests:", error);
      if (axios.isAxiosError(error)) {
        console.error("Response:", error.response?.data);
        console.error("Status:", error.response?.status);
        if (error.response?.status === 401) {
          console.error("Unauthorized - Token might be invalid or missing");
        }
      }
      throw error;
    }
  },

  updateStatus: async (
    id: number,
    status: "APPROVED" | "REJECTED",
    managerComment?: string
  ) => {
    return api.patch(`/software/requests/${id}`, { status, managerComment });
  },

  create: async (data: {
    softwareId: number;
    accessType: AccessLevel;
    reason: string;
    userType: string;
  }) => {
    return api.post("/software/requests", {
      ...data,
      accessType: data.accessType.toUpperCase(),
    });
  },

  getApproved: async () => {
    console.log("Getting approved requests");
    try {
      const response = await api.get("/software/requests/approved");
      console.log("Approved requests:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching approved requests:", error);
      if (axios.isAxiosError(error)) {
        console.error("Response:", error.response?.data);
        console.error("Status:", error.response?.status);
      }
      throw error;
    }
  },
};
