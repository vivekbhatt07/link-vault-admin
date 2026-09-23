import AuthShell from '@/components/layouts/AuthShell';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

import ForgotPasswordHeader from './layouts/ForgotPasswordHeader';

import ForgotPasswordForm from './layouts/ForgotPasswordForm';
import ForgotPasswordFooter from './layouts/ForgotPasswordFooter';

const ForgotPasswordPage = () => {
  useDocumentTitle('Forgot password');

  return (
    <AuthShell>
      <Card className="w-full shadow-xl shadow-stone-950/5 dark:shadow-black/30">
        <CardHeader>
          <ForgotPasswordHeader />
        </CardHeader>
        <CardContent>
          <ForgotPasswordForm />
        </CardContent>
        <CardFooter>
          <ForgotPasswordFooter />
        </CardFooter>
      </Card>
    </AuthShell>
  );
};

export default ForgotPasswordPage;
