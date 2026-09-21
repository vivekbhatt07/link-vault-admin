import { Navigate, Outlet, useLocation } from 'react-router';

import { ROUTES } from '@/constants/routes';
import { useAuthStore } from '@/store/authStore';

interface ProtectedRouteProps {
  children?: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to login, but remember where the admin was trying to go
    return (
      <Navigate
        to={ROUTES.PUBLIC.AUTH.SIGN_IN}
        state={{ from: location }}
        replace
      />
    );
  }
  return <>{children ?? <Outlet />}</>;
};

export default ProtectedRoute;
