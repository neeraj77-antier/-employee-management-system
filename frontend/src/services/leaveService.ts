import axios from "../api/axios";
import { API_ENDPOINTS } from "../constants";

export interface LeaveRequest {
  id: number;
  employee_id: number;
  leave_type: "CASUAL" | "SICK" | "PAID" | "SHORT";
  start_date: string;
  end_date: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  session?: "FIRST_HALF" | "SECOND_HALF";
  approved_by?: number;
  reason?: string;
  admin_comments?: string;
  employee?: any;
  approver?: any;
}

export interface CreateLeaveData {
  employee_id?: number;
  leave_type: "CASUAL" | "SICK" | "PAID" | "SHORT";
  start_date: string;
  end_date: string;
  reason: string;
  session?: "FIRST_HALF" | "SECOND_HALF";
}

export const leaveService = {
  getMyRequests: async (): Promise<LeaveRequest[]> => {
    const response = await axios.get(`${API_ENDPOINTS.LEAVES}/my-requests`);
    return response.data;
  },

  getPending: async (): Promise<LeaveRequest[]> => {
    const response = await axios.get(`${API_ENDPOINTS.LEAVES}/pending`);
    return response.data;
  },

  getAll: async (): Promise<LeaveRequest[]> => {
    const response = await axios.get(API_ENDPOINTS.LEAVES);
    return response.data;
  },

  create: async (data: CreateLeaveData): Promise<LeaveRequest> => {
    const response = await axios.post(API_ENDPOINTS.LEAVES, data);
    return response.data;
  },

  approve: async (id: number, reason?: string): Promise<any> => {
    const response = await axios.patch(
      `${API_ENDPOINTS.LEAVES}/${id}/approve`,
      {
        reason,
      }
    );
    return response.data;
  },

  reject: async (id: number, reason?: string): Promise<any> => {
    const response = await axios.patch(`${API_ENDPOINTS.LEAVES}/${id}/reject`, {
      reason,
    });
    return response.data;
  },
};
