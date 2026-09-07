import { Link, useNavigate } from "react-router-dom";
import { clearHRSession, getHRSession } from "../services/auth";
import { LogOut } from "lucide-react";

export default function HRDashboard() {
  const navigate = useNavigate();
  const hr = getHRSession();

  const handleLogout = () => {
    clearHRSession();
    navigate("/hr/login", { replace: true });
  };

  const activities = [
    ["Rahul Sharma", "Application submitted", "2 mins ago"],
    ["Priya Singh", "AI analysis completed", "15 mins ago"],
    ["Aman Kumar", "Shortlisted for Java Developer", "1 hour ago"],
    ["Neha Gupta", "New referral received", "2 hours ago"],
    ["Vikram Rao", "Moved to under review", "3 hours ago"]
  ];

  return (
    <div className="hr-layout">

      {/* SIDEBAR */}

      <aside className="sidebar">

        <div className="sidebar-logo">
          Micron
        </div>

        <Link className="side-link active" to="/hr/dashboard">
          🏠 Dashboard
        </Link>

        <Link className="side-link" to="/hr/candidates">
          👥 Candidates
        </Link>

        <Link className="side-link">
          💼 Jobs
        </Link>

        <Link className="side-link">
          ↗ Referrals
        </Link>

        <Link className="side-link">
          ✨ AI Analysis
        </Link>

        <Link className="side-link">
          ✓ Shortlisted
        </Link>

        <Link className="side-link">
          ⚙ Settings
        </Link>

        <div className="sidebar-bottom">
          <div className="avatar">{(hr?.name || "HR").split(" ").map((part) => part[0]).join("").slice(0, 2)}</div>
          <div>
            <b>{hr?.name || "HR Manager"}</b>
            <small>{hr?.role || "HR Manager"}</small>
          </div>
          <button type="button" className="hr-logout" onClick={handleLogout} title="Sign out" aria-label="Sign out">
            <LogOut size={15} />
          </button>
        </div>

      </aside>


      {/* MAIN */}

      <main className="hr-main">

        <header className="hr-header">

          <div>
            <input
              className="search"
              placeholder="Search candidates, jobs..."
            />
          </div>

          <div className="header-right">
            <span>🔔</span>
            <div className="header-avatar">SK</div>
          </div>

        </header>


        <div className="dashboard-content">

          <div className="welcome-row">

            <div>
              <h1>Welcome back, {hr?.name?.split(" ")[0] || "HR"}! 👋</h1>
              <p>Here's your recruitment overview.</p>
            </div>

            <div className="date">
              Mar 1, 2025 - Mar 31, 2025 ▾
            </div>

          </div>


          {/* STATS */}

          <div className="stats-grid">

            <div className="stat-card">
              <span>Total Candidates</span>
              <strong>124</strong>
            </div>

            <div className="stat-card">
              <span>Active Jobs</span>
              <strong>18</strong>
            </div>

            <div className="stat-card">
              <span>Analyzed (AI)</span>
              <strong>87</strong>
            </div>

            <div className="stat-card">
              <span>Shortlisted</span>
              <strong>27</strong>
            </div>

          </div>


          <div className="dashboard-grid">

            {/* ACTIVITY */}

            <div className="dashboard-card">

              <h3>Recent Activity</h3>

              {activities.map((activity, index) => (

                <div className="activity" key={index}>

                  <div className="activity-avatar">
                    {activity[0][0]}
                  </div>

                  <div>
                    <b>{activity[0]}</b>
                    <p>{activity[1]}</p>
                  </div>

                  <small>{activity[2]}</small>

                </div>

              ))}

            </div>


            {/* AI INSIGHTS */}

            <div className="dashboard-card">

              <h3>AI Insights</h3>

              <p className="insight-title">
                Top Hiring Roles This Month
              </p>

              <div className="bars">

                <div style={{ height: "45%" }}></div>
                <div style={{ height: "70%" }}></div>
                <div style={{ height: "55%" }}></div>
                <div style={{ height: "90%" }}></div>
                <div style={{ height: "65%" }}></div>

              </div>

              <h4>Top Hiring Roles This Month</h4>

              <ol>
                <li>Java Developer <b>28</b></li>
                <li>Data Analyst <b>17</b></li>
                <li>Product Manager <b>12</b></li>
                <li>DevOps Engineer <b>9</b></li>
              </ol>

            </div>

          </div>

        </div>

      </main>

    </div>
  );
}