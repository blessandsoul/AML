import { useTranslation } from 'react-i18next';
import { AuthLayout } from '../components/AuthLayout';
import { LoginForm } from '../components/LoginForm';

export const LoginPage = () => {
    const { t } = useTranslation();

    return (
        <AuthLayout
            title={t('auth.welcome_back')}
            subtitle={t('auth.sign_in_subtitle') || "Please enter your details."}
        >
            <LoginForm />
        </AuthLayout>
    );
};
