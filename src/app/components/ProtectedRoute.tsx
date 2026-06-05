import { Navigate, useLocation } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { AccessDenied } from '../pages/AccessDenied';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    if (location.pathname === '/') {
      return <Navigate to="/login" replace />;
    }

    return <AccessDenied />;
  }

  return <>{children}</>;
}
