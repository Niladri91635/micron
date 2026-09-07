import { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { Bell, BriefcaseBusiness, ChevronRight, FileText, LayoutDashboard, LogOut, Menu, Search, Settings, Sparkles, UserRound, Users, X } from "lucide-react";
import { clearHRSession, getHRSession } from "../../services/auth";
import "./HRPortal.css";

const nav = [
  ["Dashboard", "/hr/dashboard", LayoutDashboard],
  ["Candidates", "/hr/candidates", Users],
  ["Jobs", "/hr/jobs", BriefcaseBusiness],
  ["Referrals", "/hr/referrals", FileText],
  ["AI Analysis", "/hr/ai-analysis", Sparkles],
  ["Shortlisted", "/hr/shortlisted", UserRound],
];

export default function HRLayout({ children, title, subtitle }) {
  const navigate = useNavigate();
  const location = useLocation();
  const hr = getHRSession();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const initials = (hr?.name || "HR").split(" ").map(x => x[0]).join("").slice(0, 2).toUpperCase();
  const logout = () => { clearHRSession(); navigate("/hr/login", { replace: true }); };

  const submitSearch = e => {
    e.preventDefault();
    if (query.trim()) navigate(`/hr/candidates?search=${encodeURIComponent(query.trim())}`);
  };

  return <div className="hr-portal">
    {open && <div className="hr-mobile-overlay" onClick={() => setOpen(false)} />}
    <aside className={`hr-sidebar ${open ? "open" : ""}`}>
      <div className="hr-brand"><span className="hr-brand-mark">M</span><div><strong>micron</strong><small>HR Portal</small></div><button className="hr-close" onClick={() => setOpen(false)}><X size={18}/></button></div>
      <div className="hr-nav-label">WORKSPACE</div>
      <nav className="hr-nav">
        {nav.map(([label, path, Icon]) => <NavLink key={path} to={path} onClick={() => setOpen(false)} className={({isActive}) => `hr-nav-item ${isActive || (label === "Candidates" && location.pathname.startsWith("/hr/candidates")) ? "active" : ""}`}><Icon size={17}/><span>{label}</span><ChevronRight size={14} className="hr-nav-arrow"/></NavLink>)}
      </nav>
      <div className="hr-nav-label">ACCOUNT</div>
      <NavLink to="/hr/notifications" className="hr-nav-item" onClick={() => setOpen(false)}><Bell size={17}/><span>Notifications</span></NavLink>
      <NavLink to="/hr/settings" className="hr-nav-item" onClick={() => setOpen(false)}><Settings size={17}/><span>Settings</span></NavLink>
      <div className="hr-sidebar-spacer"/>
      <div className="hr-user-card"><div className="hr-avatar">{initials}</div><div className="hr-user-info"><strong>{hr?.name || "HR Manager"}</strong><span>{hr?.department || "Talent Acquisition"}</span></div><button onClick={logout} title="Sign out"><LogOut size={16}/></button></div>
    </aside>
    <section className="hr-main-area">
      <header className="hr-topbar">
        <button className="hr-menu" onClick={() => setOpen(true)}><Menu size={20}/></button>
        <form className="hr-search" onSubmit={submitSearch}><Search size={16}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search candidates, jobs, referrals..."/><kbd>⌘ K</kbd></form>
        <div className="hr-top-actions"><NavLink to="/hr/notifications" className="hr-icon-btn"><Bell size={18}/><span className="hr-notification-dot"/></NavLink><NavLink to="/hr/profile" className="hr-top-profile"><span className="hr-avatar small">{initials}</span><span>{hr?.name || "HR Manager"}</span></NavLink></div>
      </header>
      <main className="hr-page-content">
        <div className="hr-page-heading"><div><span className="hr-eyebrow">HR RECRUITMENT WORKSPACE</span><h1>{title}</h1>{subtitle && <p>{subtitle}</p>}</div></div>
        {children}
      </main>
    </section>
  </div>;
}
