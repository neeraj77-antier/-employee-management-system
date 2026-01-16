import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "../api/axios";
import { API_ENDPOINTS } from "../constants";
import { useAppDispatch } from "../hooks/useRedux";
import { setCredentials } from "../store/slices/authSlice";
import OtpVerificationModal from "../components/auth/OtpVerificationModal";
import { useToast } from "../context/ToastContext";

const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const Login: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const [showOtpModal, setShowOtpModal] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: LoginSchema,
    onSubmit: async (values) => {
      setLoading(true);
      setError("");
      try {
        const response = await axios.post(API_ENDPOINTS.AUTH.LOGIN, values);

        // Check if OTP is required
        if (response.data.require_otp) {
          setLoginEmail(values.email);
          setShowOtpModal(true);
        } else {
          // Fallback for unexpected direct login (should not happen with current backend)
          const { access_token, user } = response.data;
          dispatch(setCredentials({ user, token: access_token }));
          navigate("/dashboard");
        }
      } catch (err: any) {
        setError(
          err.response?.data?.message ||
            "Login failed. Please check your credentials."
        );
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-primary-100">
      <div className="w-full max-w-md">
        <div className="card">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome Back
            </h1>
            <p className="text-gray-600">Sign in to your account</p>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={formik.handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className="input-field"
                placeholder="you@example.com"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
              />
              {formik.touched.email && formik.errors.email && (
                <p className="mt-1 text-sm text-red-600">
                  {formik.errors.email}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                className="input-field"
                placeholder="••••••••"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
              />
              {formik.touched.password && formik.errors.password && (
                <p className="mt-1 text-sm text-red-600">
                  {formik.errors.password}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <a
                href="/register"
                className="font-medium text-primary-600 hover:text-primary-500"
              >
                Register here
              </a>
            </p>
          </div>
        </div>
      </div>

      <OtpVerificationModal
        email={loginEmail}
        isOpen={showOtpModal}
        onClose={() => setShowOtpModal(false)}
        onSuccess={handleOtpSuccess}
      />
    </div>
  );
};

export default Login;
