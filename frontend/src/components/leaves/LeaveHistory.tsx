import React, { useEffect, useState } from "react";
import { leaveService, type LeaveRequest } from "../../services/leaveService";

interface DailyLeaveStats {
  date: string;
  employees: {
    id: number;
    name: string;
    type: string;
  }[];
}

const LeaveHistory: React.FC = () => {
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [stats, setStats] = useState<DailyLeaveStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    fetchHistory();
  }, []);

  useEffect(() => {
    if (leaves.length > 0) {
      processLeaveStats();
    }
  }, [leaves, selectedMonth, selectedYear]);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const data = await leaveService.getAll();
      // Filter only approved leaves
      const approvedLeaves = data.filter(
        (leave) => leave.status === "APPROVED"
      );
      setLeaves(approvedLeaves);
    } catch (err) {
      console.error("Failed to fetch leave history:", err);
    } finally {
      setLoading(false);
    }
  };

  const processLeaveStats = () => {
    const dailyStats: Record<string, DailyLeaveStats> = {};

    // Get start and end of selected month
    const startOfMonth = new Date(selectedYear, selectedMonth, 1);
    const endOfMonth = new Date(selectedYear, selectedMonth + 1, 0);

    // Initialize all days in month
    for (
      let d = new Date(startOfMonth);
      d <= endOfMonth;
      d.setDate(d.getDate() + 1)
    ) {
      const dateStr = d.toISOString().split("T")[0];
      dailyStats[dateStr] = { date: dateStr, employees: [] };
    }

    leaves.forEach((leave) => {
      let current = new Date(leave.start_date);
      const end = new Date(leave.end_date);

      while (current <= end) {
        // Only count if within selected month
        if (
          current.getMonth() === selectedMonth &&
          current.getFullYear() === selectedYear
        ) {
          const dateStr = current.toISOString().split("T")[0];
          if (dailyStats[dateStr]) {
            dailyStats[dateStr].employees.push({
              id: leave.employee_id,
              name: `${leave.employee?.first_name} ${leave.employee?.last_name}`,
              type: leave.leave_type,
            });
          }
        }
        current.setDate(current.getDate() + 1);
      }
    });

    // Convert to array and sort
    const sortedStats = Object.values(dailyStats)
      .filter((day) => day.employees.length > 0)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    setStats(sortedStats);
  };

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return (
    <div className="space-y-6">
      <div className="flex gap-4 items-center bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(Number(e.target.value))}
          className="input-field"
        >
          {months.map((m, i) => (
            <option key={i} value={i}>
              {m}
            </option>
          ))}
        </select>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          className="input-field"
        >
          {Array.from(
            { length: 5 },
            (_, i) => new Date().getFullYear() - 2 + i
          ).map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading stats...</div>
      ) : stats.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No employees are on leave during this month.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stats.map((day) => (
            <div
              key={day.date}
              className={`p-4 rounded-xl border transition-all ${
                day.employees.length > 0
                  ? "bg-white border-primary-100 shadow-sm hover:shadow-md"
                  : "bg-gray-50 border-transparent opacity-60"
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="font-semibold text-gray-700">
                  {new Date(day.date).toLocaleDateString(undefined, {
                    weekday: "short",
                    day: "numeric",
                  })}
                </span>
                {day.employees.length > 0 && (
                  <span className="bg-primary-100 text-primary-700 text-xs font-bold px-2 py-1 rounded-full">
                    {day.employees.length} On Leave
                  </span>
                )}
              </div>

              {day.employees.length > 0 ? (
                <ul className="space-y-2 mt-2">
                  {day.employees.map((emp, idx) => (
                    <li
                      key={idx}
                      className="text-sm flex items-center justify-between text-gray-600 bg-gray-50 p-2 rounded"
                    >
                      <span>{emp.name}</span>
                      <span className="text-xs bg-gray-200 px-1.5 py-0.5 rounded text-gray-600">
                        {emp.type}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-sm text-gray-400 italic">No leaves</div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LeaveHistory;
