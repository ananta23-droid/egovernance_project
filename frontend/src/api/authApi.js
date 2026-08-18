import axiosClient from "./axiosClient";

export const loginUser = async (payload) => {
  const res = await axiosClient.post("/auth/login", payload);
  return res?.data?.data;
};

export const registerUser = async (payload) => {
  const res = await axiosClient.post("/auth/register", payload);
  return res?.data?.data;
};