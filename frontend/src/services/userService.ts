import axios from "../api/axios";

export interface User {
  id: number;
  email: string;
  role: "ADMIN" | "MANAGER" | "EMPLOYEE";
  is_active: boolean;
}

export const userService = {
  create: async (data: any): Promise<User> => {
    const response = await axios.post("/users", data);
    return response.data;
  },

  getAll: async (): Promise<User[]> => {
    const response = await axios.get("/users");
    return response.data;
  },
};
