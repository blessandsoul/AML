import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useRoleCheck } from '@/hooks/useRoleCheck';
import { authService } from '@/features/auth/services/auth.service';
import { useAppDispatch } from '@/store/hooks';
import { updateUser } from '@/features/auth/store/authSlice';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User, Car, Check, ChevronLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { Navigate } from 'react-router-dom';
import { ROUTES } from '@/lib/constants/routes';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { getErrorMessage } from '@/lib/utils/error';
import type { UserRole, IClaimRoleRequest } from '@/features/auth/types/auth.types';

type RoleType = Extract<UserRole, 'GUIDE' | 'DRIVER'> | null;

// Guide form schema matching server validation
const guideFormSchema = z.object({
    bio: z.string().max(2000, 'Bio is too long').optional(),
    languages: z.string().min(1, 'At least one language is required'),
    yearsOfExperience: z.coerce.number().int().min(0).max(70).optional(),
    phoneNumber: z.string().max(20, 'Phone number is too long').optional(),
});

// Driver form schema matching server validation
const driverFormSchema = z.object({
    bio: z.string().max(2000, 'Bio is too long').optional(),
    vehicleType: z.string().max(100, 'Vehicle type is too long').optional(),
    vehicleCapacity: z.coerce.number().int().min(1).max(100).optional(),
    vehicleMake: z.string().max(100).optional(),
    vehicleModel: z.string().max(100).optional(),
    vehicleYear: z.coerce.number().int().min(1900).max(2100).optional(),
    licenseNumber: z.string().max(50, 'License number is too long').optional(),
    phoneNumber: z.string().max(20, 'Phone number is too long').optional(),
});

type GuideFormData = z.infer<typeof guideFormSchema>;
type DriverFormData = z.infer<typeof driverFormSchema>;

export const BecomePartnerPage = () => {
    const { t } = useTranslation();
    const { isAuthenticated, user } = useAuth();
    useRoleCheck(); // Ensure user roles are up to date
    const dispatch = useAppDispatch();
    const [selectedRole, setSelectedRole] = useState<RoleType>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    // Guide form
    const guideForm = useForm<GuideFormData>({
        resolver: zodResolver(guideFormSchema),
        defaultValues: {
            bio: '',
            languages: '',
            yearsOfExperience: undefined,
            phoneNumber: '',
        },
    });

    // Driver form
    const driverForm = useForm<DriverFormData>({
        resolver: zodResolver(driverFormSchema),
        defaultValues: {
            bio: '',
            vehicleType: '',
            vehicleCapacity: undefined,
            vehicleMake: '',
            vehicleModel: '',
            vehicleYear: undefined,
            licenseNumber: '',
            phoneNumber: '',
        },
    });

    if (!isAuthenticated) {
        return <Navigate to={ROUTES.LOGIN} />;
    }

    const hasGuideRole = user?.roles?.includes('GUIDE');
    const hasDriverRole = user?.roles?.includes('DRIVER');

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    };

    const handleRoleSelect = (role: RoleType) => {
        setSelectedRole(role);
    };

    const handleGuideSubmit = async (data: GuideFormData) => {
        setIsSubmitting(true);
        try {
            // Parse languages from comma-separated string to array
            const languagesArray = data.languages
                .split(',')
                .map(lang => lang.trim())
                .filter(lang => lang.length > 0);

            const requestData: IClaimRoleRequest = {
                role: 'GUIDE',
                profile: {
                    bio: data.bio || undefined,
                    languages: languagesArray,
                    yearsOfExperience: data.yearsOfExperience,
                    phoneNumber: data.phoneNumber || undefined,
                },
            };

            const updatedUser = await authService.claimRole(requestData);
            dispatch(updateUser(updatedUser));
            setIsSuccess(true);
            toast.success(t('partner.application.success_guide'));
        } catch (error) {
            toast.error(getErrorMessage(error));
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDriverSubmit = async (data: DriverFormData) => {
        setIsSubmitting(true);
        try {
            const requestData: IClaimRoleRequest = {
                role: 'DRIVER',
                profile: {
                    bio: data.bio || undefined,
                    vehicleType: data.vehicleType || undefined,
                    vehicleCapacity: data.vehicleCapacity,
                    vehicleMake: data.vehicleMake || undefined,
                    vehicleModel: data.vehicleModel || undefined,
                    vehicleYear: data.vehicleYear,
                    licenseNumber: data.licenseNumber || undefined,
                    phoneNumber: data.phoneNumber || undefined,
                },
            };

            const updatedUser = await authService.claimRole(requestData);
            dispatch(updateUser(updatedUser));
            setIsSuccess(true);
            toast.success(t('partner.application.success_driver'));
        } catch (error) {
            toast.error(getErrorMessage(error));
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="container mx-auto py-20 px-4 flex justify-center">
                <Card className="max-w-md w-full text-center p-8">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 1 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="flex flex-col items-center gap-4"
                    >
                        <div className="h-16 w-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                            <Check className="h-8 w-8" />
                        </div>
                        <h2 className="text-2xl font-bold">{t('partner.application.received_title')}</h2>
                        <p className="text-muted-foreground">
                            {t('partner.application.received_desc', { role: selectedRole?.toLowerCase() })}
                        </p>
                        <Button onClick={() => window.location.href = ROUTES.PROFILE} className="mt-6">
                            {t('partner.application.go_to_dashboard')}
                        </Button>
                    </motion.div>
                </Card>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 min-h-screen">
            <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="max-w-4xl mx-auto"
            >
                <header className="mb-10 text-center">
                    <h1 className="text-3xl font-bold tracking-tight mb-2">{t('partner.program')}</h1>
                    <p className="text-muted-foreground">{t('partner.program_subtitle')}</p>
                </header>

                {!selectedRole ? (
                    <div className="grid md:grid-cols-2 gap-6">
                        <Card
                            className={`transition-all group ${hasGuideRole ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer hover:border-primary/50 hover:shadow-lg'}`}
                            onClick={() => !hasGuideRole && handleRoleSelect('GUIDE')}
                        >
                            <CardHeader className="text-center">
                                <div className={`h-20 w-20 mx-auto rounded-full flex items-center justify-center mb-4 transition-transform ${hasGuideRole ? 'bg-gray-100 text-gray-400' : 'bg-blue-50 text-blue-500 group-hover:scale-110'}`}>
                                    <User className="h-10 w-10" />
                                </div>
                                <CardTitle>{hasGuideRole ? t('partner.guide_card.already_guide') : t('partner.guide_card.title')}</CardTitle>
                                <CardDescription>
                                    {t('partner.guide_card.description')}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="text-sm text-muted-foreground">
                                <ul className="list-disc list-inside space-y-1 text-left max-w-[200px] mx-auto">
                                    <li>{t('partner.guide_card.benefits.custom_tours')}</li>
                                    <li>{t('partner.guide_card.benefits.own_rates')}</li>
                                    <li>{t('partner.guide_card.benefits.manage_schedule')}</li>
                                </ul>
                            </CardContent>
                        </Card>

                        <Card
                            className={`transition-all group ${hasDriverRole ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer hover:border-primary/50 hover:shadow-lg'}`}
                            onClick={() => !hasDriverRole && handleRoleSelect('DRIVER')}
                        >
                            <CardHeader className="text-center">
                                <div className={`h-20 w-20 mx-auto rounded-full flex items-center justify-center mb-4 transition-transform ${hasDriverRole ? 'bg-gray-100 text-gray-400' : 'bg-orange-50 text-orange-500 group-hover:scale-110'}`}>
                                    <Car className="h-10 w-10" />
                                </div>
                                <CardTitle>{hasDriverRole ? t('partner.driver_card.already_driver') : t('partner.driver_card.title')}</CardTitle>
                                <CardDescription>
                                    {t('partner.driver_card.description')}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="text-sm text-muted-foreground">
                                <ul className="list-disc list-inside space-y-1 text-left max-w-[200px] mx-auto">
                                    <li>{t('partner.driver_card.benefits.list_vehicle')}</li>
                                    <li>{t('partner.driver_card.benefits.accept_jobs')}</li>
                                    <li>{t('partner.driver_card.benefits.fill_seats')}</li>
                                </ul>
                            </CardContent>
                        </Card>
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <Button
                            variant="ghost"
                            onClick={() => setSelectedRole(null)}
                            className="mb-6 pl-0 hover:pl-2 transition-all"
                        >
                            <ChevronLeft className="h-4 w-4 mr-2" />
                            {t('partner.application.back_to_selection')}
                        </Button>

                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    {selectedRole === 'GUIDE' ? t('partner.application.guide_title') : t('partner.application.driver_title')}
                                </CardTitle>
                                <CardDescription>
                                    {t('partner.application.subtitle')}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {selectedRole === 'GUIDE' && (
                                    <form onSubmit={guideForm.handleSubmit(handleGuideSubmit)} className="space-y-6">
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="phoneNumber">{t('partner.application.form.phone')}</Label>
                                                <Input
                                                    id="phoneNumber"
                                                    placeholder="+995 5XX XX XX XX"
                                                    {...guideForm.register('phoneNumber')}
                                                />
                                                {guideForm.formState.errors.phoneNumber && (
                                                    <p className="text-sm text-destructive">{guideForm.formState.errors.phoneNumber.message}</p>
                                                )}
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="languages">{t('partner.application.form.languages')} *</Label>
                                                <Input
                                                    id="languages"
                                                    placeholder={t('partner.application.form.languages_placeholder')}
                                                    {...guideForm.register('languages')}
                                                />
                                                {guideForm.formState.errors.languages && (
                                                    <p className="text-sm text-destructive">{guideForm.formState.errors.languages.message}</p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="bio">{t('partner.application.form.bio')}</Label>
                                            <Textarea
                                                id="bio"
                                                placeholder={t('partner.application.form.bio_placeholder')}
                                                className="min-h-[100px]"
                                                {...guideForm.register('bio')}
                                            />
                                            {guideForm.formState.errors.bio && (
                                                <p className="text-sm text-destructive">{guideForm.formState.errors.bio.message}</p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="yearsOfExperience">{t('partner.application.form.years_experience')}</Label>
                                            <Input
                                                id="yearsOfExperience"
                                                type="number"
                                                min="0"
                                                max="70"
                                                placeholder="e.g. 5"
                                                {...guideForm.register('yearsOfExperience')}
                                            />
                                            {guideForm.formState.errors.yearsOfExperience && (
                                                <p className="text-sm text-destructive">{guideForm.formState.errors.yearsOfExperience.message}</p>
                                            )}
                                        </div>

                                        <Button type="submit" className="w-full" disabled={isSubmitting}>
                                            {isSubmitting ? t('partner.application.submitting') : t('partner.application.submit')}
                                        </Button>
                                    </form>
                                )}

                                {selectedRole === 'DRIVER' && (
                                    <form onSubmit={driverForm.handleSubmit(handleDriverSubmit)} className="space-y-6">
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="phoneNumber">{t('partner.application.form.phone')}</Label>
                                                <Input
                                                    id="phoneNumber"
                                                    placeholder="+995 5XX XX XX XX"
                                                    {...driverForm.register('phoneNumber')}
                                                />
                                                {driverForm.formState.errors.phoneNumber && (
                                                    <p className="text-sm text-destructive">{driverForm.formState.errors.phoneNumber.message}</p>
                                                )}
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="licenseNumber">{t('partner.application.form.license')}</Label>
                                                <Input
                                                    id="licenseNumber"
                                                    placeholder="AA-123-BB"
                                                    {...driverForm.register('licenseNumber')}
                                                />
                                                {driverForm.formState.errors.licenseNumber && (
                                                    <p className="text-sm text-destructive">{driverForm.formState.errors.licenseNumber.message}</p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="bio">{t('partner.application.form.bio')}</Label>
                                            <Textarea
                                                id="bio"
                                                placeholder={t('partner.application.form.bio_placeholder')}
                                                className="min-h-[100px]"
                                                {...driverForm.register('bio')}
                                            />
                                            {driverForm.formState.errors.bio && (
                                                <p className="text-sm text-destructive">{driverForm.formState.errors.bio.message}</p>
                                            )}
                                        </div>

                                        <div className="space-y-6 border-t pt-6">
                                            <h3 className="font-semibold">{t('partner.application.form.vehicle_details')}</h3>
                                            <div className="grid md:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="vehicleType">{t('partner.application.form.vehicle_type')}</Label>
                                                    <Controller
                                                        name="vehicleType"
                                                        control={driverForm.control}
                                                        render={({ field }) => (
                                                            <Select onValueChange={field.onChange} value={field.value || ''}>
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder={t('partner.application.form.select_type')} />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value="sedan">{t('partner.application.form.types.sedan')}</SelectItem>
                                                                    <SelectItem value="suv">{t('partner.application.form.types.suv')}</SelectItem>
                                                                    <SelectItem value="minivan">{t('partner.application.form.types.minivan')}</SelectItem>
                                                                    <SelectItem value="minibus">{t('partner.application.form.types.minibus')}</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        )}
                                                    />
                                                    {driverForm.formState.errors.vehicleType && (
                                                        <p className="text-sm text-destructive">{driverForm.formState.errors.vehicleType.message}</p>
                                                    )}
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="vehicleCapacity">{t('partner.application.form.capacity')}</Label>
                                                    <Input
                                                        id="vehicleCapacity"
                                                        type="number"
                                                        min="1"
                                                        max="100"
                                                        placeholder="4"
                                                        {...driverForm.register('vehicleCapacity')}
                                                    />
                                                    {driverForm.formState.errors.vehicleCapacity && (
                                                        <p className="text-sm text-destructive">{driverForm.formState.errors.vehicleCapacity.message}</p>
                                                    )}
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="vehicleMake">{t('partner.application.form.make')}</Label>
                                                    <Input
                                                        id="vehicleMake"
                                                        placeholder="e.g. Toyota"
                                                        {...driverForm.register('vehicleMake')}
                                                    />
                                                    {driverForm.formState.errors.vehicleMake && (
                                                        <p className="text-sm text-destructive">{driverForm.formState.errors.vehicleMake.message}</p>
                                                    )}
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="vehicleModel">{t('partner.application.form.model')}</Label>
                                                    <Input
                                                        id="vehicleModel"
                                                        placeholder="e.g. Prius"
                                                        {...driverForm.register('vehicleModel')}
                                                    />
                                                    {driverForm.formState.errors.vehicleModel && (
                                                        <p className="text-sm text-destructive">{driverForm.formState.errors.vehicleModel.message}</p>
                                                    )}
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="vehicleYear">{t('partner.application.form.year')}</Label>
                                                    <Input
                                                        id="vehicleYear"
                                                        type="number"
                                                        min="1900"
                                                        max="2100"
                                                        placeholder="2015"
                                                        {...driverForm.register('vehicleYear')}
                                                    />
                                                    {driverForm.formState.errors.vehicleYear && (
                                                        <p className="text-sm text-destructive">{driverForm.formState.errors.vehicleYear.message}</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <Button type="submit" className="w-full" disabled={isSubmitting}>
                                            {isSubmitting ? t('partner.application.submitting') : t('partner.application.submit')}
                                        </Button>
                                    </form>
                                )}
                            </CardContent>
                        </Card>
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
};
