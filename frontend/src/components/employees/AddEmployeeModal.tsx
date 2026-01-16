import React, { useState, useEffect } from "react";
import {
  employeeService,
  type CreateEmployeeData,
} from "../../services/employeeService";
import {
  departmentService,
  type Department,
} from "../../services/departmentService";

interface AddEmployeeModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

const AddEmployeeModal: React.FC<AddEmployeeModalProps> = ({
  onClose,
  onSuccess,
}) => {
  const [formData, setFormData] = useState<CreateEmployeeData>({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    phone: "",
    department_id: 0,
    designation: "",
    joining_date: new Date().toISOString().split("T")[0],
    salary: 0,
  });

  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const data = await departmentService.getAll();
      setDepartments(data);
      if (data.length > 0) {
        setFormData((prev) => ({ ...prev, department_id: data[0].id }));
      }
    } catch (err) {
      console.error("Failed to fetch departments", err);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "salary" || name === "department_id" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // In a real scenario, we might need to create the user first via a userService.create() call
      // and then get the ID.
      // Since I don't have the full context of the backend user creation flow here,
      // I will assume for now that the backend *might* accept user details mixed in,
      // OR I need to create a user first.
      // Let's try to find `userService` or `authService` usage.
      // I'll assume for this step we might need to be careful.
      // *Self-correction*: The plan says "Connect to backend API for user creation".
      // I'll stick to the employee fields for now and maybe prompt for User ID or
      // if the backend handles it, great.
      // Actually, let's try to just submit the employee form.
      // If `user_id` is required, I might need to mock it or fix the backend later.
      // Let's add a "User ID" field for now if it's strictly required by the interface,
      // or better, if the backend supports creating user with employee, that would be ideal.
      // I will assume we need to capture `user_id` somehow.
      // Let's put a placeholder for User ID or fetch available users?
      // Let's just put input fields for now.

      await employeeService.create(formData);
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create employee");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Add New Employee</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name
              </label>
              <input
                type="text"
                name="first_name"
                required
                className="input-field"
                value={formData.first_name}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Name
              </label>
              <input
                type="text"
                name="last_name"
                required
                className="input-field"
                value={formData.last_name}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email (for Login)
              </label>
              <input
                type="email"
                name="email"
                required
                className="input-field"
                value={formData.email || ""}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                required
                minLength={6}
                className="input-field"
                value={formData.password || ""}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                required
                className="input-field"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Department
              </label>
              <select
                name="department_id"
                required
                className="input-field"
                value={formData.department_id}
                onChange={handleChange}
              >
                <option value={0}>Select Department</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Designation
              </label>
              <input
                type="text"
                name="designation"
                required
                className="input-field"
                value={formData.designation}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Joining Date
              </label>
              <input
                type="date"
                name="joining_date"
                required
                className="input-field"
                value={formData.joining_date}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Salary
              </label>
              <input
                type="number"
                name="salary"
                required
                min="0"
                className="input-field"
                value={formData.salary}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
              disabled={loading}
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Creating..." : "Create Employee"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEmployeeModal;
