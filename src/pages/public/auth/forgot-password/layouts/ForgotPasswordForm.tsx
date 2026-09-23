import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router';
import { ArrowLeft, Loader2, Mail, MailCheck } from 'lucide-react';

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
      <div className="flex animate-fade-up flex-col items-center gap-3 text-center">
        <div className="flex size-12 animate-in items-center justify-center rounded-full bg-emerald-50 text-emerald-600 ring-8 ring-emerald-50/50 duration-500 zoom-in-50 dark:bg-emerald-950/40 dark:text-emerald-400 dark:ring-emerald-950/20">
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
        <Button variant="outline" size="sm" asChild className="group mt-2">
          <Link to={ROUTES.PUBLIC.AUTH.SIGN_IN}>
            <ArrowLeft className="transition-transform group-hover:-translate-x-0.5" />
            Back to sign in
          </Link>
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
                      autoFocus
                      startAdornment={
                        <Mail className="size-4 text-stone-400" />
                      }
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
