import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';

import ForgotPasswordHeader from './layouts/ForgotPasswordHeader';

import ForgotPasswordForm from './layouts/ForgotPasswordForm';
import ForgotPasswordFooter from './layouts/ForgotPasswordFooter';

const ForgotPasswordPage = () => {
  return (
    <Card className="max-w-[400px] m-auto w-full">
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
  );
};

export default ForgotPasswordPage;
