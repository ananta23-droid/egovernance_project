import React from "react";
import { Navigate } from "react-router-dom";
import { getToken, isAdmin } from "../../utils/auth";

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const token = getToken();

  if (!token) return <Navigate to="/admin/login" replace />;
  if (adminOnly && !isAdmin()) return <Navigate to="/services" replace />;

  return children;
};

export default ProtectedRoute;