import { useTranslation } from 'react-i18next';
import { AuthLayout } from '@/features/auth/components/AuthLayout';
import { ForgotPasswordForm } from '@/features/auth/components/ForgotPasswordForm';

export const ForgotPasswordPage = () => {
    const { t } = useTranslation();

    return (
        <AuthLayout
            title={t('auth.forgot_password')}
            subtitle={t('auth.forgot_password_subtitle')}
        >
            <ForgotPasswordForm />
        </AuthLayout>
    );
};
