import { useTranslation } from 'react-i18next';
import {
    Star,
    MapPin,
    Clock,
    MessageCircle,
    Phone,
    Globe,
    Award,
    CheckCircle2,
    Loader2,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/cn';
import { getMediaUrl } from '@/lib/utils/media';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useCreateDirectChat } from '@/features/chat/hooks/useChats';
import { selectChat } from '@/features/chat/store/chatSlice';
import { useAppDispatch } from '@/store/hooks';
import type { Guide, Location, GuideLocation } from '../types/guide.types';

interface GuideHeaderProps {
    guide: Guide;
    className?: string;
}

export const GuideHeader = ({ guide, className }: GuideHeaderProps) => {
    const { t } = useTranslation();
    const { isAuthenticated, user } = useAuth();
    const dispatch = useAppDispatch();
    const createDirectChat = useCreateDirectChat();

    const fullName = guide.user
        ? `${guide.user.firstName} ${guide.user.lastName}`
        : t('guide_details.unknown_guide', 'Unknown Guide');

    const photoUrl = guide.photoUrl ? getMediaUrl(guide.photoUrl) : getMediaUrl(null);
    const rating = guide.averageRating ? parseFloat(guide.averageRating) : null;

    // Handle both flat Location[] and nested GuideLocation[] formats
    const getLocations = (): Location[] => {
        if (!guide.locations || guide.locations.length === 0) return [];

        // Check if it's the nested format (GuideLocation[])
        const firstItem = guide.locations[0];
        if ('location' in firstItem && firstItem.location) {
            return (guide.locations as GuideLocation[])
                .filter(gl => gl.location)
                .map(gl => gl.location as Location);
        }

        // It's already flat Location[]
        return guide.locations as Location[];
    };

    const locations = getLocations();
    const primaryLocation = locations[0];

    // Check if user is trying to message themselves
    const isSelf = user?.id === guide.userId;

    const handleSendMessage = () => {
        if (!isAuthenticated) {
            toast.error(t('common.login_required', 'Please log in to send messages'));
            return;
        }

        if (isSelf) {
            toast.error(t('common.cannot_message_self', 'You cannot message yourself'));
            return;
        }

        if (!guide.userId) {
            toast.error(t('common.error', 'Unable to start chat'));
            return;
        }

        createDirectChat.mutate(
            { otherUserId: guide.userId },
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
        if (guide.phoneNumber) {
            window.location.href = `tel:${guide.phoneNumber}`;
        }
    };

    // Safe language parsing helper
    const getLanguages = (): string[] => {
        if (!guide.languages) return [];
        if (Array.isArray(guide.languages)) return guide.languages;
        if (typeof guide.languages === 'string') {
            try {
                const parsed = JSON.parse(guide.languages);
                return Array.isArray(parsed) ? parsed : [];
            } catch (e) {
                console.error('Failed to parse languages:', e);
                return [];
            }
        }
        return [];
    };

    const languagesArray = getLanguages();

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
                                    {guide.isVerified && (
                                        <CheckCircle2 className="h-6 w-6 text-cyan-500 shrink-0" />
                                    )}
                                </div>

                                {/* Specialty/Bio snippet */}
                                {guide.bio && (
                                    <p className="text-muted-foreground text-sm md:text-base mb-3 line-clamp-2 md:line-clamp-3">
                                        {guide.bio}
                                    </p>
                                )}

                                {/* Location */}
                                {primaryLocation && (
                                    <div className="flex items-center gap-2 text-muted-foreground text-sm mb-4">
                                        <MapPin className="h-4 w-4 text-cyan-500" />
                                        <span>
                                            {primaryLocation.name}
                                            {primaryLocation.country && `, ${primaryLocation.country}`}
                                        </span>
                                    </div>
                                )}

                                {/* Quick Stats */}
                                <div className="flex flex-wrap items-center gap-3">
                                    {guide.yearsOfExperience && (
                                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full">
                                            <Clock className="h-3.5 w-3.5 text-cyan-500" />
                                            <span>{guide.yearsOfExperience} {t('guide_details.years_exp', 'years exp.')}</span>
                                        </div>
                                    )}
                                    {languagesArray.length > 0 && (
                                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full">
                                            <Globe className="h-3.5 w-3.5 text-cyan-500" />
                                            <span>{languagesArray.slice(0, 3).join(', ')}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Rating */}
                            <div className="flex flex-col items-start md:items-end gap-1 shrink-0">
                                <div className="flex items-center gap-1">
                                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                                    <span className="text-xl font-bold text-foreground">
                                        {rating ? rating.toFixed(1) : '-'}
                                    </span>
                                </div>
                                <span className="text-sm text-muted-foreground">
                                    {guide.reviewCount} {t('guide_details.reviews', 'reviews')}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Language Badges - shown as pills */}
                {languagesArray.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t border-border">
                        <Award className="h-5 w-5 text-amber-500 mr-1" />
                        {languagesArray.map((lang, index) => (
                            <Badge
                                key={index}
                                variant="secondary"
                                className="bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20"
                            >
                                {lang}
                            </Badge>
                        ))}
                    </div>
                )}

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
                        {t('guide_details.send_message', 'Send Message')}
                    </Button>
                    {guide.phoneNumber && (
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
