import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { trackApplication } from "../../api/applicationApi";

const STAGES = [
  { id: "SUBMITTED", label: "Application Submitted", desc: "Application received online by government portal." },
  { id: "UNDER_REVIEW", label: "Under Review", desc: "Document verification and eligibility check in progress." },
  { id: "PROCESSING", label: "Processing", desc: "Processing at designated District Administration Office." },
  { id: "APPROVED", label: "Approved / Issued", desc: "Application approved and sent for document printing." },
  { id: "COMPLETED", label: "Completed", desc: "Document ready for collection at service office." },
];

const ApplicationTrackingPage = () => {
  const { appNumber } = useParams();
  const navigate = useNavigate();

  const [inputNumber, setInputNumber] = useState(appNumber || "");
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(Boolean(appNumber));
  const [error, setError] = useState("");

  const loadApp = async (numToFetch) => {
    const clean = (numToFetch || "").trim();
    if (!clean) return;
    try {
      setLoading(true);
      setError("");
      const data = await trackApplication(clean);
      setApplication(data);
    } catch (err) {
      setError(err?.response?.data?.message || `No application record found for ID: "${clean}".`);
      setApplication(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (appNumber) {
      setInputNumber(appNumber);
      loadApp(appNumber);
    }
  }, [appNumber]);

  const onSearchSubmit = (e) => {
    e.preventDefault();
    const q = inputNumber.trim();
    if (!q) return;
    navigate(`/track-status/${q}`);
  };

  const getStageIndex = (status) => {
    const idx = STAGES.findIndex((s) => s.id === status);
    return idx >= 0 ? idx : 0;
  };

  return (
    <div className="svc-page">
      {/* GLOBAL INTERNAL PAGE HEADER */}
      <div className="gov-page-header">
        <div className="gov-container">
          <div className="gov-breadcrumb">
            <Link to="/">Home</Link>
            <span className="gov-breadcrumb-sep">›</span>
            <span>Track Application Status</span>
          </div>

          <h1 className="gov-page-title">Track Application Status</h1>
          <p className="gov-page-subtitle">
            Enter your application number to view the latest status of your application.
          </p>
        </div>
      </div>

      <div className="gov-container gov-page-body">
        {/* TRACKING INPUT PANEL */}
        <div className="gov-card track-search-card">
          <form onSubmit={onSearchSubmit}>
            <label htmlFor="trackNumberInput" className="gov-label">
              Application Number
            </label>
            <div style={{ display: "flex", gap: 12, marginBottom: 8 }}>
              <input
                id="trackNumberInput"
                type="text"
                className="gov-input"
                placeholder="e.g. EP-2026-000123"
                value={inputNumber}
                onChange={(e) => setInputNumber(e.target.value)}
              />
              <button type="submit" className="gov-btn gov-btn-primary">
                Track Status
              </button>
            </div>
            <p style={{ margin: 0, fontSize: 13, color: "var(--secondary-text)" }}>
              Example: <strong>EP-2026-000123</strong> or <strong>DL-2026-000087</strong>
            </p>
          </form>

          {/* Quick Demo Pre-fill Links */}
          <div style={{ marginTop: 16, paddingTop: 14, borderTop: "1px solid var(--border)", display: "flex", gap: 8, alignItems: "center" }}>
            <span style={{ fontSize: 12, color: "var(--secondary-text)", fontWeight: 600 }}>Try Demo IDs:</span>
            <button
              type="button"
              className="gov-btn gov-btn-neutral gov-btn-sm"
              onClick={() => {
                setInputNumber("EP-2026-000123");
                navigate("/track-status/EP-2026-000123");
              }}
            >
              EP-2026-000123
            </button>
            <button
              type="button"
              className="gov-btn gov-btn-neutral gov-btn-sm"
              onClick={() => {
                setInputNumber("DL-2026-000087");
                navigate("/track-status/DL-2026-000087");
              }}
            >
              DL-2026-000087
            </button>
          </div>
        </div>

        {/* LOADING & ERROR STATES */}
        {loading && (
          <div style={{ textAlign: "center", padding: "30px 0" }}>
            <p style={{ color: "var(--secondary-text)" }}>Fetching application tracking timeline…</p>
          </div>
        )}

        {error && (
          <div className="gov-card" style={{ borderLeft: "4px solid var(--error)", maxWidth: 680, margin: "0 auto 24px" }}>
            <strong style={{ color: "var(--error)" }}>Application Search Result</strong>
            <p style={{ margin: "4px 0 0 0", color: "var(--secondary-text)" }}>{error}</p>
          </div>
        )}

        {/* TRACKING RESULT LAYOUT */}
        {application && !loading && (
          <div className="track-result-layout">
            {/* Left: Application Details */}
            <div className="gov-card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, paddingBottom: 12, borderBottom: "1px solid var(--border)" }}>
                <h3 style={{ margin: 0, fontSize: 18, color: "var(--navy)", fontWeight: 800 }}>Application Details</h3>
                <span className="gov-badge gov-badge-submitted">{application.status}</span>
              </div>

              <div className="track-meta-group">
                <div className="track-meta-row">
                  <span className="track-meta-label">Application Number</span>
                  <span className="track-meta-val" style={{ color: "var(--navy)" }}>{application.applicationNumber}</span>
                </div>
                <div className="track-meta-row">
                  <span className="track-meta-label">Service</span>
                  <span className="track-meta-val">{application.service?.title || "Government Service"}</span>
                </div>
                <div className="track-meta-row">
                  <span className="track-meta-label">Applicant Name</span>
                  <span className="track-meta-val">{application.applicantName}</span>
                </div>
                <div className="track-meta-row">
                  <span className="track-meta-label">Submitted Date</span>
                  <span className="track-meta-val">
                    {new Date(application.submittedAt || Date.now()).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <div className="track-meta-row">
                  <span className="track-meta-label">Appointment Office</span>
                  <span className="track-meta-val">{application.appointment?.location || "DAO Office"}</span>
                </div>
              </div>
            </div>

            {/* Right: Stage Timeline */}
            <div className="gov-card">
              <h3 style={{ margin: "0 0 16px 0", fontSize: 18, color: "var(--navy)", fontWeight: 800 }}>Processing Timeline</h3>

              <div className="gov-timeline">
                {STAGES.map((stage, idx) => {
                  const currentIdx = getStageIndex(application.status);
                  const isCompleted = idx < currentIdx;
                  const isCurrent = idx === currentIdx;

                  let itemClass = "";
                  if (isCompleted) itemClass = "gov-timeline-item--completed";
                  else if (isCurrent) itemClass = "gov-timeline-item--current";

                  return (
                    <div key={stage.id} className={`gov-timeline-item ${itemClass}`}>
                      <div className="gov-timeline-marker">
                        {isCompleted ? "✓" : idx + 1}
                      </div>
                      <div className="gov-timeline-content">
                        <div className="gov-timeline-header">
                          <h4 className="gov-timeline-title">{stage.label}</h4>
                          {isCurrent && (
                            <span className="gov-badge gov-badge-action">Current Status</span>
                          )}
                        </div>
                        <p className="gov-timeline-desc">{stage.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicationTrackingPage;
