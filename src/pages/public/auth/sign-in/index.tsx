import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import SignInHeader from './layouts/SignInHeader';
import SignInForm from './layouts/SignInForm';
import SignInFooter from './layouts/SignInFooter';

const SignInPage = () => {
  return (
    <Card className="max-w-[400px] m-auto w-full">
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
  );
};

export default SignInPage;
