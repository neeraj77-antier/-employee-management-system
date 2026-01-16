import React from "react";
import { useToast, type Toast } from "../../context/ToastContext";

const ToastItem: React.FC<{ toast: Toast }> = ({ toast }) => {
  const [isExiting, setIsExiting] = React.useState(false);
  const { removeToast } = useToast();

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      removeToast(toast.id);
    }, 400); // Match animation duration
  };

  // Auto-dismiss logic needs to be mindful of the exit animation
  React.useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const typeConfig = {
    success: {
      bg: "bg-white", // Glassy white
      border: "border-green-100",
      iconColor: "text-green-500",
      progressBar: "bg-green-500",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    error: {
      bg: "bg-white",
      border: "border-red-100",
      iconColor: "text-red-500",
      progressBar: "bg-red-500",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    info: {
      bg: "bg-white",
      border: "border-blue-100",
      iconColor: "text-blue-500",
      progressBar: "bg-blue-500",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    warning: {
      bg: "bg-white",
      border: "border-yellow-100",
      iconColor: "text-yellow-500",
      progressBar: "bg-yellow-500",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
  };

  const config = typeConfig[toast.type];

  return (
    <div
      className={`relative w-full max-w-sm flex items-start p-4 mb-3 rounded-2xl shadow-xl border backdrop-blur-sm transition-all transform hover:scale-[1.02] cursor-default ${
        isExiting ? "toast-exit" : "toast-enter"
      } ${config.bg} ${config.border}`}
      role="alert"
    >
      {/* Icon */}
      <div className={`flex-shrink-0 mr-4 ${config.iconColor}`}>
        {config.icon}
      </div>

      {/* Content */}
      <div className="flex-1 pt-0.5">
        <p className="text-sm font-semibold text-gray-900 capitalize mb-0.5">
          {toast.type}
        </p>
        <p className="text-sm text-gray-600 leading-relaxed font-medium">
          {toast.message}
        </p>
      </div>

      {/* Close Button */}
      <button
        onClick={handleClose}
        className="ml-4 flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      {/* Progress Bar (Optional Visual Flair) */}
      <div className="absolute bottom-0 left-4 right-4 h-0.5 bg-gray-100 rounded-full overflow-hidden opacity-50">
        <div
          className={`h-full ${config.progressBar}`}
          style={{
            animation: `fadeOut 5s linear forwards`, // Matches auto-dismiss timer
          }}
        />
      </div>
    </div>
  );
};

export const ToastContainer: React.FC = () => {
  const { toasts } = useToast();

  return (
    <div className="fixed top-24 right-6 z-50 flex flex-col items-end pointer-events-none gap-4">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </div>
  );
};
