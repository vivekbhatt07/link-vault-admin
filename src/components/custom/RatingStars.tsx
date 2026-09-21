import { Star } from 'lucide-react';

import { cn } from '@/lib/utils';

type TRatingStarsProps = {
  /** 0–5, fractions allowed (rendered as half-filled). */
  rating: number;
  size?: number;
  className?: string;
};

const RatingStars = ({ rating, size = 14, className }: TRatingStarsProps) => (
  <div
    className={cn('inline-flex items-center gap-0.5', className)}
    role="img"
    aria-label={`${rating.toFixed(1)} out of 5 stars`}
  >
    {Array.from({ length: 5 }).map((_, index) => {
      const fill = Math.min(Math.max(rating - index, 0), 1);
      return (
        <span
          key={index}
          className="relative inline-block"
          style={{ width: size, height: size }}
        >
          <Star
            size={size}
            className="absolute inset-0 text-stone-300 dark:text-stone-600"
          />
          <span
            className="absolute inset-0 overflow-hidden"
            style={{ width: `${fill * 100}%` }}
          >
            <Star size={size} className="fill-amber-400 text-amber-400" />
          </span>
        </span>
      );
    })}
  </div>
);

export default RatingStars;
