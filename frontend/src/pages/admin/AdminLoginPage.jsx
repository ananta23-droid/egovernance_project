import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminLogin } from "../../api/adminApi";
import { saveAuth } from "../../utils/auth";

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "admin@sewabot.com", password: "Admin@123" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");

      const data = await adminLogin(form);

      if (data.user.role !== "ADMIN") {
        setError("Access denied. Admin account required.");
        return;
      }

      saveAuth(data);
      navigate("/admin/departments");
    } catch (err) {
      setError(err?.response?.data?.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form onSubmit={onSubmit} className="w-full max-w-md bg-white p-6 rounded-xl shadow space-y-4">
        <h2 className="text-xl font-bold">Admin Login</h2>

        <input name="email" type="email" value={form.email} onChange={onChange} className="w-full border rounded px-3 py-2" />
        <input name="password" type="password" value={form.password} onChange={onChange} className="w-full border rounded px-3 py-2" />

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded">
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default AdminLoginPage;