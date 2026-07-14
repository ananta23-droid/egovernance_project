import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ServicesPage from "../pages/public/ServicesPage";
import ServiceDetailPage from "../pages/public/ServiceDetailPage";
import AdminLoginPage from "../pages/admin/AdminLoginPage";
import DepartmentsPage from "../pages/admin/DepartmentsPage";
import CategoriesPage from "../pages/admin/CategoriesPage";
import ServicesManagePage from "../pages/admin/ServiceManagePage";
import AdminLayout from "../layouts/AdminLayout";
import ProtectedRoute from "../components/common/ProtectedRoute";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/services" replace />} />
      <Route path="/services" element={<ServicesPage />} />
      <Route path="/services/:id" element={<ServiceDetailPage />} />

      <Route path="/admin/login" element={<AdminLoginPage />} />

      <Route
        path="/admin"
        element={
          <ProtectedRoute adminOnly>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/admin/departments" replace />} />
        <Route path="departments" element={<DepartmentsPage />} />
        <Route path="categories" element={<CategoriesPage />} />
        <Route path="services" element={<ServicesManagePage />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;