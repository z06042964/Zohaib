import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import AdminLoadingScreen from "./AdminLoadingScreen";

export default function ProtectedAdminRoute() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <AdminLoadingScreen label="Checking admin session..." />;
  }

  if (!user) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
