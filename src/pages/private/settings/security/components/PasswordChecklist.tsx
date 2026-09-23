import { Check } from 'lucide-react';

import { cn } from '@/lib/utils';

/** Mirrors PASSWORD_REGEX, one rule at a time, for live feedback. */
const RULES = [
  {
    label: '8–64 characters',
    test: (value: string) => value.length >= 8 && value.length <= 64,
  },
  {
    label: 'An uppercase letter',
    test: (value: string) => /[A-Z]/.test(value),
  },
  { label: 'A lowercase letter', test: (value: string) => /[a-z]/.test(value) },
  { label: 'A number', test: (value: string) => /\d/.test(value) },
  {
    label: 'A special character',
    test: (value: string) => /[^a-zA-Z0-9]/.test(value),
  },
] as const;

const STRENGTH_LABELS = ['Too weak', 'Weak', 'Fair', 'Good', 'Strong'] as const;

const STRENGTH_COLORS = [
  'bg-red-500',
  'bg-red-500',
  'bg-amber-500',
  'bg-lime-500',
  'bg-emerald-500',
] as const;

type TPasswordChecklistProps = {
  password: string;
};

const PasswordChecklist = ({ password }: TPasswordChecklistProps) => {
  const passed = RULES.map((rule) => rule.test(password));
  const score = passed.filter(Boolean).length;
  const strengthIndex = Math.max(0, score - 1);

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-stone-200 bg-stone-50/60 p-3 dark:border-stone-700/60 dark:bg-stone-800/30">
      <div className="flex items-center gap-3">
        <div className="flex flex-1 gap-1" aria-hidden>
          {RULES.map((rule, index) => (
            <span
              key={rule.label}
              className={cn(
                'h-1.5 flex-1 rounded-full transition-colors duration-300',
                password && index < score
                  ? STRENGTH_COLORS[strengthIndex]
                  : 'bg-stone-200 dark:bg-stone-700',
              )}
            />
          ))}
        </div>
        <span
          aria-live="polite"
          className="w-16 text-right text-xs font-medium text-stone-500 dark:text-stone-400"
        >
          {password ? STRENGTH_LABELS[strengthIndex] : ''}
        </span>
      </div>
      <ul className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
        {RULES.map((rule, index) => (
          <li
            key={rule.label}
            className={cn(
              'flex items-center gap-2 text-xs transition-colors duration-200',
              passed[index]
                ? 'text-emerald-700 dark:text-emerald-400'
                : 'text-stone-500 dark:text-stone-400',
            )}
          >
            <span
              className={cn(
                'flex size-4 shrink-0 items-center justify-center rounded-full border transition-all duration-200',
                passed[index]
                  ? 'scale-100 border-emerald-500 bg-emerald-500 text-white'
                  : 'border-stone-300 dark:border-stone-600',
              )}
            >
              <Check
                className={cn(
                  'size-2.5 transition-transform duration-200',
                  passed[index] ? 'scale-100' : 'scale-0',
                )}
                strokeWidth={3}
              />
            </span>
            {rule.label}
            <span className="sr-only">
              {passed[index] ? '(met)' : '(not met)'}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PasswordChecklist;
