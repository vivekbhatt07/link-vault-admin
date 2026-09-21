import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, type UseFormReturn } from 'react-hook-form';
import { AlertTriangle, Loader2 } from 'lucide-react';

import ImagesInput from '@/components/custom/ImagesInput';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useCategories } from '@/hooks/categories';
import type { Product } from '@/types/api';

import {
  DEACTIVATE_WARNING,
  PRODUCT_FORM_FIELD_NAMES,
  PRODUCT_LIMITS,
} from '../constants';
import { productFormSchema } from '../schemas';
import type { TProductFormData, TProductFormMode } from '../types';

type TProductFormProps = {
  mode: TProductFormMode;
  defaultValues: TProductFormData;
  /** The product being edited (for slug display and rename warning). */
  product?: Product;
  isPending: boolean;
  onSubmit: (
    data: TProductFormData,
    form: UseFormReturn<TProductFormData>,
  ) => void;
  onCancel: () => void;
};

/** `valueAsNumber` semantics for a controlled input: NaN while empty. */
const toNumber = (event: React.ChangeEvent<HTMLInputElement>) =>
  event.target.value === '' ? Number.NaN : event.target.valueAsNumber;

const numberValue = (value: number) => (Number.isNaN(value) ? '' : value);

const ProductForm = ({
  mode,
  defaultValues,
  product,
  isPending,
  onSubmit,
  onCancel,
}: TProductFormProps) => {
  const isEdit = mode === 'edit';
  const {
    NAME,
    DESCRIPTION,
    PRICE,
    STOCK,
    CATEGORY_ID,
    IMAGES,
    IS_FEATURED,
    IS_ACTIVE,
  } = PRODUCT_FORM_FIELD_NAMES;

  const categories = useCategories();

  const form = useForm<TProductFormData>({
    resolver: zodResolver(productFormSchema),
    defaultValues,
  });

  const nameValue = form.watch(NAME);
  const descriptionValue = form.watch(DESCRIPTION) ?? '';
  const isActiveValue = form.watch(IS_ACTIVE);
  const isRenaming = isEdit && product && nameValue.trim() !== product.name;

  const imageErrors = form.formState.errors.images;
  const imageItemErrors = Array.isArray(imageErrors)
    ? imageErrors.map((error) => error?.message)
    : undefined;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => onSubmit(data, form))}
        className="flex flex-col gap-6"
      >
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Main column */}
          <div className="flex flex-col gap-6 lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Details</CardTitle>
                <CardDescription>
                  The slug is generated from the name.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <FormField
                  control={form.control}
                  name={NAME}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required>Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Hand-carved Deodar Wall Panel"
                          maxLength={PRODUCT_LIMITS.NAME_MAX}
                          disabled={isPending}
                          {...field}
                        />
                      </FormControl>
                      {isEdit && product && (
                        <FormDescription>
                          Current slug:{' '}
                          <span className="font-mono">{product.slug}</span>
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
                      for this product.
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
                          {PRODUCT_LIMITS.DESCRIPTION_MAX}
                        </span>
                      </div>
                      <FormControl>
                        <Textarea
                          rows={8}
                          placeholder="Materials, dimensions, the artisan story…"
                          disabled={isPending}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Images</CardTitle>
                <CardDescription>
                  Order here is the display order on the storefront. The first
                  image is the primary one.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name={IMAGES}
                  render={({ field }) => (
                    <FormItem>
                      <ImagesInput
                        value={field.value}
                        onChange={field.onChange}
                        itemErrors={imageItemErrors}
                        disabled={isPending}
                      />
                      {!Array.isArray(imageErrors) && <FormMessage />}
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>

          {/* Side column */}
          <div className="flex flex-col gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Pricing & stock</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <FormField
                  control={form.control}
                  name={PRICE}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required>Price (₹)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          inputMode="decimal"
                          min={0}
                          step="0.01"
                          placeholder="0.00"
                          disabled={isPending}
                          name={field.name}
                          ref={field.ref}
                          onBlur={field.onBlur}
                          value={numberValue(field.value)}
                          onChange={(event) => field.onChange(toNumber(event))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={STOCK}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required>Stock</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          inputMode="numeric"
                          min={0}
                          step={1}
                          placeholder="0"
                          disabled={isPending}
                          name={field.name}
                          ref={field.ref}
                          onBlur={field.onBlur}
                          value={numberValue(field.value)}
                          onChange={(event) => field.onChange(toNumber(event))}
                        />
                      </FormControl>
                      <FormDescription>Whole units available.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Organisation</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <FormField
                  control={form.control}
                  name={CATEGORY_ID}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required>Category</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={isPending || categories.isPending}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              placeholder={
                                categories.isPending
                                  ? 'Loading categories…'
                                  : 'Select a category'
                              }
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {(categories.data ?? []).map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={IS_FEATURED}
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <FormLabel>Featured</FormLabel>
                          <p className="mt-0.5 text-xs text-stone-400 dark:text-stone-500">
                            Highlight on the storefront
                          </p>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            disabled={isPending}
                          />
                        </FormControl>
                      </div>
                    </FormItem>
                  )}
                />

                {isEdit && (
                  <FormField
                    control={form.control}
                    name={IS_ACTIVE}
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <FormLabel>Active</FormLabel>
                            <p className="mt-0.5 text-xs text-stone-400 dark:text-stone-500">
                              Visible on the storefront and in this panel
                            </p>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              disabled={isPending}
                            />
                          </FormControl>
                        </div>
                        {!isActiveValue && (
                          <div className="mt-1 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300">
                            <AlertTriangle className="mt-0.5 size-3.5 shrink-0" />
                            <p>{DEACTIVATE_WARNING}</p>
                          </div>
                        )}
                      </FormItem>
                    )}
                  />
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
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
            {isEdit ? 'Save changes' : 'Create product'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ProductForm;
