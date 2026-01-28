import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { authService } from '../services/auth.service';
import { createResetPasswordSchema, type ResetPasswordFormData } from '../schemas/validation';
import { getErrorMessage } from '@/lib/utils/error';
import { PasswordStrengthIndicator } from './PasswordStrengthIndicator';

export const ResetPasswordForm = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const token = searchParams.get('token');

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm<ResetPasswordFormData>({
        resolver: zodResolver(createResetPasswordSchema(t)),
    });

    const password = watch('newPassword');

    const onSubmit = async (data: ResetPasswordFormData) => {
        if (!token) {
            toast.error(t('auth.invalid_reset_link'));
            return;
        }

        setIsSubmitting(true);
        try {
            await authService.resetPassword(token, data.newPassword);
            toast.success(t('auth.password_reset_success'));
            navigate('/login');
        } catch (error) {
            toast.error(getErrorMessage(error));
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!token) {
        return (
            <div className="text-center space-y-4">
                <p className="text-destructive">{t('auth.invalid_reset_link')}</p>
                <Button onClick={() => navigate('/forgot-password')} variant="outline">
                    {t('auth.request_new_link')}
                </Button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
                <Label htmlFor="newPassword">{t('auth.new_password')}</Label>
                <Input
                    id="newPassword"
                    type="password"
                    {...register('newPassword')}
                    aria-invalid={!!errors.newPassword}
                    placeholder={t('auth.password_placeholder')}
                />
                {errors.newPassword && (
                    <p className="text-sm text-destructive mt-1">{errors.newPassword.message}</p>
                )}
                {password && <PasswordStrengthIndicator password={password} />}
            </div>

            <div>
                <Label htmlFor="confirmPassword">{t('auth.confirm_password')}</Label>
                <Input
                    id="confirmPassword"
                    type="password"
                    {...register('confirmPassword')}
                    aria-invalid={!!errors.confirmPassword}
                    placeholder={t('auth.password_placeholder')}
                />
                {errors.confirmPassword && (
                    <p className="text-sm text-destructive mt-1">{errors.confirmPassword.message}</p>
                )}
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? t('auth.resetting_password') : t('auth.reset_password')}
            </Button>

            <div className="text-center">
                <Button
                    type="button"
                    variant="link"
                    onClick={() => navigate('/login')}
                    className="text-sm"
                >
                    {t('auth.back_to_login')}
                </Button>
            </div>
        </form>
    );
};
