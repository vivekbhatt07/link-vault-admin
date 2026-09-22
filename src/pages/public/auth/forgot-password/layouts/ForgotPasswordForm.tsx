import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router';
import { Loader2, MailCheck } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { AUTH_MESSAGES } from '@/constants/messages/auth';
import { ROUTES } from '@/constants/routes';
import { applyApiFieldErrors } from '@/helpers/form';
import { useForgotPassword } from '@/hooks/auth';

import { FORGOT_PASSWORD_FORM_FIELD_NAMES } from '../constants';
import { forgotPasswordFormDataSchema } from '../schemas';
import type { TForgotPasswordFormData } from '../types';

const ForgotPasswordForm = () => {
  const { EMAIL } = FORGOT_PASSWORD_FORM_FIELD_NAMES;
  const forgotPassword = useForgotPassword();
  const [sentTo, setSentTo] = useState<string | null>(null);

  const form = useForm<TForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordFormDataSchema),
    defaultValues: {
      [EMAIL]: '',
    },
  });

  const forgotPasswordFormSubmitHandler = (data: TForgotPasswordFormData) => {
    forgotPassword.mutate(data.email, {
      onSuccess: () => setSentTo(data.email),
      onError: (error) => {
        applyApiFieldErrors(form, error);
      },
    });
  };

  if (sentTo) {
    return (
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="flex size-10 items-center justify-center rounded-full bg-green-50 text-green-600 dark:bg-green-950/40 dark:text-green-400">
          <MailCheck className="size-5" />
        </div>
        <p className="text-sm text-stone-700 dark:text-stone-300">
          Check your email. If an account exists for{' '}
          <span className="font-medium">{sentTo}</span>, a reset link is on its
          way.
        </p>
        <p className="text-xs text-muted-foreground">
          {AUTH_MESSAGES.FORGOT_PASSWORD_HINT}
        </p>
        <Button variant="outline" size="sm" asChild className="mt-2">
          <Link to={ROUTES.PUBLIC.AUTH.SIGN_IN}>Back to sign in</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <Form {...form}>
        <form
          className="flex flex-col gap-4"
          onSubmit={form.handleSubmit(forgotPasswordFormSubmitHandler)}
        >
          <div className="flex flex-col gap-2">
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
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={forgotPassword.isPending}
            startAdornment={
              forgotPassword.isPending ? (
                <Loader2 className="animate-spin" />
              ) : undefined
            }
          >
            Send reset link
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            {AUTH_MESSAGES.FORGOT_PASSWORD_HINT}
          </p>
        </form>
      </Form>
    </div>
  );
};

export default ForgotPasswordForm;
