export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000";

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    VERIFY_OTP: "/auth/verify-otp",
  },
  USERS: "/users",
  EMPLOYEES: "/employees",
  DEPARTMENTS: "/departments",
  ATTENDANCE: "/attendance",
  LEAVES: "/leaves",
  PAYROLL: "/payroll",
  PERFORMANCE: "/performance",
};

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  DASHBOARD: "/dashboard",
  EMPLOYEES: "/employees",
  ATTENDANCE: "/attendance",
  LEAVES: "/leaves",
  PAYROLL: "/payroll",
  PERFORMANCE: "/performance",
};
