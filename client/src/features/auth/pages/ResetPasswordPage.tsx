import { useTranslation } from 'react-i18next';
import { AuthLayout } from '@/features/auth/components/AuthLayout';
import { ResetPasswordForm } from '@/features/auth/components/ResetPasswordForm';

export const ResetPasswordPage = () => {
    const { t } = useTranslation();

    return (
        <AuthLayout
            title={t('auth.reset_password')}
            subtitle={t('auth.reset_password_subtitle')}
        >
            <ResetPasswordForm />
        </AuthLayout>
    );
};
