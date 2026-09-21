import { Link } from 'react-router';
import { Compass } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { ROUTES } from '@/constants/routes';

const NotFoundPage = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-stone-50 px-4 text-center dark:bg-stone-950">
      <div className="flex size-14 items-center justify-center rounded-full bg-stone-100 text-stone-400 dark:bg-stone-800">
        <Compass className="size-6" />
      </div>
      <div>
        <p className="text-sm font-semibold tracking-wide text-stone-400 uppercase dark:text-stone-500">
          404
        </p>
        <h1 className="mt-1 text-xl font-semibold text-stone-900 dark:text-stone-50">
          Page not found
        </h1>
        <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
          The page you are looking for does not exist or has moved.
        </p>
      </div>
      <Button asChild>
        <Link to={ROUTES.PRIVATE.DASHBOARD}>Go to dashboard</Link>
      </Button>
    </div>
  );
};

export default NotFoundPage;
