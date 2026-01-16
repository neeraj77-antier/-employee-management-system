import axios from "../api/axios";

export interface PerformanceReview {
  id: number;
  employee_id: number;
  reviewer_id: number;
  rating: number;
  comments: string;
  review_date: string;
  reviewer?: {
    user?: {
      email: string;
    };
    first_name: string;
    last_name: string;
  };
  employee?: {
    first_name: string;
    last_name: string;
  };
}

export interface Goal {
  id: number;
  employee_id: number;
  title: string;
  description: string;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED";
  deadline: string;
  created_at: string;
}

export const performanceService = {
  // Reviews
  addReview: async (data: {
    employeeId: number;
    rating: number;
    comments?: string;
  }) => {
    const response = await axios.post("/performance/reviews", data);
    return response.data;
  },

  getMyReviews: async (): Promise<PerformanceReview[]> => {
    const response = await axios.get("/performance/reviews/my");
    return response.data;
  },

  getAllReviews: async (employeeId?: number): Promise<PerformanceReview[]> => {
    const params = new URLSearchParams();
    if (employeeId) params.append("employeeId", employeeId.toString());

    const response = await axios.get(
      `/performance/reviews?${params.toString()}`
    );
    return response.data;
  },

  // Goals
  addGoal: async (data: {
    title: string;
    description?: string;
    deadline?: string;
  }) => {
    const response = await axios.post("/performance/goals", data);
    return response.data;
  },

  getMyGoals: async (employeeId?: number): Promise<Goal[]> => {
    const params = new URLSearchParams();
    if (employeeId) params.append("employeeId", employeeId.toString());

    const response = await axios.get(`/performance/goals?${params.toString()}`);
    return response.data;
  },

  updateGoal: async (
    id: number,
    status: "PENDING" | "IN_PROGRESS" | "COMPLETED"
  ) => {
    const response = await axios.patch(`/performance/goals/${id}`, { status });
    return response.data;
  },
};
