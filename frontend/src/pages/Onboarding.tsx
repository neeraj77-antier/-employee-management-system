import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "../api/axios";
import { API_ENDPOINTS } from "../constants";
import { useNavigate } from "react-router-dom";
import OtpVerificationModal from "../components/auth/OtpVerificationModal";
import { useToast } from "../context/ToastContext";

const OnboardingSchema = Yup.object().shape({
  first_name: Yup.string().required("First Name is required"),
  last_name: Yup.string().required("Last Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  phone: Yup.string().required("Phone number is required"),
  designation: Yup.string().required("Designation is required"),
  department_id: Yup.number().required("Department ID is required"),
});

const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");

  const formik = useFormik({
    initialValues: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      phone: "",
      designation: "",
      department_id: 1, // Default to 1 or make it a dropdown
    },
    validationSchema: OnboardingSchema,
    onSubmit: async (values) => {
      setLoading(true);
      setError("");
      try {
        await axios.post(API_ENDPOINTS.AUTH.REGISTER, values);
        setRegisteredEmail(values.email);
        setShowOtpModal(true);
        addToast("Registration successful! Please verify OTP.", "info");
      } catch (err: any) {
        const errorMsg =
          err.response?.data?.message ||
          "Registration failed. Please try again.";
        setError(errorMsg);
        addToast(errorMsg, "error");
      } finally {
        setLoading(false);
      }
    },
  });

  const handleOtpSuccess = () => {
    setShowOtpModal(false);
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">
            Create an Account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Join the Employee Management System
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={formik.handleSubmit}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  First Name
                </label>
                <input
                  name="first_name"
                  type="text"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.first_name}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
                {formik.touched.first_name && formik.errors.first_name && (
                  <p className="mt-1 text-xs text-red-600">
                    {formik.errors.first_name}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Last Name
                </label>
                <input
                  name="last_name"
                  type="text"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.last_name}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
                {formik.touched.last_name && formik.errors.last_name && (
                  <p className="mt-1 text-xs text-red-600">
                    {formik.errors.last_name}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                name="email"
                type="email"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
              {formik.touched.email && formik.errors.email && (
                <p className="mt-1 text-xs text-red-600">
                  {formik.errors.email}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                name="password"
                type="password"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
              {formik.touched.password && formik.errors.password && (
                <p className="mt-1 text-xs text-red-600">
                  {formik.errors.password}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Phone
              </label>
              <input
                name="phone"
                type="text"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.phone}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
              {formik.touched.phone && formik.errors.phone && (
                <p className="mt-1 text-xs text-red-600">
                  {formik.errors.phone}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Designation
              </label>
              <input
                name="designation"
                type="text"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.designation}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
              {formik.touched.designation && formik.errors.designation && (
                <p className="mt-1 text-xs text-red-600">
                  {formik.errors.designation}
                </p>
              )}
            </div>

            {/* Department ID is hidden or fixed for now, or add dropdown if needed */}
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? "Creating Account..." : "Sign Up"}
            </button>
          </div>

          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <a
                href="/login"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Log in
              </a>
            </p>
          </div>
        </form>
      </div>

      <OtpVerificationModal
        email={registeredEmail}
        isOpen={showOtpModal}
        onClose={() => setShowOtpModal(false)}
        onSuccess={handleOtpSuccess}
      />
    </div>
  );
};

export default Onboarding;
