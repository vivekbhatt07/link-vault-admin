import { useState } from 'react';
import { ImageOff } from 'lucide-react';

import { cn } from '@/lib/utils';

type TImageThumbProps = {
  src: string | null | undefined;
  alt: string;
  className?: string;
  rounded?: 'md' | 'lg' | 'full';
};

const roundedClass = {
  md: 'rounded-md',
  lg: 'rounded-lg',
  full: 'rounded-full',
} as const;

const ImageThumb = ({
  src,
  alt,
  className,
  rounded = 'md',
}: TImageThumbProps) => {
  const [failed, setFailed] = useState(false);
  const showFallback = !src || failed;

  return (
    <div
      className={cn(
        'flex shrink-0 items-center justify-center overflow-hidden border border-stone-200 bg-stone-100 dark:border-stone-700 dark:bg-stone-800',
        roundedClass[rounded],
        className,
      )}
    >
      {showFallback ? (
        <ImageOff className="size-[40%] text-stone-400" aria-hidden />
      ) : (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          className="size-full object-cover"
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
};

export default ImageThumb;
