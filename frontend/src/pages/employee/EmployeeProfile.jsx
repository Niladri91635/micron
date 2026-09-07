import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  BadgeCheck,
  BriefcaseBusiness,
  CheckCircle2,
  ChevronRight,
  Mail,
  Settings,
  ShieldCheck,
  User,
} from "lucide-react";

import "./EmployeeProfile.css";
import { getEmployeeSession } from "../../services/auth";

function EmployeeProfile() {
  const navigate = useNavigate();

  const [employee, setEmployee] = useState(null);

  useEffect(() => {
    const storedEmployee = getEmployeeSession();

    if (!storedEmployee) {
      navigate("/employee/login", { replace: true });
      return;
    }

    setEmployee(storedEmployee);
  }, [navigate]);

  if (!employee) {
    return (
      <div className="portal-loading">
        <div className="portal-loader"></div>
      </div>
    );
  }

  const firstName = employee.firstName || "Employee";
  const lastName = employee.lastName || "";
  const fullName = `${firstName} ${lastName}`.trim();

  const initials =
    `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();

  return (
    <div className="profile-page">
      <div className="profile-content">

        {/* Page header */}
        <div className="profile-page-header">
          <div>
            <div className="profile-eyebrow">
              EMPLOYEE PORTAL
            </div>

            <h1>My Profile</h1>

            <p>
              View your employee information and account details.
            </p>
          </div>

          <button
            className="profile-manage-button"
            onClick={() => navigate("/employee/settings")}
          >
            <Settings size={17} />
            Manage Account
          </button>
        </div>

        {/* Identity card */}
        <section className="profile-identity-card">

          <div className="identity-main">

            <div className="profile-large-avatar">
              {employee.profilePicture ? (
                <img
                  src={employee.profilePicture}
                  alt={fullName}
                />
              ) : (
                initials
              )}
            </div>

            <div className="identity-details">

              <div className="identity-status">
                <CheckCircle2 size={15} />
                Verified Employee
              </div>

              <h2>{fullName}</h2>

              <p className="identity-id">
                Employee ID · {employee.employeeId}
              </p>

              <div className="identity-email">
                <Mail size={15} />
                {employee.email}
              </div>
            </div>

          </div>

          <div className="identity-actions">

            <div className="identity-status-card">
              <span>ACCOUNT STATUS</span>

              <strong>
                <span className="status-dot"></span>
                Active
              </strong>
            </div>

            <div className="identity-status-card">
              <span>PORTAL ACCESS</span>

              <strong>
                <ShieldCheck size={15} />
                Employee Portal
              </strong>
            </div>

          </div>

        </section>

        {/* Information */}
        <section className="profile-information-section">

          <div className="profile-section-heading">
            <div>
              <span>EMPLOYEE INFORMATION</span>
              <h2>Account details</h2>
            </div>

            <BadgeCheck size={20} />
          </div>

          <div className="profile-details-grid">

            <div className="profile-detail">
              <span>FIRST NAME</span>
              <strong>{firstName}</strong>
            </div>

            <div className="profile-detail">
              <span>LAST NAME</span>
              <strong>{lastName || "—"}</strong>
            </div>

            <div className="profile-detail">
              <span>EMPLOYEE ID</span>
              <strong>{employee.employeeId}</strong>
            </div>

            <div className="profile-detail">
              <span>WORK EMAIL</span>
              <strong>{employee.email}</strong>
            </div>

            <div className="profile-detail">
              <span>ACCOUNT STATUS</span>
              <strong className="success-detail">
                <CheckCircle2 size={16} />
                Active
              </strong>
            </div>

            <div className="profile-detail">
              <span>PORTAL ROLE</span>
              <strong>
                <BriefcaseBusiness size={16} />
                Employee
              </strong>
            </div>

          </div>

        </section>

        {/* Account shortcuts */}
        <section className="profile-shortcuts">

          <button
            onClick={() => navigate("/employee/settings")}
          >
            <div className="shortcut-icon">
              <Settings size={19} />
            </div>

            <div>
              <strong>Manage your account</strong>
              <span>
                Update your account preferences and profile information.
              </span>
            </div>

            <ChevronRight size={18} />
          </button>

          <button
            onClick={() => navigate("/employee/settings")}
          >
            <div className="shortcut-icon">
              <ShieldCheck size={19} />
            </div>

            <div>
              <strong>Account security</strong>
              <span>
                Review authentication and security information.
              </span>
            </div>

            <ChevronRight size={18} />
          </button>

        </section>

        <div className="profile-footer-note">
          <User size={15} />
          Employee information is managed through your employee account.
        </div>

      </div>
    </div>
  );
}

export default EmployeeProfile;