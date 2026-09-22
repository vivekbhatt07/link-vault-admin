import { Outlet } from 'react-router';

import RateLimitBanner from '@/components/custom/RateLimitBanner';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';
import { useSidebarStore } from '@/store/sidebarStore';
import Header from './Header';
import Sidebar from './Sidebar';

const PageLayout = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isCollapsed = useSidebarStore((state) => state.isCollapsed);

  return (
    <div className="flex h-screen flex-col bg-stone-50 dark:bg-stone-950">
      <Header />
      <RateLimitBanner />
      <div className="flex min-h-0 flex-1 overflow-hidden">
        {isAuthenticated && <Sidebar />}
        <main
          className={cn(
            'flex flex-1 overflow-y-auto px-4 py-6 sm:px-6 sm:py-8',
            isAuthenticated && !isCollapsed && 'md:pl-6',
            isAuthenticated && isCollapsed && 'md:pl-4',
          )}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default PageLayout;
