import React, { useEffect, useState } from "react";
import { employeeService, type Employee } from "../services/employeeService";
// import {
//   departmentService,
//   type Department,
// } from "../services/departmentService";
import AddEmployeeModal from "../components/employees/AddEmployeeModal";
import ConfirmationModal from "../components/ConfirmationModal";
import { useAppSelector } from "../hooks/useRedux";
import { useToast } from "../context/ToastContext";

const Employees: React.FC = () => {
  const { addToast } = useToast();
  const { user } = useAppSelector((state) => state.auth);
  const [employees, setEmployees] = useState<Employee[]>([]);
  // const [departments, setDepartments] = useState<Department[]>([]); // Unused
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<number | null>(null);

  useEffect(() => {
    fetchEmployees();
    // fetchDepartments(); // Unused
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const data = await employeeService.getAll();
      setEmployees(data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch employees");
    } finally {
      setLoading(false);
    }
  };

  // const fetchDepartments = async () => { ... } removed

  const handleDelete = (id: number) => {
    setEmployeeToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!employeeToDelete) return;

    try {
      await employeeService.delete(employeeToDelete);
      setEmployees(employees.filter((emp) => emp.id !== employeeToDelete));
      setShowDeleteModal(false);
      setEmployeeToDelete(null);
      addToast("Employee deleted successfully", "success");
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message || "Failed to delete employee";
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
          <h1 className="text-3xl font-bold text-gray-900">Employees</h1>
          <p className="text-gray-600 mt-2">Manage your team members</p>
        </div>
        {(user?.role === "ADMIN" || user?.role === "MANAGER") && (
          <button className="btn-primary" onClick={() => setShowAddModal(true)}>
            + Add Employee
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-4 px-4 font-semibold text-gray-700">
                  Name
                </th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700">
                  Email
                </th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700">
                  Department
                </th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700">
                  Designation
                </th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700">
                  Phone
                </th>
                {(user?.role === "ADMIN" || user?.role === "MANAGER") && (
                  <th className="text-left py-4 px-4 font-semibold text-gray-700">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {employees.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-500">
                    No employees found
                  </td>
                </tr>
              ) : (
                employees.map((employee) => (
                  <tr
                    key={employee.id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-semibold">
                          {employee.first_name[0]}
                          {employee.last_name[0]}
                        </div>
                        <span className="font-medium text-gray-900">
                          {employee.first_name} {employee.last_name}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-gray-600">
                      {employee.user?.email || "N/A"}
                    </td>
                    <td className="py-4 px-4 text-gray-600">
                      {employee.department?.name || "N/A"}
                    </td>
                    <td className="py-4 px-4 text-gray-600">
                      {employee.designation}
                    </td>
                    <td className="py-4 px-4 text-gray-600">
                      {employee.phone}
                    </td>
                    {(user?.role === "ADMIN" || user?.role === "MANAGER") && (
                      <td className="py-4 px-4">
                        <button
                          onClick={() => handleDelete(employee.id)}
                          className="text-red-600 hover:text-red-700 font-medium text-sm"
                        >
                          Delete
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showAddModal && (
        <AddEmployeeModal
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            setShowAddModal(false);
            fetchEmployees();
            addToast("Employee added successfully", "success");
          }}
        />
      )}

      <ConfirmationModal
        isOpen={showDeleteModal}
        title="Delete Employee"
        message="Are you sure you want to delete this employee? This action cannot be undone."
        onConfirm={confirmDelete}
        onCancel={() => setShowDeleteModal(false)}
        confirmText="Delete"
        type="danger"
      />
    </div>
  );
};

export default Employees;
