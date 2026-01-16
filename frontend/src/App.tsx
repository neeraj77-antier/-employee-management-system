import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./layouts/DashboardLayout";
import Login from "./pages/Login";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import Departments from "./pages/Departments";
import Leaves from "./pages/Leaves";
import PayrollPage from "./pages/Payroll";
import PerformancePage from "./pages/Performance";
import Attendance from "./pages/Attendance";
import ProfilePage from "./pages/Profile";

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Onboarding />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route
              path="employees"
              element={
                <ProtectedRoute allowedRoles={["ADMIN", "MANAGER"]}>
                  <Employees />
                </ProtectedRoute>
              }
            />
            <Route path="departments" element={<Departments />} />
            <Route path="attendance" element={<Attendance />} />
            <Route path="leaves" element={<Leaves />} />
            <Route path="payroll" element={<PayrollPage />} />
            <Route
              path="performance"
              element={
                <ProtectedRoute>
                  <PerformancePage />
                </ProtectedRoute>
              }
            />
            <Route path="profile" element={<ProfilePage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
