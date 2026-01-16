import React, { useState } from "react";
import axios from "../../api/axios";
import { API_ENDPOINTS } from "../../constants";
import { useAppDispatch } from "../../hooks/useRedux";
import { setCredentials } from "../../store/slices/authSlice";
// import { useNavigate } from "react-router-dom";
import { useToast } from "../../context/ToastContext";

interface OtpVerificationModalProps {
  email: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const OtpVerificationModal: React.FC<OtpVerificationModalProps> = ({
  email,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const dispatch = useAppDispatch();
  // const navigate = useNavigate();

  const handleChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(Number(element.value))) return false;

    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

    // Focus next input
    if (element.nextSibling && element.value !== "") {
      (element.nextSibling as HTMLInputElement).focus();
    }
  };

  const { addToast } = useToast();

  const handleVerify = async () => {
    const otpValue = otp.join("");
    if (otpValue.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      addToast("Please enter a valid 6-digit OTP", "warning");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axios.post(API_ENDPOINTS.AUTH.VERIFY_OTP, {
        email,
        otp: otpValue,
      });

      const { access_token, user } = response.data;
      dispatch(setCredentials({ user, token: access_token }));
      addToast("OTP Verified! Login successful.", "success");
      onSuccess();
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message || "Verification failed. Please try again.";
      setError(errorMsg);
      addToast(errorMsg, "error");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl transform transition-all">
        <div className="text-center mb-6">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mb-4">
            <svg
              className="h-8 w-8 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Verify OTP</h2>
          <p className="text-sm text-gray-500 mt-2">
            Enter the 6-digit code sent to{" "}
            <span className="font-medium text-gray-700">{email}</span>
          </p>
          <p className="text-xs text-blue-500 mt-1">(Use static OTP: 123456)</p>
        </div>

        <div className="flex justify-center gap-2 mb-6">
          {otp.map((data, index) => (
            <input
              className="w-12 h-12 border-2 rounded-lg text-center text-xl font-bold text-gray-900 focus:border-blue-500 focus:ring-blue-500 outline-none transition-colors"
              type="text"
              name="otp"
              maxLength={1}
              key={index}
              value={data}
              onChange={(e) => handleChange(e.target, index)}
              onFocus={(e) => e.target.select()}
            />
          ))}
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg text-center">
            {error}
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={handleVerify}
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-xl font-semibold shadow-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Verifying..." : "Verify & Continue"}
          </button>

          <button
            onClick={onClose}
            className="w-full text-gray-500 text-sm font-medium hover:text-gray-700 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default OtpVerificationModal;
