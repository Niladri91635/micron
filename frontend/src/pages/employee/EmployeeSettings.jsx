
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import {
  Bell,
  Check,
  CheckCircle2,
  ImagePlus,
  LockKeyhole,
  Mail,
  Moon,
  Save,
  ShieldCheck,
  User,
  UserRound,
} from "lucide-react";

import "./EmployeeSettings.css";
import { getEmployeeSession, getDemoEmployeeAccount, saveDemoEmployeeAccount, setEmployeeSession } from "../../services/auth";

function EmployeeSettings() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const initialTab = searchParams.get("tab") || "account";

  const [activeTab, setActiveTab] = useState(initialTab);
  const [employee, setEmployee] = useState(null);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const [emailNotifications, setEmailNotifications] =
    useState(true);

  const [referralNotifications, setReferralNotifications] =
    useState(true);

  useEffect(() => {
    const parsed = getEmployeeSession();

    if (!parsed) {
      navigate("/employee/login", { replace: true });
      return;
    }

    setEmployee(parsed);
    setFirstName(parsed.firstName || "");
    setLastName(parsed.lastName || "");
  }, [navigate]);

  // Keep active tab synchronized with URL
  useEffect(() => {
    const tab = searchParams.get("tab");

    if (
      tab &&
      ["account", "notifications", "security", "appearance"].includes(tab)
    ) {
      setActiveTab(tab);
    } else if (!tab) {
      setActiveTab("account");
    }
  }, [searchParams]);

  const changeTab = (tab) => {
    setActiveTab(tab);

    navigate(`/employee/settings?tab=${tab}`, {
      replace: true,
    });
  };

  const saveAccount = () => {
    if (!employee) return;

    const updatedEmployee = {
      ...employee,
      firstName,
      lastName,
    };

    setEmployeeSession(updatedEmployee);

    // Preserve the demo account's passwordHash instead of overwriting it.
    const account = getDemoEmployeeAccount();
    if (account) {
      saveDemoEmployeeAccount({
        ...account,
        firstName,
        lastName,
        email: updatedEmployee.email,
        profilePicture: updatedEmployee.profilePicture || account.profilePicture || "",
      });
    }

    setEmployee(updatedEmployee);
  };

  if (!employee) {
    return (
      <div className="portal-loading">
        <div className="portal-loader"></div>
      </div>
    );
  }

  const fullName =
    `${employee.firstName || ""} ${
      employee.lastName || ""
    }`.trim();

  const initials =
    `${employee.firstName?.charAt(0) || ""}${
      employee.lastName?.charAt(0) || ""
    }`.toUpperCase();

  const tabs = [
    {
      id: "account",
      label: "Manage Account",
      icon: <UserRound size={18} />,
      description: "Employee information",
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: <Bell size={18} />,
      description: "Portal activity",
    },
    {
      id: "security",
      label: "Security",
      icon: <ShieldCheck size={18} />,
      description: "Account protection",
    },
    {
      id: "appearance",
      label: "Appearance",
      icon: <Moon size={18} />,
      description: "Interface preferences",
    },
  ];

  return (
    <div className="settings-page">
      <div className="settings-page-content">

        {/* HEADER */}
        <header className="settings-page-header">
          <div>
            <span>SYSTEM</span>

            <h1>Settings</h1>

            <p>
              Manage your employee portal preferences and account.
            </p>
          </div>
        </header>

        <div className="settings-workspace">

          {/* NAVIGATION */}
          <aside className="settings-navigation">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                className={`settings-navigation-item ${
                  activeTab === tab.id ? "active" : ""
                }`}
                onClick={() => changeTab(tab.id)}
              >
                <div className="settings-navigation-icon">
                  {tab.icon}
                </div>

                <div className="settings-navigation-copy">
                  <strong>{tab.label}</strong>
                  <span>{tab.description}</span>
                </div>
              </button>
            ))}
          </aside>

          {/* CONTENT */}
          <main className="settings-main-panel">

            {/* ACCOUNT */}
            {activeTab === "account" && (
              <>
                <div className="settings-content-header">
                  <div>
                    <span>ACCOUNT</span>

                    <h2>Manage Account</h2>

                    <p>
                      Update your employee profile information.
                    </p>
                  </div>

                  <UserRound size={23} />
                </div>

                <div className="settings-identity">

                  <div className="settings-avatar">
                    {employee.profilePicture ? (
                      <img
                        src={employee.profilePicture}
                        alt={fullName || "Employee"}
                      />
                    ) : (
                      initials || "E"
                    )}
                  </div>

                  <div className="settings-identity-info">
                    <h3>{fullName || "Employee"}</h3>

                    <span>{employee.email || "No email available"}</span>

                    <small>
                      Employee ID ·{" "}
                      {employee.employeeId || "Not available"}
                    </small>
                  </div>

                  <div className="settings-active">
                    <CheckCircle2 size={15} />
                    Active
                  </div>
                </div>

                <div className="settings-form">

                  <div className="settings-field">
                    <label htmlFor="firstName">
                      First name
                    </label>

                    <input
                      id="firstName"
                      type="text"
                      value={firstName}
                      onChange={(e) =>
                        setFirstName(e.target.value)
                      }
                    />
                  </div>

                  <div className="settings-field">
                    <label htmlFor="lastName">
                      Last name
                    </label>

                    <input
                      id="lastName"
                      type="text"
                      value={lastName}
                      onChange={(e) =>
                        setLastName(e.target.value)
                      }
                    />
                  </div>

                  <div className="settings-field">
                    <label htmlFor="employeeId">
                      Employee ID
                    </label>

                    <input
                      id="employeeId"
                      type="text"
                      value={employee.employeeId || ""}
                      disabled
                    />
                  </div>

                  <div className="settings-field">
                    <label htmlFor="workEmail">
                      Work email
                    </label>

                    <input
                      id="workEmail"
                      type="email"
                      value={employee.email || ""}
                      disabled
                    />
                  </div>

                </div>

                <div className="settings-information">
                  <ShieldCheck size={19} />

                  <div>
                    <strong>
                      Employee-managed information
                    </strong>

                    <p>
                      Employee ID and work email are controlled
                      by the organization's identity system.
                    </p>
                  </div>
                </div>

                <div className="settings-actions">
                  <button
                    type="button"
                    className="settings-save-button"
                    onClick={saveAccount}
                  >
                    <Save size={16} />
                    Save changes
                  </button>
                </div>
              </>
            )}

            {/* NOTIFICATIONS */}
            {activeTab === "notifications" && (
              <>
                <div className="settings-content-header">
                  <div>
                    <span>PREFERENCES</span>

                    <h2>Notifications</h2>

                    <p>
                      Choose how you want to receive portal updates.
                    </p>
                  </div>

                  <Bell size={23} />
                </div>

                <div className="preference-list">

                  {/* EMAIL NOTIFICATIONS */}
                  <div className="preference-item">
                    <div className="preference-icon">
                      <Mail size={19} />
                    </div>

                    <div className="preference-copy">
                      <strong>Email notifications</strong>

                      <span>
                        Receive important employee portal updates
                        by email.
                      </span>
                    </div>

                    <button
                      type="button"
                      aria-label="Toggle email notifications"
                      className={`settings-toggle ${
                        emailNotifications ? "checked" : ""
                      }`}
                      onClick={() =>
                        setEmailNotifications(
                          !emailNotifications
                        )
                      }
                    >
                      <span></span>
                    </button>
                  </div>

                  {/* REFERRAL ACTIVITY */}
                  <div className="preference-item">
                    <div className="preference-icon">
                      <User size={19} />
                    </div>

                    <div className="preference-copy">
                      <strong>Referral activity</strong>

                      <span>
                        Get updates when your referred candidates
                        take meaningful actions.
                      </span>
                    </div>

                    <button
                      type="button"
                      aria-label="Toggle referral notifications"
                      className={`settings-toggle ${
                        referralNotifications ? "checked" : ""
                      }`}
                      onClick={() =>
                        setReferralNotifications(
                          !referralNotifications
                        )
                      }
                    >
                      <span></span>
                    </button>
                  </div>

                  {/* SECURITY ALERTS */}
                  <div className="preference-item">
                    <div className="preference-icon">
                      <ShieldCheck size={19} />
                    </div>

                    <div className="preference-copy">
                      <strong>Security alerts</strong>

                      <span>
                        Important security notifications cannot
                        be disabled.
                      </span>
                    </div>

                    <div className="preference-fixed">
                      <Check size={15} />
                      Always on
                    </div>
                  </div>

                </div>
              </>
            )}

            {/* SECURITY */}
            {activeTab === "security" && (
              <>
                <div className="settings-content-header">
                  <div>
                    <span>PROTECTION</span>

                    <h2>Security</h2>

                    <p>
                      Review your employee account security.
                    </p>
                  </div>

                  <ShieldCheck size={23} />
                </div>

                <div className="security-status-banner">

                  <div className="security-status-icon">
                    <ShieldCheck size={23} />
                  </div>

                  <div>
                    <strong>
                      Account protection is active
                    </strong>

                    <p>
                      Your employee account is protected by
                      employee authentication.
                    </p>
                  </div>

                  <span>Secure</span>
                </div>

                {/* REGISTERED EMAIL */}
                <div className="security-card">
                  <div className="security-card-icon">
                    <Mail size={21} />
                  </div>

                  <div className="security-card-content">
                    <strong>Registered email</strong>

                    <p>
                      {employee.email || "No email available"}
                    </p>
                  </div>

                  <div className="verified-label">
                    <CheckCircle2 size={15} />
                    Verified
                  </div>
                </div>

                {/* PASSWORD */}
                <div className="security-card">
                  <div className="security-card-icon">
                    <LockKeyhole size={21} />
                  </div>

                  <div className="security-card-content">
                    <strong>Password</strong>

                    <p>
                      Your account password is protected.
                    </p>
                  </div>

                  <span className="security-managed">
                    Managed
                  </span>
                </div>

                {/* EMPLOYEE AUTHENTICATION */}
                <div className="security-card">
                  <div className="security-card-icon">
                    <UserRound size={21} />
                  </div>

                  <div className="security-card-content">
                    <strong>
                      Employee authentication
                    </strong>

                    <p>
                      Employee identity is associated with your
                      registered portal account.
                    </p>
                  </div>

                  <span className="security-managed">
                    Active
                  </span>
                </div>
              </>
            )}

            {/* APPEARANCE */}
            {activeTab === "appearance" && (
              <>
                <div className="settings-content-header">
                  <div>
                    <span>INTERFACE</span>

                    <h2>Appearance</h2>

                    <p>
                      Customize how the employee portal looks.
                    </p>
                  </div>

                  <Moon size={23} />
                </div>

                <div className="appearance-options">

                  <button
                    type="button"
                    className="appearance-option active"
                  >
                    <div className="appearance-preview">
                      <div></div>
                      <div></div>
                      <div></div>
                    </div>

                    <div>
                      <strong>Dark</strong>

                      <span>
                        Optimized for the Micron employee portal.
                      </span>
                    </div>

                    <div className="appearance-check">
                      <CheckCircle2 size={21} />
                    </div>
                  </button>

                </div>

                {/* SIDEBAR */}
                <div className="appearance-settings">
                  <div>
                    <strong>Sidebar behavior</strong>

                    <span>
                      Keep the navigation expanded on desktop.
                    </span>
                  </div>

                  <span className="appearance-value">
                    Expandable
                  </span>
                </div>

                {/* DENSITY */}
                <div className="appearance-settings">
                  <div>
                    <strong>Interface density</strong>

                    <span>
                      Comfortable spacing for everyday use.
                    </span>
                  </div>

                  <span className="appearance-value">
                    Comfortable
                  </span>
                </div>

                {/* MOTION */}
                <div className="appearance-settings">
                  <div>
                    <strong>Motion</strong>

                    <span>
                      Subtle transitions are enabled throughout
                      the portal.
                    </span>
                  </div>

                  <span className="appearance-value">
                    Standard
                  </span>
                </div>

                <div className="appearance-note">
                  <ImagePlus size={18} />

                  <span>
                    Additional appearance customization can be
                    introduced in a future version.
                  </span>
                </div>
              </>
            )}

          </main>
        </div>
      </div>
    </div>
  );
}

export default EmployeeSettings;

