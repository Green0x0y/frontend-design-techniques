import { useAuth } from '../contexts/AuthContext';
import { AccessDenied } from '../pages/AccessDenied';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <AccessDenied />;
  }

  return <>{children}</>;
}
