import { ShieldCheck } from 'lucide-react';

const SignInHeader = () => {
  return (
    <div className="mb-6 text-center">
      <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-md bg-accent-50 text-accent-700 dark:bg-accent-950/50 dark:text-accent-400">
        <ShieldCheck />
      </div>
      <h1 className="text-lg font-medium">Admin sign in</h1>
      <p className="text-sm text-muted-foreground">
        Manage the Pahadi Shilpkar catalog
      </p>
    </div>
  );
};

export default SignInHeader;
