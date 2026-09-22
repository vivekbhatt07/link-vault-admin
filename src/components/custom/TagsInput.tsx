import { useState } from 'react';
import { X } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

type TTagsInputProps = {
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  maxTags?: number;
  maxTagLength?: number;
};

/** Chip input. Tags are stored lowercase and deduped, matching the backend. */
const TagsInput = ({
  value,
  onChange,
  placeholder = 'Type a tag and press Enter…',
  disabled,
  maxTags = 20,
  maxTagLength = 30,
}: TTagsInputProps) => {
  const [draft, setDraft] = useState('');
  const [error, setError] = useState<string | null>(null);

  const addTag = (raw: string) => {
    const tag = raw.trim().toLowerCase();
    if (!tag) return;
    if (tag.length > maxTagLength) {
      setError(`Each tag must be ${maxTagLength} characters or fewer`);
      return;
    }
    if (value.includes(tag)) {
      setDraft('');
      return;
    }
    if (value.length >= maxTags) {
      setError(`You can add up to ${maxTags} tags`);
      return;
    }
    onChange([...value, tag]);
    setDraft('');
    setError(null);
  };

  const removeTag = (tag: string) => {
    onChange(value.filter((item) => item !== tag));
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault();
      addTag(draft);
      return;
    }
    if (event.key === 'Backspace' && draft === '' && value.length > 0) {
      removeTag(value[value.length - 1]);
    }
  };

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex flex-wrap items-center gap-1.5 rounded-lg border border-stone-200 p-1.5 dark:border-stone-700">
        {value.map((tag) => (
          <Badge key={tag} variant="secondary" className="gap-1 pr-1">
            {tag}
            {!disabled && (
              <button
                type="button"
                onClick={() => removeTag(tag)}
                aria-label={`Remove ${tag}`}
                className="rounded-full p-0.5 hover:bg-stone-200 dark:hover:bg-stone-700"
              >
                <X className="size-3" />
              </button>
            )}
          </Badge>
        ))}
        <Input
          value={draft}
          onChange={(event) => {
            setDraft(event.target.value);
            if (error) setError(null);
          }}
          onKeyDown={handleKeyDown}
          onBlur={() => addTag(draft)}
          placeholder={value.length === 0 ? placeholder : undefined}
          disabled={disabled || value.length >= maxTags}
          className="h-7 min-w-32 flex-1 border-none px-1 shadow-none focus-visible:border-none md:h-7"
        />
      </div>
      {error && (
        <p className="text-xs font-medium text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
};

export default TagsInput;
