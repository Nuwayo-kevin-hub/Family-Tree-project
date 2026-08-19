import { Link } from "react-router-dom";
import "./home.css";

export default function Home() {
  return (
    <div className="home-page">

      {/* ============================================================
          NAVBAR
      ============================================================ */}
      <header className="home-nav">
        <div className="home-nav-inner">

          <div className="home-nav-brand">
            <div className="home-nav-logo">🌳</div>
            <span className="home-nav-name">FamilyTree</span>
          </div>

          <nav className="home-nav-links">
            <a href="#features">Features</a>
            <a href="#how-it-works">How It Works</a>
            <a href="#why-us">Why Us</a>
          </nav>

          <div className="home-nav-actions">
            <Link to="/login" className="nav-btn-ghost">Sign In</Link>
            <Link to="/register" className="nav-btn-solid">Get Started</Link>
          </div>

        </div>
      </header>

      {/* ============================================================
          HERO
      ============================================================ */}
      <section className="home-hero">

        {/* Background decorations */}
        <div className="hero-bg-orb hero-bg-orb-1"></div>
        <div className="hero-bg-orb hero-bg-orb-2"></div>
        <div className="hero-bg-orb hero-bg-orb-3"></div>
        <div className="hero-grid-overlay"></div>

        <div className="hero-content">

          {/* Left: Text */}
          <div className="hero-text">

            <div className="hero-pill">
              <span className="hero-pill-dot"></span>
              Preserve Your Legacy Forever
            </div>

            <h1 className="hero-title">
              Discover Your <br />
              <span className="hero-title-gradient">Family Roots</span>
            </h1>

            <p className="hero-subtitle">
              Build a living family tree, reconnect with lost relatives,
              and preserve your family history for generations to come.
            </p>

            <div className="hero-actions">
              <Link to="/register" className="hero-btn-primary">
                Start Your Tree
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </Link>
              <Link to="/login" className="hero-btn-ghost">
                Sign In
              </Link>
              <Link to="/family-request" className="hero-btn-accent">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
                Find Your Family
              </Link>
            </div>

            <div className="hero-trust">
              <div className="hero-avatars">
                <div className="hero-avatar" style={{background:"#e8f0fe"}}>👨</div>
                <div className="hero-avatar" style={{background:"#e6f7f0"}}>👩</div>
                <div className="hero-avatar" style={{background:"#fef3e8"}}>👴</div>
                <div className="hero-avatar" style={{background:"#f0f0ff"}}>👵</div>
              </div>
              <p className="hero-trust-text">
                Join <strong>thousands of families</strong> already connected
              </p>
            </div>

          </div>

          {/* Right: Visual card */}
          <div className="hero-visual">

            <div className="hero-card-main">
              <div className="hero-card-header">
                <div className="hero-card-dot red"></div>
                <div className="hero-card-dot yellow"></div>
                <div className="hero-card-dot green"></div>
                <span className="hero-card-title">Family Tree Preview</span>
              </div>

              <div className="hero-tree-preview">

                {/* Root node */}
                <div className="tree-preview-row">
                  <div className="tree-node-preview founder">
                    <div className="node-avatar">👴</div>
                    <div className="node-info">
                      <strong>Ibrahim Hassan</strong>
                      <span>Founder</span>
                    </div>
                  </div>
                  <div className="node-connector-h"></div>
                  <div className="tree-node-preview spouse">
                    <div className="node-avatar">👵</div>
                    <div className="node-info">
                      <strong>Fatima Hassan</strong>
                      <span>Spouse</span>
                    </div>
                  </div>
                </div>

                {/* Vertical connector */}
                <div className="tree-connector-v"></div>

                {/* Children row */}
                <div className="tree-preview-row children-row">
                  <div className="tree-node-preview child">
                    <div className="node-avatar">👨</div>
                    <div className="node-info">
                      <strong>Omar</strong>
                      <span>Son</span>
                    </div>
                  </div>
                  <div className="tree-node-preview child">
                    <div className="node-avatar">👩</div>
                    <div className="node-info">
                      <strong>Sara</strong>
                      <span>Daughter</span>
                    </div>
                  </div>
                  <div className="tree-node-preview child">
                    <div className="node-avatar">👦</div>
                    <div className="node-info">
                      <strong>Ali</strong>
                      <span>Son</span>
                    </div>
                  </div>
                </div>

              </div>

              <div className="hero-card-footer">
                <div className="hero-card-stat">
                  <strong>3</strong>
                  <span>Children</span>
                </div>
                <div className="hero-card-divider"></div>
                <div className="hero-card-stat">
                  <strong>2</strong>
                  <span>Generations</span>
                </div>
                <div className="hero-card-divider"></div>
                <div className="hero-card-stat">
                  <strong>5</strong>
                  <span>Members</span>
                </div>
              </div>
            </div>

            {/* Floating badges */}
            <div className="hero-float-badge badge-tl">
              <span>🔒</span> Secure & Private
            </div>
            <div className="hero-float-badge badge-br">
              <span>✅</span> Verified Records
            </div>

          </div>

        </div>

        {/* Scroll indicator */}
        <div className="hero-scroll-hint">
          <div className="scroll-mouse">
            <div className="scroll-wheel"></div>
          </div>
          <span>Scroll to explore</span>
        </div>

      </section>

      {/* ============================================================
          STATS BAR
      ============================================================ */}
      <section className="home-stats">
        <div className="home-stats-inner">

          <div className="stat-item">
            <span className="stat-number">10K+</span>
            <span className="stat-label">Families Connected</span>
          </div>

          <div className="stat-divider"></div>

          <div className="stat-item">
            <span className="stat-number">50K+</span>
            <span className="stat-label">Members Registered</span>
          </div>

          <div className="stat-divider"></div>

          <div className="stat-item">
            <span className="stat-number">98%</span>
            <span className="stat-label">Satisfaction Rate</span>
          </div>

          <div className="stat-divider"></div>

          <div className="stat-item">
            <span className="stat-number">5+</span>
            <span className="stat-label">Generations Tracked</span>
          </div>

        </div>
      </section>

      {/* ============================================================
          FEATURES
      ============================================================ */}
      <section className="home-features" id="features">
        <div className="home-section-inner">

          <div className="section-header">
            <div className="section-pill">Features</div>
            <h2 className="section-title">
              Everything You Need to <br />
              <span>Manage Your Family</span>
            </h2>
            <p className="section-subtitle">
              Powerful tools to build, explore, and protect your family legacy.
            </p>
          </div>

          <div className="features-grid">

            <div className="feature-card feature-card-1">
              <div className="feature-icon-wrap">
                <span className="feature-icon">🌳</span>
              </div>
              <h3>Interactive Family Tree</h3>
              <p>
                Visualise your entire family structure — ancestors, descendants,
                spouses, and siblings — in an elegant, collapsible tree view.
              </p>
              <div className="feature-tag">Visual Explorer</div>
            </div>

            <div className="feature-card feature-card-2">
              <div className="feature-icon-wrap">
                <span className="feature-icon">🔍</span>
              </div>
              <h3>Lost Family Search</h3>
              <p>
                Submit a request and let the system match you with possible
                relatives based on family records and genealogy data.
              </p>
              <div className="feature-tag">Smart Matching</div>
            </div>

            <div className="feature-card feature-card-3">
              <div className="feature-icon-wrap">
                <span className="feature-icon">🛡️</span>
              </div>
              <h3>Relationship Protection</h3>
              <p>
                Automatic alerts prevent relationships between close relatives,
                keeping your family tree accurate and ethically sound.
              </p>
              <div className="feature-tag">Safety First</div>
            </div>

            <div className="feature-card feature-card-4">
              <div className="feature-icon-wrap">
                <span className="feature-icon">🔑</span>
              </div>
              <h3>Role-Based Access</h3>
              <p>
                Fine-grained permissions — Root Admin, Sub Root, Branch Admin,
                and Member roles — keep your data in the right hands.
              </p>
              <div className="feature-tag">Secure Access</div>
            </div>

            <div className="feature-card feature-card-5">
              <div className="feature-icon-wrap">
                <span className="feature-icon">📊</span>
              </div>
              <h3>Admin Dashboard</h3>
              <p>
                Real-time statistics, recent activity, quick actions, and full
                member management — all from one central dashboard.
              </p>
              <div className="feature-tag">Full Control</div>
            </div>

            <div className="feature-card feature-card-6">
              <div className="feature-icon-wrap">
                <span className="feature-icon">🔔</span>
              </div>
              <h3>Smart Notifications</h3>
              <p>
                Stay informed with instant alerts for new requests, approvals,
                member additions, and important family events.
              </p>
              <div className="feature-tag">Real-time</div>
            </div>

          </div>

        </div>
      </section>

      {/* ============================================================
          HOW IT WORKS
      ============================================================ */}
      <section className="home-how" id="how-it-works">
        <div className="home-section-inner">

          <div className="section-header">
            <div className="section-pill section-pill-accent">How It Works</div>
            <h2 className="section-title">
              Up and Running in <span>3 Simple Steps</span>
            </h2>
            <p className="section-subtitle">
              No technical knowledge required. Build your family tree in minutes.
            </p>
          </div>

          <div className="how-steps">

            <div className="how-step">
              <div className="step-number">01</div>
              <div className="step-content">
                <div className="step-icon">📝</div>
                <h3>Register Your Family</h3>
                <p>
                  Create your family profile, add the founder, parents, siblings,
                  and spouse through our guided multi-step registration wizard.
                </p>
              </div>
              <div className="step-connector"></div>
            </div>

            <div className="how-step">
              <div className="step-number">02</div>
              <div className="step-content">
                <div className="step-icon">👥</div>
                <h3>Invite &amp; Connect Members</h3>
                <p>
                  Add family members, assign roles, and grant permissions.
                  Everyone gets their own secure account to contribute.
                </p>
              </div>
              <div className="step-connector"></div>
            </div>

            <div className="how-step">
              <div className="step-number">03</div>
              <div className="step-content">
                <div className="step-icon">🌳</div>
                <h3>Explore Your Tree</h3>
                <p>
                  Watch your family tree grow. Navigate generations, discover
                  connections, and share your heritage with those who matter.
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ============================================================
          WHY US
      ============================================================ */}
      <section className="home-why" id="why-us">
        <div className="home-section-inner home-why-inner">

          <div className="why-text">
            <div className="section-pill section-pill-light">Why Choose Us</div>
            <h2 className="section-title left-align">
              Built for <span>Real Families</span>, <br />
              Not Just Data
            </h2>
            <p className="section-subtitle left-align">
              Unlike generic tools, our platform is built specifically for
              managing family hierarchies — with the privacy, structure,
              and cultural sensitivity your family deserves.
            </p>

            <ul className="why-list">
              <li>
                <div className="why-check">✓</div>
                <div>
                  <strong>Multi-generational tracking</strong>
                  <span>Track unlimited generations with nested branches</span>
                </div>
              </li>
              <li>
                <div className="why-check">✓</div>
                <div>
                  <strong>Privacy-first design</strong>
                  <span>Your family data is never shared with third parties</span>
                </div>
              </li>
              <li>
                <div className="why-check">✓</div>
                <div>
                  <strong>Admin hierarchy system</strong>
                  <span>Delegate control across branches of your family</span>
                </div>
              </li>
              <li>
                <div className="why-check">✓</div>
                <div>
                  <strong>Lost family reconnection</strong>
                  <span>Submit requests and get matched with relatives</span>
                </div>
              </li>
            </ul>

            <Link to="/register" className="why-cta">
              Start Free Today
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
          </div>

          <div className="why-visual">
            <div className="why-card">
              <div className="why-card-header">
                <span className="why-card-icon">🌳</span>
                <div>
                  <strong>Hassan Family Tree</strong>
                  <span>Est. 2023 · 3 Generations</span>
                </div>
                <div className="why-card-badge">Active</div>
              </div>

              <div className="why-card-stats">
                <div className="why-stat">
                  <strong>47</strong>
                  <span>Members</span>
                </div>
                <div className="why-stat">
                  <strong>12</strong>
                  <span>Branches</span>
                </div>
                <div className="why-stat">
                  <strong>3</strong>
                  <span>Admins</span>
                </div>
              </div>

              <div className="why-card-members">
                <div className="why-member">
                  <div className="why-member-avatar">👴</div>
                  <div>
                    <strong>Ibrahim</strong>
                    <span>Root Admin</span>
                  </div>
                </div>
                <div className="why-member">
                  <div className="why-member-avatar">👨</div>
                  <div>
                    <strong>Omar</strong>
                    <span>Branch Admin</span>
                  </div>
                </div>
                <div className="why-member">
                  <div className="why-member-avatar">👩</div>
                  <div>
                    <strong>Sara</strong>
                    <span>Member</span>
                  </div>
                </div>
                <div className="why-member why-member-more">
                  <div className="why-member-avatar more">+44</div>
                  <div>
                    <strong>More</strong>
                    <span>Family members</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative glow */}
            <div className="why-glow"></div>
          </div>

        </div>
      </section>

      {/* ============================================================
          CTA BANNER
      ============================================================ */}
      <section className="home-cta">
        <div className="home-cta-inner">
          <div className="cta-bg-orb cta-orb-1"></div>
          <div className="cta-bg-orb cta-orb-2"></div>

          <div className="cta-content">
            <span className="cta-icon">🌳</span>
            <h2>Your Family Story Starts Here</h2>
            <p>
              Register today and build a tree that will last generations.
              It's free to get started.
            </p>
            <div className="cta-actions">
              <Link to="/register" className="cta-btn-primary">
                Create Your Family Tree
              </Link>
              <Link to="/family-request" className="cta-btn-ghost">
                Find My Family
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          FOOTER
      ============================================================ */}
      <footer className="home-footer">
        <div className="home-footer-inner">

          <div className="footer-brand">
            <div className="footer-logo">🌳</div>
            <div>
              <strong>FamilyTree System</strong>
              <span>Connecting families, preserving legacies.</span>
            </div>
          </div>

          <div className="footer-links">
            <Link to="/login">Sign In</Link>
            <Link to="/register">Register</Link>
            <Link to="/family-request">Find Family</Link>
          </div>

          <div className="footer-copy">
            © {new Date().getFullYear()} FamilyTree System. All rights reserved.
          </div>

        </div>
      </footer>

    </div>
  );
}
