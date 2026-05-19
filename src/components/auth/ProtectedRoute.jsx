import { Navigate, Outlet, useLocation } from "react-router-dom";
import LoadingState from "@/components/ui/LoadingState.jsx";
import { useAuth } from "@/hooks/useAuth.js";
import { canAccessRoles } from "@/lib/permissions.js";

export default function ProtectedRoute({ roles = [] }) {
  const location = useLocation();
  const { isAuthenticated, isLoading, profile } = useAuth();

  if (isLoading) {
    return (
      <main className="page-shell">
        <LoadingState label="Recuperando sessao..." />
      </main>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (roles.length > 0 && !canAccessRoles(profile, roles)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}
