import { useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router';

import CommandPalette from '@/components/custom/CommandPalette';
import RateLimitBanner from '@/components/custom/RateLimitBanner';
import TopProgressBar from '@/components/custom/TopProgressBar';
import { ROUTES } from '@/constants/routes';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';
import Header from './Header';
import Sidebar from './Sidebar';

const PageLayout = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const { pathname } = useLocation();
  const mainRef = useRef<HTMLElement>(null);

  // <main> is the scroll container, so the browser won't reset it between
  // routes on its own.
  useEffect(() => {
    mainRef.current?.scrollTo({ top: 0 });
  }, [pathname]);

  // Settings tabs animate their own content; keep the settings shell still.
  const transitionKey = pathname.startsWith(ROUTES.PRIVATE.SETTINGS.ROOT)
    ? ROUTES.PRIVATE.SETTINGS.ROOT
    : pathname;

  return (
    <div className="flex h-dvh flex-col bg-stone-50 dark:bg-stone-950">
      <TopProgressBar />
      <Header />
      <RateLimitBanner />
      <div className="flex min-h-0 flex-1 overflow-hidden">
        {isAuthenticated && <Sidebar />}
        <main
          ref={mainRef}
          className="flex min-w-0 flex-1 overflow-y-auto px-4 py-6 sm:px-6 sm:py-8 lg:px-8"
        >
          {/* Column, so each page keeps its natural height: in a row it would
              be stretched to the viewport and tall pages would squash
              overflow-clipping children (e.g. the settings tab bar). */}
          <div
            key={transitionKey}
            className={cn(
              'flex min-w-0 flex-1 flex-col animate-page-in',
              isAuthenticated && 'mx-auto w-full max-w-350',
            )}
          >
            <Outlet />
          </div>
        </main>
      </div>
      {isAuthenticated && <CommandPalette />}
    </div>
  );
};

export default PageLayout;
