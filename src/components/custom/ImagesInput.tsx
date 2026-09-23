import { useState } from 'react';
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
  sortableKeyboardCoordinates,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  ChevronLeft,
  ChevronRight,
  ImagePlus,
  Plus,
  Trash2,
} from 'lucide-react';

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

/** Stable sortable ids, even if the same URL somehow appears twice. */
const toSortableIds = (urls: string[]) => {
  const seen = new Map<string, number>();
  return urls.map((url) => {
    const occurrence = seen.get(url) ?? 0;
    seen.set(url, occurrence + 1);
    return `${url}#${occurrence}`;
  });
};

const tileActionClass =
  'flex size-6 cursor-pointer items-center justify-center rounded-md bg-white/90 text-stone-700 shadow-sm backdrop-blur transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-40 dark:bg-stone-900/90 dark:text-stone-200 dark:hover:bg-stone-900';

type TSortableImageProps = {
  id: string;
  url: string;
  index: number;
  count: number;
  error?: string;
  disabled?: boolean;
  onMove: (from: number, to: number) => void;
  onRemove: (index: number) => void;
};

const SortableImage = ({
  id,
  url,
  index,
  count,
  error,
  disabled,
  onMove,
  onRemove,
}: TSortableImageProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, disabled });

  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(
        'group relative aspect-square animate-in duration-200 fade-in-0 zoom-in-95',
        isDragging && 'z-10',
      )}
    >
      <div
        {...attributes}
        {...listeners}
        title={url}
        aria-label={`Image ${index + 1}${index === 0 ? ', primary' : ''}. Drag or press space to reorder.`}
        className={cn(
          'relative size-full cursor-grab touch-none overflow-hidden rounded-lg border bg-white outline-none active:cursor-grabbing dark:bg-stone-900',
          'transition-shadow duration-200 focus-visible:ring-4 focus-visible:ring-accent-500/25',
          error
            ? 'border-red-500 ring-2 ring-red-500/20 dark:border-red-500/70'
            : 'border-stone-200 dark:border-stone-700',
          isDragging && 'shadow-xl ring-2 ring-accent-500/50',
        )}
      >
        <ImageThumb
          src={url}
          alt=""
          rounded="lg"
          className="size-full border-0"
        />
        {index === 0 ? (
          <span className="absolute bottom-1.5 left-1.5 rounded-md bg-accent-600 px-1.5 py-0.5 text-[10px] font-semibold text-white shadow-sm">
            Primary
          </span>
        ) : (
          <span className="absolute bottom-1.5 left-1.5 flex size-5 items-center justify-center rounded-md bg-stone-950/60 text-[10px] font-semibold text-white tabular-nums backdrop-blur">
            {index + 1}
          </span>
        )}
      </div>

      <div
        className={cn(
          'absolute top-1.5 right-1.5 flex gap-1 transition-opacity duration-150',
          'opacity-0 group-focus-within:opacity-100 group-hover:opacity-100 pointer-coarse:opacity-100',
          isDragging && 'opacity-0!',
        )}
      >
        <button
          type="button"
          onClick={() => onMove(index, index - 1)}
          disabled={disabled || index === 0}
          aria-label="Move earlier"
          className={tileActionClass}
        >
          <ChevronLeft className="size-3.5" />
        </button>
        <button
          type="button"
          onClick={() => onMove(index, index + 1)}
          disabled={disabled || index === count - 1}
          aria-label="Move later"
          className={tileActionClass}
        >
          <ChevronRight className="size-3.5" />
        </button>
        <button
          type="button"
          onClick={() => onRemove(index)}
          disabled={disabled}
          aria-label="Remove image"
          className={cn(
            tileActionClass,
            'hover:text-red-600 dark:hover:text-red-400',
          )}
        >
          <Trash2 className="size-3.5" />
        </button>
      </div>
    </li>
  );
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
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );
  const ids = toSortableIds(value);

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
    onChange(arrayMove(value, from, to));
  };

  const remove = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return;
    const from = ids.indexOf(String(active.id));
    const to = ids.indexOf(String(over.id));
    if (from !== -1 && to !== -1) move(from, to);
  };

  const errorEntries = (itemErrors ?? [])
    .map((error, index) => ({ error, index }))
    .filter((entry): entry is { error: string; index: number } =>
      Boolean(entry.error),
    );

  return (
    <div className="flex flex-col gap-3">
      {value.length > 0 ? (
        <>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={ids} strategy={rectSortingStrategy}>
              <ul className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5">
                {value.map((url, index) => (
                  <SortableImage
                    key={ids[index]}
                    id={ids[index]}
                    url={url}
                    index={index}
                    count={value.length}
                    error={itemErrors?.[index]}
                    disabled={disabled}
                    onMove={move}
                    onRemove={remove}
                  />
                ))}
              </ul>
            </SortableContext>
          </DndContext>
          <p className="text-xs text-stone-400 dark:text-stone-500">
            Drag to reorder. The first image is the primary one on the
            storefront.
          </p>
          {errorEntries.length > 0 && (
            <ul className="flex flex-col gap-0.5">
              {errorEntries.map(({ error, index }) => (
                <li
                  key={index}
                  className="text-xs font-medium text-red-600 dark:text-red-400"
                >
                  Image {index + 1}: {error}
                </li>
              ))}
            </ul>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center gap-2 rounded-xl border-2 border-dashed border-stone-200 px-4 py-8 text-center dark:border-stone-700">
          <div className="flex size-10 items-center justify-center rounded-full bg-stone-100 text-stone-400 dark:bg-stone-800">
            <ImagePlus className="size-5" />
          </div>
          <p className="text-sm font-medium text-stone-700 dark:text-stone-300">
            No images yet
          </p>
          <p className="text-xs text-stone-400 dark:text-stone-500">
            Upload photos or paste an image URL below.
          </p>
        </div>
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
