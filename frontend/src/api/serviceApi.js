import axiosClient from "./axiosClient";

export const getDepartments = async () => {
  const res = await axiosClient.get("/departments");
  return res.data.data;
};

export const getCategories = async (departmentId) => {
  const url = departmentId ? `/categories?departmentId=${departmentId}` : "/categories";
  const res = await axiosClient.get(url);
  return res.data.data;
};

export const getServices = async (params = {}) => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== "" && value !== null && value !== undefined) {
      searchParams.append(key, value);
    }
  });

  const res = await axiosClient.get(`/services?${searchParams.toString()}`);
  return res.data.data;
};

export const getServiceById = async (id) => {
  const res = await axiosClient.get(`/services/${id}`);
  return res.data.data;
};