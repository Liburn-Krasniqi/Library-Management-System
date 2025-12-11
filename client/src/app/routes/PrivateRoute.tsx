import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../providers";
const PrivateRoute: React.FC = () => {
  const { token } = useAuth();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
