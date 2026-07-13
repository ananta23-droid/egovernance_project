import React, { useEffect, useState } from "react";
import { getCategories, getDepartments, getServices } from "../../api/serviceApi";
import ServiceFilters from "../../components/services/ServiceFilters";
import ServiceCard from "../../components/services/ServiceCard";

const ServicesPage = () => {
  const [services, setServices] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [categories, setCategories] = useState([]);

  const [search, setSearch] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [categoryId, setCategoryId] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadDepartments = async () => {
    const data = await getDepartments();
    setDepartments(data);
  };

  const loadCategories = async (deptId = "") => {
    const data = await getCategories(deptId || undefined);
    setCategories(data);
  };

  const loadServices = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getServices({
        search,
        departmentId,
        categoryId,
        page: 1,
        limit: 20,
      });

      setServices(data.items || []);
    } catch (err) {
      console.error("Load services error:", err?.response?.data || err.message);
      setError(err?.response?.data?.message || "Failed to load services.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDepartments();
    loadCategories();
  }, []);

  useEffect(() => {
    loadServices();
  }, [search, departmentId, categoryId]);

  const handleDepartmentChange = async (value) => {
    setDepartmentId(value);
    setCategoryId("");
    await loadCategories(value);
  };

  const handleReset = async () => {
    setSearch("");
    setDepartmentId("");
    setCategoryId("");
    await loadCategories("");
  };

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold">Government Services</h1>

      <ServiceFilters
        search={search}
        departmentId={departmentId}
        categoryId={categoryId}
        departments={departments}
        categories={categories}
        onSearchChange={setSearch}
        onDepartmentChange={handleDepartmentChange}
        onCategoryChange={setCategoryId}
        onReset={handleReset}
      />

      {loading && <p>Loading services...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {!loading && !error && services.length === 0 && <p>No services found.</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {services.map((service) => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>
    </div>
  );
};

export default ServicesPage;