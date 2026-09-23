import { MountainSnow } from 'lucide-react';

import { cn } from '@/lib/utils';

type TBrandMarkProps = {
  size?: 'sm' | 'md' | 'lg';
  showName?: boolean;
  className?: string;
};

const TILE_SIZES = {
  sm: 'size-7 rounded-lg [&_svg]:size-4',
  md: 'size-9 rounded-xl [&_svg]:size-5',
  lg: 'size-12 rounded-2xl [&_svg]:size-6',
} as const;

/** Pahadi Shilpkar logo tile — tinted with the admin's accent colour. */
const BrandMark = ({
  size = 'sm',
  showName = false,
  className,
}: TBrandMarkProps) => (
  <span className={cn('inline-flex items-center gap-2.5', className)}>
    <span
      className={cn(
        'flex shrink-0 items-center justify-center text-white shadow-sm',
        'bg-linear-to-br from-accent-400 to-accent-700 shadow-accent-600/30',
        'ring-1 ring-inset ring-white/20',
        TILE_SIZES[size],
      )}
    >
      <MountainSnow aria-hidden />
    </span>
    {showName && (
      <span className="text-sm font-semibold tracking-tight whitespace-nowrap text-stone-900 dark:text-stone-50">
        Pahadi Shilpkar
      </span>
    )}
  </span>
);

export default BrandMark;
