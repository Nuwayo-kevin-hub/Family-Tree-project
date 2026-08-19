import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../api/authApi";
import useAuth from "../hooks/useAuth";

import "./login.css";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      const response = await loginUser({ username, password });
      console.log("LOGIN FULL RESPONSE:", response);

      if (!response.success) {
        setError(response.message);
        return;
      }

      login(response.user, response.token);
      const role = response.user.role;

      if (role === "ROOT_ADMIN")           navigate("/root/dashboard");
      else if (role === "SUB_ROOT_ADMIN")  navigate("/subroot/");
      else if (role === "BRANCH_ADMIN")    navigate("/branch/dashboard");
      else                                 navigate("/member/dashboard");

    } catch (err) {
      console.log(err);
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      {/* ── background orbs ── */}
      <div className="lp-orb lp-orb-1" />
      <div className="lp-orb lp-orb-2" />
      <div className="lp-orb lp-orb-3" />
      <div className="lp-grid" />

      <div className="login-container">

        {/* ════════ LEFT — FORM ════════ */}
        <div className="login-left">

          {/* brand */}
          <div className="lp-brand">
            <div className="lp-brand-logo">🌳</div>
            <span className="lp-brand-name">FamilyTree</span>
          </div>

          {/* header */}
          <div className="login-header">
            <h1>Welcome back</h1>
            <p className="subtitle">Sign in to continue to your family tree</p>
          </div>

          {/* error */}
          {error && (
            <div className="login-error">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {error}
            </div>
          )}

          {/* form */}
          <form onSubmit={handleLogin} className="login-form">

            <div className="form-group">
              <label htmlFor="username">Username or Email</label>
              <div className="input-wrapper">
                <svg className="input-icon" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
                <input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={loading}
                  autoComplete="username"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-wrapper">
                <svg className="input-icon" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="input-eye"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="lp-forgot-row">
              <Link to="/forgot-password" className="forgot-link">Forgot password?</Link>
            </div>

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? (
                <>
                  <span className="lp-spinner" />
                  Signing in…
                </>
              ) : (
                <>
                  Sign In
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </>
              )}
            </button>

          </form>

          {/* footer */}
          <div className="login-footer">
            <p>Don't have an account? <Link to="/register">Create one now</Link></p>
          </div>

        </div>

        {/* ════════ RIGHT — VISUAL ════════ */}
        <div className="login-right">

          {/* decorative orbs */}
          <div className="lr-orb lr-orb-1" />
          <div className="lr-orb lr-orb-2" />
          <div className="lr-orb lr-orb-3" />
          <div className="lr-grid" />

          {/* tree illustration */}
          <div className="lr-tree-wrap">
            <div className="lr-tree-icon">🌳</div>
            <div className="lr-rings">
              <div className="lr-ring lr-ring-1" />
              <div className="lr-ring lr-ring-2" />
              <div className="lr-ring lr-ring-3" />
            </div>
          </div>

          {/* content */}
          <div className="login-overlay">
            <div className="lp-overlay-badge">
              <span>🌳</span> Family Tree System
            </div>
            <h3>Find Your Roots</h3>
            <p>Connect with your heritage, discover ancestors and preserve your family story for generations.</p>

            <div className="lp-features">
              <div className="lp-feature-item"><span>✦</span> Interactive family tree</div>
              <div className="lp-feature-item"><span>✦</span> Secure &amp; private</div>
              <div className="lp-feature-item"><span>✦</span> Multi-generational tracking</div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
