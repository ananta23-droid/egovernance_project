import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getServiceById } from "../../api/serviceApi";

const ServiceDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await getServiceById(id);
        setService(data || null);
      } catch (err) {
        setError(
          err?.response?.data?.message || "Failed to load service details."
        );
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="svc-page">
        <div className="svc-page-body">
          <div className="svc-loading" role="status">
            <div className="svc-loading-spinner" aria-hidden="true"></div>
            <p>Loading service details…</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="svc-page">
        <div className="svc-page-body">
          <div className="svc-error-box" role="alert">
            <span className="svc-error-icon" aria-hidden="true">⚠</span>
            <div>
              <strong>Service Information Error</strong>
              <p>{error}</p>
            </div>
            <Link to="/services" className="svc-btn-retry" style={{ textDecoration: "none" }}>
              Back to Services
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="svc-page">
        <div className="svc-page-body">
          <div className="svc-empty" role="status">
            <span className="svc-empty-icon" aria-hidden="true">🏛️</span>
            <h2>Service Not Found</h2>
            <p>The requested government service could not be found or is inactive.</p>
            <Link to="/services" className="svc-btn-reset" style={{ textDecoration: "none", display: "inline-block" }}>
              View All Services
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="svc-page">
      {/* Header Banner */}
      <div className="gov-page-header">
        <div className="gov-container">
          <div className="gov-breadcrumb">
            <Link to="/">Home</Link>
            <span className="gov-breadcrumb-sep">›</span>
            <Link to="/services">Government Services</Link>
            <span className="gov-breadcrumb-sep">›</span>
            <span>{service.title}</span>
          </div>

          <div className="svc-detail-header-content" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 20 }}>
            <div>
              <span className="svc-detail-badge">Nepal Citizen Service</span>
              <h1 className="gov-page-title">{service.title}</h1>
              <p className="gov-page-subtitle">{service.description}</p>
            </div>

            {/* Prominent Application CTA */}
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Link to={`/services/${id}/apply`} className="gov-btn gov-btn-primary" style={{ textDecoration: "none", height: 48, padding: "0 24px" }}>
                Apply for this Service →
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="gov-container gov-page-body">
        <Link to="/services" className="svc-back-link">
          ← Back to All Services
        </Link>

        <div className="svc-detail-layout">
          {/* Main Info */}
          <main className="svc-detail-main">
            {/* Overview / Department */}
            <section className="svc-detail-card">
              <h2 className="svc-detail-heading">🏛️ Department & Category</h2>
              <div className="svc-detail-grid-2">
                <div className="svc-detail-field">
                  <span className="svc-detail-label">Department</span>
                  <span className="svc-detail-value">{service.department?.name || "N/A"}</span>
                </div>
                <div className="svc-detail-field">
                  <span className="svc-detail-label">Service Category</span>
                  <span className="svc-detail-value">{service.category?.name || "N/A"}</span>
                </div>
              </div>
            </section>

            {/* Eligibility */}
            <section className="svc-detail-card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <h2 className="svc-detail-heading" style={{ margin: 0, padding: 0, border: "none" }}>📋 Eligibility Criteria</h2>
                <Link to={`/services/${id}/apply`} className="gov-btn gov-btn-sm gov-btn-secondary" style={{ textDecoration: "none" }}>
                  Check Eligibility & Apply →
                </Link>
              </div>
              <p className="svc-detail-text">{service.eligibility || "Standard Nepal citizen eligibility guidelines apply."}</p>
            </section>

            {/* Required Documents */}
            <section className="svc-detail-card">
              <h2 className="svc-detail-heading">📁 Required Documents</h2>
              <p className="svc-detail-text">{service.requiredDocuments || "None specified. Please consult the responsible office."}</p>
            </section>

            {/* Application Process */}
            <section className="svc-detail-card">
              <h2 className="svc-detail-heading">⚙️ Application Process & Steps</h2>
              <div className="svc-detail-steps">
                {service.processSteps ? (
                  service.processSteps.split("->").map((step, idx) => (
                    <div key={idx} className="svc-step-item">
                      <span className="svc-step-num">{idx + 1}</span>
                      <span className="svc-step-text">{step.trim()}</span>
                    </div>
                  ))
                ) : (
                  <p className="svc-detail-text">Consult official department guidelines for application workflow.</p>
                )}
              </div>
            </section>

            {/* Final CTA Banner */}
            <section className="svc-detail-card" style={{ background: "linear-gradient(135deg, #0f2942 0%, #153a5b 100%)", color: "#ffffff" }}>
              <h2 className="svc-detail-heading" style={{ color: "#ffffff", borderBottomColor: "rgba(255,255,255,0.15)" }}>
                🚀 Ready to Submit Your Application?
              </h2>
              <p style={{ color: "#cbd5e1", margin: "0 0 20px 0" }}>
                Start your online pre-enrollment application for {service.title} right now through our simplified e-Governance portal.
              </p>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <Link to={`/services/${id}/apply`} className="gov-btn gov-btn-primary" style={{ textDecoration: "none", height: 44, display: "inline-flex", alignItems: "center" }}>
                  Start Online Application →
                </Link>
              </div>
            </section>
          </main>

          {/* Sidebar */}
          <aside className="svc-detail-sidebar">
            {/* Quick Action Card */}
            <div className="svc-sidebar-card" style={{ border: "2px solid #c0262d" }}>
              <h3 className="svc-sidebar-title" style={{ color: "#c0262d" }}>Online Application</h3>
              <p style={{ fontSize: 13, color: "#334155", margin: "0 0 16px 0", lineHeight: 1.5 }}>
                Submit details online, upload required documents, and select your preferred appointment slot.
              </p>
              <Link to={`/services/${id}/apply`} className="gov-btn gov-btn-primary" style={{ textDecoration: "none", width: "100%", justifyContent: "center", display: "inline-flex", height: 42, alignItems: "center" }}>
                Apply for {service.title?.split(" ")[2] || "Service"} →
              </Link>
            </div>

            <div className="svc-sidebar-card">
              <h3 className="svc-sidebar-title">Service Metadata</h3>
              <dl className="svc-sidebar-dl">
                <div className="svc-sidebar-dt-group">
                  <dt>Service Fee</dt>
                  <dd>{service.feeInfo || "Standard government rates"}</dd>
                </div>

                <div className="svc-sidebar-dt-group">
                  <dt>Service Office</dt>
                  <dd>{service.officeInfo || "Designated District / Central Office"}</dd>
                </div>

                <div className="svc-sidebar-dt-group">
                  <dt>Status</dt>
                  <dd><span className="svc-status-tag">Active Service</span></dd>
                </div>
              </dl>
            </div>

            <div className="svc-sidebar-card svc-sidebar-help">
              <h3 className="svc-sidebar-title">🤖 Need Assistance?</h3>
              <p>Ask SewaBot AI assistant using the chat button at the bottom right for instant guidance on document requirements and DAO locations.</p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetailPage;