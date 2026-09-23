import BrandMark from '@/components/custom/BrandMark';

const SignInHeader = () => {
  return (
    <div className="mb-4 flex flex-col items-center text-center">
      <BrandMark size="lg" className="mb-4" />
      <h1 className="text-xl font-semibold tracking-tight">Welcome back</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Sign in to manage the Pahadi Shilpkar catalog
      </p>
    </div>
  );
};

export default SignInHeader;
