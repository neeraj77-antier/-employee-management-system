import React, { useEffect, useState } from "react";
import { useAppSelector } from "../hooks/useRedux";
import { employeeService } from "../services/employeeService";
import { attendanceService } from "../services/attendanceService";
import { leaveService } from "../services/leaveService";
import { payrollService } from "../services/payrollService";

const Dashboard: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);

  const [stats, setStats] = useState({
    totalEmployees: 0,
    presentToday: 0,
    onLeave: 0,
    pendingPayrolls: 0,
    pendingLeaves: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const isAdminOrManager =
        user?.role === "ADMIN" || user?.role === "MANAGER";

      // Initialize defaults
      let totalEmployees = 0;
      let presentToday = 0;
      let onLeave = 0;
      let pendingPayrolls = 0;
      let pendingLeaves = 0;

      if (isAdminOrManager) {
        // Admin View: Fetch EVERYTHING
        const [employees, attendanceLogs, leaves, payrolls] = await Promise.all(
          [
            employeeService.getAll(),
            attendanceService.getLogs(),
            leaveService.getAll(),
            payrollService.getAll(),
          ]
        );

        const today = new Date().toISOString().split("T")[0];

        totalEmployees = employees.length;

        // Count UNIQUE employees present today
        const uniquePresent = new Set(
          attendanceLogs
            .filter((log) => log.date === today && log.status === "PRESENT")
            .map((log) => log.employee_id)
        );
        presentToday = uniquePresent.size;

        onLeave = leaves.filter((leave) => {
          return (
            leave.status === "APPROVED" &&
            leave.start_date <= today &&
            leave.end_date >= today
          );
        }).length;

        pendingPayrolls = payrolls.filter((p) => p.status === "PENDING").length;
        pendingLeaves = leaves.filter((l) => l.status === "PENDING").length;
      } else {
        // Employee View: Fetch only MY data
        // We skip employees/pending payrolls/pending leaves as they are admin stats
        const [myAttendance, myLeaves, myPayrolls] = await Promise.all([
          attendanceService.getLogs(), // This returns MY logs for regular user
          leaveService.getMyRequests(),
          payrollService.getMySlips(),
        ]);

        const today = new Date().toISOString().split("T")[0];

        // "Total Employees" -> Hide or Show "My Team" size? Let's just set to 0 or handled in UI
        totalEmployees = 0; // Or we can hide this card

        // "Present Today" -> Am I present?
        const amIPresent = myAttendance.find(
          (log) => log.date === today && log.status === "PRESENT"
        );
        presentToday = amIPresent ? 1 : 0;

        // "On Leave" -> Am I on leave?
        const amIOnLeave = myLeaves.find((leave) => {
          return (
            leave.status === "APPROVED" &&
            leave.start_date <= today &&
            leave.end_date >= today
          );
        });
        onLeave = amIOnLeave ? 1 : 0;

        // "Pending Payrolls" -> My unpaid slips
        pendingPayrolls = myPayrolls.filter(
          (p) => p.status === "PENDING"
        ).length;

        // "Pending Leaves" -> My pending requests
        pendingLeaves = myLeaves.filter((l) => l.status === "PENDING").length;
      }

      setStats({
        totalEmployees,
        presentToday,
        onLeave,
        pendingPayrolls,
        pendingLeaves,
      });
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    ...(user?.role === "ADMIN" || user?.role === "MANAGER"
      ? [
          {
            label: "Total Employees",
            value: stats.totalEmployees,
            icon: "👥",
            color: "bg-blue-500",
          },
        ]
      : []), // Hide Total Employees for regular users
    {
      label: user?.role === "ADMIN" ? "Present Today" : "My Status",
      value:
        user?.role === "ADMIN"
          ? stats.presentToday
          : stats.presentToday === 1
          ? "Present"
          : "Absent",
      icon: "✅",
      color: "bg-green-500",
    },
    {
      label: user?.role === "ADMIN" ? "On Leave" : "On Leave",
      value:
        user?.role === "ADMIN"
          ? stats.onLeave
          : stats.onLeave === 1
          ? "Yes"
          : "No",
      icon: "🏖️",
      color: "bg-yellow-500",
    },
    {
      label: user?.role === "ADMIN" ? "Pending Payrolls" : "Unpaid Slips",
      value: stats.pendingPayrolls,
      icon: "⏳",
      color: "bg-orange-500",
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.email?.split("@")[0]}!
        </h1>
        <p className="text-gray-600 mt-2">
          Here's what's happening with your team today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className="card hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900">
                  {loading ? "..." : stat.value}
                </p>
              </div>
              <div
                className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center text-2xl text-white`}
              >
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity (Placeholder for now, or could link to pending items) */}
      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Pending Actions
        </h2>
        <div className="space-y-4">
          {stats.pendingLeaves > 0 ? (
            <div className="flex items-center gap-4 p-4 bg-yellow-50 rounded-lg">
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600 font-semibold">
                ✋
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">
                  {stats.pendingLeaves} Leave Request
                  {stats.pendingLeaves !== 1 ? "s" : ""} Pending
                </p>
                <p className="text-sm text-gray-600">
                  Review in Leaves section
                </p>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">
              No pending actions requiring attention.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
