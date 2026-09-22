import { Link as ReactRouterLink, useNavigate } from 'react-router';
import { LogOut, Menu, Settings, Store } from 'lucide-react';

import { ThemeToggle } from '@/components/theme-toggle';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ROUTES } from '@/constants/routes';
import { getDisplayName, getInitials } from '@/helpers/format';
import { useLogout } from '@/hooks/auth';
import { useAuthStore } from '@/store/authStore';
import { useSidebarStore } from '@/store/sidebarStore';

const Header = () => {
  const { user, isAuthenticated } = useAuthStore();
  const { toggleOpen } = useSidebarStore();
  const navigate = useNavigate();
  const logout = useLogout();

  const displayName = getDisplayName(user);
  const initials = getInitials(user);

  return (
    <header className="flex h-[80px] items-center border-b border-stone-200/60 bg-stone-50/90 supports-backdrop-filter:backdrop-blur-sm dark:border-stone-800/60 dark:bg-stone-950/90">
      <div className="mx-auto flex w-full items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-2">
          {isAuthenticated && (
            <button
              onClick={toggleOpen}
              className="rounded-lg p-1.5 text-stone-500 hover:bg-stone-100 hover:text-stone-900 md:hidden dark:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-stone-50"
              aria-label="Open menu"
            >
              <Menu size={18} />
            </button>
          )}
          <ReactRouterLink
            to={ROUTES.PRIVATE.DASHBOARD}
            aria-label="Pahadi Shilpkar admin home"
            className="group flex items-center gap-2.5"
          >
            <Store
              size={16}
              className="text-stone-900 transition-colors group-hover:text-accent-600 dark:text-stone-50 dark:group-hover:text-accent-400"
            />
            <span className="text-sm font-semibold tracking-tight text-stone-900 transition-colors group-hover:text-accent-600 dark:text-stone-50 dark:group-hover:text-accent-400">
              Pahadi Shilpkar
            </span>
            <Badge variant="outline" className="hidden sm:inline-flex">
              Admin
            </Badge>
          </ReactRouterLink>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />

          {isAuthenticated && user && (
            <DropdownMenu>
              <DropdownMenuTrigger className="rounded-full outline-hidden ring-offset-2 focus-visible:ring-2 focus-visible:ring-accent-600 dark:focus-visible:ring-accent-400">
                <Avatar className="size-9 cursor-pointer border border-stone-200 dark:border-stone-800">
                  <AvatarImage
                    src={user.avatar || undefined}
                    alt={displayName}
                  />
                  <AvatarFallback className="bg-accent-50 text-xs font-semibold text-accent-700 dark:bg-accent-950/50 dark:text-accent-400">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-60">
                <DropdownMenuLabel className="p-3 font-normal">
                  <div className="flex items-center gap-3">
                    <Avatar className="size-10 shrink-0 border border-stone-200 dark:border-stone-800">
                      <AvatarImage
                        src={user.avatar || undefined}
                        alt={displayName}
                      />
                      <AvatarFallback className="bg-accent-50 text-xs font-semibold text-accent-700 dark:bg-accent-950/50 dark:text-accent-400">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex min-w-0 flex-col">
                      <p className="truncate text-sm leading-none font-semibold text-stone-900 dark:text-stone-50">
                        {displayName}
                      </p>
                      <p className="mt-1 truncate text-xs leading-none text-stone-500 dark:text-stone-400">
                        {user.email}
                      </p>
                    </div>
                  </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  className="cursor-pointer gap-2"
                  onClick={() => navigate(ROUTES.PRIVATE.SETTINGS.PROFILE)}
                >
                  <Settings className="size-4" />
                  Settings
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={logout}
                  variant="destructive"
                  className="cursor-pointer gap-2"
                >
                  <LogOut className="size-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
