import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  CheckCircle2,
  ChevronRight,
  Clock3,
  HelpCircle,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  Sparkles,
  User,
  UserPlus,
  Users,
  X,
} from "lucide-react";

import "./EmployeeDashboard.css";
import { clearEmployeeSession, getEmployeeSession } from "../../services/auth";

function EmployeeDashboard() {
  const navigate = useNavigate();

  const [employee, setEmployee] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  /* =========================
     CHECK LOGIN
  ========================= */

  useEffect(() => {
    const parsedEmployee = getEmployeeSession();

    if (!parsedEmployee) {
      navigate("/employee/login", { replace: true });
      return;
    }

    setEmployee(parsedEmployee);
  }, [navigate]);

  /* =========================
     LOGOUT
  ========================= */
const handleLogout = () => {
  clearEmployeeSession();
  navigate("/employee/login", { replace: true });
};


  /* =========================
     REFER CANDIDATE
  ========================= */

  const goToReferral = () => {
    setSidebarOpen(false);

    /*
      Referral page is not currently registered
      in App.jsx.

      Keep this navigation when you create:
      /employee/refer
    */

    navigate("/employee/refer");
  };


  /* =========================
     SCROLL TO SECTION
  ========================= */

  const scrollToSection = (id) => {
    setSidebarOpen(false);

    const element = document.getElementById(id);

    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };


  /* =========================
     LOADING
  ========================= */

  if (!employee) {
    return (
      <div className="employee-dashboard-loading">
        <div className="dashboard-loader"></div>
      </div>
    );
  }


  /* =========================
     EMPLOYEE INFORMATION
  ========================= */

  const firstName =
    employee.firstName || "Employee";

  const lastName =
    employee.lastName || "";

  const fullName =
    `${firstName} ${lastName}`.trim();

  const initials =
    `${firstName.charAt(0)}${lastName.charAt(0)}`
      .toUpperCase();


  return (
    <div className="employee-dashboard-page">

      {/* =========================
          MOBILE OVERLAY
      ========================= */}

      {sidebarOpen && (
        <div
          className="dashboard-sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}


      {/* =========================
          SIDEBAR
      ========================= */}

      <aside
        className={`dashboard-sidebar ${
          sidebarOpen
            ? "sidebar-open"
            : ""
        }`}
      >

        <div className="sidebar-top">

          {/* BRAND */}

          <div className="sidebar-brand">

            <div className="sidebar-brand-mark">
              M
            </div>

            <div className="sidebar-brand-text">
              <strong>micron</strong>
              <span>Employee Portal</span>
            </div>

            <button
              type="button"
              className="sidebar-close"
              onClick={() =>
                setSidebarOpen(false)
              }
            >
              <X size={19} />
            </button>

          </div>


          {/* WORKSPACE */}

          <div className="sidebar-section-label">
            WORKSPACE
          </div>


          {/* NAVIGATION */}

          <nav className="sidebar-navigation">

            {/* Dashboard */}

            <button
              type="button"
              className="sidebar-nav-item active"
              onClick={() =>
                scrollToSection(
                  "dashboard-home"
                )
              }
            >
              <LayoutDashboard size={17} />

              <span>
                Dashboard
              </span>
            </button>


            {/* Refer Candidate */}

            <button
              type="button"
              className="sidebar-nav-item"
              onClick={goToReferral}
            >
              <UserPlus size={17} />

              <span>
                Refer Candidate
              </span>

              <ChevronRight
                size={14}
                className="nav-arrow"
              />
            </button>


            {/* My Referrals */}

            <button
              type="button"
              className="sidebar-nav-item"
              onClick={() => navigate("/employee/referrals")}
            >
              <Users size={17} />

              <span>
                My Referrals
              </span>
            </button>


            {/* My Profile */}

            <button
              type="button"
              className="sidebar-nav-item"
              onClick={() =>
                scrollToSection(
                  "profile-section"
                )
              }
            >
              <User size={17} />

              <span>
                My Profile
              </span>
            </button>

          </nav>

          <div className="sidebar-section-label sidebar-help-label">ACCOUNT</div>

          <button type="button" className="sidebar-nav-item" onClick={() => navigate("/employee/notifications")}>
            <Mail size={17} />
            <span>Notifications</span>
          </button>

          <button type="button" className="sidebar-nav-item" onClick={() => navigate("/employee/settings")}>
            <BadgeCheck size={17} />
            <span>Settings</span>
          </button>

          {/* SUPPORT */}

          <div className="sidebar-section-label sidebar-help-label">
            SUPPORT
          </div>


          <button
            type="button"
            className="sidebar-nav-item"
            onClick={() =>
              scrollToSection(
                "how-it-works"
              )
            }
          >
            <HelpCircle size={17} />

            <span>
              How it works
            </span>
          </button>

        </div>


        {/* =========================
            SIDEBAR PROFILE
        ========================= */}

        <div className="sidebar-bottom">

          <div className="sidebar-employee">

            <div className="sidebar-avatar">

              {employee.profilePicture ? (
                <img
                  src={employee.profilePicture}
                  alt={fullName}
                />
              ) : (
                initials || "E"
              )}

            </div>


            <div className="sidebar-employee-info">

              <strong>
                {fullName}
              </strong>

              <span>
                {employee.employeeId}
              </span>

            </div>

          </div>


          {/* SIGN OUT */}

          <button
            type="button"
            className="sidebar-signout"
            onClick={handleLogout}
          >
            <LogOut size={16} />

            <span>
              Sign out
            </span>
          </button>

        </div>

      </aside>


      {/* =========================
          MAIN AREA
      ========================= */}

      <div className="dashboard-content">


        {/* =========================
            MOBILE HEADER
        ========================= */}

        <header className="mobile-dashboard-header">

          <div className="mobile-brand">

            <div className="mobile-brand-mark">
              M
            </div>

            <strong>
              micron
            </strong>

          </div>


          <button
            type="button"
            className="mobile-menu-button"
            onClick={() =>
              setSidebarOpen(true)
            }
          >
            <Menu size={20} />
          </button>

        </header>


        <main className="dashboard-main">


          {/* =========================
              TOP BAR
          ========================= */}

          <div className="dashboard-topbar">

            <div>

              <span className="dashboard-date">
                EMPLOYEE REFERRAL PORTAL
              </span>

              <div className="dashboard-topbar-line">

                <span>
                  Talent network
                </span>

                <span className="topbar-dot"></span>

                <span>
                  Internal referrals
                </span>

              </div>

            </div>


            {/* TOP PROFILE */}

            <div className="topbar-profile">

              <div className="topbar-avatar">

                {employee.profilePicture ? (
                  <img
                    src={employee.profilePicture}
                    alt={fullName}
                  />
                ) : (
                  initials || "E"
                )}

              </div>


              <div className="topbar-profile-info">

                <strong>
                  {fullName}
                </strong>

                <span>
                  {employee.employeeId}
                </span>

              </div>

            </div>

          </div>


          {/* =========================
              HERO
          ========================= */}

          <section
            className="dashboard-hero"
            id="dashboard-home"
          >

            <div className="hero-glow"></div>


            <div className="hero-content">

              <div className="hero-badge">

                <span className="hero-status-dot"></span>

                YOUR REFERRAL SPACE

              </div>


              <h1>

                Welcome back,

                <span>
                  {firstName}.
                </span>

              </h1>


              <p>
                Your network can help Micron find the next
                great teammate. Refer someone you believe
                would be a strong fit.
              </p>


              <div className="hero-actions">

                {/* PRIMARY */}

                <button
                  type="button"
                  className="hero-primary-button"
                  onClick={goToReferral}
                >

                  <UserPlus size={17} />

                  Refer a Candidate

                  <ArrowRight size={16} />

                </button>


                {/* SECONDARY */}

                <button
                  type="button"
                  className="hero-secondary-button"
                  onClick={() =>
                    scrollToSection(
                      "recent-referrals"
                    )
                  }
                >

                  View my referrals

                  <ChevronRight size={15} />

                </button>

              </div>

            </div>


            {/* HERO VISUAL */}

            <div className="hero-visual">

              <div className="hero-visual-orbit orbit-one"></div>

              <div className="hero-visual-orbit orbit-two"></div>


              <div className="hero-visual-card">

                <div className="hero-visual-icon">

                  <Sparkles size={23} />

                </div>


                <div>

                  <strong>
                    AI-powered matching
                  </strong>

                  <span>
                    Every candidate is evaluated
                    against available opportunities.
                  </span>

                </div>

              </div>

            </div>

          </section>


          {/* =========================
              OVERVIEW
          ========================= */}

          <section className="dashboard-overview">

            <div className="section-heading-row">

              <div>

                <span className="section-label">
                  OVERVIEW
                </span>

                <h2>
                  Your referral activity
                </h2>

              </div>


              <span className="section-muted">
                Updated automatically
              </span>

            </div>


            <div className="overview-grid">


              {/* PROFILE */}

              <article
                className="profile-overview-card"
                id="profile-section"
              >

                <div className="card-top-label">
                  YOUR PROFILE
                </div>


                <div className="profile-overview-main">

                  <div className="profile-large-avatar">

                    {employee.profilePicture ? (
                      <img
                        src={employee.profilePicture}
                        alt={fullName}
                      />
                    ) : (
                      initials || "E"
                    )}

                    <span className="profile-online-dot"></span>

                  </div>


                  <div className="profile-overview-info">

                    <div className="employee-status">

                      <CheckCircle2 size={13} />

                      Active employee

                    </div>


                    <h3>
                      {fullName}
                    </h3>


                    <p>
                      {employee.employeeId}
                    </p>

                  </div>

                </div>


                <div className="profile-overview-details">


                  {/* EMAIL */}

                  <div className="profile-detail">

                    <div className="profile-detail-icon">

                      <Mail size={14} />

                    </div>


                    <div>

                      <span>
                        WORK EMAIL
                      </span>

                      <strong>
                        {employee.email}
                      </strong>

                    </div>

                  </div>


                  {/* ACCOUNT */}

                  <div className="profile-detail">

                    <div className="profile-detail-icon verified">

                      <BadgeCheck size={14} />

                    </div>


                    <div>

                      <span>
                        ACCOUNT
                      </span>

                      <strong>
                        Verified Employee
                      </strong>

                    </div>

                  </div>

                </div>

              </article>


              {/* =========================
                  STAT 1
              ========================= */}

              <article className="metric-card">

                <div className="metric-card-header">

                  <div className="metric-icon blue">

                    <Users size={17} />

                  </div>

                  <span>
                    Total referrals
                  </span>

                </div>


                <div className="metric-value">
                  0
                </div>


                <p>
                  Candidates you've referred
                </p>


                <div className="metric-bottom">

                  <span>
                    Start building your network
                  </span>

                </div>

              </article>


              {/* =========================
                  STAT 2
              ========================= */}

              <article className="metric-card">

                <div className="metric-card-header">

                  <div className="metric-icon amber">

                    <Clock3 size={17} />

                  </div>

                  <span>
                    Pending
                  </span>

                </div>


                <div className="metric-value">
                  0
                </div>


                <p>
                  Awaiting candidate action
                </p>


                <div className="metric-bottom">

                  <span>
                    Invitations in progress
                  </span>

                </div>

              </article>


              {/* =========================
                  STAT 3
              ========================= */}

              <article className="metric-card">

                <div className="metric-card-header">

                  <div className="metric-icon green">

                    <CheckCircle2 size={17} />

                  </div>

                  <span>
                    Successful
                  </span>

                </div>


                <div className="metric-value">
                  0
                </div>


                <p>
                  Candidates moved forward
                </p>


                <div className="metric-bottom">

                  <span>
                    Great referrals make impact
                  </span>

                </div>

              </article>

            </div>

          </section>


          {/* =========================
              PIPELINE
          ========================= */}

          <section className="pipeline-card">

            <div className="pipeline-header">

              <div>

                <span className="section-label">
                  REFERRAL PIPELINE
                </span>

                <h2>
                  Track the journey
                </h2>

                <p>
                  Follow your candidates from referral
                  to hiring review.
                </p>

              </div>


              <div className="pipeline-summary">

                <BarChart3 size={16} />

                <span>
                  0 active candidates
                </span>

              </div>

            </div>


            <div className="pipeline">


              {/* STEP 1 */}

              <div className="pipeline-step active">

                <div className="pipeline-number">
                  01
                </div>

                <div className="pipeline-step-content">

                  <strong>
                    Referred
                  </strong>

                  <span>
                    You submit their details
                  </span>

                </div>

              </div>


              <div className="pipeline-connector"></div>


              {/* STEP 2 */}

              <div className="pipeline-step">

                <div className="pipeline-number">
                  02
                </div>

                <div className="pipeline-step-content">

                  <strong>
                    Invited
                  </strong>

                  <span>
                    Candidate receives an email
                  </span>

                </div>

              </div>


              <div className="pipeline-connector"></div>


              {/* STEP 3 */}

              <div className="pipeline-step">

                <div className="pipeline-number">
                  03
                </div>

                <div className="pipeline-step-content">

                  <strong>
                    Submitted
                  </strong>

                  <span>
                    Resume is uploaded
                  </span>

                </div>

              </div>


              <div className="pipeline-connector"></div>


              {/* STEP 4 */}

              <div className="pipeline-step">

                <div className="pipeline-number">
                  04
                </div>

                <div className="pipeline-step-content">

                  <strong>
                    AI Review
                  </strong>

                  <span>
                    Profile is analyzed
                  </span>

                </div>

              </div>


              <div className="pipeline-connector"></div>


              {/* STEP 5 */}

              <div className="pipeline-step">

                <div className="pipeline-number">
                  05
                </div>

                <div className="pipeline-step-content">

                  <strong>
                    HR Review
                  </strong>

                  <span>
                    HR makes the final decision
                  </span>

                </div>

              </div>

            </div>

          </section>


          {/* =========================
              RECENT REFERRALS
          ========================= */}

          <section
            className="recent-referrals-card"
            id="recent-referrals"
          >

            <div className="recent-header">

              <div>

                <span className="section-label">
                  ACTIVITY
                </span>

                <h2>
                  Recent referrals
                </h2>

                <p>
                  Keep track of candidates you've
                  referred to Micron.
                </p>

              </div>


              <button
                type="button"
                className="view-all-button"
                onClick={() =>
                  scrollToSection(
                    "recent-referrals"
                  )
                }
              >

                View all

                <ArrowRight size={15} />

              </button>

            </div>


            {/* EMPTY STATE */}

            <div className="referrals-empty-state">

              <div className="empty-state-illustration">

                <div className="empty-state-circle">

                  <Users size={24} />

                </div>

                <div className="empty-state-orbit orbit-left"></div>

                <div className="empty-state-orbit orbit-right"></div>

              </div>


              <h3>
                Your referral list is empty
              </h3>


              <p>
                Refer a talented person from your network
                and their journey will appear here.
              </p>


              <button
                type="button"
                className="empty-state-button"
                onClick={goToReferral}
              >

                <UserPlus size={15} />

                Refer your first candidate

                <ArrowRight size={15} />

              </button>

            </div>

          </section>


          {/* =========================
              HOW IT WORKS
          ========================= */}

          <section
            className="how-it-works-card"
            id="how-it-works"
          >

            <div className="how-icon">

              <Sparkles size={19} />

            </div>


            <div className="how-content">

              <span>
                HOW IT WORKS
              </span>

              <h3>
                You refer. AI analyzes. HR decides.
              </h3>

              <p>
                Submit a candidate using their basic
                details. We'll invite them to complete
                their profile and upload a resume. Our
                AI analyzer evaluates their skills,
                experience and education against available
                roles, while HR makes the final decision.
              </p>

            </div>


            <button
              type="button"
              className="how-arrow"
              onClick={goToReferral}
              aria-label="Refer a candidate"
            >

              <ArrowRight size={18} />

            </button>

          </section>


          {/* =========================
              FOOTER
          ========================= */}

          <footer className="dashboard-footer">

            <span>
              micron employee referral portal
            </span>

            <span>
              Internal use only
            </span>

          </footer>

        </main>

      </div>

    </div>
  );
}

export default EmployeeDashboard;