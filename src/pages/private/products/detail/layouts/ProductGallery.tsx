import { useState } from 'react';

import ImageThumb from '@/components/custom/ImageThumb';
import { cn } from '@/lib/utils';

type TProductGalleryProps = {
  images: string[];
  name: string;
};

const ProductGallery = ({ images, name }: TProductGalleryProps) => {
  const [active, setActive] = useState(0);
  const current = images[active] ?? images[0];

  return (
    <div className="flex flex-col gap-3">
      <ImageThumb
        src={current}
        alt={name}
        rounded="lg"
        className="aspect-square w-full"
      />
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((url, index) => (
            <button
              key={`${url}-${index}`}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`Show image ${index + 1}`}
              className={cn(
                'shrink-0 rounded-md ring-2 ring-offset-2 ring-offset-white transition dark:ring-offset-stone-900',
                index === active
                  ? 'ring-accent-500 dark:ring-accent-400'
                  : 'ring-transparent hover:ring-stone-300 dark:hover:ring-stone-600',
              )}
            >
              <ImageThumb src={url} alt="" className="size-14" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductGallery;
