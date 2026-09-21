import { useEffect, useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useRateLimitStore } from '@/store/rateLimitStore';

const formatRemaining = (ms: number) => {
  const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;
};

/**
 * Global banner for HTTP 429. The backend allows 100 requests per IP per
 * 15-minute window (10 on auth routes).
 */
const RateLimitBanner = () => {
  const { isLimited, message, resetAt, clear } = useRateLimitStore();
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!isLimited) return;
    const interval = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(interval);
  }, [isLimited]);

  useEffect(() => {
    if (isLimited && resetAt && now >= resetAt) clear();
  }, [isLimited, resetAt, now, clear]);

  if (!isLimited) return null;

  return (
    <div
      role="alert"
      className="flex items-center gap-3 border-b border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-200 sm:px-6"
    >
      <AlertTriangle className="size-4 shrink-0" />
      <p className="flex-1">
        <span className="font-medium">{message}</span>{' '}
        <span className="text-amber-800/80 dark:text-amber-300/80">
          Requests are limited to 100 per 15 minutes.
          {resetAt && ` Try again in about ${formatRemaining(resetAt - now)}.`}
        </span>
      </p>
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={clear}
        aria-label="Dismiss"
        className="text-amber-900 hover:bg-amber-100 dark:text-amber-200 dark:hover:bg-amber-900/40"
      >
        <X />
      </Button>
    </div>
  );
};

export default RateLimitBanner;
