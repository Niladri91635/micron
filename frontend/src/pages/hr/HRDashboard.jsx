import { Link } from "react-router-dom";
import { ArrowUpRight, BriefcaseBusiness, FileText, Sparkles, UserCheck, Users } from "lucide-react";
import HRLayout from "./HRLayout";
import { getCandidates, getJobs } from "./HRData";

export default function HRDashboard(){
 const candidates=getCandidates(); const jobs=getJobs();
 const shortlisted=candidates.filter(c=>c.status==="SHORTLISTED").length;
 return <HRLayout title="Welcome back." subtitle="Here is what is happening across your recruitment workspace today.">
  <div className="hr-hero-banner"><div><span className="hr-status-pill"><span/> SYSTEM ONLINE</span><h2>Build great teams with better decisions.</h2><p>Review referrals, use AI-assisted screening and keep every candidate moving.</p></div><Link to="/hr/candidates" className="hr-primary-btn">Review candidates <ArrowUpRight size={16}/></Link></div>
  <div className="hr-stat-grid">
   <Stat icon={Users} label="Total Candidates" value={candidates.length} note="Across active roles"/>
   <Stat icon={BriefcaseBusiness} label="Active Jobs" value={jobs.length} note="Currently hiring"/>
   <Stat icon={Sparkles} label="AI Analysed" value={87} note="This month"/>
   <Stat icon={UserCheck} label="Shortlisted" value={shortlisted} note="Ready for next step"/>
  </div>
  <div className="hr-two-col">
   <section className="hr-panel"><PanelHead title="Recent candidates" action="View all" to="/hr/candidates"/>{candidates.slice(0,5).map(c=><div className="hr-list-row" key={c.id}><div className="hr-candidate-avatar">{c.name.split(" ").map(x=>x[0]).join("")}</div><div className="hr-list-main"><strong>{c.name}</strong><span>{c.job} · {c.source}</span></div><span className={`hr-status ${c.status.toLowerCase()}`}>{c.status.replace("_"," ")}</span><span className="hr-muted">{c.updated}</span></div>)}</section>
   <section className="hr-panel"><PanelHead title="Hiring snapshot" action="Manage jobs" to="/hr/jobs"/><div className="hr-role-list">{jobs.map(j=><div className="hr-role" key={j.id}><div><strong>{j.title}</strong><span>{j.department} · {j.location}</span></div><b>{j.applicants}</b></div>)}</div><div className="hr-insight"><Sparkles size={18}/><div><strong>AI insight</strong><p>Java Developer is currently the highest-volume role. Prioritize the 2 candidates scoring above 85.</p></div></div></section>
  </div>
  <section className="hr-panel"><PanelHead title="Quick actions"/><div className="hr-quick-grid"><Quick to="/hr/candidates" icon={Users} title="Review candidates" text="Screen and update candidate status"/><Quick to="/hr/referrals" icon={FileText} title="Review referrals" text="See employee referral submissions"/><Quick to="/hr/ai-analysis" icon={Sparkles} title="Run AI analysis" text="Compare skills against job requirements"/><Quick to="/hr/jobs" icon={BriefcaseBusiness} title="Manage jobs" text="Create and manage open positions"/></div></section>
 </HRLayout>
}
function Stat({icon:Icon,label,value,note}){return <div className="hr-stat-card"><div className="hr-stat-icon"><Icon size={19}/></div><span>{label}</span><strong>{value}</strong><small>{note}</small></div>}
function PanelHead({title,action,to}){return <div className="hr-panel-head"><h3>{title}</h3>{action&&<Link to={to}>{action} <ArrowUpRight size={14}/></Link>}</div>}
function Quick({to,icon:Icon,title,text}){return <Link to={to} className="hr-quick"><div><Icon size={18}/></div><span><strong>{title}</strong><small>{text}</small></span><ArrowUpRight size={15}/></Link>}
