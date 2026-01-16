import React, { useEffect, useState } from "react";
import { payrollService, type Payroll } from "../services/payrollService";
import { useAppSelector } from "../hooks/useRedux";
import ConfirmationModal from "../components/ConfirmationModal";
import { useToast } from "../context/ToastContext";

const PayrollPage: React.FC = () => {
  const { addToast } = useToast();
  const { user } = useAppSelector((state) => state.auth);
  const [payrolls, setPayrolls] = useState<Payroll[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [showMarkPaidModal, setShowMarkPaidModal] = useState(false);
  const [markPaidId, setMarkPaidId] = useState<number | null>(null);

  // Filter state for Admin
  const [selectedMonth, setSelectedMonth] = useState("January");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  useEffect(() => {
    fetchPayroll();
  }, [user, selectedMonth, selectedYear]);

  const fetchPayroll = async () => {
    try {
      setLoading(true);
      setError("");
      let data;
      if (user?.role === "ADMIN") {
        data = await payrollService.getAll(selectedYear, selectedMonth);
      } else {
        data = await payrollService.getMySlips();
      }
      setPayrolls(data);
    } catch (err: any) {
      console.error(err);
      setError("No records found or failed to fetch.");
    } finally {
      setLoading(false);
    }
  };

  const startGenerate = () => {
    console.log("Start generate clicked");
    setShowGenerateModal(true);
  };

  const confirmGenerate = async () => {
    console.log("Confirming generation...");
    setShowGenerateModal(false);
    try {
      setLoading(true);
      await payrollService.generate({
        month: selectedMonth,
        year: selectedYear,
      });
      console.log("Generation successful, fetching...");
      await fetchPayroll();
      addToast("Payroll generated successfully!", "success");
    } catch (err: any) {
      console.error("Generate error", err);
      const errorMsg =
        err.response?.data?.message || "Failed to generate payroll";
      addToast(errorMsg, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkPaid = async (id: number) => {
    try {
      await payrollService.markAsPaid(id);
      setPayrolls(
        payrolls.map((p) =>
          p.id === id
            ? { ...p, status: "PAID", payment_date: new Date().toISOString() }
            : p
        )
      );
      addToast("Marked as PAID", "success");
    } catch (err: any) {
      addToast("Failed to update status", "error");
    }
  };

  const startMarkPaid = (id: number) => {
    setMarkPaidId(id);
    setShowMarkPaidModal(true);
  };

  const confirmMarkPaid = async () => {
    if (markPaidId) {
      await handleMarkPaid(markPaidId);
      setShowMarkPaidModal(false);
      setMarkPaidId(null);
    }
  };

  const printPayslip = (slip: Payroll) => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      addToast("Please allow popups to print payslips.", "warning");
      return;
    }

    const htmlContent = `
      <html>
        <head>
          <title>Payslip - ${slip.employee.first_name}</title>
          <style>
            body { font-family: 'Helvetica', sans-serif; padding: 40px; color: #333; }
            .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px; }
            .title { font-size: 24px; font-weight: bold; margin-bottom: 5px; }
            .company { color: #666; font-size: 14px; }
            .section { margin-bottom: 25px; }
            .row { display: flex; justify-content: space-between; border-bottom: 1px solid #eee; padding: 8px 0; }
            .label { font-weight: bold; width: 40%; }
            .value { width: 60%; text-align: right; }
            .total-row { display: flex; justify-content: space-between; border-top: 2px solid #000; padding-top: 15px; margin-top: 10px; font-weight: bold; font-size: 18px; }
            .footer { margin-top: 50px; font-size: 12px; text-align: center; color: #999; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="title">PAYSLIP</div>
            <div class="company">EMP Systems Inc.</div>
          </div>

          <div class="section">
            <div class="row"><span class="label">Employee Name:</span> <span class="value">${
              slip.employee.first_name
            } ${slip.employee.last_name}</span></div>
            <div class="row"><span class="label">Designation:</span> <span class="value">${
              slip.employee.designation
            }</span></div>
            <div class="row"><span class="label">Period:</span> <span class="value">${
              slip.month
            } ${slip.year}</span></div>
            <div class="row"><span class="label">Status:</span> <span class="value">${
              slip.status
            }</span></div>
            <div class="row"><span class="label">Payment Date:</span> <span class="value">${
              slip.payment_date
                ? new Date(slip.payment_date).toLocaleDateString()
                : "N/A"
            }</span></div>
          </div>

          <div class="section">
            <h3 style="border-bottom: 1px solid #000; padding-bottom: 5px;">Earnings</h3>
            <div class="row"><span class="label">Base Salary:</span> <span class="value">$${Number(
              slip.base_salary
            ).toLocaleString()}</span></div>
          </div>

          <div class="section">
             <h3 style="border-bottom: 1px solid #000; padding-bottom: 5px;">Deductions</h3>
            <div class="row"><span class="label">Tax & PF:</span> <span class="value">-$${Number(
              slip.deductions
            ).toLocaleString()}</span></div>
          </div>

          <div class="total-row">
            <span>Net Salary:</span>
            <span>$${Number(slip.net_salary).toLocaleString()}</span>
          </div>

          <div class="footer">
            This is a system generated payslip.
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Payroll</h1>
          <p className="text-gray-600 mt-2">
            {user?.role === "ADMIN"
              ? "Manage employee salaries"
              : "My salary history"}
          </p>
        </div>

        {user?.role === "ADMIN" && (
          <div className="flex gap-4">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="input-field w-40"
            >
              {months.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="input-field w-32"
            >
              {[2024, 2025, 2026].map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
            <button onClick={startGenerate} className="btn-primary">
              Generate Payroll
            </button>
          </div>
        )}
      </div>

      <ConfirmationModal
        isOpen={showGenerateModal}
        title="Generate Payroll"
        message={`Are you sure you want to generate payroll for ${selectedMonth} ${selectedYear}? This will create payslips for all active employees.`}
        onConfirm={confirmGenerate}
        onCancel={() => setShowGenerateModal(false)}
        confirmText="Generate"
        type="info"
      />

      <ConfirmationModal
        isOpen={showMarkPaidModal}
        title="Confirm Payment"
        message="Are you sure you want to mark this payslip as PAID? This action cannot be undone."
        onConfirm={confirmMarkPaid}
        onCancel={() => {
          setShowMarkPaidModal(false);
          setMarkPaidId(null);
        }}
        confirmText="Mark Paid"
        type="info"
      />

      {loading ? (
        <div className="text-center py-12 text-gray-500">
          Loading payroll data...
        </div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Period
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Base Salary
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Net Salary
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
              {payrolls.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    No payroll records found for this period.
                  </td>
                </tr>
              ) : (
                payrolls.map((slip) => (
                  <tr key={slip.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {slip.employee.first_name} {slip.employee.last_name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {slip.employee.designation}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {slip.month} {slip.year}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${slip.base_salary}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                      ${slip.net_salary}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          slip.status === "PAID"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {slip.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => printPayslip(slip)}
                        className="text-primary-600 hover:text-primary-900 mr-4 font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:text-gray-400"
                        disabled={slip.status === "PENDING"}
                      >
                        Print / Save PDF
                      </button>

                      {user?.role === "ADMIN" && slip.status === "PENDING" && (
                        <button
                          onClick={() => startMarkPaid(slip.id)}
                          className="text-green-600 hover:text-green-900"
                        >
                          Mark Paid
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PayrollPage;
