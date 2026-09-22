import { Lock } from 'lucide-react';

const ForgotPasswordHeader = () => {
  return (
    <div className="mb-6 text-center">
      <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-md bg-accent-50 text-accent-700 dark:bg-accent-950/50 dark:text-accent-400">
        <Lock />
      </div>
      <h1 className="text-lg font-medium">Forgot password?</h1>
      <p className="text-sm text-muted-foreground">
        Enter your email and we'll send you a reset link
      </p>
    </div>
  );
};

export default ForgotPasswordHeader;
