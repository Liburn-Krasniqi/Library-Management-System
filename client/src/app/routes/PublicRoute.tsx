import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../providers";

const PublicRoute: React.FC = () => {
  const { token } = useAuth();

  // If user is logged in, redirect them to home (or dashboard)
  if (token) {
    return <Navigate to="/" replace />;
  }

  // Otherwise, allow access to the route
  return <Outlet />;
};

export default PublicRoute;
