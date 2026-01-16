import axios from "../api/axios";
import { API_ENDPOINTS } from "../constants";

export interface Employee {
  id: number;
  user_id: number;
  first_name: string;
  last_name: string;
  phone: string;
  department_id: number;
  designation: string;
  joining_date: string;
  salary: number;
  manager_id?: number;
  user?: any;
  department?: any;
  manager?: any;
}

export interface CreateEmployeeData {
  user_id?: number;
  first_name: string;
  last_name: string;
  phone: string;
  department_id: number;
  designation: string;
  joining_date: string;
  salary: number;
  manager_id?: number;
  email?: string;
  password?: string;
  role?: string;
}

export const employeeService = {
  getProfile: async () => {
    // Assuming backend endpoint is /employees/profile
    const response = await axios.get(`${API_ENDPOINTS.EMPLOYEES}/profile`);
    return response.data;
  },

  getAll: async (): Promise<Employee[]> => {
    const response = await axios.get(API_ENDPOINTS.EMPLOYEES);
    return response.data;
  },

  getById: async (id: number): Promise<Employee> => {
    const response = await axios.get(`${API_ENDPOINTS.EMPLOYEES}/${id}`);
    return response.data;
  },

  create: async (data: CreateEmployeeData): Promise<Employee> => {
    const response = await axios.post(API_ENDPOINTS.EMPLOYEES, data);
    return response.data;
  },

  update: async (
    id: number,
    data: Partial<CreateEmployeeData>
  ): Promise<any> => {
    const response = await axios.patch(
      `${API_ENDPOINTS.EMPLOYEES}/${id}`,
      data
    );
    return response.data;
  },

  delete: async (id: number): Promise<any> => {
    const response = await axios.delete(`${API_ENDPOINTS.EMPLOYEES}/${id}`);
    return response.data;
  },
};
