import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { KeyRound, Loader2 } from 'lucide-react';

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
import { applyApiFieldErrors } from '@/helpers/form';
import { useChangePassword } from '@/hooks/auth';

import SettingsSection from '../components/SettingsSection';
import PasswordChecklist from './components/PasswordChecklist';

import { SECURITY_FORM_FIELD_NAMES } from './constants';
import { securityFormSchema } from './schemas';
import type { TSecurityFormData } from './types';

const CURRENT_PASSWORD_ERROR = 'Current password is incorrect';

const SecurityPage = () => {
  const { CURRENT_PASSWORD, NEW_PASSWORD, CONFIRM_NEW_PASSWORD } =
    SECURITY_FORM_FIELD_NAMES;
  const changePassword = useChangePassword();

  const form = useForm<TSecurityFormData>({
    resolver: zodResolver(securityFormSchema),
    defaultValues: {
      [CURRENT_PASSWORD]: '',
      [NEW_PASSWORD]: '',
      [CONFIRM_NEW_PASSWORD]: '',
    },
  });

  const newPasswordValue = useWatch({
    control: form.control,
    name: NEW_PASSWORD,
  });

  const handleSubmit = (data: TSecurityFormData) => {
    changePassword.mutate(
      {
        currentPassword: data[CURRENT_PASSWORD],
        newPassword: data[NEW_PASSWORD],
      },
      {
        onSuccess: () => form.reset(),
        onError: (error) => {
          if (applyApiFieldErrors(form, error)) return;
          // The backend answers 400 with a plain message for these two.
          if (error.message === CURRENT_PASSWORD_ERROR) {
            form.setError(CURRENT_PASSWORD, { message: error.message });
          } else if (error.message.startsWith('New password')) {
            form.setError(NEW_PASSWORD, { message: error.message });
          }
        },
      },
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <SettingsSection
        icon={<KeyRound />}
        title="Change password"
        description="Your session stays signed in after changing the password."
      >
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="flex flex-col gap-4"
          >
            <FormField
              control={form.control}
              name={CURRENT_PASSWORD}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      autoComplete="current-password"
                      disabled={changePassword.isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={NEW_PASSWORD}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      autoComplete="new-password"
                      disabled={changePassword.isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="sr-only">
                    8–64 characters with an uppercase letter, a lowercase
                    letter, a number, and a special character.
                  </FormDescription>
                  <PasswordChecklist password={newPasswordValue ?? ''} />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={CONFIRM_NEW_PASSWORD}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm new password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      autoComplete="new-password"
                      disabled={changePassword.isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end border-t border-stone-100 pt-4 dark:border-stone-800">
              <Button
                type="submit"
                disabled={changePassword.isPending}
                startAdornment={
                  changePassword.isPending ? (
                    <Loader2 className="animate-spin" />
                  ) : undefined
                }
              >
                Update password
              </Button>
            </div>
          </form>
        </Form>
      </SettingsSection>
    </div>
  );
};

export default SecurityPage;
