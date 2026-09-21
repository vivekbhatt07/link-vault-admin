import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
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
import { applyApiFieldErrors } from '@/helpers/form';
import { useChangePassword } from '@/hooks/auth';

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
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h3 className="text-sm font-semibold text-foreground">
            Change password
          </h3>
          <p className="text-sm text-muted-foreground">
            Your session stays signed in after changing the password.
          </p>
        </div>
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
                  <FormDescription>
                    8–64 characters with an uppercase letter, a lowercase
                    letter, a number, and a special character.
                  </FormDescription>
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

            <div className="flex justify-end">
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
      </div>
    </div>
  );
};

export default SecurityPage;
