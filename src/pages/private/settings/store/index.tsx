import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
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
import { Loader } from '@/components/ui/loader';
import { Textarea } from '@/components/ui/textarea';
import { applyApiFieldErrors, pickChangedFields } from '@/helpers/form';
import { formatPrice } from '@/helpers/format';
import { useSettings, useUpdateSettings } from '@/hooks/settings';
import type { StoreSettings, UpdateSettingsPayload } from '@/types/api';

import {
  DEFAULT_WHATSAPP_TEMPLATE,
  STORE_SETTINGS_FORM_FIELD_NAMES,
  STORE_SETTINGS_LIMITS,
} from './constants';
import { storeSettingsFormSchema } from './schemas';
import type { TStoreSettingsFormData } from './types';

const {
  WHATSAPP_NUMBER,
  WHATSAPP_MESSAGE_TEMPLATE,
  CONTACT_EMAIL,
  CONTACT_PHONE,
  INSTAGRAM_URL,
  FACEBOOK_URL,
  YOUTUBE_URL,
} = STORE_SETTINGS_FORM_FIELD_NAMES;

const toFormData = (settings: StoreSettings | undefined): TStoreSettingsFormData => ({
  whatsappNumber: settings?.whatsappNumber ?? '',
  whatsappMessageTemplate: settings?.whatsappMessageTemplate ?? '',
  contactEmail: settings?.contactEmail ?? '',
  contactPhone: settings?.contactPhone ?? '',
  instagramUrl: settings?.instagramUrl ?? '',
  facebookUrl: settings?.facebookUrl ?? '',
  youtubeUrl: settings?.youtubeUrl ?? '',
});

const renderPreview = (template: string) => {
  const effective = template.trim() || DEFAULT_WHATSAPP_TEMPLATE;
  return effective
    .replaceAll('{{productName}}', 'Hand-carved Deodar Wall Panel')
    .replaceAll('{{price}}', formatPrice(1299))
    .replaceAll(
      '{{productUrl}}',
      'https://yourdomain.com/products/hand-carved-deodar-wall-panel',
    );
};

const StoreSettingsPage = () => {
  const settings = useSettings();
  const updateSettings = useUpdateSettings();

  const form = useForm<TStoreSettingsFormData>({
    resolver: zodResolver(storeSettingsFormSchema),
    defaultValues: toFormData(settings.data),
  });

  useEffect(() => {
    if (settings.data) form.reset(toFormData(settings.data));
  }, [settings.data, form]);

  const templateValue = form.watch(WHATSAPP_MESSAGE_TEMPLATE) ?? '';

  const handleSubmit = (data: TStoreSettingsFormData) => {
    const changed = pickChangedFields(toFormData(settings.data), data);
    if (Object.keys(changed).length === 0) return;

    const payload: UpdateSettingsPayload = {
      ...(changed.whatsappNumber !== undefined && {
        whatsappNumber: changed.whatsappNumber || null,
      }),
      ...(changed.whatsappMessageTemplate !== undefined && {
        whatsappMessageTemplate: changed.whatsappMessageTemplate || null,
      }),
      ...(changed.contactEmail !== undefined && {
        contactEmail: changed.contactEmail || null,
      }),
      ...(changed.contactPhone !== undefined && {
        contactPhone: changed.contactPhone || null,
      }),
      ...(changed.instagramUrl !== undefined && {
        instagramUrl: changed.instagramUrl || null,
      }),
      ...(changed.facebookUrl !== undefined && {
        facebookUrl: changed.facebookUrl || null,
      }),
      ...(changed.youtubeUrl !== undefined && {
        youtubeUrl: changed.youtubeUrl || null,
      }),
    };

    updateSettings.mutate(payload, {
      onError: (error) => applyApiFieldErrors(form, error),
    });
  };

  if (settings.isPending) {
    return <Loader centered className="my-16" />;
  }

  return (
    <div className="flex flex-col gap-8">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="flex flex-col gap-8"
        >
          <div className="flex flex-col gap-4">
            <div>
              <h3 className="text-sm font-semibold text-foreground">
                WhatsApp buy button
              </h3>
              <p className="text-sm text-muted-foreground">
                Powers the "buy on WhatsApp" link on every product.
              </p>
            </div>

            <FormField
              control={form.control}
              name={WHATSAPP_NUMBER}
              render={({ field }) => (
                <FormItem>
                  <FormLabel optional>WhatsApp number</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="+91 98765 43210"
                      disabled={updateSettings.isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Stored with the country code, digits only. Leave blank to
                    disable the buy button everywhere.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={WHATSAPP_MESSAGE_TEMPLATE}
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel optional>Message template</FormLabel>
                    <span className="text-xs text-stone-400 dark:text-stone-500">
                      {templateValue.length}/
                      {STORE_SETTINGS_LIMITS.WHATSAPP_MESSAGE_TEMPLATE_MAX}
                    </span>
                  </div>
                  <FormControl>
                    <Textarea
                      rows={3}
                      placeholder={DEFAULT_WHATSAPP_TEMPLATE}
                      disabled={updateSettings.isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Supports {'{{productName}}'}, {'{{price}}'} and{' '}
                    {'{{productUrl}}'}. Leave blank to use the default above.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="rounded-lg border border-stone-200 bg-stone-50 px-3 py-2.5 text-sm text-stone-700 dark:border-stone-700 dark:bg-stone-800/40 dark:text-stone-300">
              <p className="mb-1 text-xs font-medium text-stone-500 dark:text-stone-400">
                Preview
              </p>
              {renderPreview(templateValue)}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div>
              <h3 className="text-sm font-semibold text-foreground">
                Contact details
              </h3>
              <p className="text-sm text-muted-foreground">
                Shown on the storefront's contact page.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name={CONTACT_EMAIL}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel optional>Contact email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="hello@pahadishilpkar.com"
                        disabled={updateSettings.isPending}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={CONTACT_PHONE}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel optional>Contact phone</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="+91 98765 43210"
                        maxLength={STORE_SETTINGS_LIMITS.CONTACT_PHONE_MAX}
                        disabled={updateSettings.isPending}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div>
              <h3 className="text-sm font-semibold text-foreground">
                Social links
              </h3>
              <p className="text-sm text-muted-foreground">
                Linked from the storefront's footer.
              </p>
            </div>

            <FormField
              control={form.control}
              name={INSTAGRAM_URL}
              render={({ field }) => (
                <FormItem>
                  <FormLabel optional>Instagram</FormLabel>
                  <FormControl>
                    <Input
                      type="url"
                      placeholder="https://instagram.com/pahadishilpkar"
                      disabled={updateSettings.isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={FACEBOOK_URL}
              render={({ field }) => (
                <FormItem>
                  <FormLabel optional>Facebook</FormLabel>
                  <FormControl>
                    <Input
                      type="url"
                      placeholder="https://facebook.com/pahadishilpkar"
                      disabled={updateSettings.isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={YOUTUBE_URL}
              render={({ field }) => (
                <FormItem>
                  <FormLabel optional>YouTube</FormLabel>
                  <FormControl>
                    <Input
                      type="url"
                      placeholder="https://youtube.com/@pahadishilpkar"
                      disabled={updateSettings.isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => form.reset(toFormData(settings.data))}
              disabled={!form.formState.isDirty || updateSettings.isPending}
            >
              Reset
            </Button>
            <Button
              type="submit"
              disabled={!form.formState.isDirty || updateSettings.isPending}
              startAdornment={
                updateSettings.isPending ? (
                  <Loader2 className="animate-spin" />
                ) : undefined
              }
            >
              Save changes
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default StoreSettingsPage;
