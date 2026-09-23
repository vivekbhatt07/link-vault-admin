import { Badge } from '@/components/ui/badge';

type TPageHeaderProps = {
  title: React.ReactNode;
  description?: React.ReactNode;
  count?: number;
  actions?: React.ReactNode;
};

const PageHeader = ({
  title,
  description,
  count,
  actions,
}: TPageHeaderProps) => (
  <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
    <div className="flex min-w-0 flex-col gap-1">
      <div className="flex items-center gap-2.5">
        <h1 className="truncate text-2xl font-semibold tracking-tight text-stone-900 dark:text-stone-50">
          {title}
        </h1>
        {count !== undefined && (
          <Badge
            key={count}
            variant="secondary"
            className="animate-in tabular-nums fade-in-0 zoom-in-90"
          >
            {count}
          </Badge>
        )}
      </div>
      {description && (
        <p className="text-sm text-stone-500 dark:text-stone-400">
          {description}
        </p>
      )}
    </div>
    {actions && (
      <div className="flex shrink-0 items-center gap-2">{actions}</div>
    )}
  </div>
);

export default PageHeader;
