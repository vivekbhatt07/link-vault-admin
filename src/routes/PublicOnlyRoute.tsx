import { Navigate, Outlet } from 'react-router';

import { ROUTES } from '@/constants/routes';
import { useAuthStore } from '@/store/authStore';

/** Auth pages bounce an already signed-in admin to the dashboard. */
const PublicOnlyRoute = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (isAuthenticated) {
    return <Navigate to={ROUTES.PRIVATE.DASHBOARD} replace />;
  }
  return <Outlet />;
};

export default PublicOnlyRoute;
