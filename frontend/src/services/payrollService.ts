import axios from "../api/axios";

export interface Payroll {
  id: number;
  month: string;
  year: number;
  base_salary: string;
  deductions: string;
  net_salary: string;
  status: "PENDING" | "PAID";
  payment_date: string | null;
  generated_at: string;
  employee: {
    first_name: string;
    last_name: string;
    designation: string;
  };
}

export const payrollService = {
  // Admin: Generate payroll for a month
  generate: async (data: { month: string; year: number }) => {
    const response = await axios.post("/payroll/generate", data);
    return response.data;
  },

  // Admin: Get all payroll records (optional filters)
  getAll: async (year?: number, month?: string): Promise<Payroll[]> => {
    const params = new URLSearchParams();
    if (year) params.append("year", year.toString());
    if (month) params.append("month", month);

    const response = await axios.get(`/payroll?${params.toString()}`);
    return response.data;
  },

  // Employee: Get my payslips
  getMySlips: async (): Promise<Payroll[]> => {
    const response = await axios.get("/payroll/my-slips");
    return response.data;
  },

  // Admin: Mark as paid
  markAsPaid: async (id: number) => {
    const response = await axios.patch(`/payroll/${id}/pay`);
    return response.data;
  },
};
