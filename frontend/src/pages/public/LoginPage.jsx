import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../../api/authApi";
import { isAuthenticated, setAuth } from "../../utils/authStorage";

const LoginPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
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
      setLoading(true);
      setError("");
      const data = await loginUser(form);

      setAuth({ token: data?.token, user: data?.user });
      navigate("/services");
    } catch (err) {
      setError(err?.response?.data?.message || "Invalid credentials. Please verify your email and password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="svc-page">
      <div className="gov-container auth-page-wrap">
        <div className="auth-card-panel">
          <div className="auth-header">
            <h1 className="auth-title">Citizen Login</h1>
            <p className="auth-subtitle">
              Sign in to access your applications and government services.
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
              <div>
                <label htmlFor="loginEmail" className="gov-label">
                  Email Address / Mobile Number <span className="gov-label-required">*</span>
                </label>
                <input
                  id="loginEmail"
                  name="email"
                  type="email"
                  className="gov-input"
                  placeholder="citizen@example.com"
                  value={form.email}
                  onChange={onChange}
                  required
                />
              </div>

              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <label htmlFor="loginPassword" className="gov-label" style={{ margin: 0 }}>
                    Password <span className="gov-label-required">*</span>
                  </label>
                </div>
                <div style={{ position: "relative" }}>
                  <input
                    id="loginPassword"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    className="gov-input"
                    placeholder="Enter your password"
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

              <button
                type="submit"
                className="gov-btn gov-btn-primary gov-btn-full"
                style={{ marginTop: 10 }}
                disabled={loading}
              >
                {loading ? "Signing in…" : "Sign In"}
              </button>
            </div>
          </form>

          <div className="auth-footer-link">
            Don't have an account? <Link to="/signup">Create Citizen Account</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;