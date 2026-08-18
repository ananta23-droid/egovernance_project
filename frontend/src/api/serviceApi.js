import axiosClient from "./axiosClient";

const unwrap = (res) => res?.data?.data ?? res?.data ?? null;

/**
 * Deduplicates an array of services by id.
 * Guards against any backend-side duplicates reaching the UI.
 */
const dedupById = (items) => {
  const seen = new Set();
  return items.filter((s) => {
    if (seen.has(s.id)) return false;
    seen.add(s.id);
    return true;
  });
};

export const getServices = async (params = {}) => {
  const sp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") sp.append(k, v);
  });

  const url = sp.toString() ? `/services?${sp.toString()}` : "/services";
  const res = await axiosClient.get(url);
  const raw = unwrap(res);

  // support both:
  // A) { items: [...] }
  // B) [...]
  if (Array.isArray(raw)) return { items: dedupById(raw), pagination: null };
  if (raw && Array.isArray(raw.items))
    return { ...raw, items: dedupById(raw.items) };

  return { items: [], pagination: null };
};

export const getServiceById = async (id) => {
  const res = await axiosClient.get(`/services/${id}`);
  return unwrap(res);
};

export const getDepartments = async () => {
  const res = await axiosClient.get("/departments");
  const raw = unwrap(res);
  return Array.isArray(raw) ? raw : raw?.items || [];
};

export const getCategories = async (departmentId) => {
  const q = departmentId ? `?departmentId=${departmentId}` : "";
  const res = await axiosClient.get(`/categories${q}`);
  const raw = unwrap(res);
  return Array.isArray(raw) ? raw : raw?.items || [];
};