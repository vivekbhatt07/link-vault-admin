import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router';
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  FolderTree,
  LayoutDashboard,
  Lock,
  MessageSquare,
  Package,
  Palette,
  Settings,
  Store,
  User,
  Users,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/constants/routes';
import { useSidebarStore } from '@/store/sidebarStore';

type TNavItem = {
  label: string;
  to: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  /** Match the route exactly (dashboard) instead of as a prefix. */
  end?: boolean;
};

type TSettingsSubItem = {
  label: string;
  to: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
};

const NAV_ITEMS: TNavItem[] = [
  {
    label: 'Dashboard',
    to: ROUTES.PRIVATE.DASHBOARD,
    icon: LayoutDashboard,
    end: true,
  },
  { label: 'Categories', to: ROUTES.PRIVATE.CATEGORIES, icon: FolderTree },
  { label: 'Products', to: ROUTES.PRIVATE.PRODUCTS.ROOT, icon: Package },
  {
    label: 'Testimonials',
    to: ROUTES.PRIVATE.TESTIMONIALS,
    icon: MessageSquare,
  },
  { label: 'Customers', to: ROUTES.PRIVATE.CUSTOMERS, icon: Users },
];

const SETTINGS_SUB_ITEMS: TSettingsSubItem[] = [
  { label: 'Profile', to: ROUTES.PRIVATE.SETTINGS.PROFILE, icon: User },
  { label: 'Security', to: ROUTES.PRIVATE.SETTINGS.SECURITY, icon: Lock },
  { label: 'Store', to: ROUTES.PRIVATE.SETTINGS.STORE, icon: Store },
  {
    label: 'Appearance',
    to: ROUTES.PRIVATE.SETTINGS.APPEARANCE,
    icon: Palette,
  },
];

type TSidebarContentProps = {
  isCollapsed: boolean;
  onClose?: () => void;
  onToggleCollapse?: () => void;
};

const SidebarContent = ({
  isCollapsed,
  onClose,
  onToggleCollapse,
}: TSidebarContentProps) => {
  const { pathname } = useLocation();
  const isOnSettings = pathname.startsWith(ROUTES.PRIVATE.SETTINGS.ROOT);
  const [isSettingsExpanded, setIsSettingsExpanded] = useState(isOnSettings);

  useEffect(() => {
    if (isOnSettings) setIsSettingsExpanded(true);
  }, [isOnSettings]);

  const handleNavClick = () => onClose?.();

  const baseItemClass = cn(
    'flex items-center rounded-lg py-2 text-sm font-medium transition-colors',
    isCollapsed ? 'justify-center px-2' : 'gap-3 px-3',
  );

  const activeItemClass =
    'bg-accent-50 text-accent-700 dark:bg-accent-950/50 dark:text-accent-400';
  const inactiveItemClass =
    'text-stone-500 hover:bg-stone-100 hover:text-stone-900 dark:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-stone-50';

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    cn(baseItemClass, isActive ? activeItemClass : inactiveItemClass);

  return (
    <div className="flex h-full flex-col py-3">
      {/* Header row: collapse toggle or close */}
      <div
        className={cn(
          'mb-1 flex px-2',
          isCollapsed ? 'justify-center' : 'justify-end',
        )}
      >
        <button
          onClick={onClose ?? onToggleCollapse}
          className={cn(
            'rounded-lg p-1.5 transition-colors',
            inactiveItemClass,
          )}
        >
          {onClose ? (
            <X size={16} />
          ) : isCollapsed ? (
            <ChevronRight size={16} />
          ) : (
            <ChevronLeft size={16} />
          )}
        </button>
      </div>

      <nav className="flex flex-col gap-0.5 px-2">
        {NAV_ITEMS.map(({ label, to, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={navLinkClass}
            onClick={handleNavClick}
          >
            <Icon size={16} className="shrink-0" />
            {!isCollapsed && <span>{label}</span>}
          </NavLink>
        ))}

        {/* Settings parent */}
        {isCollapsed ? (
          <NavLink
            to={ROUTES.PRIVATE.SETTINGS.PROFILE}
            className={navLinkClass}
            onClick={handleNavClick}
          >
            <Settings size={16} className="shrink-0" />
          </NavLink>
        ) : (
          <>
            <button
              type="button"
              onClick={() => setIsSettingsExpanded((prev) => !prev)}
              className={cn(
                baseItemClass,
                'w-full',
                isOnSettings ? activeItemClass : inactiveItemClass,
              )}
            >
              <Settings size={16} className="shrink-0" />
              <span className="flex-1 text-left">Settings</span>
              <ChevronDown
                size={14}
                className={cn(
                  'shrink-0 transition-transform duration-200',
                  isSettingsExpanded && 'rotate-180',
                )}
              />
            </button>

            {isSettingsExpanded && (
              <div className="mt-0.5 flex flex-col gap-0.5 pl-5">
                {SETTINGS_SUB_ITEMS.map(({ label, to, icon: Icon }) => (
                  <NavLink
                    key={to}
                    to={to}
                    end
                    onClick={handleNavClick}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors',
                        isActive ? activeItemClass : inactiveItemClass,
                      )
                    }
                  >
                    <Icon size={13} className="shrink-0" />
                    {label}
                  </NavLink>
                ))}
              </div>
            )}
          </>
        )}
      </nav>
    </div>
  );
};

const Sidebar = () => {
  const { isOpen, isCollapsed, close, toggleCollapsed } = useSidebarStore();

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={cn(
          'hidden md:flex shrink-0 flex-col border-r border-stone-200 dark:border-stone-800',
          'overflow-hidden transition-[width] duration-200',
          isCollapsed ? 'w-14' : 'w-56',
        )}
      >
        <SidebarContent
          isCollapsed={isCollapsed}
          onToggleCollapse={toggleCollapsed}
        />
      </aside>

      {/* Mobile overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={close}
          />
          <aside className="absolute left-0 top-0 h-full w-64 overflow-y-auto border-r border-stone-200 bg-stone-50 dark:border-stone-800 dark:bg-stone-950">
            <SidebarContent isCollapsed={false} onClose={close} />
          </aside>
        </div>
      )}
    </>
  );
};

export default Sidebar;
