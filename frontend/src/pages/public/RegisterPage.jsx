import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../../api/authApi";
import { isAuthenticated, setAuth } from "../../utils/authStorage";

const getPasswordError = (password) => {
  if (!password || password.length < 8) {
    return "Password must be at least 8 characters long.";
  }

  if (!/[A-Z]/.test(password)) {
    return "Password must contain at least one uppercase letter.";
  }

  if (!/[a-z]/.test(password)) {
    return "Password must contain at least one lowercase letter.";
  }

  if (!/[0-9]/.test(password)) {
    return "Password must contain at least one number.";
  }

  return "";
};

const RegisterPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isAuthenticated()) {
      navigate("/services", { replace: true });
    }
  }, [navigate]);

  const onChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      if (form.password !== form.confirmPassword) {
        setError("Passwords do not match. Please verify your password entry.");
        return;
      }

      const passwordError = getPasswordError(form.password.trim());
      if (passwordError) {
        setError(passwordError);
        return;
      }

      setLoading(true);
      setError("");
      const data = await registerUser({
        fullName: form.fullName,
        email: form.email,
        password: form.password,
      });

      setAuth({ token: data?.token, user: data?.user });
      navigate("/services");
    } catch (err) {
      setError(err?.response?.data?.message || "Registration failed. Please check your information.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="svc-page">
      <div className="gov-container auth-page-wrap">
        <div className="auth-card-panel auth-card-panel-wide">
          <div className="auth-header">
            <h1 className="auth-title">Create Citizen Account</h1>
            <p className="auth-subtitle">
              Create an account to apply for services and track your applications.
            </p>
          </div>

          <form onSubmit={onSubmit}>
            {error && (
              <div
                className="gov-card"
                style={{
                  borderLeft: "4px solid var(--error)",
                  marginBottom: 20,
                  padding: "12px 16px",
                  background: "#fef2f2",
                }}
              >
                <span className="gov-field-error" style={{ margin: 0 }}>
                  ⚠ {error}
                </span>
              </div>
            )}

            <div className="auth-form-grid">
              {/* Personal Information */}
              <div className="auth-form-grid-2">
                <div>
                  <label htmlFor="regFullName" className="gov-label">
                    Full Name <span className="gov-label-required">*</span>
                  </label>
                  <input
                    id="regFullName"
                    name="fullName"
                    type="text"
                    className="gov-input"
                    placeholder="e.g. Ram Bahadur Thapa"
                    value={form.fullName}
                    onChange={onChange}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="regEmail" className="gov-label">
                    Email Address <span className="gov-label-required">*</span>
                  </label>
                  <input
                    id="regEmail"
                    name="email"
                    type="email"
                    className="gov-input"
                    placeholder="citizen@example.com"
                    value={form.email}
                    onChange={onChange}
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="regPhone" className="gov-label">
                  Mobile Phone Number (Optional)
                </label>
                <input
                  id="regPhone"
                  name="phoneNumber"
                  type="tel"
                  className="gov-input"
                  placeholder="98XXXXXXXX"
                  value={form.phoneNumber}
                  onChange={onChange}
                />
              </div>

              {/* Account Security */}
              <div className="auth-form-grid-2">
                <div>
                  <label htmlFor="regPassword" className="gov-label">
                    Password <span className="gov-label-required">*</span>
                  </label>
                  <div style={{ position: "relative" }}>
                    <input
                      id="regPassword"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      className="gov-input"
                      placeholder="Minimum 8 characters"
                      value={form.password}
                      onChange={onChange}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      style={{
                        position: "absolute",
                        right: 12,
                        top: "50%",
                        transform: "translateY(-50%)",
                        background: "transparent",
                        border: "none",
                        fontSize: 12,
                        fontWeight: 700,
                        color: "var(--navy)",
                        cursor: "pointer",
                      }}
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                <div>
                  <label htmlFor="regConfirmPassword" className="gov-label">
                    Confirm Password <span className="gov-label-required">*</span>
                  </label>
                  <input
                    id="regConfirmPassword"
                    name="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    className="gov-input"
                    placeholder="Re-enter password"
                    value={form.confirmPassword}
                    onChange={onChange}
                    required
                  />
                </div>
              </div>

              <p style={{ margin: 0, fontSize: 12, color: "var(--secondary-text)" }}>
                Password must contain at least 8 characters, including uppercase, lowercase, and numeric digits.
              </p>

              <button
                type="submit"
                className="gov-btn gov-btn-primary gov-btn-full"
                style={{ marginTop: 10 }}
                disabled={loading}
              >
                {loading ? "Creating Citizen Account…" : "Create Account"}
              </button>
            </div>
          </form>

          <div className="auth-footer-link">
            Already have an account? <Link to="/login">Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;