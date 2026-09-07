import { ArrowLeft, ArrowRight, BriefcaseBusiness, ShieldCheck } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import "./LoginSelection.css";

function LoginSelection() {
  const navigate = useNavigate();

  return (
    <div className="login-selection-page">
      <header className="login-selection-nav">
        <Link to="/" className="login-selection-brand" aria-label="Back to Micron home">
          <span className="login-selection-brand-mark">M</span>
          <span>micron</span>
        </Link>
      </header>

      <main className="login-selection-main">
        <button type="button" className="login-selection-back" onClick={() => navigate("/")}>
          <ArrowLeft size={15} />
          Back to home
        </button>

        <div className="login-selection-heading">
          <span className="login-selection-eyebrow">MICRON REFERRAL PLATFORM</span>
          <h1>Choose your portal.</h1>
          <p>Select how you want to continue. Employees can submit and track referrals, while HR can manage candidates and referral operations.</p>
        </div>

        <section className="login-selection-grid" aria-label="Login options">
          <button type="button" className="login-role-card" onClick={() => navigate("/employee/login")}>
            <div className="login-role-icon"><BriefcaseBusiness size={23} /></div>
            <div className="login-role-copy">
              <span>EMPLOYEE PORTAL</span>
              <h2>Employee login</h2>
              <p>Refer candidates, view your referrals and manage your employee profile.</p>
            </div>
            <span className="login-role-action">Continue <ArrowRight size={16} /></span>
            <span className="login-role-register" onClick={(event) => { event.stopPropagation(); navigate("/employee/register"); }}>Create employee account</span>
          </button>

          <button type="button" className="login-role-card" onClick={() => navigate("/hr/login")}>
            <div className="login-role-icon"><ShieldCheck size={23} /></div>
            <div className="login-role-copy">
              <span>HR PORTAL</span>
              <h2>HR login</h2>
              <p>Review candidates, manage referral activity and handle HR operations.</p>
            </div>
            <span className="login-role-action">Continue <ArrowRight size={16} /></span>
            <span className="login-role-register" onClick={(event) => { event.stopPropagation(); navigate("/hr/register"); }}>Create HR account</span>
          </button>
        </section>
      </main>
    </div>
  );
}

export default LoginSelection;
