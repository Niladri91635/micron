const CANDIDATE_KEY = "micronHrCandidates";
const JOB_KEY = "micronHrJobs";

export const demoCandidates = [
 {id:101,name:"Rahul Sharma",email:"rahul.sharma@email.com",phone:"+91 98765 43210",job:"Java Developer",experience:"4 yrs",score:92,status:"SHORTLISTED",source:"Employee Referral",referrer:"Aarav Mehta",updated:"2 mins ago",skills:["Java","Spring Boot","SQL"]},
 {id:102,name:"Priya Singh",email:"priya.singh@email.com",phone:"+91 98765 12345",job:"Data Analyst",experience:"3 yrs",score:88,status:"UNDER_REVIEW",source:"Employee Referral",referrer:"Neha Kapoor",updated:"15 mins ago",skills:["Python","SQL","Power BI"]},
 {id:103,name:"Aman Kumar",email:"aman.kumar@email.com",phone:"+91 99887 66554",job:"Java Developer",experience:"5 yrs",score:86,status:"SHORTLISTED",source:"Employee Referral",referrer:"Rohit Kumar",updated:"1 hour ago",skills:["Java","Spring","AWS"]},
 {id:104,name:"Neha Gupta",email:"neha.gupta@email.com",phone:"+91 91234 56789",job:"Product Manager",experience:"6 yrs",score:81,status:"NEW",source:"Employee Referral",referrer:"Vikram Rao",updated:"2 hours ago",skills:["Product","Agile","Analytics"]},
 {id:105,name:"Vikram Rao",email:"vikram.rao@email.com",phone:"+91 90123 45678",job:"DevOps Engineer",experience:"4 yrs",score:79,status:"UNDER_REVIEW",source:"Direct Application",referrer:"—",updated:"3 hours ago",skills:["AWS","Docker","Kubernetes"]},
 {id:106,name:"Anjali Verma",email:"anjali.verma@email.com",phone:"+91 90909 10101",job:"Software Engineer",experience:"2 yrs",score:74,status:"NEW",source:"Employee Referral",referrer:"Aarav Mehta",updated:"5 hours ago",skills:["Java","React","SQL"]}
];
export const demoJobs = [
 {id:"JOB-101",title:"Java Developer",department:"Engineering",location:"Bengaluru",type:"Full-time",openings:4,status:"OPEN",applicants:28},
 {id:"JOB-102",title:"Data Analyst",department:"Data & AI",location:"Hyderabad",type:"Full-time",openings:3,status:"OPEN",applicants:17},
 {id:"JOB-103",title:"Product Manager",department:"Product",location:"Pune",type:"Full-time",openings:2,status:"OPEN",applicants:12},
 {id:"JOB-104",title:"DevOps Engineer",department:"Infrastructure",location:"Bengaluru",type:"Full-time",openings:2,status:"OPEN",applicants:9}
];
function read(key,fallback){try{const v=localStorage.getItem(key);return v?JSON.parse(v):fallback}catch{return fallback}}
export function getCandidates(){return read(CANDIDATE_KEY,demoCandidates)}
export function saveCandidates(value){localStorage.setItem(CANDIDATE_KEY,JSON.stringify(value))}
export function getJobs(){return read(JOB_KEY,demoJobs)}
export function saveJobs(value){localStorage.setItem(JOB_KEY,JSON.stringify(value))}
