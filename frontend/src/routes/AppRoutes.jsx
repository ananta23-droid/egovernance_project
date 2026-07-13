import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ServicesPage from "../pages/public/ServicesPage";
import ServiceDetailPage from "../pages/public/ServiceDetailPage";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/services" replace />} />
      <Route path="/services" element={<ServicesPage />} />
      <Route path="/services/:id" element={<ServiceDetailPage />} />
    </Routes>
  );
};

export default AppRoutes;