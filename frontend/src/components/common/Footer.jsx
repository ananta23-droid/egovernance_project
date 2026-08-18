import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="sb-footer" role="contentinfo">
      <div className="sb-footer-main">
        <div className="gov-container sb-footer-container">
          {/* Col 1: Branding & Disclaimer */}
          <div className="sb-footer-col">
            <h2 className="sb-footer-logo">SewaBot — नागरिक सेवा केन्द्र</h2>
            <p className="sb-footer-tagline">
              Your AI-powered citizen helpdesk and online application portal for Nepal government services.
            </p>

            <span className="sb-footer-academic-badge">Academic Project</span>
            <p className="sb-footer-academic-note">
              Academic E-Governance Project — SewaBot.<br />
              This is an academic demonstration and is not an official Government of Nepal service portal.
            </p>
          </div>

          {/* Col 2: Navigation */}
          <div className="sb-footer-col">
            <h3 className="sb-footer-col-title">Quick Links</h3>
            <ul className="sb-footer-links">
              <li><Link to="/services" className="sb-footer-link">Government Services</Link></li>
              <li><Link to="/track-status" className="sb-footer-link">Track Status</Link></li>
              <li><Link to="/my-applications" className="sb-footer-link">My Applications</Link></li>
              <li><Link to="/login" className="sb-footer-link">Citizen Login</Link></li>
              <li><Link to="/signup" className="sb-footer-link">Citizen Registration</Link></li>
            </ul>
          </div>

          {/* Col 3: Popular Services */}
          <div className="sb-footer-col">
            <h3 className="sb-footer-col-title">Services</h3>
            <ul className="sb-footer-links">
              <li><Link to="/services/2" className="sb-footer-link">Apply for e-Passport</Link></li>
              <li><Link to="/services/1" className="sb-footer-link">Citizenship Certificate</Link></li>
              <li><Link to="/services/3" className="sb-footer-link">Driving License</Link></li>
              <li><Link to="/services" className="sb-footer-link">Department Guidelines</Link></li>
            </ul>
          </div>

          {/* Col 4: Contact Information */}
          <div className="sb-footer-col">
            <h3 className="sb-footer-col-title">Contact & Help</h3>
            <address className="sb-footer-contact">
              <div>📍 Kathmandu, Nepal</div>
              <div>✉️ <a href="mailto:support@sewabot.gov.np" className="sb-footer-link">support@sewabot.gov.np</a></div>
              <div>📞 +977-9800000000</div>
              <div>⏰ Office Hours: Sun – Fri (10:00 AM – 5:00 PM)</div>
            </address>
          </div>
        </div>
      </div>

      {/* Bottom Legal Bar */}
      <div className="sb-footer-bottom">
        <div className="gov-container sb-footer-bottom-inner">
          <span>© {new Date().getFullYear()} SewaBot. Academic E-Governance Project Demonstration.</span>
          <span>Designed for Nepal Digital Public Infrastructure</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;