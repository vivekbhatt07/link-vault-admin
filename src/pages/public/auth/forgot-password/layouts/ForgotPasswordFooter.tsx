import { ROUTES } from '@/constants/routes';
import { Link } from 'react-router';

const ForgotPasswordFooter = () => {
  return (
    <p className="text-sm text-muted-foreground mx-auto">
      Remember your password?{' '}
      <Link
        to={ROUTES.PUBLIC.AUTH.SIGN_IN}
        className="font-medium text-accent-600 underline-offset-4 hover:underline dark:text-accent-400"
      >
        Sign in
      </Link>
    </p>
  );
};

export default ForgotPasswordFooter;
