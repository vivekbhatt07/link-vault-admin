import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PRODUCT_LIMITS } from '../constants';

type THighlightsFieldProps = {
  value: string[];
  onChange: (value: string[]) => void;
  /** Per-index server/validation errors, e.g. from `highlights[0]`. */
  itemErrors?: (string | undefined)[];
  disabled?: boolean;
};

/** Ordered bullet points. Whole array replaces on save, like ImagesInput. */
const HighlightsField = ({
  value,
  onChange,
  itemErrors,
  disabled,
}: THighlightsFieldProps) => {
  const [draft, setDraft] = useState('');
  const atLimit = value.length >= PRODUCT_LIMITS.HIGHLIGHTS_MAX;

  const add = () => {
    const trimmed = draft.trim();
    if (!trimmed || atLimit) return;
    onChange([...value, trimmed]);
    setDraft('');
  };

  const update = (index: number, next: string) => {
    const copy = [...value];
    copy[index] = next;
    onChange(copy);
  };

  const remove = (index: number) =>
    onChange(value.filter((_, i) => i !== index));

  return (
    <div className="flex flex-col gap-2">
      {value.map((highlight, index) => (
        <div
          key={index}
          className="flex animate-in flex-col gap-1 duration-200 fade-in-0 slide-in-from-top-1"
        >
          <div className="flex items-center gap-2">
            <Input
              value={highlight}
              onChange={(event) => update(index, event.target.value)}
              maxLength={PRODUCT_LIMITS.HIGHLIGHT_MAX}
              disabled={disabled}
              aria-invalid={Boolean(itemErrors?.[index])}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={() => remove(index)}
              disabled={disabled}
              aria-label="Remove highlight"
            >
              <Trash2 className="text-stone-400" />
            </Button>
          </div>
          {itemErrors?.[index] && (
            <p className="text-xs font-medium text-red-600 dark:text-red-400">
              {itemErrors[index]}
            </p>
          )}
        </div>
      ))}
      {!atLimit && (
        <div className="flex items-center gap-2">
          <Input
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                add();
              }
            }}
            placeholder="Hand-carved from a single block of deodar…"
            maxLength={PRODUCT_LIMITS.HIGHLIGHT_MAX}
            disabled={disabled}
          />
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={add}
            disabled={disabled || !draft.trim()}
            startAdornment={<Plus />}
          >
            Add
          </Button>
        </div>
      )}
    </div>
  );
};

export default HighlightsField;
