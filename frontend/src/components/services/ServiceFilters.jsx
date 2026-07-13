import React from "react";

const ServiceFilters = ({
  search,
  departmentId,
  categoryId,
  departments,
  categories,
  onSearchChange,
  onDepartmentChange,
  onCategoryChange,
  onReset,
}) => {
  return (
    <div className="bg-white p-4 rounded-xl shadow space-y-3">
      <input
        type="text"
        placeholder="Search services..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full border rounded-lg px-3 py-2"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <select
          value={departmentId}
          onChange={(e) => onDepartmentChange(e.target.value)}
          className="border rounded-lg px-3 py-2"
        >
          <option value="">All Departments</option>
          {departments.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>

        <select
          value={categoryId}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="border rounded-lg px-3 py-2"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={onReset}
        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg"
      >
        Reset Filters
      </button>
    </div>
  );
};

export default ServiceFilters;