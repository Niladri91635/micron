import { Navigate, Outlet, useLocation } from "react-router-dom";
import { isEmployeeAuthenticated, isHRAuthenticated } from "../services/auth";

function ProtectedRoute({ role }) {
  const location = useLocation();
  const authenticated = role === "hr"
    ? isHRAuthenticated()
    : isEmployeeAuthenticated();

  if (!authenticated) {
    return (
      <Navigate
        to={role === "hr" ? "/hr/login" : "/employee/login"}
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  return <Outlet />;
}

export default ProtectedRoute;
