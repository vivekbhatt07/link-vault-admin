import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useLocation, useNavigate } from 'react-router';
import { AlertCircle, Loader2 } from 'lucide-react';

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
import { getErrorMessage } from '@/api/error';
import { applyApiFieldErrors } from '@/helpers/form';
import { useSignIn } from '@/hooks/auth';

import { SIGN_IN_FORM_FIELD_NAMES } from '../constants';
import { signInFormDataSchema } from '../schemas';
import type { TSignInFormData } from '../types';

const VERIFY_EMAIL_ERROR = 'Please verify your email before signing in';

const SignInForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const signIn = useSignIn();
  const { EMAIL, PASSWORD } = SIGN_IN_FORM_FIELD_NAMES;

  const form = useForm<TSignInFormData>({
    resolver: zodResolver(signInFormDataSchema),
    defaultValues: {
      [EMAIL]: '',
      [PASSWORD]: '',
    },
  });

  const rootError = form.formState.errors.root?.message;
  const showVerifyHint = rootError === VERIFY_EMAIL_ERROR;

  const signInFormSubmitHandler = (data: TSignInFormData) => {
    form.clearErrors('root');
    signIn.mutate(data, {
      onSuccess: () => {
        const from = (location.state as { from?: Location } | null)?.from;
        navigate(from?.pathname ?? ROUTES.PRIVATE.DASHBOARD, { replace: true });
      },
      onError: (error) => {
        if (applyApiFieldErrors(form, error)) return;
        form.setError('root', { message: getErrorMessage(error) });
      },
    });
  };

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-4"
        onSubmit={form.handleSubmit(signInFormSubmitHandler)}
      >
        {rootError && (
          <div
            role="alert"
            className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300"
          >
            <AlertCircle className="mt-0.5 size-3.5 shrink-0" />
            <div>
              <p className="font-medium">{rootError}</p>
              {showVerifyHint && (
                <p className="mt-0.5 text-red-600/80 dark:text-red-300/80">
                  {AUTH_MESSAGES.VERIFY_EMAIL_HINT}
                </p>
              )}
            </div>
          </div>
        )}

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
          <FormField
            control={form.control}
            name={PASSWORD}
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel>Password</FormLabel>
                  <Link
                    to={ROUTES.PUBLIC.AUTH.FORGOT_PASSWORD}
                    className="text-sm font-medium text-accent-600 hover:underline dark:text-accent-400"
                  >
                    Forgot password?
                  </Link>
                </div>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    autoComplete="current-password"
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
          disabled={signIn.isPending}
          startAdornment={
            signIn.isPending ? <Loader2 className="animate-spin" /> : undefined
          }
        >
          Sign in
        </Button>
      </form>
    </Form>
  );
};

export default SignInForm;
