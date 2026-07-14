import React, { useEffect, useState } from "react";
import {
  getDepartmentsAdmin,
  createDepartmentAdmin,
  updateDepartmentAdmin,
  deleteDepartmentAdmin,
} from "../../api/adminApi";

const DepartmentsPage = () => {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ name: "", description: "" });
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");

  const load = async () => {
    const data = await getDepartmentsAdmin();
    setItems(data);
  };

  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    try {
      setError("");
      if (editId) await updateDepartmentAdmin(editId, form);
      else await createDepartmentAdmin(form);

      setForm({ name: "", description: "" });
      setEditId(null);
      load();
    } catch (err) {
      setError(err?.response?.data?.message || "Operation failed.");
    }
  };

  const onEdit = (d) => {
    setEditId(d.id);
    setForm({ name: d.name, description: d.description || "" });
  };

  const onDelete = async (id) => {
    if (!confirm("Delete this department?")) return;
    await deleteDepartmentAdmin(id);
    load();
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Departments</h2>

      <form onSubmit={submit} className="space-y-2">
        <input className="w-full border rounded px-3 py-2" placeholder="Name"
          value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
        <textarea className="w-full border rounded px-3 py-2" placeholder="Description"
          value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} />
        <button className="px-4 py-2 bg-blue-600 text-white rounded">
          {editId ? "Update Department" : "Add Department"}
        </button>
      </form>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <div className="space-y-2">
        {items.map((d) => (
          <div key={d.id} className="border rounded p-3 flex items-center justify-between">
            <div>
              <p className="font-medium">{d.name}</p>
              <p className="text-sm text-gray-600">{d.description}</p>
            </div>
            <div className="space-x-2">
              <button onClick={() => onEdit(d)} className="px-3 py-1 bg-yellow-400 rounded">Edit</button>
              <button onClick={() => onDelete(d.id)} className="px-3 py-1 bg-red-500 text-white rounded">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DepartmentsPage;