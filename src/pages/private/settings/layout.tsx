import { NavLink, Outlet, useLocation } from 'react-router';

import { SETTINGS_ITEMS } from '@/components/layouts/navigation';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { cn } from '@/lib/utils';

const SettingsLayout = () => {
  const { pathname } = useLocation();
  const current = SETTINGS_ITEMS.find((item) => item.to === pathname);
  useDocumentTitle(current ? `${current.label} settings` : 'Settings');

  return (
    <div className="flex w-full max-w-3xl flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight text-stone-900 dark:text-stone-50">
          Settings
        </h1>
        <p className="text-sm text-stone-500 dark:text-stone-400">
          Manage your admin account, store details, and preferences.
        </p>
      </div>

      <nav
        aria-label="Settings sections"
        className="-mx-4 overflow-x-auto border-b border-stone-200 px-4 sm:mx-0 sm:px-0 dark:border-stone-800"
      >
        <div className="flex gap-1">
          {SETTINGS_ITEMS.map(({ label, to, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end
              className={({ isActive }) =>
                cn(
                  'group relative flex shrink-0 items-center gap-2 px-3 pt-1 pb-3 text-sm font-medium whitespace-nowrap outline-none transition-colors',
                  'focus-visible:text-stone-900 dark:focus-visible:text-stone-50',
                  'after:absolute after:inset-x-2 after:-bottom-px after:h-0.5 after:rounded-full after:transition-all after:duration-300',
                  isActive
                    ? 'text-stone-900 after:bg-accent-500 dark:text-stone-50 dark:after:bg-accent-400'
                    : 'text-stone-500 after:scale-x-0 after:bg-stone-300 hover:text-stone-800 hover:after:scale-x-100 dark:text-stone-400 dark:after:bg-stone-600 dark:hover:text-stone-200',
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className={cn(
                      'size-4 transition-colors',
                      isActive
                        ? 'text-accent-600 dark:text-accent-400'
                        : 'text-stone-400 group-hover:text-stone-500',
                    )}
                  />
                  {label}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>

      <div key={pathname} className="animate-page-in">
        <Outlet />
      </div>
    </div>
  );
};

export default SettingsLayout;
