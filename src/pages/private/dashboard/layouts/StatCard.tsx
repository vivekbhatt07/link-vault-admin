import { Link } from 'react-router';

import { Card, CardContent } from '@/components/ui/card';

type TStatCardProps = {
  icon: React.ReactNode;
  label: string;
  value: number | undefined;
  isLoading?: boolean;
  to?: string;
};

const StatCard = ({ icon, label, value, isLoading, to }: TStatCardProps) => {
  const body = (
    <CardContent className="flex items-center gap-4 py-5">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-stone-100 dark:bg-stone-800">
        {icon}
      </div>
      <div>
        {isLoading ? (
          <div className="h-7 w-12 animate-pulse rounded bg-stone-100 dark:bg-stone-800" />
        ) : (
          <p className="text-2xl leading-none font-bold text-stone-900 tabular-nums dark:text-stone-50">
            {value ?? '—'}
          </p>
        )}
        <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">
          {label}
        </p>
      </div>
    </CardContent>
  );

  if (!to) return <Card>{body}</Card>;

  return (
    <Card className="transition-shadow hover:shadow-md">
      <Link to={to} aria-label={label}>
        {body}
      </Link>
    </Card>
  );
};

export default StatCard;
