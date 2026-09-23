import { Link, useNavigate } from 'react-router';
import { ArrowLeft, Home } from 'lucide-react';

import BrandMark from '@/components/custom/BrandMark';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/constants/routes';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

const NotFoundPage = () => {
  useDocumentTitle('Page not found');
  const navigate = useNavigate();

  return (
    <div className="relative isolate flex min-h-dvh flex-col items-center justify-center gap-6 overflow-hidden bg-stone-50 px-4 text-center dark:bg-stone-950">
      <div
        aria-hidden
        className="absolute top-1/2 left-1/2 -z-10 size-128 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-400/15 blur-3xl dark:bg-accent-500/10"
      />
      <BrandMark size="md" className="animate-fade-up" />
      <div className="flex animate-fade-up flex-col items-center [animation-delay:80ms]">
        <p className="bg-linear-to-b from-stone-900 to-stone-400 bg-clip-text text-8xl font-bold tracking-tighter text-transparent tabular-nums sm:text-9xl dark:from-stone-50 dark:to-stone-600">
          404
        </p>
        <h1 className="mt-2 text-xl font-semibold text-stone-900 dark:text-stone-50">
          This trail doesn't lead anywhere
        </h1>
        <p className="mt-1 max-w-sm text-sm text-stone-500 dark:text-stone-400">
          The page you are looking for does not exist or has moved.
        </p>
      </div>
      <div className="flex animate-fade-up items-center gap-2 [animation-delay:160ms]">
        <Button
          variant="outline"
          onClick={() => navigate(-1)}
          className="group"
        >
          <ArrowLeft className="transition-transform group-hover:-translate-x-0.5" />
          Go back
        </Button>
        <Button asChild>
          <Link to={ROUTES.PRIVATE.DASHBOARD}>
            <Home />
            Dashboard
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFoundPage;
