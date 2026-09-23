import { KeyRound } from 'lucide-react';

const ForgotPasswordHeader = () => {
  return (
    <div className="mb-4 flex flex-col items-center text-center">
      <div className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-accent-50 text-accent-600 ring-8 ring-accent-50/50 dark:bg-accent-950/50 dark:text-accent-400 dark:ring-accent-950/20">
        <KeyRound className="size-5" />
      </div>
      <h1 className="text-xl font-semibold tracking-tight">Forgot password?</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Enter your email and we'll send you a reset link
      </p>
    </div>
  );
};

export default ForgotPasswordHeader;
