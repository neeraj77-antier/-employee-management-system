import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../hooks/useRedux";
import { logout } from "../store/slices/authSlice";

const DashboardLayout: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: "📊" },
    {
      name: "Employees",
      path: "/employees",
      icon: "👥",
      roles: ["ADMIN", "MANAGER"],
    },
    {
      name: "Departments",
      path: "/departments",
      icon: "🏢",
      roles: ["ADMIN", "MANAGER"],
    },
    { name: "Attendance", path: "/attendance", icon: "📅" },
    { name: "Leaves", path: "/leaves", icon: "🏖️" },
    { name: "Payroll", path: "/payroll", icon: "💰" },
    { name: "Performance", path: "/performance", icon: "⭐" },
    { name: "My Profile", path: "/profile", icon: "👤" },
  ];

  const filteredNavItems = navItems.filter(
    (item) => !item.roles || (user && item.roles.includes(user.role))
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-primary-600">EMP System</h1>
          <p className="text-sm text-gray-600 mt-1">Employee Management</p>
        </div>

        <nav className="p-4 space-y-2">
          {filteredNavItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg hover:bg-primary-50 hover:text-primary-700 transition-colors duration-200"
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium">{item.name}</span>
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <div className="mb-3 px-4">
            <p className="text-sm font-medium text-gray-900">{user?.email}</p>
            <p className="text-xs text-gray-500 capitalize">
              {user?.role.toLowerCase()}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full btn-secondary text-sm"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
