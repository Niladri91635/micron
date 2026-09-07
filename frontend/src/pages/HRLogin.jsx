import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock, Eye, EyeOff, ArrowLeft, ShieldCheck, BriefcaseBusiness } from "lucide-react";
import "./employee/EmployeeLogin.css";
import "./HRLogin.css";
import { getDemoHRAccount, hashPassword, saveDemoHRAccount, setHRSession } from "../services/auth";

function HRLogin({ initialMode = "signin" }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(initialMode);
  const [loginData, setLoginData] = useState({ hrId: "", password: "" });
  const [registerData, setRegisterData] = useState({ hrId: "", email: "", firstName: "", lastName: "", department: "", password: "", confirmPassword: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const clearMessage = () => setMessage({ type: "", text: "" });
  const updateLogin = ({ target }) => { setLoginData(p => ({ ...p, [target.name]: target.value })); clearMessage(); };
  const updateRegister = ({ target }) => { setRegisterData(p => ({ ...p, [target.name]: target.value })); clearMessage(); };

  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    const hrId = loginData.hrId.trim();
    if (!hrId || !loginData.password) return setMessage({ type: "error", text: "Please enter your HR ID and password." });
    const account = getDemoHRAccount();
    if (!account) return setMessage({ type: "error", text: "No HR account found. Please create an account first." });
    const passwordHash = await hashPassword(loginData.password);
    if (account.hrId !== hrId || account.passwordHash !== passwordHash) return setMessage({ type: "error", text: "Invalid HR ID or password." });
    setHRSession({ hrId: account.hrId, email: account.email, name: `${account.firstName} ${account.lastName}`.trim(), role: "HR Manager", department: account.department });
    setMessage({ type: "success", text: "Login successful. Welcome to the HR Portal." });
    setTimeout(() => navigate("/hr/dashboard", { replace: true }), 500);
  };

  const handleRegisterSubmit = async (event) => {
    event.preventDefault();
    const hrId = registerData.hrId.trim();
    const email = registerData.email.trim();
    const firstName = registerData.firstName.trim();
    const lastName = registerData.lastName.trim();
    const department = registerData.department.trim();
    if (!hrId || !email || !firstName || !lastName || !department || !registerData.password || !registerData.confirmPassword) return setMessage({ type: "error", text: "Please complete all required fields." });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setMessage({ type: "error", text: "Please enter a valid work email address." });
    if (registerData.password.length < 6) return setMessage({ type: "error", text: "Password must contain at least 6 characters." });
    if (registerData.password !== registerData.confirmPassword) return setMessage({ type: "error", text: "Passwords do not match." });
    const account = { hrId, email, firstName, lastName, department, passwordHash: await hashPassword(registerData.password) };
    saveDemoHRAccount(account);
    setLoginData({ hrId, password: "" });
    setRegisterData({ hrId: "", email: "", firstName: "", lastName: "", department: "", password: "", confirmPassword: "" });
    setMessage({ type: "success", text: "HR account created successfully. Please sign in." });
    setTimeout(() => { setActiveTab("signin"); clearMessage(); }, 900);
  };

  const switchMode = () => { setActiveTab(p => p === "signin" ? "register" : "signin"); clearMessage(); };

  return (
    <div className="employee-auth-page">
      <header className="employee-auth-nav"><Link to="/" className="employee-auth-brand"><span className="employee-auth-brand-mark">M</span><span className="employee-auth-brand-text">micron</span></Link></header>
      <main className="employee-auth-content">
        <div className={`employee-auth-card ${activeTab === "register" ? "registration-card" : ""}`}>
          <Link to="/login" className="auth-card-back"><ArrowLeft size={13} /> <span>Portals</span></Link>
          <div className="auth-icon">{activeTab === "signin" ? <ShieldCheck size={20} /> : <BriefcaseBusiness size={20} />}</div>
          <div className="auth-card-heading">
            <div className="auth-eyebrow">HR PORTAL</div>
            <h1>{activeTab === "signin" ? "Welcome back." : "Create your account."}</h1>
            <p>{activeTab === "signin" ? "Sign in to manage candidates and referral operations." : "Create an HR account to access the recruitment workspace."}</p>
          </div>
          {message.text && <div className={`auth-message ${message.type}`} role="alert">{message.text}</div>}

          {activeTab === "signin" ? (
            <form className="auth-form" onSubmit={handleLoginSubmit}>
              <div className="form-field"><label htmlFor="hr-id">HR ID</label><div className="input-wrapper"><User size={15}/><input id="hr-id" name="hrId" value={loginData.hrId} onChange={updateLogin} placeholder="Enter your HR ID" autoComplete="username" /></div></div>
              <div className="form-field"><div className="password-label-row"><label htmlFor="hr-password">Password</label><button type="button" className="forgot-password" onClick={() => setMessage({ type: "success", text: "Password reset can be connected to the backend later." })}>Forgot password?</button></div><div className="input-wrapper"><Lock size={15}/><input id="hr-password" name="password" type={showPassword ? "text" : "password"} value={loginData.password} onChange={updateLogin} placeholder="Enter your password" autoComplete="current-password"/><button type="button" className="password-toggle" onClick={() => setShowPassword(p => !p)}>{showPassword ? <EyeOff size={15}/> : <Eye size={15}/>}</button></div></div>
              <div className="auth-login-options"><span>HR access</span><span className="secure-label"><ShieldCheck size={12}/> Secure portal</span></div>
              <button type="submit" className="auth-submit-button">Sign In</button>
            </form>
          ) : (
            <form className="auth-form register-form" onSubmit={handleRegisterSubmit}>
              <div className="registration-grid">
                <div className="form-field"><label>HR ID *</label><div className="input-wrapper"><User size={15}/><input name="hrId" value={registerData.hrId} onChange={updateRegister} placeholder="e.g. HR001" /></div></div>
                <div className="form-field"><label>Work email *</label><div className="input-wrapper"><Mail size={15}/><input name="email" type="email" value={registerData.email} onChange={updateRegister} placeholder="hr@company.com" /></div></div>
                <div className="form-field"><label>First name *</label><div className="input-wrapper"><User size={15}/><input name="firstName" value={registerData.firstName} onChange={updateRegister} placeholder="First name" /></div></div>
                <div className="form-field"><label>Last name *</label><div className="input-wrapper"><User size={15}/><input name="lastName" value={registerData.lastName} onChange={updateRegister} placeholder="Last name" /></div></div>
                <div className="form-field full-field"><label>Department *</label><div className="input-wrapper"><BriefcaseBusiness size={15}/><input name="department" value={registerData.department} onChange={updateRegister} placeholder="e.g. Talent Acquisition" /></div></div>
                <div className="form-field"><label>Password *</label><div className="input-wrapper"><Lock size={15}/><input name="password" type={showRegisterPassword ? "text" : "password"} value={registerData.password} onChange={updateRegister} placeholder="Minimum 6 characters"/><button type="button" className="password-toggle" onClick={() => setShowRegisterPassword(p => !p)}>{showRegisterPassword ? <EyeOff size={15}/> : <Eye size={15}/>}</button></div></div>
                <div className="form-field"><label>Confirm password *</label><div className="input-wrapper"><Lock size={15}/><input name="confirmPassword" type={showConfirmPassword ? "text" : "password"} value={registerData.confirmPassword} onChange={updateRegister} placeholder="Repeat password"/><button type="button" className="password-toggle" onClick={() => setShowConfirmPassword(p => !p)}>{showConfirmPassword ? <EyeOff size={15}/> : <Eye size={15}/>}</button></div></div>
              </div>
              <div className="auth-login-options"><span>HR registration</span><span className="secure-label"><ShieldCheck size={12}/> Protected workspace</span></div>
              <button type="submit" className="auth-submit-button">Create HR Account</button>
            </form>
          )}

          <div className="auth-switch"><span>{activeTab === "signin" ? "Don't have an HR account?" : "Already have an HR account?"}</span><button type="button" onClick={switchMode}>{activeTab === "signin" ? "Create HR account" : "Sign in"}</button></div>
          <div className="auth-switch"><span>Employee?</span><button type="button" onClick={() => navigate("/employee/login")}>Employee Login</button></div>
        </div>
      </main>
    </div>
  );
}

export default HRLogin;
