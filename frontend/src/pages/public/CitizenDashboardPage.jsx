import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getMyApplications } from "../../api/applicationApi";
import { getUser } from "../../utils/authStorage";

const CitizenDashboardPage = () => {
  const navigate = useNavigate();
  const currentUser = getUser();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await getMyApplications();
        setApplications(Array.isArray(data) ? data : []);
      } catch (err) {
        setError("Could not load your applications.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filteredApps = applications.filter((app) => {
    const q = search.toLowerCase().trim();
    if (!q) return true;
    return (
      app.applicationNumber?.toLowerCase().includes(q) ||
      app.service?.title?.toLowerCase().includes(q) ||
      app.applicantName?.toLowerCase().includes(q) ||
      app.status?.toLowerCase().includes(q)
    );
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case "SUBMITTED":
        return <span className="gov-badge gov-badge-submitted">Submitted</span>;
      case "UNDER_REVIEW":
        return <span className="gov-badge gov-badge-review">Under Review</span>;
      case "PROCESSING":
        return <span className="gov-badge gov-badge-processing">Processing</span>;
      case "APPROVED":
        return <span className="gov-badge gov-badge-approved">Approved</span>;
      case "COMPLETED":
        return <span className="gov-badge gov-badge-completed">Completed</span>;
      case "REJECTED":
        return <span className="gov-badge gov-badge-rejected">Rejected</span>;
      case "ACTION_REQUIRED":
        return <span className="gov-badge gov-badge-action">Action Required</span>;
      default:
        return <span className="gov-badge gov-badge-submitted">{status}</span>;
    }
  };

  const totalCount = applications.length;
  const underReviewCount = applications.filter((a) => a.status === "UNDER_REVIEW" || a.status === "SUBMITTED").length;
  const approvedCount = applications.filter((a) => a.status === "APPROVED" || a.status === "COMPLETED").length;
  const actionRequiredCount = applications.filter((a) => a.status === "ACTION_REQUIRED").length;

  return (
    <div className="svc-page">
      {/* GLOBAL INTERNAL PAGE HEADER */}
      <div className="gov-page-header">
        <div className="gov-container">
          <div className="gov-breadcrumb">
            <Link to="/">Home</Link>
            <span className="gov-breadcrumb-sep">›</span>
            <span>My Applications</span>
          </div>

          <h1 className="gov-page-title">My Applications</h1>
          <p className="gov-page-subtitle">
            View and track your submitted academic prototype demo applications.
          </p>
        </div>
      </div>

      <div className="gov-container gov-page-body">
        {/* STATS SUMMARY CARDS */}
        <div className="gov-stats-grid">
          <div className="gov-stat-card">
            <span className="gov-stat-number">{totalCount}</span>
            <span className="gov-stat-label">Total Applications</span>
          </div>
          <div className="gov-stat-card">
            <span className="gov-stat-number" style={{ color: "var(--warning)" }}>{underReviewCount}</span>
            <span className="gov-stat-label">Under Review</span>
          </div>
          <div className="gov-stat-card">
            <span className="gov-stat-number" style={{ color: "var(--success)" }}>{approvedCount}</span>
            <span className="gov-stat-label">Approved</span>
          </div>
          <div className="gov-stat-card">
            <span className="gov-stat-number" style={{ color: "var(--crimson)" }}>{actionRequiredCount}</span>
            <span className="gov-stat-label">Action Required</span>
          </div>
        </div>

        {/* SEARCH & ACTIONS */}
        <div className="svc-filter-panel">
          <div className="svc-filter-grid" style={{ gridTemplateColumns: "1fr auto" }}>
            <div>
              <label htmlFor="dashSearchInput" className="gov-label">Filter My Applications</label>
              <input
                id="dashSearchInput"
                type="text"
                className="gov-input"
                placeholder="Search by Application ID, service title, or status..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div>
              <Link to="/services" className="gov-btn gov-btn-primary" style={{ textDecoration: "none" }}>
                + Apply for New Service
              </Link>
            </div>
          </div>
        </div>

        {/* LOADING & ERROR STATES */}
        {loading && (
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <p style={{ color: "var(--secondary-text)" }}>Loading submitted applications…</p>
          </div>
        )}

        {error && (
          <div className="gov-card" style={{ borderLeft: "4px solid var(--error)", marginBottom: 24 }}>
            <strong style={{ color: "var(--error)" }}>Dashboard Error</strong>
            <p style={{ margin: "4px 0 0 0", color: "var(--secondary-text)" }}>{error}</p>
          </div>
        )}

        {/* APPLICATIONS DESKTOP TABLE */}
        {!loading && !error && filteredApps.length > 0 && (
          <>
            {/* Desktop Table View */}
            <div className="gov-table-wrap" style={{ display: "block" }}>
              <table className="gov-table" aria-label="Submitted Applications">
                <thead>
                  <tr>
                    <th>Application Number</th>
                    <th>Service</th>
                    <th>Submitted</th>
                    <th>Status</th>
                    <th>Last Updated</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredApps.map((app) => (
                    <tr key={app.id || app.applicationNumber}>
                      <td>
                        <strong style={{ color: "var(--navy)" }}>{app.applicationNumber}</strong>
                      </td>
                      <td>{app.service?.title || "Government Service"}</td>
                      <td>
                        {new Date(app.submittedAt || Date.now()).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td>{getStatusBadge(app.status)}</td>
                      <td>
                        {new Date(app.updatedAt || app.submittedAt || Date.now()).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td>
                        <button
                          type="button"
                          className="gov-btn gov-btn-secondary gov-btn-sm"
                          onClick={() => navigate(`/track-status/${app.applicationNumber}`)}
                        >
                          View Details →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* EMPTY STATE */}
        {!loading && !error && filteredApps.length === 0 && (
          <div className="gov-card" style={{ textAlign: "center", padding: "48px 24px" }}>
            <h3 style={{ fontSize: 20, color: "var(--navy)", margin: "0 0 8px 0" }}>No Submitted Applications</h3>
            <p style={{ color: "var(--secondary-text)", margin: "0 0 20px 0" }}>
              You have not submitted any applications matching your search query.
            </p>
            <Link to="/services" className="gov-btn gov-btn-primary" style={{ textDecoration: "none" }}>
              Explore Services & Apply Now
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default CitizenDashboardPage;
