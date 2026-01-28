import { useTranslation } from 'react-i18next';
import { AuthLayout } from '../components/AuthLayout';
import { CompanyRegisterForm } from '../components/CompanyRegisterForm';

export const CompanyRegisterPage = () => {
    const { t } = useTranslation();

    return (
        <AuthLayout
            title={t('auth.register_company')}
            subtitle={t('auth.register_company_subtitle') || "Grow your business with us."}
        >
            <CompanyRegisterForm />
        </AuthLayout>
    );
};
