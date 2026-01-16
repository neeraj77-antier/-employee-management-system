import React, { useEffect, useState } from "react";
import {
  departmentService,
  type Department,
} from "../services/departmentService";
import { useAppSelector } from "../hooks/useRedux";
import ConfirmationModal from "../components/ConfirmationModal";
import { useToast } from "../context/ToastContext";

const Departments: React.FC = () => {
  const { addToast } = useToast();
  const { user } = useAppSelector((state) => state.auth);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({ name: "", description: "" });

  // Delete confirmation state
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const data = await departmentService.getAll();
      setDepartments(data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch departments");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await departmentService.create(formData);
      setShowAddModal(false);
      setFormData({ name: "", description: "" });
      fetchDepartments();
      addToast("Department created successfully", "success");
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message || "Failed to create department";
      addToast(errorMsg, "error");
    }
  };

  const confirmDelete = (id: number) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (deleteId === null) return;

    try {
      await departmentService.delete(deleteId);
      setDepartments(departments.filter((dept) => dept.id !== deleteId));
      setShowDeleteModal(false);
      setDeleteId(null);
      addToast("Department deleted successfully", "success");
    } catch (err: any) {
      // Close modal first so alert is visible/cleaner, or customize alert too
      setShowDeleteModal(false);
      const errorMsg =
        err.response?.data?.message || "Failed to delete department";
      addToast(errorMsg, "error");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Departments</h1>
          <p className="text-gray-600 mt-2">
            Manage organizational departments
          </p>
        </div>
        {user?.role === "ADMIN" && (
          <button className="btn-primary" onClick={() => setShowAddModal(true)}>
            + Add Department
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.map((department) => (
          <div
            key={department.id}
            className="card hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-gray-900">
                {department.name}
              </h3>
              {user?.role === "ADMIN" && (
                <button
                  onClick={() => confirmDelete(department.id)}
                  className="text-red-600 hover:text-red-700 text-sm"
                >
                  Delete
                </button>
              )}
            </div>
            <p className="text-gray-600">
              {department.description || "No description"}
            </p>
          </div>
        ))}
      </div>

      {/* Add Department Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Add Department</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department Name
                </label>
                <input
                  type="text"
                  className="input-field"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  className="input-field"
                  rows={3}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>
              <div className="flex gap-3">
                <button type="submit" className="btn-primary flex-1">
                  Create
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        title="Delete Department"
        message="Are you sure you want to delete this department? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
        confirmText="Delete"
        type="danger"
      />
    </div>
  );
};

export default Departments;
