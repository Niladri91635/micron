import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Bell,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock3,
  FileText,
  HelpCircle,
  LayoutDashboard,
  LogOut,
  Menu,
  Search,
  Settings,
  Sparkles,
  User,
  UserPlus,
  Users,
  X,
} from "lucide-react";

import "./EmployeeDashboard.css";

import {
  clearEmployeeSession,
  getEmployeeSession,
} from "../../services/auth";


function EmployeeDashboard() {
  const navigate = useNavigate();

  const [employee, setEmployee] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] =
    useState(false);


  /* =========================================================
     LOAD EMPLOYEE SESSION
  ========================================================= */

  useEffect(() => {
    const parsedEmployee = getEmployeeSession();

    if (!parsedEmployee) {
      navigate("/employee/login", {
        replace: true,
      });

      return;
    }

    setEmployee(parsedEmployee);
  }, [navigate]);


  /* =========================================================
     ESCAPE KEY
  ========================================================= */

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setSidebarOpen(false);
        setProfileOpen(false);
        setNotificationsOpen(false);
      }
    };

    document.addEventListener(
      "keydown",
      handleEscape
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, []);


  /* =========================================================
     NAVIGATION
  ========================================================= */

  const goTo = (path) => {
    setSidebarOpen(false);
    setProfileOpen(false);
    setNotificationsOpen(false);

    navigate(path);
  };


  /* =========================================================
     LOGOUT
  ========================================================= */

  const handleLogout = () => {
    clearEmployeeSession();

    navigate("/employee/login", {
      replace: true,
    });
  };


  /* =========================================================
     LOADING
  ========================================================= */

  if (!employee) {
    return (
      <div className="employee-dashboard-loading">
        <div className="dashboard-loader" />
      </div>
    );
  }


  /* =========================================================
     EMPLOYEE DATA
  ========================================================= */

  const firstName =
    employee.firstName || "Employee";

  const lastName =
    employee.lastName || "";

  const fullName =
    `${firstName} ${lastName}`.trim();

  const employeeId =
    employee.employeeId || "EMPLOYEE";

  const email =
    employee.email || "";

  const initials =
    `${firstName.charAt(0)}${lastName.charAt(0)}`
      .toUpperCase();


  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div className="employee-dashboard-page">

      {/* =====================================================
          SIDEBAR OVERLAY
      ===================================================== */}

      {sidebarOpen && (
        <div
          className="dashboard-sidebar-overlay"
          onClick={() =>
            setSidebarOpen(false)
          }
        />
      )}


      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <aside
        className={`dashboard-sidebar ${
          sidebarOpen
            ? "sidebar-open"
            : ""
        }`}
      >

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
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>

        </div>


        {/* NAVIGATION */}

        <nav className="sidebar-navigation">

          <div className="sidebar-section-label">
            WORKSPACE
          </div>


          {/* DASHBOARD */}

          <button
            type="button"
            className="sidebar-nav-item active"
            onClick={() =>
              goTo("/employee/dashboard")
            }
          >
            <LayoutDashboard size={17} />

            <span>
              Dashboard
            </span>
          </button>


          {/* REFER */}

          <button
            type="button"
            className="sidebar-nav-item"
            onClick={() =>
              goTo("/employee/refer")
            }
          >
            <UserPlus size={17} />

            <span>
              Refer Candidate
            </span>

            <ChevronRight
              size={14}
              className="sidebar-nav-arrow"
            />
          </button>


          {/* REFERRALS */}

          <button
            type="button"
            className="sidebar-nav-item"
            onClick={() =>
              goTo("/employee/referrals")
            }
          >
            <Users size={17} />

            <span>
              My Referrals
            </span>
          </button>


          {/* PROFILE */}

          <button
            type="button"
            className="sidebar-nav-item"
            onClick={() =>
              goTo("/employee/profile")
            }
          >
            <User size={17} />

            <span>
              My Profile
            </span>
          </button>


          <div className="sidebar-section-label">
            ACCOUNT
          </div>


          {/* NOTIFICATIONS */}

          <button
            type="button"
            className="sidebar-nav-item"
            onClick={() =>
              goTo("/employee/notifications")
            }
          >
            <Bell size={17} />

            <span>
              Notifications
            </span>

            <span className="sidebar-notification-badge">
              2
            </span>
          </button>


          {/* SETTINGS */}

          <button
            type="button"
            className="sidebar-nav-item"
            onClick={() =>
              goTo("/employee/settings")
            }
          >
            <Settings size={17} />

            <span>
              Settings
            </span>
          </button>


          <div className="sidebar-section-label">
            SUPPORT
          </div>


          {/* HELP */}

          <button
            type="button"
            className="sidebar-nav-item"
            onClick={() =>
              goTo("/employee/dashboard")
            }
          >
            <HelpCircle size={17} />

            <span>
              Help & Support
            </span>
          </button>

        </nav>


        {/* SIDEBAR USER */}

        <div className="sidebar-bottom">

          <div className="sidebar-user">

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

            <div className="sidebar-user-info">

              <strong>
                {fullName}
              </strong>

              <span>
                {employeeId}
              </span>

            </div>

          </div>


          <button
            type="button"
            className="sidebar-signout"
            onClick={handleLogout}
          >
            <LogOut size={15} />
            Sign out
          </button>

        </div>

      </aside>


      {/* =====================================================
          MAIN
      ===================================================== */}

      <div className="employee-main">


        {/* HEADER */}

        <header className="employee-header">

          <div className="employee-header-left">

            <button
              type="button"
              className="employee-menu-button"
              onClick={() => {
                setSidebarOpen(true);
                setProfileOpen(false);
                setNotificationsOpen(false);
              }}
              aria-label="Open sidebar"
            >
              <Menu size={19} />
            </button>

            <div className="employee-header-title">
              Dashboard
            </div>

          </div>


          <div className="employee-header-right">


            {/* SEARCH */}

            <div className="employee-search">

              <Search size={15} />

              <input
                type="text"
                placeholder="Search candidates, jobs, referrals..."
              />

              <span>
                ⌘ K
              </span>

            </div>


            {/* NOTIFICATIONS */}

            <div className="employee-header-dropdown">

              <button
                type="button"
                className="employee-header-icon"
                onClick={() => {
                  setNotificationsOpen(
                    !notificationsOpen
                  );

                  setProfileOpen(false);
                }}
              >
                <Bell size={18} />

                <span className="employee-header-dot" />
              </button>


              {notificationsOpen && (
                <div className="employee-dropdown">

                  <div className="employee-dropdown-heading">

                    <strong>
                      Notifications
                    </strong>

                    <span>
                      2 unread
                    </span>

                  </div>


                  <div className="employee-notification">

                    <div className="employee-notification-icon">
                      <UserPlus size={14} />
                    </div>

                    <div>

                      <strong>
                        Referral invitation
                      </strong>

                      <p>
                        Your candidate invitation
                        activity will appear here.
                      </p>

                      <span>
                        Just now
                      </span>

                    </div>

                  </div>


                  <button
                    type="button"
                    className="employee-dropdown-link"
                    onClick={() =>
                      goTo(
                        "/employee/notifications"
                      )
                    }
                  >
                    View all notifications
                    <ChevronRight size={13} />
                  </button>

                </div>
              )}

            </div>


            {/* PROFILE */}

            <div className="employee-header-dropdown">

              <button
                type="button"
                className="employee-profile-button"
                onClick={() => {
                  setProfileOpen(!profileOpen);
                  setNotificationsOpen(false);
                }}
              >

                <div className="employee-header-avatar">

                  {employee.profilePicture ? (
                    <img
                      src={employee.profilePicture}
                      alt={fullName}
                    />
                  ) : (
                    initials || "E"
                  )}

                </div>

                <div className="employee-header-user">

                  <strong>
                    {fullName}
                  </strong>

                  <span>
                    {employeeId}
                  </span>

                </div>

                <ChevronDown size={14} />

              </button>


              {profileOpen && (
                <div className="employee-dropdown employee-profile-dropdown">

                  <div className="employee-profile-summary">

                    <div className="employee-dropdown-avatar">

                      {employee.profilePicture ? (
                        <img
                          src={employee.profilePicture}
                          alt={fullName}
                        />
                      ) : (
                        initials || "E"
                      )}

                    </div>

                    <div>

                      <strong>
                        {fullName}
                      </strong>

                      <span>
                        {email}
                      </span>

                    </div>

                  </div>


                  <div className="employee-dropdown-divider" />


                  <button
                    type="button"
                    onClick={() =>
                      goTo("/employee/profile")
                    }
                  >
                    <User size={15} />
                    My Profile
                  </button>


                  <button
                    type="button"
                    onClick={() =>
                      goTo("/employee/settings")
                    }
                  >
                    <Settings size={15} />
                    Settings
                  </button>


                  <div className="employee-dropdown-divider" />


                  <button
                    type="button"
                    className="employee-dropdown-logout"
                    onClick={handleLogout}
                  >
                    <LogOut size={15} />
                    Sign out
                  </button>

                </div>
              )}

            </div>

          </div>

        </header>


        {/* =====================================================
            DASHBOARD CONTENT
        ===================================================== */}

        <main className="employee-content">


          {/* INTRO */}

          <section className="employee-page-intro">

            <div>

              <span className="employee-eyebrow">
                EMPLOYEE REFERRAL WORKSPACE
              </span>

              <h1>
                Welcome back,{" "}
                <span>{firstName}.</span>
              </h1>

              <p>
                Refer talented people from your
                network and track their journey
                through the recruitment process.
              </p>

            </div>


            <button
              type="button"
              className="employee-primary-button"
              onClick={() =>
                goTo("/employee/refer")
              }
            >
              <UserPlus size={16} />
              Refer a Candidate
            </button>

          </section>


          {/* AI WORKFLOW */}

          <section className="employee-workflow-card">

            <div className="employee-workflow-icon">
              <Sparkles size={19} />
            </div>

            <div className="employee-workflow-content">

              <span>
                AI-POWERED REFERRAL PROCESS
              </span>

              <h2>
                You refer. AI analyzes. HR decides.
              </h2>

              <p>
                Once your candidate completes their
                application and uploads a resume,
                the AI analyzer evaluates their
                profile against available jobs.
              </p>

            </div>

            <div className="employee-workflow-status">
              <span />
              AI Ready
            </div>

          </section>


          {/* OVERVIEW */}

          <section className="employee-section">

            <div className="employee-section-heading">

              <div>

                <span>
                  OVERVIEW
                </span>

                <h2>
                  Referral activity
                </h2>

              </div>

              <small>
                Your referral summary
              </small>

            </div>


            <div className="employee-stats-grid">

              <StatCard
                icon={<Users size={17} />}
                label="TOTAL REFERRALS"
                value="0"
                description="Candidates referred"
                type="blue"
              />

              <StatCard
                icon={<Clock3 size={17} />}
                label="PENDING"
                value="0"
                description="Awaiting candidate action"
                type="amber"
              />

              <StatCard
                icon={<CheckCircle2 size={17} />}
                label="SUCCESSFUL"
                value="0"
                description="Candidates moved forward"
                type="green"
              />

            </div>

          </section>


          {/* TWO COLUMN */}

          <div className="employee-two-column">


            {/* RECENT REFERRALS */}

            <section className="employee-panel">

              <div className="employee-panel-header">

                <div>

                  <span>
                    ACTIVITY
                  </span>

                  <h2>
                    Recent referrals
                  </h2>

                </div>

                <button
                  type="button"
                  onClick={() =>
                    goTo("/employee/referrals")
                  }
                >
                  View all
                  <ChevronRight size={13} />
                </button>

              </div>


              <div className="employee-empty">

                <div className="employee-empty-icon">
                  <Users size={20} />
                </div>

                <h3>
                  No referrals yet
                </h3>

                <p>
                  Candidates you refer will
                  appear here.
                </p>

                <button
                  type="button"
                  className="employee-secondary-button"
                  onClick={() =>
                    goTo("/employee/refer")
                  }
                >
                  <UserPlus size={14} />
                  Refer your first candidate
                </button>

              </div>

            </section>


            {/* PIPELINE */}

            <section className="employee-panel">

              <div className="employee-panel-header">

                <div>

                  <span>
                    WORKFLOW
                  </span>

                  <h2>
                    Referral pipeline
                  </h2>

                </div>

                <Sparkles
                  size={17}
                  className="employee-panel-header-icon"
                />

              </div>


              <div className="employee-pipeline">

                <PipelineStep
                  number="01"
                  title="Referred"
                  text="Candidate details submitted"
                  active
                />

                <PipelineStep
                  number="02"
                  title="Invited"
                  text="Application invitation sent"
                />

                <PipelineStep
                  number="03"
                  title="Submitted"
                  text="Profile and resume received"
                />

                <PipelineStep
                  number="04"
                  title="AI Review"
                  text="Resume and skills analyzed"
                />

                <PipelineStep
                  number="05"
                  title="HR Review"
                  text="Recruiter makes decision"
                />

              </div>

            </section>

          </div>


          {/* HOW IT WORKS */}

          <section className="employee-how-card">

            <div className="employee-how-icon">
              <FileText size={18} />
            </div>

            <div>

              <span>
                HOW IT WORKS
              </span>

              <h2>
                A simple referral process
              </h2>

              <p>
                Refer a candidate using their basic
                details. The candidate completes the
                application and uploads their resume.
                AI performs the analysis and HR makes
                the final recruitment decision.
              </p>

            </div>

          </section>

        </main>

      </div>

    </div>
  );
}


/* =========================================================
   STAT CARD
========================================================= */

const StatCard = ({
  icon,
  label,
  value,
  description,
  type,
}) => {
  return (
    <article className="employee-stat-card">

      <div className="employee-stat-header">

        <div
          className={`employee-stat-icon ${type}`}
        >
          {icon}
        </div>

        <span>
          {label}
        </span>

      </div>

      <strong>
        {value}
      </strong>

      <p>
        {description}
      </p>

    </article>
  );
};


/* =========================================================
   PIPELINE STEP
========================================================= */

const PipelineStep = ({
  number,
  title,
  text,
  active = false,
}) => {
  return (
    <div
      className={`employee-pipeline-step ${
        active ? "active" : ""
      }`}
    >

      <div className="employee-pipeline-number">
        {number}
      </div>

      <div className="employee-pipeline-text">

        <strong>
          {title}
        </strong>

        <span>
          {text}
        </span>

      </div>

    </div>
  );
};


export default EmployeeDashboard;