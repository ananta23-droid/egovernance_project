import React from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { clearAuth, getUser } from "../utils/auth";

const AdminLayout = () => {
  const navigate = useNavigate();
  const user = getUser();

  const logout = () => {
    clearAuth();
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-6xl mx-auto p-4">
        <div className="bg-white rounded-xl shadow p-4 mb-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">SewaBot Admin Panel</h1>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">{user?.email}</span>
            <button onClick={logout} className="px-3 py-1 bg-red-500 text-white rounded">
              Logout
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <aside className="bg-white rounded-xl shadow p-4 space-y-2">
            <Link className="block hover:underline" to="/admin/departments">Departments</Link>
            <Link className="block hover:underline" to="/admin/categories">Categories</Link>
            <Link className="block hover:underline" to="/admin/services">Services</Link>
          </aside>

          <main className="md:col-span-3 bg-white rounded-xl shadow p-4">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;