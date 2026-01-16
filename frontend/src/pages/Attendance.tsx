import React, { useEffect, useState } from "react";
import {
  attendanceService,
  type AttendanceRecord,
} from "../services/attendanceService";
import { useAppSelector } from "../hooks/useRedux";
import { useToast } from "../context/ToastContext";

const Attendance: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const [logs, setLogs] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [todayRecord, setTodayRecord] = useState<AttendanceRecord | null>(null);
  const [error, setError] = useState("");
  const { addToast } = useToast();

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      const data = await attendanceService.getLogs();
      setLogs(data);

      // Find today's record
      const today = new Date().toISOString().split("T")[0];
      const todayLog = data.find((log) => log.date === today);
      if (todayLog) {
        setTodayRecord(todayLog);
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Failed to fetch attendance logs"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async () => {
    try {
      setActionLoading(true);
      setError("");
      await attendanceService.checkIn();
      addToast("Checked in successfully", "success");
      await fetchAttendance();
    } catch (err: any) {
      const msg = err.response?.data?.message || "Failed to check in";
      setError(msg);
      addToast(msg, "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleCheckOut = async () => {
    try {
      setActionLoading(true);
      setError("");
      await attendanceService.checkOut();
      addToast("Checked out successfully", "success");
      await fetchAttendance();
    } catch (err: any) {
      const msg = err.response?.data?.message || "Failed to check out";
      setError(msg);
      addToast(msg, "error");
    } finally {
      setActionLoading(false);
    }
  };

  const formatTime = (timeString: string | null) => {
    if (!timeString) return "--:--";
    // If it's a full ISO string, parse it. If it's HH:MM:SS, just return it or format strictly.
    // Backend seems to return Time column which is usually HH:MM:SS string in TypeORM/Postgres
    // Check if it looks like a time string "HH:MM:SS"
    if (timeString.includes("T")) {
      return new Date(timeString).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    }
    return timeString.substring(0, 5); // Return HH:MM
  };

  if (loading && logs.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Attendance</h1>
        <p className="text-gray-600 mt-2">Track your daily attendance</p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* Action Card */}
      <div className="card mb-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Today's Status
            </h2>
            <p className="text-gray-600 mt-1">
              {new Date().toLocaleDateString(undefined, {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          <div className="flex items-center gap-4">
            {!todayRecord || !todayRecord.clock_in ? (
              <button
                onClick={handleCheckIn}
                disabled={actionLoading}
                className="btn-primary bg-green-600 hover:bg-green-700 disabled:opacity-50"
              >
                {actionLoading ? "Processing..." : "Check In"}
              </button>
            ) : !todayRecord.clock_out ? (
              <div className="flex items-center gap-4">
                <span className="text-green-600 font-medium">
                  Checked in at {formatTime(todayRecord.clock_in)}
                </span>
                <button
                  onClick={handleCheckOut}
                  disabled={actionLoading}
                  className="btn-primary bg-red-600 hover:bg-red-700 disabled:opacity-50"
                >
                  {actionLoading ? "Processing..." : "Check Out"}
                </button>
              </div>
            ) : (
              <div className="text-gray-600 font-medium">
                Completed for today ({formatTime(todayRecord.clock_in)} -{" "}
                {formatTime(todayRecord.clock_out)})
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Logs Table */}
      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          Attendance History
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-4 px-4 font-semibold text-gray-700">
                  Date
                </th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700">
                  Status
                </th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700">
                  Check In
                </th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700">
                  Check Out
                </th>
              </tr>
            </thead>
            <tbody>
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-gray-500">
                    No attendance records found
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr
                    key={log.id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-4 px-4 text-gray-900">
                      {new Date(log.date).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          log.status === "PRESENT"
                            ? "bg-green-100 text-green-800"
                            : log.status === "ABSENT"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {log.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-gray-600">
                      {formatTime(log.clock_in)}
                    </td>
                    <td className="py-4 px-4 text-gray-600">
                      {formatTime(log.clock_out)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Attendance;
