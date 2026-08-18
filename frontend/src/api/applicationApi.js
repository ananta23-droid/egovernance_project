import axiosClient from "./axiosClient";

const unwrap = (res) => res?.data?.data ?? res?.data ?? null;

export const submitApplication = async (payload) => {
  const res = await axiosClient.post("/applications", payload);
  return unwrap(res);
};

export const trackApplication = async (appNumber) => {
  const res = await axiosClient.get(`/applications/track/${appNumber}`);
  return unwrap(res);
};

export const getMyApplications = async () => {
  const res = await axiosClient.get("/applications/my-applications");
  return unwrap(res);
};

export const getApplicationById = async (id) => {
  const res = await axiosClient.get(`/applications/${id}`);
  return unwrap(res);
};
