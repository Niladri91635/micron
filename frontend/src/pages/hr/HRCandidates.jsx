import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowUpRight, CheckCircle2, Download, Filter, Search, Sparkles } from "lucide-react";
import HRLayout from "./HRLayout";
import { getCandidates, saveCandidates } from "./HRData";

export default function HRCandidates(){
 const [params]=useSearchParams(); const [query,setQuery]=useState(params.get("search")||""); const [status,setStatus]=useState("ALL"); const [candidates]=useState(() => getCandidates());
 const filtered=useMemo(()=>candidates.filter(c=>(status==="ALL"||c.status===status)&&`${c.name} ${c.email} ${c.job} ${c.skills.join(" ")}`.toLowerCase().includes(query.toLowerCase())),[candidates,query,status]);

 return <HRLayout title="Candidates" subtitle="Review every applicant, referral and AI score from one workspace.">
  <div className="hr-toolbar"><div className="hr-local-search"><Search size={16}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search candidates..."/></div><select value={status} onChange={e=>setStatus(e.target.value)}><option value="ALL">All statuses</option><option value="NEW">New</option><option value="UNDER_REVIEW">Under review</option><option value="SHORTLISTED">Shortlisted</option><option value="REJECTED">Rejected</option></select><button className="hr-outline-btn"><Filter size={15}/> Filters</button><button className="hr-outline-btn"><Download size={15}/> Export</button></div>
  <div className="hr-table-wrap"><table className="hr-table"><thead><tr><th>Candidate</th><th>Position</th><th>AI score</th><th>Source</th><th>Status</th><th>Updated</th><th/></tr></thead><tbody>{filtered.map(c=><tr key={c.id}><td><div className="hr-table-person"><div className="hr-candidate-avatar">{c.name.split(" ").map(x=>x[0]).join("")}</div><div><strong>{c.name}</strong><span>{c.email}</span></div></div></td><td><strong>{c.job}</strong><span className="hr-cell-sub">{c.experience}</span></td><td><span className={`hr-score ${c.score>=85?"high":c.score>=75?"mid":"low"}`}><Sparkles size={13}/>{c.score}%</span></td><td>{c.source}</td><td><span className={`hr-status ${c.status.toLowerCase()}`}>{c.status.replace("_"," ")}</span></td><td>{c.updated}</td><td><Link className="hr-row-link" to={`/hr/candidates/${c.id}`}>View <ArrowUpRight size={14}/></Link></td></tr>)}</tbody></table>{!filtered.length&&<div className="hr-empty">No candidates match your filters.</div>}</div>
  <div className="hr-note"><CheckCircle2 size={17}/><span>Click a candidate to see profile, skills, referral context and hiring actions.</span></div>
 </HRLayout>
}
