import axios from "../api/axios";
import { API_ENDPOINTS } from "../constants";

export interface AttendanceRecord {
  id: number;
  employee_id: number;
  date: string;
  clock_in: string | null;
  clock_out: string | null;
  status: string;
  total_hours: number | null;
  employee?: {
    first_name: string;
    last_name: string;
  };
}

export const attendanceService = {
  getStats: async (): Promise<any> => {
    // This endpoint might need to be created in backend or we derive stats from logs
    const response = await axios.get(`${API_ENDPOINTS.ATTENDANCE}/stats`);
    return response.data;
  },

  checkIn: async (): Promise<AttendanceRecord> => {
    const response = await axios.post(`${API_ENDPOINTS.ATTENDANCE}/check-in`);
    return response.data;
  },

  checkOut: async (): Promise<AttendanceRecord> => {
    const response = await axios.post(`${API_ENDPOINTS.ATTENDANCE}/check-out`);
    return response.data;
  },

  getLogs: async (): Promise<AttendanceRecord[]> => {
    const response = await axios.get(API_ENDPOINTS.ATTENDANCE);
    return response.data;
  },
};
