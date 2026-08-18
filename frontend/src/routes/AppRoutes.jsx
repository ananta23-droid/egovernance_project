import React from "react";
import { Routes, Route } from "react-router-dom";
import App from "../App";
import HomePage from "../pages/public/HomePage";
import ServicesPage from "../pages/public/ServicesPage";
import ServiceDetailPage from "../pages/public/ServiceDetailPage";
import ApplicationFormPage from "../pages/public/ApplicationFormPage";
import ApplicationTrackingPage from "../pages/public/ApplicationTrackingPage";
import CitizenDashboardPage from "../pages/public/CitizenDashboardPage";
import LoginPage from "../pages/public/LoginPage";
import RegisterPage from "../pages/public/RegisterPage";

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<App />}>
        {/* Page 1: Home */}
        <Route path="/" element={<HomePage />} />

        {/* Page 2: Services & Details/Application */}
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/services/:id" element={<ServiceDetailPage />} />
        <Route path="/services/:id/apply" element={<ApplicationFormPage />} />

        {/* Page 3: Track Application Status */}
        <Route path="/track-status" element={<ApplicationTrackingPage />} />
        <Route path="/track-status/:appNumber" element={<ApplicationTrackingPage />} />
        <Route path="/track" element={<ApplicationTrackingPage />} />
        <Route path="/track/:appNumber" element={<ApplicationTrackingPage />} />

        {/* Page 4: My Applications */}
        <Route path="/my-applications" element={<CitizenDashboardPage />} />
        <Route path="/dashboard" element={<CitizenDashboardPage />} />

        {/* Page 5: Citizen Signup */}
        <Route path="/signup" element={<RegisterPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Page 6: Citizen Login */}
        <Route path="/login" element={<LoginPage />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;