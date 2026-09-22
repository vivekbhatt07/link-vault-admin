import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';

import ImageUrlInput from '@/components/custom/ImageUrlInput';
import { Badge } from '@/components/ui/badge';
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
import { Textarea } from '@/components/ui/textarea';
import { applyApiFieldErrors, pickChangedFields } from '@/helpers/form';
import { useUpdateProfile } from '@/hooks/auth';
import { useAuthStore } from '@/store/authStore';
import type { UpdateProfilePayload, User } from '@/types/api';

import { PROFILE_FORM_FIELD_NAMES, PROFILE_LIMITS } from './constants';
import { profileFormSchema } from './schemas';
import type { TProfileFormData } from './types';

const toFormData = (user: User | null): TProfileFormData => ({
  firstName: user?.firstName ?? '',
  lastName: user?.lastName ?? '',
  email: user?.email ?? '',
  bio: user?.bio ?? '',
  avatar: user?.avatar ?? '',
});

const ProfilePage = () => {
  const user = useAuthStore((state) => state.user);
  const updateProfile = useUpdateProfile();
  const { FIRST_NAME, LAST_NAME, EMAIL, BIO, AVATAR } =
    PROFILE_FORM_FIELD_NAMES;

  const form = useForm<TProfileFormData>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: toFormData(user),
  });

  // Re-sync after /me hydration or a successful save.
  useEffect(() => {
    form.reset(toFormData(user));
  }, [user, form]);

  const bioValue = form.watch(BIO) ?? '';

  const handleSubmit = (data: TProfileFormData) => {
    const changed = pickChangedFields(toFormData(user), data);
    if (Object.keys(changed).length === 0) return;

    // Only changed keys are sent. Cleared optional fields are sent as null
    // (see the TODO on UpdateProfilePayload).
    const payload: UpdateProfilePayload = {
      ...(changed.firstName !== undefined && { firstName: changed.firstName }),
      ...(changed.lastName !== undefined && { lastName: changed.lastName }),
      ...(changed.email !== undefined && { email: changed.email }),
      ...(changed.bio !== undefined && { bio: changed.bio || null }),
      ...(changed.avatar !== undefined && { avatar: changed.avatar || null }),
    };

    updateProfile.mutate(payload, {
      onError: (error) => {
        applyApiFieldErrors(form, error);
      },
    });
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-foreground">Profile</h3>
          {user && <Badge variant="secondary">{user.role}</Badge>}
        </div>
        <p className="text-sm text-muted-foreground">
          How you appear across the admin panel.
        </p>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="flex flex-col gap-6"
        >
          <FormField
            control={form.control}
            name={AVATAR}
            render={({ field }) => (
              <FormItem>
                <FormLabel optional>Profile photo</FormLabel>
                <FormControl>
                  <ImageUrlInput
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    rounded="full"
                    alt="Avatar preview"
                    placeholder="https://example.com/avatar.jpg"
                    disabled={updateProfile.isPending}
                    variant="avatar"
                  />
                </FormControl>
                <FormDescription>
                  Upload a photo or paste an image URL.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name={FIRST_NAME}
              render={({ field }) => (
                <FormItem>
                  <FormLabel optional>First name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Vivek"
                      maxLength={PROFILE_LIMITS.NAME_MAX}
                      autoComplete="given-name"
                      disabled={updateProfile.isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={LAST_NAME}
              render={({ field }) => (
                <FormItem>
                  <FormLabel optional>Last name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Bhatt"
                      maxLength={PROFILE_LIMITS.NAME_MAX}
                      autoComplete="family-name"
                      disabled={updateProfile.isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name={EMAIL}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="admin@example.com"
                    autoComplete="email"
                    disabled={updateProfile.isPending}
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Used to sign in to this panel.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name={BIO}
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel optional>Bio</FormLabel>
                  <span className="text-xs text-muted-foreground">
                    {bioValue.length}/{PROFILE_LIMITS.BIO_MAX}
                  </span>
                </div>
                <FormControl>
                  <Textarea
                    placeholder="A short note about yourself…"
                    rows={4}
                    disabled={updateProfile.isPending}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => form.reset(toFormData(user))}
              disabled={!form.formState.isDirty || updateProfile.isPending}
            >
              Reset
            </Button>
            <Button
              type="submit"
              disabled={!form.formState.isDirty || updateProfile.isPending}
              startAdornment={
                updateProfile.isPending ? (
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

export default ProfilePage;
