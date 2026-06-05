import { useAuth } from "../contexts/AuthContext";
import { AccessDenied } from "../pages/AccessDenied";

export function AdminRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isAdmin } = useAuth();

  if (!isAuthenticated || !isAdmin) {
    return <AccessDenied />;
  }

  return <>{children}</>;
}
