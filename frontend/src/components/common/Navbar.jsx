import React, { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import logo from "../../assets/NepalGovernment.png";
import {
  clearAuth,
  getUser,
  isAuthenticated,
  onAuthChange,
} from "../../utils/authStorage";

const Navbar = () => {
  const navigate = useNavigate();
  const [auth, setAuth] = useState({
    authenticated: isAuthenticated(),
    user: getUser(),
  });
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(
    () =>
      onAuthChange(() =>
        setAuth({ authenticated: isAuthenticated(), user: getUser() })
      ),
    []
  );

  const onLogout = () => {
    clearAuth();
    navigate("/");
  };

  return (
    <header className="sb-navbar" role="banner">
      {/* EXACT REFERENCE GOVT MASTHEAD HEADER BANNER */}
      <div className="gov-header-banner">
        <div className="gov-container gov-header-banner-inner">
          {/* Left Brand Identity */}
          <Link to="/" className="gov-brand-block" aria-label="SewaBot Home Portal">
            <img
              src={logo}
              alt="Nepal Emblem"
              className="gov-emblem-img"
            />
            <div className="gov-brand-titles">
              <span className="gov-title-sub">नेपाल सरकार | गृह मन्त्रालय</span>
              <h1 className="gov-title-main">SewaBot — नागरिक सेवा केन्द्र</h1>
              <span className="gov-title-loc">लाज़िम्पाट, काठमाडौँ, नेपाल</span>
            </div>
          </Link>

          {/* Right Date & Flag Widget */}
          <div className="gov-header-date-widget">
            <div className="gov-flag-icon">🇳🇵</div>
            <div className="gov-date-info">
              <div className="gov-date-nepali">वि.सं: २०८२ भाद्र ३० गते सोमबार, २१:०५ बजे</div>
              <div className="gov-date-samvat">नेपाल संवत्: ११४५ गुलाथ्व तृतीया - ३</div>
            </div>
          </div>
        </div>
      </div>

      {/* SOLID DEEP BLUE HORIZONTAL NAV BAR */}
      <div className="gov-nav-strip">
        <div className="gov-container gov-nav-inner">
          <nav className="gov-nav-list" aria-label="Primary navigation">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                isActive ? "gov-nav-item gov-nav-item--active" : "gov-nav-item"
              }
            >
              गृह पृष्ठ
            </NavLink>
            <NavLink
              to="/services"
              className={({ isActive }) =>
                isActive ? "gov-nav-item gov-nav-item--active" : "gov-nav-item"
              }
            >
              सरकारी सेवाहरू
            </NavLink>
            <NavLink
              to="/track-status"
              className={({ isActive }) =>
                isActive ? "gov-nav-item gov-nav-item--active" : "gov-nav-item"
              }
            >
              आवेदन स्थिति
            </NavLink>
            <NavLink
              to="/my-applications"
              className={({ isActive }) =>
                isActive ? "gov-nav-item gov-nav-item--active" : "gov-nav-item"
              }
            >
              मेरो आवेदन
            </NavLink>
          </nav>

          <div className="gov-nav-right-tools">
            {auth.authenticated ? (
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span className="gov-user-tag">
                  👤 {auth.user?.fullName || auth.user?.email || "Citizen"}
                </span>
                <button
                  type="button"
                  className="gov-logout-link"
                  onClick={onLogout}
                >
                  बाहिरिनुहोस् (Logout)
                </button>
              </div>
            ) : (
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <NavLink to="/login" className="gov-auth-btn">
                  लगइन (Login)
                </NavLink>
                <NavLink to="/signup" className="gov-auth-btn gov-auth-btn--crimson">
                  नागरिक दर्ता
                </NavLink>
              </div>
            )}

            <button
              className="sb-hamburger"
              onClick={() => setMobileOpen((o) => !o)}
              aria-expanded={mobileOpen}
              aria-label="Toggle menu"
              type="button"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <nav
          className="sb-mobile-nav"
          aria-label="Mobile navigation"
          id="mobile-nav"
        >
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              isActive ? "sb-mobile-link sb-mobile-link--active" : "sb-mobile-link"
            }
            onClick={() => setMobileOpen(false)}
          >
            Home
          </NavLink>
          <NavLink
            to="/services"
            className={({ isActive }) =>
              isActive ? "sb-mobile-link sb-mobile-link--active" : "sb-mobile-link"
            }
            onClick={() => setMobileOpen(false)}
          >
            Services
          </NavLink>
          <NavLink
            to="/track-status"
            className={({ isActive }) =>
              isActive ? "sb-mobile-link sb-mobile-link--active" : "sb-mobile-link"
            }
            onClick={() => setMobileOpen(false)}
          >
            Track Status
          </NavLink>
          <NavLink
            to="/my-applications"
            className={({ isActive }) =>
              isActive ? "sb-mobile-link sb-mobile-link--active" : "sb-mobile-link"
            }
            onClick={() => setMobileOpen(false)}
          >
            My Applications
          </NavLink>
          {auth.authenticated ? (
            <>
              <span className="sb-mobile-link sb-mobile-user">
                👤 {auth.user?.fullName || auth.user?.email || "Citizen"}
              </span>
              <button
                type="button"
                className="sb-mobile-link sb-mobile-logout"
                onClick={() => { onLogout(); setMobileOpen(false); }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  isActive ? "sb-mobile-link sb-mobile-link--active" : "sb-mobile-link"
                }
                onClick={() => setMobileOpen(false)}
              >
                Login
              </NavLink>
              <NavLink
                to="/signup"
                className={({ isActive }) =>
                  isActive ? "sb-mobile-link sb-mobile-link--active" : "sb-mobile-link"
                }
                onClick={() => setMobileOpen(false)}
              >
                Signup
              </NavLink>
            </>
          )}
        </nav>
      )}
    </header>
  );
};

export default Navbar;