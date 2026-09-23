import { AlertCircle, AlertTriangle, CheckCircle2, Info } from 'lucide-react';

import { cn } from '@/lib/utils';

type TCalloutVariant = 'info' | 'warning' | 'danger' | 'success';

const VARIANT_STYLES: Record<TCalloutVariant, string> = {
  info: 'border-accent-200 bg-accent-50 text-accent-900 dark:border-accent-900/60 dark:bg-accent-950/40 dark:text-accent-100',
  warning:
    'border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-200',
  danger:
    'border-red-200 bg-red-50 text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300',
  success:
    'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300',
};

const VARIANT_ICONS = {
  info: Info,
  warning: AlertTriangle,
  danger: AlertCircle,
  success: CheckCircle2,
} as const;

type TCalloutProps = {
  variant?: TCalloutVariant;
  title?: React.ReactNode;
  children?: React.ReactNode;
  action?: React.ReactNode;
  size?: 'sm' | 'md';
  className?: string;
  role?: 'alert' | 'status';
};

/** Inline notice for warnings, errors and hints — replaces ad-hoc colored boxes. */
const Callout = ({
  variant = 'info',
  title,
  children,
  action,
  size = 'sm',
  className,
  role,
}: TCalloutProps) => {
  const Icon = VARIANT_ICONS[variant];

  return (
    <div
      role={role}
      className={cn(
        'flex animate-in items-start border fade-in-0 slide-in-from-top-1 duration-200',
        size === 'sm'
          ? 'gap-2 rounded-lg px-3 py-2 text-xs'
          : 'gap-3 rounded-xl px-4 py-3 text-sm',
        VARIANT_STYLES[variant],
        className,
      )}
    >
      <Icon
        className={cn('mt-0.5 shrink-0', size === 'sm' ? 'size-3.5' : 'size-4')}
      />
      <div className="min-w-0 flex-1">
        {title && <p className="font-medium">{title}</p>}
        {children && (
          <div className={cn(title && 'mt-0.5 opacity-85')}>{children}</div>
        )}
      </div>
      {action && <div className="shrink-0 self-center">{action}</div>}
    </div>
  );
};

export default Callout;
