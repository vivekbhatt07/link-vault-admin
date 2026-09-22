import { Plus, Trash2 } from 'lucide-react';
import { useFieldArray, useFormContext } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PRODUCT_FORM_FIELD_NAMES, PRODUCT_LIMITS } from '../constants';
import type { TProductFormData } from '../types';

const { SPECIFICATIONS } = PRODUCT_FORM_FIELD_NAMES;

type TSpecificationsFieldProps = { disabled?: boolean };

const SpecificationsField = ({ disabled }: TSpecificationsFieldProps) => {
  const { control, register, formState } = useFormContext<TProductFormData>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: SPECIFICATIONS,
  });
  const errors = formState.errors.specifications;

  return (
    <div className="flex flex-col gap-2">
      {fields.length === 0 && (
        <p className="text-xs text-stone-400 dark:text-stone-500">
          No specifications yet.
        </p>
      )}
      {fields.map((field, index) => {
        const rowError =
          errors?.[index]?.label?.message ?? errors?.[index]?.value?.message;
        return (
          <div key={field.id} className="flex flex-col gap-1">
            <div className="flex items-start gap-2">
              <Input
                placeholder="Label (e.g. Material)"
                maxLength={PRODUCT_LIMITS.SPEC_LABEL_MAX}
                disabled={disabled}
                {...register(`${SPECIFICATIONS}.${index}.label` as const)}
              />
              <Input
                placeholder="Value (e.g. Deodar wood)"
                maxLength={PRODUCT_LIMITS.SPEC_VALUE_MAX}
                disabled={disabled}
                {...register(`${SPECIFICATIONS}.${index}.value` as const)}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={() => remove(index)}
                disabled={disabled}
                aria-label="Remove specification"
              >
                <Trash2 className="text-stone-400" />
              </Button>
            </div>
            {rowError && (
              <p className="text-xs font-medium text-red-600 dark:text-red-400">
                {rowError}
              </p>
            )}
          </div>
        );
      })}
      {fields.length < PRODUCT_LIMITS.SPECIFICATIONS_MAX && (
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => append({ label: '', value: '' })}
          disabled={disabled}
          startAdornment={<Plus />}
          className="w-fit"
        >
          Add specification
        </Button>
      )}
    </div>
  );
};

export default SpecificationsField;
