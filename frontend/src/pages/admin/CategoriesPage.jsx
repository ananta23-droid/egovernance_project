import React, { useEffect, useState } from "react";
import {
  getDepartmentsAdmin,
  getCategoriesAdmin,
  createCategoryAdmin,
  updateCategoryAdmin,
  deleteCategoryAdmin,
} from "../../api/adminApi";

const CategoriesPage = () => {
  const [departments, setDepartments] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filterDepartmentId, setFilterDepartmentId] = useState("");

  const [form, setForm] = useState({
    departmentId: "",
    name: "",
    description: "",
  });

  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");

  const loadDepartments = async () => {
    const data = await getDepartmentsAdmin();
    setDepartments(data);
  };

  const loadCategories = async (departmentId = "") => {
    const data = await getCategoriesAdmin(departmentId);
    setCategories(data);
  };

  useEffect(() => {
    loadDepartments();
    loadCategories();
  }, []);

  const onFilterChange = async (value) => {
    setFilterDepartmentId(value);
    await loadCategories(value);
  };

  const resetForm = () => {
    setForm({ departmentId: "", name: "", description: "" });
    setEditId(null);
  };

  const submit = async (e) => {
    e.preventDefault();
    try {
      setError("");
      const payload = {
        ...form,
        departmentId: Number(form.departmentId),
      };

      if (!payload.departmentId) {
        setError("Please select a department.");
        return;
      }

      if (editId) {
        await updateCategoryAdmin(editId, payload);
      } else {
        await createCategoryAdmin(payload);
      }

      resetForm();
      await loadCategories(filterDepartmentId);
    } catch (err) {
      setError(err?.response?.data?.message || "Category operation failed.");
    }
  };

  const onEdit = (item) => {
    setEditId(item.id);
    setForm({
      departmentId: String(item.departmentId),
      name: item.name,
      description: item.description || "",
    });
  };

  const onDelete = async (id) => {
    if (!confirm("Delete this category?")) return;
    try {
      await deleteCategoryAdmin(id);
      await loadCategories(filterDepartmentId);
    } catch (err) {
      setError(err?.response?.data?.message || "Delete failed.");
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Categories</h2>

      <div className="border rounded p-3 bg-gray-50">
        <label className="text-sm font-medium">Filter by Department</label>
        <select
          className="w-full mt-1 border rounded px-3 py-2"
          value={filterDepartmentId}
          onChange={(e) => onFilterChange(e.target.value)}
        >
          <option value="">All Departments</option>
          {departments.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>
      </div>

      <form onSubmit={submit} className="space-y-2">
        <select
          className="w-full border rounded px-3 py-2"
          value={form.departmentId}
          onChange={(e) => setForm((p) => ({ ...p, departmentId: e.target.value }))}
        >
          <option value="">Select Department</option>
          {departments.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>

        <input
          className="w-full border rounded px-3 py-2"
          placeholder="Category name"
          value={form.name}
          onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
        />

        <textarea
          className="w-full border rounded px-3 py-2"
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
        />

        <div className="flex gap-2">
          <button className="px-4 py-2 bg-blue-600 text-white rounded">
            {editId ? "Update Category" : "Add Category"}
          </button>
          {editId && (
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 bg-gray-200 rounded"
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <div className="space-y-2">
        {categories.map((c) => (
          <div key={c.id} className="border rounded p-3 flex justify-between items-start">
            <div>
              <p className="font-medium">{c.name}</p>
              <p className="text-sm text-gray-600">{c.description || "No description"}</p>
              <p className="text-xs text-gray-500 mt-1">
                Department: {c.department?.name || `ID ${c.departmentId}`}
              </p>
            </div>
            <div className="space-x-2">
              <button onClick={() => onEdit(c)} className="px-3 py-1 bg-yellow-400 rounded">
                Edit
              </button>
              <button onClick={() => onDelete(c.id)} className="px-3 py-1 bg-red-500 text-white rounded">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoriesPage;