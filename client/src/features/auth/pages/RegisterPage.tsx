import { useTranslation } from 'react-i18next';
import { AuthLayout } from '../components/AuthLayout';
import { RegisterForm } from '../components/RegisterForm';

export const RegisterPage = () => {
    const { t } = useTranslation();

    return (
        <AuthLayout
            title={t('auth.create_account')}
            subtitle={t('auth.sign_up_subtitle') || "Start your journey with us."}
        >
            <RegisterForm />
        </AuthLayout>
    );
};
