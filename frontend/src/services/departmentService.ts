import axios from "../api/axios";
import { API_ENDPOINTS } from "../constants";

export interface Department {
  id: number;
  name: string;
  description?: string;
}

export const departmentService = {
  getAll: async (): Promise<Department[]> => {
    const response = await axios.get(API_ENDPOINTS.DEPARTMENTS);
    return response.data;
  },

  getById: async (id: number): Promise<Department> => {
    const response = await axios.get(`${API_ENDPOINTS.DEPARTMENTS}/${id}`);
    return response.data;
  },

  create: async (data: Omit<Department, "id">): Promise<Department> => {
    const response = await axios.post(API_ENDPOINTS.DEPARTMENTS, data);
    return response.data;
  },

  update: async (
    id: number,
    data: Partial<Omit<Department, "id">>
  ): Promise<any> => {
    const response = await axios.patch(
      `${API_ENDPOINTS.DEPARTMENTS}/${id}`,
      data
    );
    return response.data;
  },

  delete: async (id: number): Promise<any> => {
    const response = await axios.delete(`${API_ENDPOINTS.DEPARTMENTS}/${id}`);
    return response.data;
  },
};
