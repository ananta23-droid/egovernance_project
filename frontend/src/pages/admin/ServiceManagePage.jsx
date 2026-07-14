import React, { useEffect, useState } from "react";
import {
  getDepartmentsAdmin,
  getCategoriesAdmin,
  getServicesAdmin,
  createServiceAdmin,
  updateServiceAdmin,
  deleteServiceAdmin,
} from "../../api/adminApi";

const initialForm = {
  departmentId: "",
  categoryId: "",
  title: "",
  description: "",
  eligibility: "",
  requiredDocuments: "",
  processSteps: "",
  feeInfo: "",
  officeInfo: "",
  isActive: true,
};

const ServicesManagePage = () => {
  const [departments, setDepartments] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [services, setServices] = useState([]);

  const [form, setForm] = useState(initialForm);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");

  const loadInitialData = async () => {
    const [deptData, catData, serviceData] = await Promise.all([
      getDepartmentsAdmin(),
      getCategoriesAdmin(),
      getServicesAdmin(),
    ]);

    setDepartments(deptData);
    setAllCategories(catData);
    setServices(serviceData.items || []);
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (!form.departmentId) {
      setFilteredCategories([]);
      return;
    }
    const list = allCategories.filter(
      (c) => String(c.departmentId) === String(form.departmentId)
    );
    setFilteredCategories(list);
  }, [form.departmentId, allCategories]);

  const resetForm = () => {
    setForm(initialForm);
    setEditId(null);
  };

  const handleChange = (field, value) => {
    setForm((p) => ({ ...p, [field]: value }));
  };

  const submit = async (e) => {
    e.preventDefault();
    try {
      setError("");
      const payload = {
        ...form,
        departmentId: Number(form.departmentId),
        categoryId: Number(form.categoryId),
      };

      if (!payload.departmentId || !payload.categoryId) {
        setError("Please select both department and category.");
        return;
      }

      if (editId) {
        await updateServiceAdmin(editId, payload);
      } else {
        await createServiceAdmin(payload);
      }

      resetForm();
      const refreshed = await getServicesAdmin();
      setServices(refreshed.items || []);
    } catch (err) {
      setError(err?.response?.data?.message || "Service operation failed.");
    }
  };

  const onEdit = (s) => {
    setEditId(s.id);
    setForm({
      departmentId: String(s.departmentId),
      categoryId: String(s.categoryId),
      title: s.title || "",
      description: s.description || "",
      eligibility: s.eligibility || "",
      requiredDocuments: s.requiredDocuments || "",
      processSteps: s.processSteps || "",
      feeInfo: s.feeInfo || "",
      officeInfo: s.officeInfo || "",
      isActive: Boolean(s.isActive),
    });
  };

  const onDelete = async (id) => {
    if (!confirm("Delete this service?")) return;
    try {
      await deleteServiceAdmin(id);
      const refreshed = await getServicesAdmin();
      setServices(refreshed.items || []);
    } catch (err) {
      setError(err?.response?.data?.message || "Delete failed.");
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Services</h2>

      <form onSubmit={submit} className="space-y-2">
        <div className="grid md:grid-cols-2 gap-2">
          <select
            className="border rounded px-3 py-2"
            value={form.departmentId}
            onChange={(e) => handleChange("departmentId", e.target.value)}
          >
            <option value="">Select Department</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>

          <select
            className="border rounded px-3 py-2"
            value={form.categoryId}
            onChange={(e) => handleChange("categoryId", e.target.value)}
          >
            <option value="">Select Category</option>
            {filteredCategories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <input className="w-full border rounded px-3 py-2" placeholder="Title"
          value={form.title} onChange={(e) => handleChange("title", e.target.value)} />

        <textarea className="w-full border rounded px-3 py-2" placeholder="Description"
          value={form.description} onChange={(e) => handleChange("description", e.target.value)} />

        <textarea className="w-full border rounded px-3 py-2" placeholder="Eligibility"
          value={form.eligibility} onChange={(e) => handleChange("eligibility", e.target.value)} />

        <textarea className="w-full border rounded px-3 py-2" placeholder="Required Documents"
          value={form.requiredDocuments} onChange={(e) => handleChange("requiredDocuments", e.target.value)} />

        <textarea className="w-full border rounded px-3 py-2" placeholder="Process Steps"
          value={form.processSteps} onChange={(e) => handleChange("processSteps", e.target.value)} />

        <input className="w-full border rounded px-3 py-2" placeholder="Fee Info"
          value={form.feeInfo} onChange={(e) => handleChange("feeInfo", e.target.value)} />

        <input className="w-full border rounded px-3 py-2" placeholder="Office Info"
          value={form.officeInfo} onChange={(e) => handleChange("officeInfo", e.target.value)} />

        <label className="inline-flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.isActive}
            onChange={(e) => handleChange("isActive", e.target.checked)}
          />
          Active Service
        </label>

        <div className="flex gap-2">
          <button className="px-4 py-2 bg-blue-600 text-white rounded">
            {editId ? "Update Service" : "Add Service"}
          </button>
          {editId && (
            <button type="button" onClick={resetForm} className="px-4 py-2 bg-gray-200 rounded">
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <div className="space-y-2">
        {services.map((s) => (
          <div key={s.id} className="border rounded p-3 flex justify-between items-start">
            <div>
              <p className="font-medium">{s.title}</p>
              <p className="text-sm text-gray-600">{s.description}</p>
              <p className="text-xs text-gray-500 mt-1">
                Dept: {s.department?.name} | Cat: {s.category?.name} | Active: {String(s.isActive)}
              </p>
            </div>
            <div className="space-x-2">
              <button onClick={() => onEdit(s)} className="px-3 py-1 bg-yellow-400 rounded">Edit</button>
              <button onClick={() => onDelete(s.id)} className="px-3 py-1 bg-red-500 text-white rounded">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServicesManagePage;