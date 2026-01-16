import React, { useEffect, useState } from "react";
import { leaveService, type LeaveRequest } from "../services/leaveService";
import { useAppSelector } from "../hooks/useRedux";
import RequestLeaveModal from "../components/leaves/RequestLeaveModal";
import LeaveActionModal from "../components/leaves/LeaveActionModal";
import LeaveHistory from "../components/leaves/LeaveHistory";
import { useToast } from "../context/ToastContext";

const Leaves: React.FC = () => {
  const { addToast } = useToast();
  const { user } = useAppSelector((state) => state.auth);
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [pendingLeaves, setPendingLeaves] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "my-requests" | "pending" | "history"
  >("my-requests");
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);

  const [actionModal, setActionModal] = useState<{
    isOpen: boolean;
    leaveId: number | null;
    actionType: "APPROVE" | "REJECT";
  }>({
    isOpen: false,
    leaveId: null,
    actionType: "APPROVE",
  });

  useEffect(() => {
    if (user?.role === "ADMIN" && activeTab === "my-requests") {
      setActiveTab("pending");
    }
  }, [user, activeTab]);

  useEffect(() => {
    fetchLeaves();
  }, [activeTab]);

  const fetchLeaves = async () => {
    try {
      setLoading(true);
      if (activeTab === "my-requests") {
        const data = await leaveService.getMyRequests();
        setLeaves(data);
      } else if (activeTab === "pending") {
        const data = await leaveService.getPending();
        setPendingLeaves(data);
      }
    } catch (err) {
      console.error("Failed to fetch leaves:", err);
    } finally {
      setLoading(false);
    }
  };

  const openActionModal = (id: number, type: "APPROVE" | "REJECT") => {
    setActionModal({
      isOpen: true,
      leaveId: id,
      actionType: type,
    });
  };

  const handleConfirmAction = async (id: number, reason: string) => {
    try {
      if (actionModal.actionType === "APPROVE") {
        await leaveService.approve(id, reason);
        addToast("Leave request approved", "success");
      } else {
        await leaveService.reject(id, reason);
        addToast("Leave request rejected", "info");
      }
      fetchLeaves();
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message || "Failed to process request";
      addToast(errorMsg, "error");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "bg-green-100 text-green-800";
      case "REJECTED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Leave Management</h1>
          <p className="text-gray-600 mt-2">
            Manage leave requests and approvals
          </p>
        </div>
        {(user?.role === "EMPLOYEE" || user?.role === "MANAGER") && (
          <button
            onClick={() => setIsRequestModalOpen(true)}
            className="btn-primary"
          >
            Request Leave
          </button>
        )}
      </div>

      <RequestLeaveModal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        onSuccess={() => {
          fetchLeaves();
          addToast("Leave request submitted successfully", "success");
        }}
      />

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b border-gray-200">
        {user?.role !== "ADMIN" && (
          <button
            onClick={() => setActiveTab("my-requests")}
            className={`pb-3 px-4 font-medium transition-colors ${
              activeTab === "my-requests"
                ? "border-b-2 border-primary-600 text-primary-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            My Requests
          </button>
        )}
        {(user?.role === "ADMIN" || user?.role === "MANAGER") && (
          <button
            onClick={() => setActiveTab("pending")}
            className={`pb-3 px-4 font-medium transition-colors ${
              activeTab === "pending"
                ? "border-b-2 border-primary-600 text-primary-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Pending Approvals
          </button>
        )}
        {(user?.role === "ADMIN" || user?.role === "MANAGER") && (
          <button
            onClick={() => setActiveTab("history")}
            className={`pb-3 px-4 font-medium transition-colors ${
              activeTab === "history"
                ? "border-b-2 border-primary-600 text-primary-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            History & Analytics
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-gray-600">Loading...</div>
        </div>
      ) : (
        <div className="card">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  {activeTab === "pending" && (
                    <th className="text-left py-4 px-4 font-semibold text-gray-700">
                      Employee
                    </th>
                  )}
                  <th className="text-left py-4 px-4 font-semibold text-gray-700">
                    Type
                  </th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-700">
                    Date
                  </th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-700">
                    Reason
                  </th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-700">
                    Status
                  </th>
                  {activeTab === "pending" && (
                    <th className="text-left py-4 px-4 font-semibold text-gray-700">
                      Actions
                    </th>
                  )}
                  {activeTab === "my-requests" && (
                    <th className="text-left py-4 px-4 font-semibold text-gray-700">
                      Comments
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {(activeTab === "my-requests" ? leaves : pendingLeaves)
                  .length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-gray-500">
                      No leave requests found
                    </td>
                  </tr>
                ) : (
                  (activeTab === "my-requests" ? leaves : pendingLeaves).map(
                    (leave) => (
                      <tr
                        key={leave.id}
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >
                        {activeTab === "pending" && (
                          <td className="py-4 px-4 font-medium text-gray-900">
                            {leave.employee?.first_name}{" "}
                            {leave.employee?.last_name}
                          </td>
                        )}
                        <td className="py-4 px-4 text-gray-600">
                          {leave.leave_type}
                        </td>
                        <td className="py-4 px-4 text-gray-600">
                          {new Date(leave.start_date).toLocaleDateString()} -{" "}
                          {new Date(leave.end_date).toLocaleDateString()}
                        </td>
                        <td
                          className="py-4 px-4 text-gray-600 max-w-xs truncate"
                          title={leave.reason}
                        >
                          {leave.reason || "-"}
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(
                              leave.status
                            )}`}
                          >
                            {leave.status}
                          </span>
                        </td>
                        {activeTab === "pending" && (
                          <td className="py-4 px-4">
                            <div className="flex gap-2">
                              <button
                                onClick={() =>
                                  openActionModal(leave.id, "APPROVE")
                                }
                                className="text-green-600 hover:text-green-700 font-medium text-sm"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() =>
                                  openActionModal(leave.id, "REJECT")
                                }
                                className="text-red-600 hover:text-red-700 font-medium text-sm"
                              >
                                Reject
                              </button>
                            </div>
                          </td>
                        )}
                        {activeTab === "my-requests" && (
                          <td className="py-4 px-4 text-gray-500 italic">
                            {leave.admin_comments || "-"}
                          </td>
                        )}
                      </tr>
                    )
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "history" && <LeaveHistory />}

      <LeaveActionModal
        isOpen={actionModal.isOpen}
        onClose={() => setActionModal({ ...actionModal, isOpen: false })}
        onConfirm={handleConfirmAction}
        title={
          actionModal.actionType === "APPROVE"
            ? "Approve Leave Request"
            : "Reject Leave Request"
        }
        leaveId={actionModal.leaveId}
        actionType={actionModal.actionType}
      />
    </div>
  );
};

export default Leaves;
