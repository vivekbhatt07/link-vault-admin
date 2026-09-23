import { useEffect, useState } from 'react';
import { useIsFetching, useIsMutating } from '@tanstack/react-query';

import { cn } from '@/lib/utils';

/** Delay before showing, so instant cache hits never flash the bar. */
const SHOW_DELAY_MS = 150;

/** Thin indeterminate bar pinned to the top while any request is in flight. */
const TopProgressBar = () => {
  const isBusy = useIsFetching() + useIsMutating() > 0;
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timeout = window.setTimeout(
      () => setIsVisible(isBusy),
      isBusy ? SHOW_DELAY_MS : 0,
    );
    return () => window.clearTimeout(timeout);
  }, [isBusy]);

  return (
    <div
      aria-hidden
      className={cn(
        'pointer-events-none fixed inset-x-0 top-0 z-[60] h-0.5 overflow-hidden transition-opacity duration-300',
        isVisible ? 'opacity-100' : 'opacity-0',
      )}
    >
      <div className="h-full w-full origin-left animate-progress bg-linear-to-r from-accent-400 via-accent-500 to-accent-600" />
    </div>
  );
};

export default TopProgressBar;
