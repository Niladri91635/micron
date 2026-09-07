import { useState } from "react";
import { ArrowLeft, CheckCircle2, FileText, Mail, Phone, Send, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import apiClient from "../../services/apiClients";
import { getEmployeeSession } from "../../services/auth";
import "./EmployeeReferral.css";

const initialForm = {
  candidateName: "",
  candidateEmail: "",
  candidatePhone: "",
  jobTitle: "",
  resumeUrl: "",
  note: "",
};

function EmployeeReferral() {
  const navigate = useNavigate();
  const employee = getEmployeeSession();
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState({ type: "", text: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = ({ target }) => {
    setForm((previous) => ({ ...previous, [target.name]: target.value }));
    setStatus({ type: "", text: "" });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!employee) {
      navigate("/employee/login", { replace: true });
      return;
    }

    if (!form.candidateName.trim() || !form.candidateEmail.trim() || !form.jobTitle.trim()) {
      setStatus({ type: "error", text: "Candidate name, email and job title are required." });
      return;
    }

    setSubmitting(true);

    try {
      await apiClient.post("/referrals", {
        employeeId: employee.employeeId,
        candidateName: form.candidateName.trim(),
        candidateEmail: form.candidateEmail.trim(),
        candidatePhone: form.candidatePhone.trim() || null,
        jobTitle: form.jobTitle.trim(),
        resumeUrl: form.resumeUrl.trim() || null,
        note: form.note.trim() || null,
      });

      setForm(initialForm);
      setStatus({ type: "success", text: "Referral submitted successfully." });
    } catch (error) {
      setStatus({
        type: "error",
        text: error.message || "Unable to submit referral. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="referral-page">
      <header className="referral-header">
        <button type="button" className="referral-back" onClick={() => navigate("/employee/dashboard")}>
          <ArrowLeft size={16} /> Back to dashboard
        </button>
        <div className="referral-brand"><span>M</span> micron</div>
      </header>

      <section className="referral-shell">
        <div className="referral-intro">
          <span className="referral-eyebrow">EMPLOYEE REFERRAL</span>
          <h1>Refer someone exceptional.</h1>
          <p>Share a candidate with HR. The backend can attach the referral to the employee and track its status.</p>
        </div>

        <form className="referral-card" onSubmit={handleSubmit}>
          <div className="referral-card-heading">
            <div className="referral-icon"><UserPlus size={19} /></div>
            <div><h2>Candidate details</h2><p>Fields marked with * are required.</p></div>
          </div>

          {status.text && (
            <div className={`referral-message ${status.type}`} role="alert">
              {status.type === "success" ? <CheckCircle2 size={16} /> : null}
              {status.text}
            </div>
          )}

          <div className="referral-grid">
            <label>Candidate name *<input name="candidateName" value={form.candidateName} onChange={handleChange} placeholder="Full name" autoComplete="name" /></label>
            <label>Email *<span className="input-with-icon"><Mail size={15} /><input name="candidateEmail" type="email" value={form.candidateEmail} onChange={handleChange} placeholder="candidate@example.com" autoComplete="email" /></span></label>
            <label>Phone<span className="input-with-icon"><Phone size={15} /><input name="candidatePhone" value={form.candidatePhone} onChange={handleChange} placeholder="Optional" autoComplete="tel" /></span></label>
            <label>Job title *<input name="jobTitle" value={form.jobTitle} onChange={handleChange} placeholder="e.g. Java Developer" /></label>
            <label className="full-width">Resume URL<span className="input-with-icon"><FileText size={15} /><input name="resumeUrl" type="url" value={form.resumeUrl} onChange={handleChange} placeholder="https://..." /></span></label>
            <label className="full-width">Message to HR<textarea name="note" value={form.note} onChange={handleChange} rows="5" maxLength="1000" placeholder="Why would this candidate be a good fit?" /></label>
          </div>

          <div className="referral-actions">
            <button type="button" className="referral-cancel" onClick={() => navigate("/employee/dashboard")}>Cancel</button>
            <button type="submit" className="referral-submit" disabled={submitting}>
              <Send size={15} /> {submitting ? "Submitting…" : "Submit referral"}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}

export default EmployeeReferral;
