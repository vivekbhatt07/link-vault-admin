import { Badge } from '@/components/ui/badge';

type TPageHeaderProps = {
  title: string;
  description?: string;
  count?: number;
  actions?: React.ReactNode;
};

const PageHeader = ({
  title,
  description,
  count,
  actions,
}: TPageHeaderProps) => (
  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
    <div className="flex flex-col gap-0.5">
      <div className="flex items-center gap-2.5">
        <h1 className="text-xl font-semibold text-stone-900 dark:text-stone-50">
          {title}
        </h1>
        {count !== undefined && <Badge variant="secondary">{count}</Badge>}
      </div>
      {description && (
        <p className="text-sm text-stone-500 dark:text-stone-400">
          {description}
        </p>
      )}
    </div>
    {actions && <div className="flex items-center gap-2">{actions}</div>}
  </div>
);

export default PageHeader;
