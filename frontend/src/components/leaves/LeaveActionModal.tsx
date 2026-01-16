import React, { useState } from "react";

interface LeaveActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (id: number, reason: string) => void;
  title: string;
  leaveId: number | null;
  actionType: "APPROVE" | "REJECT";
}

const LeaveActionModal: React.FC<LeaveActionModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  leaveId,
  actionType,
}) => {
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen || leaveId === null) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (actionType === "REJECT" && !reason.trim()) {
      alert("Reason is required for rejection");
      return;
    }

    setLoading(true);
    await onConfirm(leaveId, reason);
    setLoading(false);
    setReason("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-lg p-6 w-full max-w-sm">
        <h2
          className={`text-xl font-bold mb-4 ${
            actionType === "REJECT" ? "text-red-600" : "text-green-600"
          }`}
        >
          {title}
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {actionType === "REJECT"
                ? "Reason (Required)"
                : "Comments (Optional)"}
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="input-field w-full"
              rows={3}
              placeholder={
                actionType === "REJECT"
                  ? "Why is this request being rejected?"
                  : "Any comments..."
              }
              required={actionType === "REJECT"}
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-4 py-2 text-white rounded-lg font-medium ${
                actionType === "REJECT"
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-green-600 hover:bg-green-700"
              }`}
              disabled={loading}
            >
              {loading ? "Processing..." : "Confirm"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LeaveActionModal;
