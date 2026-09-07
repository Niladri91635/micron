import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Upload,
  ArrowLeft,
  ShieldCheck,
} from "lucide-react";

import "./EmployeeLogin.css";
import {
  getDemoEmployeeAccount,
  hashPassword,
  saveDemoEmployeeAccount,
  setEmployeeSession,
} from "../../services/auth";

function EmployeeLogin({ initialMode = "signin" }) {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState(initialMode);

  const [loginData, setLoginData] = useState({
    employeeId: "",
    password: "",
  });

  const [registerData, setRegisterData] = useState({
    employeeId: "",
    email: "",
    firstName: "",
    lastName: "",
    profilePicture: null,
    password: "",
    confirmPassword: "",
  });

  const [profilePreview, setProfilePreview] = useState("");

  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [message, setMessage] = useState({
    type: "",
    text: "",
  });

  /* =========================
     LOGIN
     ========================= */

  const handleLoginChange = (event) => {
    const { name, value } = event.target;

    setLoginData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setMessage({
      type: "",
      text: "",
    });
  };

  const handleLoginSubmit = async (event) => {
    event.preventDefault();

    const employeeId = loginData.employeeId.trim();
    const password = loginData.password;

    if (!employeeId || !password) {
      setMessage({
        type: "error",
        text: "Please enter your Employee ID and password.",
      });
      return;
    }

    const account = getDemoEmployeeAccount();

    if (!account) {
      setMessage({
        type: "error",
        text: "No employee account found. Please create an account first.",
      });
      return;
    }

    const passwordHash = await hashPassword(password);

    if (
      account.employeeId !== employeeId ||
      account.passwordHash !== passwordHash
    ) {
      setMessage({
        type: "error",
        text: "Invalid Employee ID or password.",
      });
      return;
    }

    setEmployeeSession({
      employeeId: account.employeeId,
      email: account.email,
      firstName: account.firstName,
      lastName: account.lastName,
      profilePicture: account.profilePicture,
    });

    setMessage({
      type: "success",
      text: "Login successful. Welcome to the Employee Portal.",
    });

    setTimeout(() => {
      navigate("/employee/dashboard");
    }, 700);
  };

  /* =========================
     REGISTRATION
     ========================= */

  const handleRegisterChange = (event) => {
    const { name, value } = event.target;

    setRegisterData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setMessage({
      type: "",
      text: "",
    });
  };

  /* =========================
     PROFILE PICTURE
     ========================= */

  const handleProfilePicture = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      setMessage({
        type: "error",
        text: "Please upload a JPG, PNG or WEBP image.",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage({
        type: "error",
        text: "Profile picture must be smaller than 5MB.",
      });
      return;
    }

    setRegisterData((previous) => ({
      ...previous,
      profilePicture: file,
    }));

    const reader = new FileReader();

    reader.onloadend = () => {
      setProfilePreview(reader.result);
    };

    reader.readAsDataURL(file);

    setMessage({
      type: "",
      text: "",
    });
  };

  /* =========================
     REGISTER
     ========================= */

  const handleRegisterSubmit = async (event) => {
    event.preventDefault();

    const employeeId = registerData.employeeId.trim();
    const email = registerData.email.trim();
    const firstName = registerData.firstName.trim();
    const lastName = registerData.lastName.trim();

    if (
      !employeeId ||
      !email ||
      !firstName ||
      !lastName ||
      !registerData.password ||
      !registerData.confirmPassword
    ) {
      setMessage({
        type: "error",
        text: "Please complete all required fields.",
      });
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setMessage({
        type: "error",
        text: "Please enter a valid email address.",
      });
      return;
    }

    if (registerData.password.length < 6) {
      setMessage({
        type: "error",
        text: "Password must contain at least 6 characters.",
      });
      return;
    }

    if (
      registerData.password !== registerData.confirmPassword
    ) {
      setMessage({
        type: "error",
        text: "Passwords do not match.",
      });
      return;
    }

    const account = {
      employeeId,
      email,
      firstName,
      lastName,
      passwordHash: await hashPassword(registerData.password),
      profilePicture: profilePreview || "",
    };

    saveDemoEmployeeAccount(account);

    setLoginData({
      employeeId,
      password: "",
    });

    setRegisterData({
      employeeId: "",
      email: "",
      firstName: "",
      lastName: "",
      profilePicture: null,
      password: "",
      confirmPassword: "",
    });

    setProfilePreview("");

    setMessage({
      type: "success",
      text: "Account created successfully. Please sign in.",
    });

    setTimeout(() => {
      setActiveTab("signin");

      setMessage({
        type: "",
        text: "",
      });
    }, 1000);
  };

  /* =========================
     FORGOT PASSWORD
     ========================= */

  const handleForgotPassword = () => {
    setMessage({
      type: "success",
      text: "Password reset instructions will be available soon.",
    });
  };

  /* =========================
     SWITCH LOGIN / REGISTER
     ========================= */

  const switchAuthMode = () => {
    setActiveTab((previous) =>
      previous === "signin" ? "register" : "signin"
    );

    setMessage({
      type: "",
      text: "",
    });
  };

  return (
    <div className="employee-auth-page">

      {/* HEADER */}

      <header className="employee-auth-nav">

        <Link
          to="/"
          className="employee-auth-brand"
        >
          <span className="employee-auth-brand-mark">
            M
          </span>

          <span className="employee-auth-brand-text">
            micron
          </span>
        </Link>

      </header>


      {/* MAIN */}

      <main className="employee-auth-content">

        <div
          className={`employee-auth-card ${
            activeTab === "register"
              ? "registration-card"
              : ""
          }`}
        >

          {/* BACK BUTTON */}

          <Link
            to="/"
            className="auth-card-back"
          >
            <ArrowLeft size={13} />
            <span>Home</span>
          </Link>


          {/* ICON */}

          <div className="auth-icon">

            {activeTab === "signin" ? (
              <ShieldCheck
                size={20}
                strokeWidth={1.8}
              />
            ) : (
              <User
                size={20}
                strokeWidth={1.8}
              />
            )}

          </div>


          {/* HEADING */}

          <div className="auth-card-heading">

            <div className="auth-eyebrow">
              EMPLOYEE PORTAL
            </div>

            <h1>
              {activeTab === "signin"
                ? "Welcome back."
                : "Create your account."}
            </h1>

            <p>
              {activeTab === "signin"
                ? "Sign in to manage your employee referrals."
                : "Create your employee account to access referrals."}
            </p>

          </div>


          {/* MESSAGE */}

          {message.text && (
            <div
              className={`auth-message ${message.type}`}
              role="alert"
            >
              {message.text}
            </div>
          )}


          {/* =========================
              SIGN IN
          ========================= */}

          {activeTab === "signin" && (

            <form
              className="auth-form"
              onSubmit={handleLoginSubmit}
            >

              {/* Employee ID */}

              <div className="form-field">

                <label htmlFor="login-employee-id">
                  Employee ID
                </label>

                <div className="input-wrapper">

                  <User size={15} />

                  <input
                    id="login-employee-id"
                    name="employeeId"
                    type="text"
                    placeholder="Enter your employee ID"
                    value={loginData.employeeId}
                    onChange={handleLoginChange}
                    autoComplete="username"
                  />

                </div>

              </div>


              {/* Password */}

              <div className="form-field">

                <div className="password-label-row">

                  <label htmlFor="login-password">
                    Password
                  </label>

                  <button
                    type="button"
                    className="forgot-password"
                    onClick={handleForgotPassword}
                  >
                    Forgot password?
                  </button>

                </div>


                <div className="input-wrapper">

                  <Lock size={15} />

                  <input
                    id="login-password"
                    name="password"
                    type={
                      showLoginPassword
                        ? "text"
                        : "password"
                    }
                    placeholder="Enter your password"
                    value={loginData.password}
                    onChange={handleLoginChange}
                    autoComplete="current-password"
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() =>
                      setShowLoginPassword(
                        (previous) => !previous
                      )
                    }
                  >
                    {showLoginPassword ? (
                      <EyeOff size={15} />
                    ) : (
                      <Eye size={15} />
                    )}
                  </button>

                </div>

              </div>


              {/* Secure information */}

              <div className="auth-login-options">

                <span>
                  Employee access
                </span>

                <span className="secure-label">

                  <ShieldCheck size={12} />

                  Secure portal

                </span>

              </div>


              {/* Submit */}

              <button
                type="submit"
                className="auth-submit-button"
              >
                Sign In
              </button>

            </form>
          )}


          {/* =========================
              REGISTER
          ========================= */}

          {activeTab === "register" && (

            <form
              className="auth-form registration-form"
              onSubmit={handleRegisterSubmit}
            >

              {/* Employee ID + Email */}

              <div className="form-grid">

                <div className="form-field">

                  <label htmlFor="employee-id">
                    Employee ID
                  </label>

                  <div className="input-wrapper">

                    <User size={15} />

                    <input
                      id="employee-id"
                      name="employeeId"
                      type="text"
                      placeholder="Employee ID"
                      value={registerData.employeeId}
                      onChange={handleRegisterChange}
                    />

                  </div>

                </div>


                <div className="form-field">

                  <label htmlFor="email">
                    Email ID
                  </label>

                  <div className="input-wrapper">

                    <Mail size={15} />

                    <input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Work email"
                      value={registerData.email}
                      onChange={handleRegisterChange}
                    />

                  </div>

                </div>

              </div>


              {/* First Name + Last Name */}

              <div className="form-grid">

                <div className="form-field">

                  <label htmlFor="first-name">
                    First Name
                  </label>

                  <div className="input-wrapper">

                    <User size={15} />

                    <input
                      id="first-name"
                      name="firstName"
                      type="text"
                      placeholder="First name"
                      value={registerData.firstName}
                      onChange={handleRegisterChange}
                    />

                  </div>

                </div>


                <div className="form-field">

                  <label htmlFor="last-name">
                    Last Name
                  </label>

                  <div className="input-wrapper">

                    <User size={15} />

                    <input
                      id="last-name"
                      name="lastName"
                      type="text"
                      placeholder="Last name"
                      value={registerData.lastName}
                      onChange={handleRegisterChange}
                    />

                  </div>

                </div>

              </div>


              {/* Profile Picture */}

              <div className="form-field">

                <label>
                  Profile Picture

                  <span className="optional-label">
                    Optional
                  </span>
                </label>

                <div className="profile-upload-area">

                  <div className="profile-avatar">

                    {profilePreview ? (

                      <img
                        src={profilePreview}
                        alt="Profile preview"
                        className="profile-preview"
                      />

                    ) : (

                      <User size={18} />

                    )}

                  </div>


                  <div className="profile-upload-content">

                    <label
                      htmlFor="profile-picture"
                      className="upload-action"
                    >

                      <Upload size={13} />

                      <span>
                        {profilePreview
                          ? "Change picture"
                          : "Upload picture"}
                      </span>

                    </label>

                    <span className="upload-info">
                      JPG, PNG or WEBP · Max 5MB
                    </span>

                    <input
                      id="profile-picture"
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleProfilePicture}
                    />

                  </div>

                </div>

              </div>


              {/* Password + Confirm Password */}

              <div className="form-grid">

                <div className="form-field">

                  <label htmlFor="register-password">
                    Password
                  </label>

                  <div className="input-wrapper">

                    <Lock size={15} />

                    <input
                      id="register-password"
                      name="password"
                      type={
                        showRegisterPassword
                          ? "text"
                          : "password"
                      }
                      placeholder="Create password"
                      value={registerData.password}
                      onChange={handleRegisterChange}
                    />

                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() =>
                        setShowRegisterPassword(
                          (previous) => !previous
                        )
                      }
                    >
                      {showRegisterPassword ? (
                        <EyeOff size={15} />
                      ) : (
                        <Eye size={15} />
                      )}
                    </button>

                  </div>

                </div>


                <div className="form-field">

                  <label htmlFor="confirm-password">
                    Confirm Password
                  </label>

                  <div className="input-wrapper">

                    <Lock size={15} />

                    <input
                      id="confirm-password"
                      name="confirmPassword"
                      type={
                        showConfirmPassword
                          ? "text"
                          : "password"
                      }
                      placeholder="Confirm password"
                      value={registerData.confirmPassword}
                      onChange={handleRegisterChange}
                    />

                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() =>
                        setShowConfirmPassword(
                          (previous) => !previous
                        )
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={15} />
                      ) : (
                        <Eye size={15} />
                      )}
                    </button>

                  </div>

                </div>

              </div>


              {/* Create Account */}

              <button
                type="submit"
                className="auth-submit-button"
              >
                Create Employee Account
              </button>

            </form>
          )}


          {/* SWITCH */}

          <div className="auth-switch">

            <span>
              {activeTab === "signin"
                ? "Don't have an employee account?"
                : "Already have an account?"}
            </span>

            <button
              type="button"
              onClick={switchAuthMode}
            >
              {activeTab === "signin"
                ? "Create account"
                : "Sign in"}
            </button>

          </div>

        </div>

      </main>

    </div>
  );
}


/* =====================================================
   IMPORTANT
   ===================================================== */

export default EmployeeLogin;