import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Loader2, ArrowLeft, Mail } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ROUTES } from '@/lib/constants/routes';
import { createForgotPasswordSchema, type ForgotPasswordFormData } from '../schemas/validation';
import { useForgotPassword } from '../hooks/useForgotPassword';
import { Alert, AlertDescription } from '@/components/ui/alert';

export const ForgotPasswordForm = () => {
    const { t } = useTranslation();
    const forgotPasswordMutation = useForgotPassword();
    const [isSubmitted, setIsSubmitted] = useState(false);

    const form = useForm<ForgotPasswordFormData>({
        resolver: zodResolver(createForgotPasswordSchema(t)),
        defaultValues: {
            email: "",
        },
    });

    const onSubmit = (data: ForgotPasswordFormData) => {
        forgotPasswordMutation.mutate(data, {
            onSuccess: () => {
                setIsSubmitted(true);
            },
        });
    };

    if (isSubmitted) {
        return (
            <div className="text-center space-y-6">
                <div className="flex justify-center">
                    <div className="h-16 w-16 bg-emerald-100 rounded-full flex items-center justify-center">
                        <Mail className="h-8 w-8 text-emerald-600" />
                    </div>
                </div>
                <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-gray-900">
                        {t('auth.check_email')}
                    </h3>
                    <p className="text-gray-500">
                        {t('auth.recovery_instructions_sent', { email: form.getValues().email })}
                    </p>
                </div>
                <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setIsSubmitted(false)}
                >
                    {t('auth.try_another_email')}
                </Button>
                <div className="pt-4 border-t border-gray-100">
                    <Link
                        to={ROUTES.LOGIN}
                        className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        {t('auth.back_to_login')}
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <Alert className="bg-blue-50 border-blue-200 text-blue-800">
                    <AlertDescription>
                        {t('auth.forgot_password_desc')}
                    </AlertDescription>
                </Alert>

                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t('auth.email')}</FormLabel>
                            <FormControl>
                                <Input
                                    type="email"
                                    placeholder={t('auth.email_placeholder')}
                                    autoComplete="email"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button
                    type="submit"
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                    disabled={forgotPasswordMutation.isPending}
                >
                    {forgotPasswordMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {t('auth.send_reset_link')}
                </Button>

                <div className="text-center">
                    <Link
                        to={ROUTES.LOGIN}
                        className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        {t('auth.back_to_login')}
                    </Link>
                </div>
            </form>
        </Form>
    );
};
