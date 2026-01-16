import React, { useEffect, useState } from "react";
import { employeeService } from "../services/employeeService";
import { useAppSelector } from "../hooks/useRedux";
import { useToast } from "../context/ToastContext";

const ProfilePage: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const [employee, setEmployee] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Edit State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    first_name: "",
    last_name: "",
    phone: "",
  });

  const { addToast } = useToast();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await employeeService.getProfile();
      setEmployee(data);
    } catch (err) {
      console.error("Error fetching profile", err);
      setError("Failed to load profile data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-600 bg-red-50 rounded-xl shadow-sm border border-red-100 max-w-2xl mx-auto mt-10">
        <p className="font-medium">{error}</p>
      </div>
    );
  }

  const getInitials = (first: string, last: string) => {
    return `${first?.charAt(0) || ""}${last?.charAt(0) || ""}`;
  };

  const handleEditClick = () => {
    if (employee) {
      setEditFormData({
        first_name: employee.first_name,
        last_name: employee.last_name,
        phone: employee.phone,
      });
      setIsEditModalOpen(true);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await employeeService.update(employee.id, editFormData);
      setEmployee({ ...employee, ...editFormData });
      setIsEditModalOpen(false);
      addToast("Profile updated successfully", "success");
    } catch (err: any) {
      console.error("Failed to update profile", err);
      addToast(
        err.response?.data?.message || "Failed to update profile",
        "error"
      );
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-10">
      {/* Header Section with Gradient Banner */}
      <div className="relative bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
        <div className="h-40 bg-gradient-to-r from-[#0f4c81] to-[#0a355c] w-full relative">
          <div className="absolute top-4 right-4">
            <button
              onClick={handleEditClick}
              className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg text-sm font-medium backdrop-blur-sm transition-all"
            >
              Edit Profile
            </button>
          </div>
        </div>

        <div className="px-8 pb-6">
          <div className="relative flex flex-col md:flex-row items-end -mt-12 mb-2">
            {/* Avatar Card */}
            <div className="relative z-10">
              <div className="h-28 w-28 rounded-xl bg-white p-1 shadow-lg border-4 border-white">
                <div className="h-full w-full rounded-lg bg-gray-100 flex items-center justify-center text-3xl font-bold text-[#0f4c81]">
                  {getInitials(employee?.first_name, employee?.last_name)}
                </div>
              </div>
              <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-1">
                <span className="flex items-center justify-center h-6 w-6 rounded-full bg-green-500">
                  <svg
                    className="w-3.5 h-3.5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="3"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                </span>
              </div>
            </div>

            {/* User Info */}
            <div className="mt-4 md:mt-0 md:ml-5 flex-1 w-full">
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                <div className="mb-1">
                  <h1 className="text-2xl font-bold text-gray-900 mb-1.5">
                    {employee?.first_name} {employee?.last_name}
                  </h1>
                  <div className="flex items-center text-gray-500 gap-4 text-sm font-medium">
                    <span className="flex items-center gap-1.5">
                      <svg
                        className="w-4 h-4 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        ></path>
                      </svg>
                      {employee?.designation || "No Designation"}
                    </span>
                    <span className="text-gray-300 text-xs">•</span>
                    <span className="flex items-center gap-1.5">
                      <svg
                        className="w-4 h-4 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                        ></path>
                      </svg>
                      {employee?.department?.name || "No Department"}
                    </span>
                  </div>
                </div>

                <div className="mb-2">
                  <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 uppercase tracking-wide border border-blue-100">
                    {user?.role}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: Contact & Personal */}
        <div className="md:col-span-1 space-y-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span className="w-1 h-6 bg-primary-500 rounded-full"></span>
              Contact Info
            </h3>

            <div className="space-y-6">
              <div className="group">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1 block group-hover:text-primary-600 transition-colors">
                  Email Address
                </label>
                <div className="flex items-center gap-3">
                  <span className="p-2 bg-gray-50 rounded-lg text-gray-500">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      ></path>
                    </svg>
                  </span>
                  <p className="text-gray-900 font-medium truncate">
                    {employee?.user?.email}
                  </p>
                </div>
              </div>

              <div className="group">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1 block group-hover:text-primary-600 transition-colors">
                  Phone Number
                </label>
                <div className="flex items-center gap-3">
                  <span className="p-2 bg-gray-50 rounded-lg text-gray-500">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      ></path>
                    </svg>
                  </span>
                  <p className="text-gray-900 font-medium">
                    {employee?.phone || "Not Provided"}
                  </p>
                </div>
              </div>

              <div className="group">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1 block group-hover:text-primary-600 transition-colors">
                  Address
                </label>
                <div className="flex items-start gap-3">
                  <span className="p-2 bg-gray-50 rounded-lg text-gray-500 mt-1">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      ></path>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      ></path>
                    </svg>
                  </span>
                  <p className="text-gray-900 font-medium leading-relaxed">
                    {employee?.address || "Not Provided"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Work Details */}
        <div className="md:col-span-2 space-y-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span className="w-1 h-6 bg-green-500 rounded-full"></span>
              Employment Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-8 gap-x-12">
              <div>
                <label className="text-sm text-gray-500 mb-1 block">
                  Employee ID
                </label>
                <p className="text-xl font-mono font-semibold text-gray-900 tracking-tight">
                  #{employee?.id?.toString().padStart(4, "0")}
                </p>
              </div>

              <div>
                <label className="text-sm text-gray-500 mb-1 block">
                  Date of Joining
                </label>
                <p className="text-lg font-medium text-gray-900">
                  {employee?.joining_date
                    ? new Date(employee.joining_date).toLocaleDateString(
                        undefined,
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )
                    : "N/A"}
                </p>
              </div>

              <div className="col-span-1 sm:col-span-2 border-t border-gray-100 pt-6 mt-2">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm text-gray-500 mb-1 block">
                      Current Salary
                    </label>
                    <p className="text-2xl font-bold text-gray-900">
                      ${employee?.salary?.toLocaleString() || "0"}{" "}
                      <span className="text-sm font-normal text-gray-400">
                        / year
                      </span>
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-50 text-green-700 text-xs font-medium border border-green-100">
                      Active Employee
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="text-lg font-bold text-gray-900">Edit Profile</h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdateProfile} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  value={editFormData.first_name}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      first_name: e.target.value,
                    })
                  }
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  value={editFormData.last_name}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      last_name: e.target.value,
                    })
                  }
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={editFormData.phone}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, phone: e.target.value })
                  }
                  className="input-field"
                  required
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="flex-1 btn-primary">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
