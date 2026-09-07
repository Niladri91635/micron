import { BrowserRouter, Route, Routes } from "react-router-dom";

import Landing from "./pages/Landing";
import LoginSelection from "./pages/LoginSelection";
import HRLogin from "./pages/HRLogin";
import HRDashboard from "./pages/hr/HRDashboard";
import HRCandidates from "./pages/hr/HRCandidates";
import CandidateDetails from "./pages/hr/CandidateDetails";
import HRJobs from "./pages/hr/HRJobs";
import HRReferrals from "./pages/hr/HRReferrals";
import HRAIAnalysis from "./pages/hr/HRAIAnalysis";
import HRShortlisted from "./pages/hr/HRShortlisted";
import HRProfile from "./pages/hr/HRProfile";
import HRNotifications from "./pages/hr/HRNotifications";
import HRSettings from "./pages/hr/HRSettings";
import EmployeeLogin from "./pages/employee/EmployeeLogin";
import EmployeeReferrals from "./pages/employee/EmployeeReferrals";
import ReferralDetails from "./pages/employee/ReferralDetails";
import EmployeeDashboard from "./pages/employee/EmployeeDashboard";
import EmployeeNotifications from "./pages/employee/EmployeeNotifications";
import EmployeeProfile from "./pages/employee/EmployeeProfile";
import EmployeeSettings from "./pages/employee/EmployeeSettings";
import EmployeeReferral from "./pages/employee/EmployeeReferral";
import ProtectedRoute from "./components/ProtectedRoute";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<LoginSelection />} />

        <Route path="/hr/login" element={<HRLogin />} />
        <Route path="/hr/register" element={<HRLogin initialMode="register" />} />
        <Route element={<ProtectedRoute role="hr" />}>
          <Route path="/hr/dashboard" element={<HRDashboard />} />
          <Route path="/hr/candidates" element={<HRCandidates />} />
          <Route path="/hr/candidates/:id" element={<CandidateDetails />} />
          <Route path="/hr/jobs" element={<HRJobs />} />
          <Route path="/hr/referrals" element={<HRReferrals />} />
          <Route path="/hr/ai-analysis" element={<HRAIAnalysis />} />
          <Route path="/hr/shortlisted" element={<HRShortlisted />} />
          <Route path="/hr/profile" element={<HRProfile />} />
          <Route path="/hr/notifications" element={<HRNotifications />} />
          <Route path="/hr/settings" element={<HRSettings />} />
        </Route>

        <Route path="/employee/login" element={<EmployeeLogin />} />
        <Route path="/employee/register" element={<EmployeeLogin initialMode="register" />} />
        <Route element={<ProtectedRoute role="employee" />}>
          <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
          <Route path="/employee/notifications" element={<EmployeeNotifications />} />
          <Route path="/employee/profile" element={<EmployeeProfile />} />
          <Route path="/employee/settings" element={<EmployeeSettings />} />
          <Route path="/employee/refer" element={<EmployeeReferral />} />
          <Route path="/employee/referrals" element={<EmployeeReferrals />} />
          <Route path="/employee/referrals/:id" element={<ReferralDetails />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
