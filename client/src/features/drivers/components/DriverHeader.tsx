import { useTranslation } from 'react-i18next';
import {
    Star,
    MapPin,
    Car,
    MessageCircle,
    Phone,
    Users,
    CheckCircle2,
    Loader2,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/cn';
import { getMediaUrl } from '@/lib/utils/media';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useCreateDirectChat } from '@/features/chat/hooks/useChats';
import { selectChat } from '@/features/chat/store/chatSlice';
import { useAppDispatch } from '@/store/hooks';
import type { Driver } from '../types/driver.types';

interface DriverHeaderProps {
    driver: Driver;
    className?: string;
}

export const DriverHeader = ({ driver, className }: DriverHeaderProps) => {
    const { t } = useTranslation();
    const { isAuthenticated, user } = useAuth();
    const dispatch = useAppDispatch();
    const createDirectChat = useCreateDirectChat();

    const fullName = driver.user
        ? `${driver.user.firstName} ${driver.user.lastName}`
        : t('driver_details.unknown_driver', 'Unknown Driver');

    const photoUrl = driver.photoUrl ? getMediaUrl(driver.photoUrl) : getMediaUrl(null);
    const rating = 5.0; // Placeholder

    const primaryLocation = driver.locations?.[0];

    // Check if user is trying to message themselves
    const isSelf = user?.id === driver.userId;

    const handleSendMessage = () => {
        if (!isAuthenticated) {
            toast.error(t('common.login_required', 'Please log in to send messages'));
            return;
        }

        if (isSelf) {
            toast.error(t('common.cannot_message_self', 'You cannot message yourself'));
            return;
        }

        if (!driver.userId) {
            toast.error(t('common.error', 'Unable to start chat'));
            return;
        }

        createDirectChat.mutate(
            { otherUserId: driver.userId },
            {
                onSuccess: (chat) => {
                    // Open the chat drawer with the created/existing chat
                    dispatch(selectChat(chat.id));
                },
                onError: () => {
                    toast.error(t('common.error', 'Failed to start chat. Please try again.'));
                },
            }
        );
    };

    const handleCall = () => {
        if (driver.phoneNumber) {
            window.location.href = `tel:${driver.phoneNumber}`;
        }
    };

    return (
        <div className={cn("bg-card rounded-2xl shadow-sm border border-border overflow-hidden", className)}>
            {/* Profile Section */}
            <div className="p-6 md:p-8">
                <div className="flex flex-col md:flex-row gap-6 md:gap-8">
                    {/* Avatar */}
                    <div className="relative shrink-0">
                        <div className="w-28 h-28 md:w-32 md:h-32 rounded-2xl overflow-hidden border-4 border-background shadow-lg">
                            <img
                                src={photoUrl}
                                alt={fullName}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                            <div>
                                {/* Name & Verified Badge */}
                                <div className="flex items-center gap-2 mb-1">
                                    <h1 className="text-2xl md:text-3xl font-bold text-foreground truncate">
                                        {fullName}
                                    </h1>
                                    {driver.isVerified && (
                                        <CheckCircle2 className="h-6 w-6 text-cyan-500 shrink-0" />
                                    )}
                                </div>

                                {/* Bio snippet */}
                                {driver.bio && (
                                    <p className="text-muted-foreground text-sm md:text-base mb-3 line-clamp-2 md:line-clamp-3">
                                        {driver.bio}
                                    </p>
                                )}

                                {/* Location */}
                                {primaryLocation && (
                                    <div className="flex items-center gap-2 text-muted-foreground text-sm mb-4">
                                        <MapPin className="h-4 w-4 text-cyan-500" />
                                        <span>
                                            {primaryLocation.city}
                                        </span>
                                    </div>
                                )}

                                {/* Quick Stats / Vehicle Info */}
                                <div className="flex flex-wrap items-center gap-3">
                                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full">
                                        <Car className="h-3.5 w-3.5 text-cyan-500" />
                                        <span>{driver.vehicleType}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full">
                                        <Users className="h-3.5 w-3.5 text-cyan-500" />
                                        <span>{driver.vehicleCapacity} Seats</span>
                                    </div>
                                </div>
                            </div>

                            {/* Rating */}
                            <div className="flex flex-col items-start md:items-end gap-1 shrink-0">
                                <div className="flex items-center gap-1">
                                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                                    <span className="text-xl font-bold text-foreground">
                                        {rating.toFixed(1)}
                                    </span>
                                </div>
                                <span className="text-sm text-muted-foreground">
                                    New Driver
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 mt-6">
                    <Button
                        size="lg"
                        className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-white dark:text-black font-semibold rounded-full shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-all"
                        onClick={handleSendMessage}
                        disabled={createDirectChat.isPending || isSelf}
                    >
                        {createDirectChat.isPending ? (
                            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                        ) : (
                            <MessageCircle className="h-5 w-5 mr-2" />
                        )}
                        {t('driver_details.send_message', 'Send Message')}
                    </Button>
                    {driver.phoneNumber && (
                        <Button
                            size="lg"
                            variant="outline"
                            className="rounded-full bg-emerald-500 hover:bg-emerald-600 text-white border-0 font-semibold"
                            onClick={handleCall}
                        >
                            <Phone className="h-5 w-5 mr-2" />
                            {t('guide_details.call', 'Call')}
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};
