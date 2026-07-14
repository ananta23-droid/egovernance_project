import axiosClient from "./axiosClient";
import { getToken } from "../utils/auth";

const authHeader = () => ({
  headers: { Authorization: `Bearer ${getToken()}` },
});

// Auth
export const adminLogin = async (payload) => {
  const res = await axiosClient.post("/auth/login", payload);
  return res.data.data;
};

// Departments
export const getDepartmentsAdmin = async () => {
  const res = await axiosClient.get("/departments");
  return res.data.data;
};
export const createDepartmentAdmin = async (payload) => {
  const res = await axiosClient.post("/departments", payload, authHeader());
  return res.data.data;
};
export const updateDepartmentAdmin = async (id, payload) => {
  const res = await axiosClient.put(`/departments/${id}`, payload, authHeader());
  return res.data.data;
};
export const deleteDepartmentAdmin = async (id) => {
  const res = await axiosClient.delete(`/departments/${id}`, authHeader());
  return res.data;
};

// Categories
export const getCategoriesAdmin = async (departmentId = "") => {
  const q = departmentId ? `?departmentId=${departmentId}` : "";
  const res = await axiosClient.get(`/categories${q}`);
  return res.data.data;
};
export const createCategoryAdmin = async (payload) => {
  const res = await axiosClient.post("/categories", payload, authHeader());
  return res.data.data;
};
export const updateCategoryAdmin = async (id, payload) => {
  const res = await axiosClient.put(`/categories/${id}`, payload, authHeader());
  return res.data.data;
};
export const deleteCategoryAdmin = async (id) => {
  const res = await axiosClient.delete(`/categories/${id}`, authHeader());
  return res.data;
};

// Services
export const getServicesAdmin = async () => {
  const res = await axiosClient.get("/services?includeInactive=true");
  return res.data.data;
};
export const createServiceAdmin = async (payload) => {
  const res = await axiosClient.post("/services", payload, authHeader());
  return res.data.data;
};
export const updateServiceAdmin = async (id, payload) => {
  const res = await axiosClient.put(`/services/${id}`, payload, authHeader());
  return res.data.data;
};
export const deleteServiceAdmin = async (id) => {
  const res = await axiosClient.delete(`/services/${id}`, authHeader());
  return res.data;
};