import { useState } from 'react';
import { ArrowDown, ArrowUp, Plus, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { VALIDATION_MESSAGES } from '@/constants/messages/shared';
import { isValidUrl } from '@/helpers/format';
import { cn } from '@/lib/utils';
import ImageThumb from './ImageThumb';
import UploadImageButton from './UploadImageButton';

type TImagesInputProps = {
  value: string[];
  onChange: (value: string[]) => void;
  /** Per-index server/validation errors, e.g. from `images[0]`. */
  itemErrors?: (string | undefined)[];
  disabled?: boolean;
};

/**
 * Ordered list of image URLs. Array order is the storefront display order;
 * the whole array is sent on every save (PATCH replaces it wholesale).
 */
const ImagesInput = ({
  value,
  onChange,
  itemErrors,
  disabled,
}: TImagesInputProps) => {
  const [draft, setDraft] = useState('');
  const [draftError, setDraftError] = useState<string | null>(null);

  const addUrl = (url: string) => {
    const trimmed = url.trim();
    if (!trimmed) return;
    if (!isValidUrl(trimmed)) {
      setDraftError(VALIDATION_MESSAGES.URL.INVALID);
      return;
    }
    if (value.includes(trimmed)) {
      setDraftError('This image is already in the list');
      return;
    }
    onChange([...value, trimmed]);
    setDraft('');
    setDraftError(null);
  };

  const move = (from: number, to: number) => {
    if (to < 0 || to >= value.length) return;
    const next = [...value];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    onChange(next);
  };

  const remove = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col gap-3">
      {value.length > 0 ? (
        <ul className="flex flex-col gap-2">
          {value.map((url, index) => {
            const error = itemErrors?.[index];
            return (
              <li
                key={`${url}-${index}`}
                className={cn(
                  'flex items-center gap-3 rounded-lg border bg-white p-2 dark:bg-stone-900',
                  error
                    ? 'border-red-500 dark:border-red-500/70'
                    : 'border-stone-200 dark:border-stone-700',
                )}
              >
                <ImageThumb
                  src={url}
                  alt={`Image ${index + 1}`}
                  className="size-12"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs text-stone-700 dark:text-stone-300">
                    {url}
                  </p>
                  <p className="mt-0.5 text-[11px] text-stone-400 dark:text-stone-500">
                    {index === 0 ? 'Primary image' : `Position ${index + 1}`}
                  </p>
                  {error && (
                    <p className="mt-0.5 text-xs font-medium text-red-600 dark:text-red-400">
                      {error}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-0.5">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => move(index, index - 1)}
                    disabled={disabled || index === 0}
                    aria-label="Move up"
                  >
                    <ArrowUp />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => move(index, index + 1)}
                    disabled={disabled || index === value.length - 1}
                    aria-label="Move down"
                  >
                    <ArrowDown />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => remove(index)}
                    disabled={disabled}
                    aria-label="Remove image"
                    className="text-stone-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/30"
                  >
                    <Trash2 />
                  </Button>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="rounded-lg border border-dashed border-stone-200 px-3 py-4 text-center text-xs text-stone-400 dark:border-stone-700 dark:text-stone-500">
          No images yet. Paste a URL below to add one.
        </p>
      )}

      <div className="flex flex-col gap-1.5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Input
            type="url"
            value={draft}
            onChange={(event) => {
              setDraft(event.target.value);
              if (draftError) setDraftError(null);
            }}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                addUrl(draft);
              }
            }}
            placeholder="https://example.com/product.jpg"
            disabled={disabled}
            aria-invalid={Boolean(draftError)}
          />
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => addUrl(draft)}
              disabled={disabled || !draft.trim()}
              startAdornment={<Plus />}
            >
              Add URL
            </Button>
            <UploadImageButton
              multiple
              disabled={disabled}
              onUploaded={(urls) => onChange([...value, ...urls])}
            />
          </div>
        </div>
        {draftError && (
          <p className="text-xs font-medium text-red-600 dark:text-red-400">
            {draftError}
          </p>
        )}
      </div>
    </div>
  );
};

export default ImagesInput;
