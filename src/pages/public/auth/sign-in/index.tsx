import AuthShell from '@/components/layouts/AuthShell';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import SignInHeader from './layouts/SignInHeader';
import SignInForm from './layouts/SignInForm';
import SignInFooter from './layouts/SignInFooter';

const SignInPage = () => {
  useDocumentTitle('Sign in');

  return (
    <AuthShell>
      <Card className="w-full shadow-xl shadow-stone-950/5 dark:shadow-black/30">
        <CardHeader>
          <SignInHeader />
        </CardHeader>
        <CardContent>
          <SignInForm />
        </CardContent>
        <CardFooter>
          <SignInFooter />
        </CardFooter>
      </Card>
    </AuthShell>
  );
};

export default SignInPage;
