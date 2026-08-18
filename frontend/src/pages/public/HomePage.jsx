import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const POPULAR_SERVICES = [
  {
    id: 2,
    title: "e-Passport",
    icon: "🛂",
    department: "Department of Passports",
    description: "Apply for new Nepalese biometric e-passport or renew an existing passport online.",
  },
  {
    id: 1,
    title: "Citizenship Certificate",
    icon: "🇳🇵",
    department: "District Administration Office",
    description: "Submit online pre-enrollment request for Nepalese Citizenship Certificate by descent or birth.",
  },
  {
    id: 3,
    title: "Driving License",
    icon: "🪪",
    department: "Transport Management Office",
    description: "Register for Smart Driving License exam, renewal, or vehicle category addition.",
  },
];

const CATEGORIES = [
  { name: "Identity & Citizenship", icon: "🆔" },
  { name: "Passport & Travel", icon: "✈️" },
  { name: "Driving & Transport", icon: "🚘" },
];

const HomePage = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const onSearchSubmit = (e) => {
    e.preventDefault();
    const q = search.trim();
    if (!q) {
      navigate("/services");
    } else {
      navigate(`/services?search=${encodeURIComponent(q)}`);
    }
  };

  return (
    <div className="home-page">
      {/* 1. INSTITUTIONAL SERVICE PORTAL BANNER */}
      <section className="home-hero">
        <div className="gov-container">
          <div className="hero-content">
            <span className="hero-sub-title">Citizen Digital Pre-Enrollment Portal</span>
            <h1>नेपाल सरकारका सार्वजनिक डिजिटल सेवाहरू</h1>
            <p>
              नेपाल सरकार अन्तर्गतका जिल्ला प्रशासन, राहदानी विभाग तथा यातायात व्यवस्था कार्यालयबाट प्रवाह हुने नागरिक सेवाहरूको पूर्व-दर्ता तथा अनलाइन निवेदन।
            </p>

            <form className="hero-search-box" onSubmit={onSearchSubmit} role="search">
              <input
                type="text"
                className="hero-search-input"
                placeholder="सेवा खोज्नुहोस् (उदा: नागरिकता, ई-राहदानी, सवारी चालक अनुमतिपत्र)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Search government services"
              />
              <button type="submit" className="hero-search-btn">
                🔍 खोज्नुहोस् / Search
              </button>
            </form>

            <div className="hero-popular-tags">
              <span>द्रुत खोज / Quick Directory:</span>
              <button
                type="button"
                className="hero-tag-btn"
                onClick={() => navigate("/services?search=Citizenship")}
              >
                🇳🇵 नागरिकता / Citizenship
              </button>
              <button
                type="button"
                className="hero-tag-btn"
                onClick={() => navigate("/services?search=Passport")}
              >
                🛂 ई-राहदानी / e-Passport
              </button>
              <button
                type="button"
                className="hero-tag-btn"
                onClick={() => navigate("/services?search=License")}
              >
                🚘 सवारी चालक / Driving License
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. PUBLIC SECTOR SERVICES DIRECTORY GRID */}
      <section className="home-section">
        <div className="gov-container">
          <div className="home-section-header">
            <h2 className="home-section-title">प्रमुख डिजिटल नागरिक सेवाहरू (Core Citizen Services)</h2>
            <p className="home-section-desc">
              नागरिकहरूले अनलाइन माध्यमबाट आवेदन दिन सकिने नेपाल सरकारका प्राथमिक एकीकृत सेवाहरू।
            </p>
          </div>

          <div className="home-popular-grid">
            {POPULAR_SERVICES.map((s) => (
              <div key={s.id} className="gov-card home-popular-card">
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                    <span className="home-popular-icon">{s.icon}</span>
                    <span className="svc-status-tag" style={{ fontSize: 11 }}>Active Pre-Enrollment</span>
                  </div>
                  <span className="home-popular-dept">{s.department}</span>
                  <h3 className="home-popular-name">{s.title}</h3>
                  <p className="home-popular-text">{s.description}</p>
                </div>
                <div style={{ marginTop: 16, paddingTop: 12, borderTop: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 12, color: "var(--secondary-text)", fontWeight: 600 }}>शुल्क / Fee: Official Rates</span>
                  <Link to={`/services/${s.id}`} className="gov-btn gov-btn-secondary gov-btn-sm">
                    विवरण र आवेदन →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. CATEGORIES SECTION */}
      <section className="home-section" style={{ background: "#ffffff", borderTop: "1px solid #d8dee6", borderBottom: "1px solid #d8dee6" }}>
        <div className="gov-container">
          <div className="home-section-header">
            <h2 className="home-section-title">Explore Services by Category</h2>
            <p className="home-section-desc">
              Browse services categorized by sector and government administrative body.
            </p>
          </div>

          <div className="home-categories-grid">
            {CATEGORIES.map((c, idx) => (
              <Link
                key={idx}
                to={`/services?category=${encodeURIComponent(c.name)}`}
                className="home-category-card"
              >
                <div className="home-category-icon">{c.icon}</div>
                <span className="home-category-name">{c.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. IMPORTANT NOTICES & PUBLIC ANNOUNCEMENTS (NEPAL GOVT INFRASTRUCTURE STYLE) */}
      <section className="home-section" style={{ background: "#f8fafc" }}>
        <div className="gov-container">
          <div className="gov-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "28px" }}>
            {/* Notices Panel */}
            <div className="gov-card" style={{ padding: "24px", borderTop: "4px solid var(--crimson)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", borderBottom: "1px solid var(--border)", paddingBottom: "10px" }}>
                <h3 style={{ margin: 0, fontSize: "17px", color: "var(--navy)", fontWeight: 800 }}>📢 Important Notices & Guidelines</h3>
                <span style={{ fontSize: "12px", color: "var(--secondary-text)" }}>Updated Today</span>
              </div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "12px" }}>
                <li style={{ borderBottom: "1px dashed var(--border)", paddingBottom: "10px" }}>
                  <div style={{ fontSize: "11px", color: "var(--crimson)", fontWeight: 700 }}>2026-08-15 | E-PASSPORT PRE-ENROLLMENT</div>
                  <a href="#notice1" onClick={(e) => e.preventDefault()} style={{ fontSize: "14px", fontWeight: 700, color: "var(--navy)", textDecoration: "none" }}>
                    Biometric Appointment Slots Open for Tripureshwor Department of Passports
                  </a>
                  <p style={{ margin: "4px 0 0 0", fontSize: "13px", color: "var(--secondary-text)" }}>
                    Applicants are advised to bring original Citizenship Certificates and online pre-enrollment receipt.
                  </p>
                </li>
                <li style={{ borderBottom: "1px dashed var(--border)", paddingBottom: "10px" }}>
                  <div style={{ fontSize: "11px", color: "var(--crimson)", fontWeight: 700 }}>2026-08-10 | DRIVING LICENSE EXAM</div>
                  <a href="#notice2" onClick={(e) => e.preventDefault()} style={{ fontSize: "14px", fontWeight: 700, color: "var(--navy)", textDecoration: "none" }}>
                    Smart Driving License Trial Exam Guidelines & Fee Deposit Notice
                  </a>
                  <p style={{ margin: "4px 0 0 0", fontSize: "13px", color: "var(--secondary-text)" }}>
                    Medical reports must be issued by designated government health centers.
                  </p>
                </li>
                <li>
                  <div style={{ fontSize: "11px", color: "var(--crimson)", fontWeight: 700 }}>2026-08-01 | CITIZENSHIP RE-ENROLLMENT</div>
                  <a href="#notice3" onClick={(e) => e.preventDefault()} style={{ fontSize: "14px", fontWeight: 700, color: "var(--navy)", textDecoration: "none" }}>
                    District Administration Office Digital Pre-Verification Guidelines
                  </a>
                  <p style={{ margin: "4px 0 0 0", fontSize: "13px", color: "var(--secondary-text)" }}>
                    Ward recommendation letters must contain official digital verification QR codes.
                  </p>
                </li>
              </ul>
            </div>

            {/* Quick Links & Office Directory Panel */}
            <div className="gov-card" style={{ padding: "24px", borderTop: "4px solid var(--navy)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", borderBottom: "1px solid var(--border)", paddingBottom: "10px" }}>
                <h3 style={{ margin: 0, fontSize: "17px", color: "var(--navy)", fontWeight: 800 }}>🏛️ Departmental Directories & Resources</h3>
                <span style={{ fontSize: "12px", color: "var(--secondary-text)" }}>Quick Access</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <Link to="/services/2" className="gov-btn gov-btn-secondary" style={{ textDecoration: "none", fontSize: "13px", justifyContent: "flex-start", padding: "10px 12px" }}>
                  🛂 Dept of Passports
                </Link>
                <Link to="/services/1" className="gov-btn gov-btn-secondary" style={{ textDecoration: "none", fontSize: "13px", justifyContent: "flex-start", padding: "10px 12px" }}>
                  🇳🇵 DAO Offices
                </Link>
                <Link to="/services/3" className="gov-btn gov-btn-secondary" style={{ textDecoration: "none", fontSize: "13px", justifyContent: "flex-start", padding: "10px 12px" }}>
                  🚘 Transport Office
                </Link>
                <Link to="/track-status" className="gov-btn gov-btn-secondary" style={{ textDecoration: "none", fontSize: "13px", justifyContent: "flex-start", padding: "10px 12px" }}>
                  🔍 Application Tracking
                </Link>
              </div>

              <div style={{ marginTop: "20px", background: "#edf2f7", padding: "14px", borderRadius: "6px", borderLeft: "3px solid var(--navy)" }}>
                <strong style={{ fontSize: "13px", color: "var(--navy)" }}>🤖 SewaBot AI Assistant Support</strong>
                <p style={{ margin: "4px 0 0 0", fontSize: "12px", color: "var(--secondary-text)" }}>
                  Need instant guidance on required documents, DAO locations, or eligibility? Click the floating bot icon at the bottom right anytime.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. TRUST & INFORMATION SECTION */}
      <section className="home-trust-section">
        <div className="gov-container">
          <div className="home-section-header" style={{ textAlign: "center" }}>
            <h2 className="home-section-title">One Portal. Multiple Citizen Services.</h2>
            <p className="home-section-desc">
              Streamlining public governance interactions through transparent digital self-service.
            </p>
          </div>

          <div className="home-trust-grid">
            <div className="home-trust-card">
              <span className="home-trust-num">01</span>
              <h3 className="home-trust-title">Find Services</h3>
              <p className="home-trust-desc">
                Discover official government services quickly with comprehensive eligibility rules and fee schedules.
              </p>
            </div>

            <div className="home-trust-card">
              <span className="home-trust-num">02</span>
              <h3 className="home-trust-title">Understand Requirements</h3>
              <p className="home-trust-desc">
                Know required documents, application steps, and processing DAO offices before visiting in person.
              </p>
            </div>

            <div className="home-trust-card">
              <span className="home-trust-num">03</span>
              <h3 className="home-trust-title">Track Applications</h3>
              <p className="home-trust-desc">
                Monitor live application progress and timeline updates directly from your citizen dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;