import { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from "date-fns";
import { CalendarIcon, Loader2, Upload, X, Check } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/cn";

import { tourService } from '../services/tour.service';
import type { CreateTourInput } from '../types/tour.types';

export const CreateTourForm = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Schema is defined inside the component to use translations
    const createTourSchema = useMemo(() => z.object({
        title: z.string()
            .min(3, t('tours.create.validation.title_min'))
            .max(200, t('tours.create.validation.title_max')),
        price: z.coerce.number()
            .min(0, t('tours.create.validation.price_min')),
        summary: z.string()
            .max(1000, t('tours.create.validation.summary_max'))
            .optional(),
        currency: z.string()
            .length(3, t('tours.create.validation.currency_length'))
            .optional()
            .default('GEL'),
        city: z.string()
            .max(100, t('tours.create.validation.city_max'))
            .optional(),
        startLocation: z.string()
            .max(100, t('tours.create.validation.start_location_max'))
            .optional(),
        originalPrice: z.coerce.number()
            .min(0, t('tours.create.validation.original_price_min'))
            .optional(),
        durationMinutes: z.coerce.number().int()
            .min(0, t('tours.create.validation.duration_min'))
            .optional(),
        maxPeople: z.coerce.number().int()
            .min(1, t('tours.create.validation.max_people_min'))
            .optional(),
        isInstantBooking: z.boolean().default(false),
        hasFreeCancellation: z.boolean().default(false),
        startDate: z.date().optional(),
    }), [t]);

    type TourFormValues = z.infer<typeof createTourSchema>;

    const form = useForm<TourFormValues>({
        resolver: zodResolver(createTourSchema) as any,
        defaultValues: {
            title: "",
            summary: "",
            price: 0,
            currency: 'GEL',
            city: "",
            startLocation: "",
            isInstantBooking: false,
            hasFreeCancellation: false,
        },
    });

    const onSubmit = async (data: TourFormValues) => {
        setIsSubmitting(true);
        try {
            // Convert TourFormValues to CreateTourInput (handling date -> string conversion)
            const tourData: CreateTourInput = {
                ...data,
                startDate: data.startDate ? data.startDate.toISOString() : undefined,
            };

            // 1. Create Tour
            const createdTourResponse = await tourService.createTour(tourData);
            if (!createdTourResponse.success || !createdTourResponse.data) {
                throw new Error('Failed to create tour');
            }

            const tourId = createdTourResponse.data.id;
            toast.success(t('tours.create.success_message'));

            // 2. Upload Images (if selected)
            if (selectedFiles.length > 0) {
                try {
                    await tourService.uploadTourImage(tourId, selectedFiles);
                    toast.success(t('tours.create.image_upload_success', { count: selectedFiles.length }));
                } catch (uploadError) {
                    console.error('Image upload failed:', uploadError);
                    toast.error(t('tours.create.image_upload_error'));
                }
            }

            // Redirect to the new tour
            navigate(`/tours/${tourId}`);
        } catch (error) {
            console.error('Failed to create tour:', error);
            toast.error(t('tours.create.error_message'));
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const newFiles = Array.from(e.target.files);

            setSelectedFiles(prevFiles => {
                const updatedFiles = [...prevFiles, ...newFiles];
                if (updatedFiles.length > 10) {
                    toast.error(t('tours.create.max_images_error'));
                    return prevFiles;
                }
                return updatedFiles;
            });

            // Reset input value
            e.target.value = '';
        }
    };

    const removeFile = (index: number) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    };

    return (
        <div className="max-w-6xl space-y-8 animate-fade-in">
            <div className="mb-8 space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">{t('tours.create.title')}</h1>
                <p className="text-muted-foreground">
                    {t('tours.create.subtitle')}
                </p>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        {/* Left Column - Main Details */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Basic Info Card */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>{t('tours.create.basic_info')}</CardTitle>
                                    <CardDescription>
                                        {t('tours.create.basic_info_desc')}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <FormField
                                        control={form.control}
                                        name="title"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>{t('tours.create.tour_title')} *</FormLabel>
                                                <FormControl>
                                                    <Input placeholder={t('tours.create.tour_title_placeholder')} {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="summary"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>{t('tours.create.summary')}</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder={t('tours.create.summary_placeholder')}
                                                        className="resize-none min-h-[120px]"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormDescription>
                                                    {t('tours.create.summary_desc')}
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <FormField
                                            control={form.control}
                                            name="city"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>{t('tours.create.region')}</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder={t('tours.create.region_placeholder')} {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="startLocation"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>{t('tours.create.meeting_point')}</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder={t('tours.create.meeting_point_placeholder')} {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Details & logistics */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>{t('tours.create.logistics')}</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <FormField
                                            control={form.control}
                                            name="durationMinutes"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>{t('tours.create.duration')}</FormLabel>
                                                    <FormControl>
                                                        <Input type="number" placeholder="180" {...field} />
                                                    </FormControl>
                                                    <FormDescription>
                                                        {t('tours.create.duration_desc')}
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="maxPeople"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>{t('tours.create.max_group_size')}</FormLabel>
                                                    <FormControl>
                                                        <Input type="number" placeholder="12" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <FormField
                                            control={form.control}
                                            name="startDate"
                                            render={({ field }) => (
                                                <FormItem className="flex flex-col">
                                                    <FormLabel>{t('tours.create.start_date')}</FormLabel>
                                                    <div className="flex gap-2">
                                                        <Popover>
                                                            <PopoverTrigger asChild>
                                                                <FormControl>
                                                                    <Button
                                                                        variant={"outline"}
                                                                        className={cn(
                                                                            "w-[240px] pl-3 text-left font-normal",
                                                                            !field.value && "text-muted-foreground"
                                                                        )}
                                                                    >
                                                                        {field.value ? (
                                                                            format(field.value, "PPP")
                                                                        ) : (
                                                                            <span>{t('tours.create.pick_date')}</span>
                                                                        )}
                                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                                    </Button>
                                                                </FormControl>
                                                            </PopoverTrigger>
                                                            <PopoverContent className="w-auto p-0" align="start">
                                                                <Calendar
                                                                    mode="single"
                                                                    selected={field.value}
                                                                    onSelect={(date: Date | undefined) => {
                                                                        if (date) {
                                                                            const newDate = new Date(date);
                                                                            if (field.value) {
                                                                                newDate.setHours(field.value.getHours());
                                                                                newDate.setMinutes(field.value.getMinutes());
                                                                            } else {
                                                                                newDate.setHours(10); // Default to 10:00 AM if no time set
                                                                                newDate.setMinutes(0);
                                                                            }
                                                                            field.onChange(newDate);
                                                                        } else {
                                                                            field.onChange(undefined);
                                                                        }
                                                                    }}
                                                                    disabled={(date) =>
                                                                        date < new Date()
                                                                    }
                                                                    initialFocus
                                                                />
                                                            </PopoverContent>
                                                        </Popover>
                                                        <Input
                                                            type="time"
                                                            className="w-[120px]"
                                                            value={field.value ? format(field.value, "HH:mm") : ""}
                                                            onChange={(e) => {
                                                                const [hours, minutes] = e.target.value.split(':').map(Number);
                                                                const newDate = field.value ? new Date(field.value) : new Date();
                                                                newDate.setHours(hours);
                                                                newDate.setMinutes(minutes);
                                                                // Ensure we don't set a date in the past if it's today
                                                                if (newDate < new Date()) {
                                                                    // Optional: Logic to prevent past times, but for now just letting it set
                                                                }
                                                                field.onChange(newDate);
                                                            }}
                                                        />
                                                    </div>
                                                    <FormDescription>
                                                        {t('tours.create.start_date_desc')}
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div className="flex flex-col gap-4 border p-4 rounded-lg bg-muted/20">
                                        <FormField
                                            control={form.control}
                                            name="isInstantBooking"
                                            render={({ field }) => (
                                                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                                    <FormControl>
                                                        <Checkbox
                                                            checked={field.value}
                                                            onCheckedChange={field.onChange}
                                                        />
                                                    </FormControl>
                                                    <div className="space-y-1 leading-none">
                                                        <FormLabel>
                                                            {t('tours.create.instant_booking')}
                                                        </FormLabel>
                                                        <FormDescription>
                                                            {t('tours.create.instant_booking_desc')}
                                                        </FormDescription>
                                                    </div>
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="hasFreeCancellation"
                                            render={({ field }) => (
                                                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                                    <FormControl>
                                                        <Checkbox
                                                            checked={field.value}
                                                            onCheckedChange={field.onChange}
                                                        />
                                                    </FormControl>
                                                    <div className="space-y-1 leading-none">
                                                        <FormLabel>
                                                            {t('tours.create.free_cancellation')}
                                                        </FormLabel>
                                                        <FormDescription>
                                                            {t('tours.create.free_cancellation_desc')}
                                                        </FormDescription>
                                                    </div>
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                </CardContent>
                            </Card>

                            {/* Media Card */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>{t('tours.create.gallery')}</CardTitle>
                                    <CardDescription>
                                        {t('tours.create.gallery_desc')}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center gap-2 hover:bg-muted/50 transition-colors cursor-pointer relative">
                                            <Input
                                                type="file"
                                                onChange={handleFileChange}
                                                accept="image/*"
                                                multiple
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            />
                                            <div className="p-3 bg-background rounded-full border shadow-sm">
                                                <Upload className="w-6 h-6 text-muted-foreground" />
                                            </div>
                                            <div className="text-center">
                                                <p className="font-medium">{t('tours.create.upload_text')}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {t('tours.create.upload_subtext')}
                                                </p>
                                            </div>
                                        </div>

                                        {selectedFiles.length > 0 && (
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                {selectedFiles.map((file, index) => (
                                                    <div key={`${file.name}-${index}`} className="relative group aspect-square rounded-lg border bg-background overflow-hidden shadow-sm">
                                                        <div className="absolute top-1 right-1 z-10">
                                                            <button
                                                                type="button"
                                                                onClick={() => removeFile(index)}
                                                                className="p-1 bg-background/80 backdrop-blur-sm rounded-full text-muted-foreground hover:text-destructive transition-colors border shadow-sm"
                                                            >
                                                                <X className="w-3 h-3" />
                                                            </button>
                                                        </div>
                                                        <div className="w-full h-full flex items-center justify-center bg-muted">
                                                            {/* We could use URL.createObjectURL(file) here for preview if we wanted */}
                                                            <span className="text-xs text-muted-foreground p-2 text-center">{file.name}</span>
                                                        </div>
                                                        <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-1 text-[10px] truncate px-2">
                                                            {(file.size / 1024 / 1024).toFixed(2)} MB
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Right Column - Pricing & Submit */}
                        <div className="space-y-8">
                            <Card className="sticky top-6">
                                <CardHeader>
                                    <CardTitle>{t('tours.create.pricing')}</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <FormField
                                        control={form.control}
                                        name="price"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>{t('tours.create.price')} *</FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <Input type="number" step="0.01" {...field} className="pl-9" />
                                                        <div className="absolute left-3 top-2.5 text-muted-foreground text-sm">
                                                            {form.watch('currency') === 'USD' ? '$' : form.watch('currency') === 'EUR' ? '€' : '₾'}
                                                        </div>
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="currency"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>{t('tours.create.currency')}</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder={t('tours.create.select_currency')} />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="GEL">GEL (₾)</SelectItem>
                                                        <SelectItem value="USD">USD ($)</SelectItem>
                                                        <SelectItem value="EUR">EUR (€)</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="originalPrice"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>{t('tours.create.original_price')}</FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <Input type="number" step="0.01" {...field} className="pl-9" />
                                                        <div className="absolute left-3 top-2.5 text-muted-foreground text-sm">
                                                            {form.watch('currency') === 'USD' ? '$' : form.watch('currency') === 'EUR' ? '€' : '₾'}
                                                        </div>
                                                    </div>
                                                </FormControl>
                                                <FormDescription>
                                                    {t('tours.create.original_price_desc')}
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <div className="pt-4">
                                        <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                                            {isSubmitting ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    {t('tours.create.publishing')}
                                                </>
                                            ) : (
                                                <>
                                                    <Check className="mr-2 h-4 w-4" />
                                                    {t('tours.create.publish_button')}
                                                </>
                                            )}
                                        </Button>
                                        <p className="text-xs text-muted-foreground text-center mt-3">
                                            {t('tours.create.terms')}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </form>
            </Form>
        </div>
    );
};
