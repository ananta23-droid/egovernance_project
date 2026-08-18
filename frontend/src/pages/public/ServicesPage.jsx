import React, { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { getCategories, getDepartments, getServices } from "../../api/serviceApi";

const ServiceIconMap = {
  2: "🛂",
  1: "🇳🇵",
  3: "🪪",
};

const ServicesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const initialSearch = searchParams.get("search") || "";
  const initialDept = searchParams.get("departmentId") || "ALL";
  const initialCat = searchParams.get("categoryId") || "ALL";

  const [services, setServices] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [categories, setCategories] = useState([]);

  const [search, setSearch] = useState(initialSearch);
  const [deptFilter, setDeptFilter] = useState(initialDept);
  const [catFilter, setCatFilter] = useState(initialCat);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setSearch(searchParams.get("search") || "");
    setDeptFilter(searchParams.get("departmentId") || "ALL");
    setCatFilter(searchParams.get("categoryId") || "ALL");
  }, [searchParams]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");
        const [svcsRes, deptsRes, catsRes] = await Promise.all([
          getServices(),
          getDepartments(),
          getCategories(),
        ]);
        const items = svcsRes?.items || (Array.isArray(svcsRes) ? svcsRes : []);
        setServices(Array.isArray(items) ? items : []);
        setDepartments(Array.isArray(deptsRes) ? deptsRes : []);
        setCategories(Array.isArray(catsRes) ? catsRes : []);
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load government services.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredServices = useMemo(() => {
    return services.filter((svc) => {
      const q = search.trim().toLowerCase();
      const matchQuery =
        !q ||
        svc.title?.toLowerCase().includes(q) ||
        svc.description?.toLowerCase().includes(q) ||
        svc.department?.name?.toLowerCase().includes(q) ||
        svc.category?.name?.toLowerCase().includes(q);

      const matchDept =
        deptFilter === "ALL" || String(svc.departmentId) === String(deptFilter);

      const matchCat =
        catFilter === "ALL" || String(svc.categoryId) === String(catFilter);

      return matchQuery && matchDept && matchCat;
    });
  }, [services, search, deptFilter, catFilter]);

  const handleReset = () => {
    setSearch("");
    setDeptFilter("ALL");
    setCatFilter("ALL");
    setSearchParams({});
  };

  return (
    <div className="svc-page">
      {/* GLOBAL INTERNAL PAGE HEADER */}
      <div className="gov-page-header">
        <div className="gov-container">
          <div className="gov-breadcrumb">
            <Link to="/">Home</Link>
            <span className="gov-breadcrumb-sep">›</span>
            <span>Government Services</span>
          </div>

          <h1 className="gov-page-title">Government Services</h1>
          <p className="gov-page-subtitle">
            Find and access digital services provided by government departments of Nepal.
          </p>
        </div>
      </div>

      <div className="gov-container gov-page-body">
        {/* SEARCH / FILTER PANEL */}
        <div className="svc-filter-panel">
          <div className="svc-filter-grid">
            <div>
              <label htmlFor="searchSvc" className="gov-label">
                Search Services
              </label>
              <input
                id="searchSvc"
                type="text"
                className="gov-input"
                placeholder="Search by keyword, title, or office..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="deptSvc" className="gov-label">
                Department
              </label>
              <select
                id="deptSvc"
                className="gov-select"
                value={deptFilter}
                onChange={(e) => setDeptFilter(e.target.value)}
              >
                <option value="ALL">All Departments</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="catSvc" className="gov-label">
                Category
              </label>
              <select
                id="catSvc"
                className="gov-select"
                value={catFilter}
                onChange={(e) => setCatFilter(e.target.value)}
              >
                <option value="ALL">All Categories</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <button
                type="button"
                className="gov-btn gov-btn-neutral"
                onClick={handleReset}
              >
                Reset Filters
              </button>
            </div>
          </div>
        </div>

        {/* LOADING & ERROR STATES */}
        {loading && (
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <p style={{ color: "var(--secondary-text)" }}>Loading services directory…</p>
          </div>
        )}

        {error && (
          <div className="gov-card" style={{ borderLeft: "4px solid var(--error)", marginBottom: 24 }}>
            <strong style={{ color: "var(--error)" }}>Error Loading Services</strong>
            <p style={{ margin: "4px 0 0 0", color: "var(--secondary-text)" }}>{error}</p>
          </div>
        )}

        {/* SERVICE LIST */}
        {!loading && !error && filteredServices.length > 0 && (
          <div className="svc-list-grid">
            {filteredServices.map((svc) => (
              <div key={svc.id} className="svc-card-item">
                <div className="svc-card-left">
                  <div className="svc-card-icon">
                    {ServiceIconMap[svc.id] || "🏛️"}
                  </div>
                  <div>
                    <h3 className="svc-card-title">{svc.title}</h3>
                    <p className="svc-card-desc">{svc.description}</p>
                    <div className="svc-card-tags">
                      <span className="svc-tag">🏛️ {svc.department?.name || "Government Dept"}</span>
                      <span className="svc-tag">📁 {svc.category?.name || "General"}</span>
                      <span className="gov-badge gov-badge-approved">Active</span>
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", gap: 10, flexShrink: 0 }}>
                  <Link to={`/services/${svc.id}`} className="gov-btn gov-btn-secondary gov-btn-sm">
                    View Details →
                  </Link>
                  <Link to={`/services/${svc.id}/apply`} className="gov-btn gov-btn-primary gov-btn-sm">
                    Apply Online
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && !error && filteredServices.length === 0 && (
          <div className="gov-card" style={{ textAlign: "center", padding: "48px 24px" }}>
            <h3 style={{ fontSize: 20, color: "var(--navy)", margin: "0 0 8px 0" }}>No Government Services Found</h3>
            <p style={{ color: "var(--secondary-text)", margin: "0 0 20px 0" }}>
              No services match your search and filter criteria.
            </p>
            <button type="button" className="gov-btn gov-btn-neutral" onClick={handleReset}>
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServicesPage;