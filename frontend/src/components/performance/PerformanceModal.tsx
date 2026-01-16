import React, { useEffect } from "react";
import { useForm } from "react-hook-form";

interface PerformanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  type: "add_review" | "add_goal";
  employees: any[];
}

const PerformanceModal: React.FC<PerformanceModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  type,
  employees,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  if (!isOpen) return null;

  const onFormSubmit = (data: any) => {
    onSubmit(data);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        ></div>
        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>
        <div className="relative z-50 inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <form onSubmit={handleSubmit(onFormSubmit)} className="p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              {type === "add_review"
                ? "Add Performance Review"
                : "Set New Goal"}
            </h3>

            {type === "add_review" ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Employee
                  </label>
                  <select
                    {...register("employeeId", {
                      required: "Employee is required",
                    })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  >
                    <option value="">Select Employee</option>
                    {Array.isArray(employees) &&
                      employees.map((e) => (
                        <option key={e.id} value={e.id}>
                          {e.first_name} {e.last_name}
                        </option>
                      ))}
                  </select>
                  {errors.employeeId && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.employeeId.message as string}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Rating (1-5)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    step="0.1"
                    {...register("rating", {
                      required: "Rating is required",
                      min: { value: 1, message: "Rating must be at least 1" },
                      max: { value: 5, message: "Rating must be at most 5" },
                      validate: (value) => {
                        if (value < 1 || value > 5)
                          return "Rating must be between 1 and 5";
                        return true;
                      },
                    })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  />
                  {errors.rating && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.rating.message as string}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Comments
                  </label>
                  <textarea
                    {...register("comments")}
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  ></textarea>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Goal Title
                  </label>
                  <input
                    type="text"
                    {...register("title", { required: "Title is required" })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  />
                  {errors.title && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.title.message as string}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    {...register("description")}
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  ></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Deadline
                  </label>
                  <input
                    type="date"
                    {...register("deadline")}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  />
                </div>
              </div>
            )}

            <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
              <button
                type="submit"
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:col-start-2 sm:text-sm"
              >
                Submit
              </button>
              <button
                type="button"
                onClick={onClose}
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:col-start-1 sm:text-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PerformanceModal;
