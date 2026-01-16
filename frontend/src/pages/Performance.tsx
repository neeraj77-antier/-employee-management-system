import React, { useState, useEffect } from "react";
// import { useForm } from "react-hook-form";
import { performanceService } from "../services/performanceService";
import type { PerformanceReview, Goal } from "../services/performanceService";
import { employeeService } from "../services/employeeService";
import { useAppSelector } from "../hooks/useRedux";
import PerformanceModal from "../components/performance/PerformanceModal";
import { useToast } from "../context/ToastContext";

const PerformancePage: React.FC = () => {
  const { addToast } = useToast();
  const { user } = useAppSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState<"reviews" | "goals">("reviews");
  const [reviews, setReviews] = useState<PerformanceReview[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<"add_review" | "add_goal">(
    "add_review"
  );

  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [statusToUpdate, setStatusToUpdate] = useState<
    "PENDING" | "IN_PROGRESS" | "COMPLETED"
  >("PENDING");

  // const { register, handleSubmit, reset } = useForm();

  const isAdminOrManager = user?.role === "ADMIN" || user?.role === "MANAGER";

  useEffect(() => {
    fetchData();
    if (isAdminOrManager) {
      fetchEmployees();
    }
  }, [activeTab]);

  const fetchEmployees = async () => {
    try {
      const data = await employeeService.getAll();
      setEmployees(data || []);
    } catch (error) {
      console.error("Error fetching employees", error);
      setEmployees([]);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === "reviews") {
        if (isAdminOrManager) {
          const data = await performanceService.getAllReviews();
          setReviews(data);
        } else {
          const data = await performanceService.getMyReviews();
          setReviews(data);
        }
      } else {
        if (isAdminOrManager) {
          // For now admins just see their own items or we could implement an "all goals" view
          // But the service supports getMyGoals(id) - let's stick to simple "getMyGoals" for now
          // Or fetch a specific employee's goals if filtered.
          // To simplify, let's load current user's goals for everyone initially
          const data = await performanceService.getMyGoals(user?.employeeId);
          setGoals(data);
        } else {
          const data = await performanceService.getMyGoals();
          setGoals(data);
        }
      }
    } catch (error) {
      console.error("Error fetching data", error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: any) => {
    try {
      if (modalType === "add_review") {
        await performanceService.addReview({
          employeeId: Number(data.employeeId),
          rating: Number(data.rating),
          comments: data.comments,
        });
        addToast("Review added successfully", "success");
      } else {
        await performanceService.addGoal({
          title: data.title,
          description: data.description,
          deadline: data.deadline,
        });
        addToast("Goal created successfully", "success");
      }
      setShowModal(false);
      // reset(); // Reset handled inside modal
      fetchData();
    } catch (error: any) {
      console.error("Error submitting form", error);
      addToast(error.message || "Operation failed", "error");
    }
  };

  const handleOpenStatusModal = (goal: Goal) => {
    setSelectedGoal(goal);
    setStatusToUpdate(goal.status);
    setShowStatusModal(true);
  };

  const handleConfirmStatusUpdate = async () => {
    if (!selectedGoal) return;
    try {
      await performanceService.updateGoal(selectedGoal.id, statusToUpdate);
      setShowStatusModal(false);
      setSelectedGoal(null);
      fetchData();
      addToast("Goal status updated successfully", "success");
    } catch (error: any) {
      console.error("Error updating goal", error);
      addToast(error.message || "Failed to update status", "error");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">
          Performance Management
        </h1>
        <div className="space-x-4">
          {/* Only managers/admins can add reviews, everyone can add goals */}
          {activeTab === "reviews" && isAdminOrManager && (
            <button
              onClick={() => {
                setModalType("add_review");
                setShowModal(true);
              }}
              className="btn-primary"
            >
              + Add Review
            </button>
          )}
          {activeTab === "goals" && (
            <button
              onClick={() => {
                setModalType("add_goal");
                setShowModal(true);
              }}
              className="btn-primary"
            >
              + Add Goal
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab("reviews")}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "reviews"
                ? "border-primary-500 text-primary-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Performance Reviews
          </button>
          <button
            onClick={() => setActiveTab("goals")}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "goals"
                ? "border-primary-500 text-primary-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Goals & OKRs
          </button>
        </nav>
      </div>

      {/* Content */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading...</div>
        ) : (
          <>
            {activeTab === "reviews" && (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    {isAdminOrManager && (
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Employee
                      </th>
                    )}
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Reviewer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rating
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Comments
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {reviews.map((review) => (
                    <tr key={review.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(review.review_date).toLocaleDateString()}
                      </td>
                      {isAdminOrManager && (
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {review.employee
                            ? `${review.employee.first_name} ${review.employee.last_name}`
                            : "N/A"}
                        </td>
                      )}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {review.reviewer
                          ? `${review.reviewer.first_name} ${review.reviewer.last_name}`
                          : "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            review.rating >= 4
                              ? "bg-green-100 text-green-800"
                              : review.rating >= 3
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {review.rating} / 5
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                        {review.comments}
                      </td>
                    </tr>
                  ))}
                  {reviews.length === 0 && (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-6 py-4 text-center text-gray-500"
                      >
                        No reviews found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}

            {activeTab === "goals" && (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Deadline
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {goals.map((goal) => (
                    <tr key={goal.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {goal.title}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {goal.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {goal.deadline
                          ? new Date(goal.deadline).toLocaleDateString()
                          : "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            goal.status === "COMPLETED"
                              ? "bg-green-100 text-green-800"
                              : goal.status === "IN_PROGRESS"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {goal.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleOpenStatusModal(goal)}
                          className="text-primary-600 hover:text-primary-900"
                        >
                          Change Status
                        </button>
                      </td>
                    </tr>
                  ))}
                  {goals.length === 0 && (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-6 py-4 text-center text-gray-500"
                      >
                        No goals found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </>
        )}
      </div>

      {/* Modal */}
      <PerformanceModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={onSubmit}
        type={modalType}
        employees={employees}
      />
      {/* Status Update Modal */}
      {/* Status Update Modal */}
      {showStatusModal && selectedGoal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md transform transition-all">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Change Goal Status
            </h3>
            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-2">
                Current Status:{" "}
                <span className="font-semibold">{selectedGoal.status}</span>
              </p>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                New Status
              </label>
              <select
                value={statusToUpdate}
                onChange={(e) => setStatusToUpdate(e.target.value as any)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
              >
                <option value="PENDING">Pending</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>
            <div className="mt-5 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
              <button
                type="button"
                onClick={handleConfirmStatusUpdate}
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:col-start-2 sm:text-sm"
              >
                Confirm Change
              </button>
              <button
                type="button"
                onClick={() => setShowStatusModal(false)}
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:col-start-1 sm:text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PerformancePage;
