import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ChevronRight, Clock3, Search, UserCheck, UserRound, XCircle, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import apiClient from "../../services/apiClients";
import { getEmployeeSession } from "../../services/auth";
import "./EmployeeReferrals.css";

const demoReferrals = [
  { id: "REF-1001", candidateName: "Rahul Sharma", jobTitle: "Java Developer", status: "UNDER_REVIEW", updatedAt: "Today", note: "Strong backend experience and Spring Boot background." },
  { id: "REF-1002", candidateName: "Priya Singh", jobTitle: "Software Engineer", status: "SHORTLISTED", updatedAt: "Yesterday", note: "Excellent problem-solving and systems experience." },
  { id: "REF-1003", candidateName: "Aman Kumar", jobTitle: "Cloud Engineer", status: "SUBMITTED", updatedAt: "3 days ago", note: "AWS and infrastructure experience." },
];

const statusMeta = {
  SUBMITTED: ["Submitted", "submitted"],
  UNDER_REVIEW: ["Under review", "review"],
  SHORTLISTED: ["Shortlisted", "shortlisted"],
  INTERVIEW: ["Interview", "interview"],
  HIRED: ["Hired", "hired"],
  REJECTED: ["Not selected", "rejected"],
};

function EmployeeReferrals() {
  const navigate = useNavigate();
  const employee = getEmployeeSession();
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    if (!employee) { navigate("/employee/login", { replace: true }); return; }
    let mounted = true;
    apiClient.get("/referrals/mine")
      .then(data => { if (mounted) setReferrals(Array.isArray(data) ? data : data?.content || []); })
      .catch(() => { if (mounted) setReferrals(demoReferrals); })
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, [employee, navigate]);

  const filtered = useMemo(() => referrals.filter(item => {
    const matchesFilter = filter === "ALL" || item.status === filter;
    const text = `${item.candidateName || ""} ${item.jobTitle || ""} ${item.id || ""}`.toLowerCase();
    return matchesFilter && text.includes(query.toLowerCase());
  }), [referrals, filter, query]);

  return <main className="referrals-page">
    <header className="referrals-header"><button onClick={() => navigate("/employee/dashboard")} className="referrals-back"><ArrowLeft size={16}/> Back to dashboard</button><div className="referrals-brand"><span>M</span> micron</div></header>
    <section className="referrals-shell">
      <div className="referrals-title-row"><div><span className="referrals-eyebrow">EMPLOYEE REFERRALS</span><h1>My referrals.</h1><p>Track every candidate you have shared with Micron and follow their progress.</p></div><button className="new-referral-button" onClick={() => navigate("/employee/refer")}><UserRound size={16}/> Refer candidate</button></div>
      <div className="referrals-toolbar"><div className="referrals-search"><Search size={16}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search candidates or roles..."/>{query && <button onClick={() => setQuery("")}><XCircle size={15}/></button>}</div><select value={filter} onChange={e => setFilter(e.target.value)}><option value="ALL">All statuses</option><option value="SUBMITTED">Submitted</option><option value="UNDER_REVIEW">Under review</option><option value="SHORTLISTED">Shortlisted</option><option value="INTERVIEW">Interview</option><option value="HIRED">Hired</option><option value="REJECTED">Not selected</option></select></div>
      <section className="referrals-card"><div className="referrals-card-head"><div><span>REFERRAL PIPELINE</span><h2>{filtered.length} {filtered.length === 1 ? "candidate" : "candidates"}</h2></div><span className="referrals-live"><span></span> Live status</span></div>
        {loading ? <div className="referrals-empty"><Clock3 size={24}/><h3>Loading referrals…</h3></div> : filtered.length === 0 ? <div className="referrals-empty"><UserCheck size={24}/><h3>No referrals found</h3><p>Try another search or submit your first referral.</p><button onClick={() => navigate("/employee/refer")}>Submit a referral</button></div> : <div className="referrals-list">{filtered.map(item => { const meta = statusMeta[item.status] || [item.status || "Unknown", "submitted"]; return <button className="referral-row" key={item.id} onClick={() => navigate(`/employee/referrals/${encodeURIComponent(item.id)}`, { state: { referral: item } })}><div className="referral-avatar">{(item.candidateName || "C").split(" ").map(x => x[0]).join("").slice(0,2).toUpperCase()}</div><div className="referral-main"><strong>{item.candidateName || "Unnamed candidate"}</strong><span>{item.jobTitle || "Role not specified"}</span><small>{item.id || "Referral"} · Updated {item.updatedAt || "recently"}</small></div><span className={`referral-status ${meta[1]}`}>{meta[0]}</span><ChevronRight size={17}/></button>})}</div>}
      </section>
    </section>
  </main>;
}
export default EmployeeReferrals;
