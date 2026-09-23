import { Link as ReactRouterLink, useNavigate } from 'react-router';
import { Command, LogOut, Menu, Palette, Search, User } from 'lucide-react';

import BrandMark from '@/components/custom/BrandMark';
import { ThemeToggle } from '@/components/theme-toggle';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Kbd } from '@/components/ui/kbd';
import { ROUTES } from '@/constants/routes';
import { getDisplayName, getInitials } from '@/helpers/format';
import { useLogout } from '@/hooks/auth';
import { useAuthStore } from '@/store/authStore';
import { useCommandPaletteStore } from '@/store/commandPaletteStore';
import { useSidebarStore } from '@/store/sidebarStore';

const MOD_KEY = navigator.userAgent.includes('Mac') ? '⌘' : 'Ctrl';

const Header = () => {
  const { user, isAuthenticated } = useAuthStore();
  const { toggleOpen } = useSidebarStore();
  const openCommandPalette = useCommandPaletteStore((state) => state.setOpen);
  const navigate = useNavigate();
  const logout = useLogout();

  const displayName = getDisplayName(user);
  const initials = getInitials(user);

  return (
    <header className="relative z-30 flex h-16 shrink-0 items-center border-b border-stone-200/70 bg-white/70 supports-backdrop-filter:backdrop-blur-md dark:border-stone-800/70 dark:bg-stone-950/70">
      <div className="mx-auto flex w-full items-center justify-between gap-3 px-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-2">
          {isAuthenticated && (
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleOpen}
              className="-ml-1 md:hidden"
              aria-label="Open menu"
            >
              <Menu className="size-5" />
            </Button>
          )}
          <ReactRouterLink
            to={ROUTES.PRIVATE.DASHBOARD}
            aria-label="Pahadi Shilpkar admin home"
            className="group flex items-center gap-2.5 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-accent-500/40"
          >
            <BrandMark className="transition-transform duration-300 group-hover:scale-[1.03]" />
            <span className="hidden text-sm font-semibold tracking-tight text-stone-900 min-[360px]:inline dark:text-stone-50">
              Pahadi Shilpkar
            </span>
            <Badge variant="accent" className="hidden sm:inline-flex">
              Admin
            </Badge>
          </ReactRouterLink>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          {isAuthenticated && (
            <>
              <button
                type="button"
                onClick={() => openCommandPalette(true)}
                className="group hidden h-9 w-64 items-center gap-2 rounded-lg border border-stone-200 bg-stone-50/80 px-3 text-sm text-stone-400 transition-all duration-150 outline-none hover:border-stone-300 hover:bg-white hover:text-stone-500 focus-visible:ring-4 focus-visible:ring-accent-500/15 sm:flex lg:w-72 dark:border-stone-700 dark:bg-stone-900/60 dark:hover:border-stone-600 dark:hover:bg-stone-900"
              >
                <Search className="size-4 shrink-0 transition-colors group-hover:text-accent-500" />
                <span className="flex-1 text-left">Search or jump to…</span>
                <span className="flex items-center gap-0.5">
                  <Kbd>{MOD_KEY}</Kbd>
                  <Kbd>K</Kbd>
                </span>
              </button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => openCommandPalette(true)}
                className="sm:hidden"
                aria-label="Search"
              >
                <Search className="size-4.5" />
              </Button>
            </>
          )}

          <ThemeToggle />

          {isAuthenticated && user && (
            <DropdownMenu>
              <DropdownMenuTrigger className="ml-1 cursor-pointer rounded-full ring-offset-2 ring-offset-white outline-hidden transition-shadow hover:ring-2 hover:ring-stone-200 focus-visible:ring-2 focus-visible:ring-accent-600 dark:ring-offset-stone-950 dark:hover:ring-stone-700 dark:focus-visible:ring-accent-400">
                <Avatar className="size-9 border border-stone-200 dark:border-stone-800">
                  <AvatarImage
                    src={user.avatar || undefined}
                    alt={displayName}
                  />
                  <AvatarFallback className="bg-accent-50 text-xs font-semibold text-accent-700 dark:bg-accent-950/50 dark:text-accent-400">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <span className="sr-only">Account menu</span>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuLabel className="p-3 font-normal tracking-normal normal-case">
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
                      <p className="mt-1.5 truncate text-xs leading-none text-stone-500 dark:text-stone-400">
                        {user.email}
                      </p>
                    </div>
                  </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  className="cursor-pointer gap-2 py-1.5"
                  onClick={() => navigate(ROUTES.PRIVATE.SETTINGS.PROFILE)}
                >
                  <User className="size-4 text-stone-400" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer gap-2 py-1.5"
                  onClick={() => navigate(ROUTES.PRIVATE.SETTINGS.APPEARANCE)}
                >
                  <Palette className="size-4 text-stone-400" />
                  Appearance
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer gap-2 py-1.5"
                  onClick={() => openCommandPalette(true)}
                >
                  <Command className="size-4 text-stone-400" />
                  Command palette
                  <DropdownMenuShortcut>{MOD_KEY} K</DropdownMenuShortcut>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={logout}
                  variant="destructive"
                  className="cursor-pointer gap-2 py-1.5"
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
