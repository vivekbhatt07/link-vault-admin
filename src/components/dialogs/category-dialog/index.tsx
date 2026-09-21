import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { AlertTriangle, Loader2 } from 'lucide-react';

import ImageUrlInput from '@/components/custom/ImageUrlInput';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { applyApiFieldErrors, pickChangedFields } from '@/helpers/form';
import { useCreateCategory, useUpdateCategory } from '@/hooks/categories';
import type { Category, UpdateCategoryPayload } from '@/types/api';

import { CATEGORY_FORM_FIELD_NAMES, CATEGORY_LIMITS } from './constants';
import { categoryFormSchema } from './schemas';
import type { TCategoryFormData } from './types';

type TCategoryDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** When provided the dialog edits; otherwise it creates. */
  category?: Category | null;
};

const toFormData = (category?: Category | null): TCategoryFormData => ({
  name: category?.name ?? '',
  description: category?.description ?? '',
  image: category?.image ?? '',
});

const CategoryDialog = ({
  open,
  onOpenChange,
  category,
}: TCategoryDialogProps) => {
  const isEdit = Boolean(category);
  const { NAME, DESCRIPTION, IMAGE } = CATEGORY_FORM_FIELD_NAMES;

  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const isPending = createCategory.isPending || updateCategory.isPending;

  const form = useForm<TCategoryFormData>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: toFormData(category),
  });

  useEffect(() => {
    if (open) form.reset(toFormData(category));
  }, [open, category, form]);

  const nameValue = form.watch(NAME);
  const descriptionValue = form.watch(DESCRIPTION) ?? '';
  const isRenaming = isEdit && nameValue.trim() !== category?.name;

  const handleClose = () => {
    if (!isPending) onOpenChange(false);
  };

  const handleSubmit = (data: TCategoryFormData) => {
    const onError = (error: unknown) => {
      applyApiFieldErrors(form, error);
    };

    if (isEdit && category) {
      // Send only changed fields; re-sending an unchanged name would still
      // regenerate the slug.
      const payload = pickChangedFields(toFormData(category), data);
      if (Object.keys(payload).length === 0) {
        onOpenChange(false);
        return;
      }
      // TODO(backend): the contract types `description`/`image` as optional
      // strings and does not say how to clear one. `null` is sent for a
      // cleared value; if the API rejects it the field error will show here.
      const body: UpdateCategoryPayload = {
        ...(payload.name !== undefined && { name: payload.name }),
        ...(payload.description !== undefined && {
          description: payload.description || null,
        }),
        ...(payload.image !== undefined && { image: payload.image || null }),
      };
      updateCategory.mutate(
        { id: category.id, payload: body },
        { onSuccess: () => onOpenChange(false), onError },
      );
      return;
    }

    createCategory.mutate(
      {
        name: data.name,
        ...(data.description && { description: data.description }),
        ...(data.image && { image: data.image }),
      },
      { onSuccess: () => onOpenChange(false), onError },
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="flex max-h-[calc(100dvh-2rem)] flex-col">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit category' : 'New category'}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Update the category details. The slug is generated from the name.'
              : 'Categories group products on the storefront. The slug is generated from the name.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="flex min-h-0 flex-1 flex-col"
          >
            <div className="flex min-h-0 flex-col gap-4 overflow-y-auto px-px">
              <FormField
                control={form.control}
                name={NAME}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Festive & Pooja"
                        maxLength={CATEGORY_LIMITS.NAME_MAX}
                        disabled={isPending}
                        {...field}
                      />
                    </FormControl>
                    {isEdit && category && (
                      <FormDescription>
                        Current slug:{' '}
                        <span className="font-mono">{category.slug}</span>
                      </FormDescription>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              {isRenaming && (
                <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-200">
                  <AlertTriangle className="mt-0.5 size-3.5 shrink-0" />
                  <p>
                    Renaming regenerates the slug and{' '}
                    <span className="font-medium">
                      breaks existing storefront URLs
                    </span>{' '}
                    for this category.
                  </p>
                </div>
              )}

              <FormField
                control={form.control}
                name={DESCRIPTION}
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel optional>Description</FormLabel>
                      <span className="text-xs text-stone-400 dark:text-stone-500">
                        {descriptionValue.length}/
                        {CATEGORY_LIMITS.DESCRIPTION_MAX}
                      </span>
                    </div>
                    <FormControl>
                      <Textarea
                        rows={3}
                        placeholder="A short description shown on the storefront…"
                        disabled={isPending}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={IMAGE}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel optional>Image</FormLabel>
                    <FormControl>
                      <ImageUrlInput
                        value={field.value}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        disabled={isPending}
                        alt={nameValue || 'Category image'}
                      />
                    </FormControl>
                    <FormDescription>
                      Paste an image URL. The backend has no upload endpoint.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                startAdornment={
                  isPending ? <Loader2 className="animate-spin" /> : undefined
                }
              >
                {isEdit ? 'Save changes' : 'Create category'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CategoryDialog;
