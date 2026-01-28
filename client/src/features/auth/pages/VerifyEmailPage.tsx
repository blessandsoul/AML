import { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Loader2, CheckCircle2, XCircle, Mail } from 'lucide-react';
import { authService } from '../services/auth.service';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/lib/constants/routes';
import { useTranslation } from 'react-i18next';

type VerificationStatus = 'verifying' | 'success' | 'error' | 'invalid';

export const VerifyEmailPage = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<VerificationStatus>('verifying');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const hasVerified = useRef(false);

  useEffect(() => {
    const token = searchParams.get('token');

    if (!token) {
      setStatus('invalid');
      return;
    }

    // Prevent double API calls in React strict mode
    if (hasVerified.current) {
      return;
    }
    hasVerified.current = true;

    const verifyEmail = async () => {
      try {
        await authService.verifyEmail(token);
        setStatus('success');

        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate(ROUTES.LOGIN);
        }, 3000);
      } catch (error: any) {
        setStatus('error');
        setErrorMessage(
          error?.response?.data?.error?.message ||
          'Verification failed. The link may be expired or invalid.'
        );
      }
    };

    verifyEmail();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-lg border shadow-sm p-8">
          {/* Logo/Brand */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-foreground">
              {t('header.brand.name')}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {t('header.brand.slogan')}
            </p>
          </div>

          {/* Verifying State */}
          {status === 'verifying' && (
            <div className="text-center py-8">
              <Loader2 className="h-16 w-16 animate-spin text-primary mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-foreground mb-2">
                {t('auth.verifying_email')}
              </h2>
              <p className="text-muted-foreground">
                {t('auth.verifying_email_subtitle')}
              </p>
            </div>
          )}

          {/* Success State */}
          {status === 'success' && (
            <div className="text-center py-8">
              <CheckCircle2 className="h-16 w-16 text-success mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-foreground mb-2">
                {t('auth.email_verified_success')}
              </h2>
              <p className="text-muted-foreground mb-6">
                {t('auth.email_verified_subtitle')}
              </p>
              <Button
                onClick={() => navigate(ROUTES.LOGIN)}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {t('auth.continue_to_login')}
              </Button>
            </div>
          )}

          {/* Error State */}
          {status === 'error' && (
            <div className="text-center py-8">
              <XCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-foreground mb-2">
                {t('auth.verification_failed')}
              </h2>
              <p className="text-muted-foreground mb-6">
                {errorMessage}
              </p>
              <div className="space-y-3">
                <Button
                  onClick={() => navigate(ROUTES.HOME)}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {t('auth.go_to_home')}
                </Button>
                <Link to={ROUTES.REGISTER}>
                  <Button variant="outline" className="w-full">
                    {t('auth.register_again')}
                  </Button>
                </Link>
              </div>
            </div>
          )}

          {/* Invalid Token State */}
          {status === 'invalid' && (
            <div className="text-center py-8">
              <Mail className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-foreground mb-2">
                {t('auth.invalid_verification_link')}
              </h2>
              <p className="text-muted-foreground mb-6">
                {t('auth.invalid_verification_link_subtitle')}
              </p>
              <Button
                onClick={() => navigate(ROUTES.HOME)}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {t('auth.go_to_home')}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
