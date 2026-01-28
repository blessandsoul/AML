
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatDate } from "@/lib/utils/format";
import { useUser } from "@/features/users/hooks/useUsers";
import { Loader2, Mail, Calendar, Shield, Building, MapPin, Car } from "lucide-react";

interface UserDetailsModalProps {
    userId: string | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const UserDetailsModal = ({ userId, open, onOpenChange }: UserDetailsModalProps) => {
    const { t } = useTranslation();
    const { data: user, isLoading, error } = useUser(userId || undefined);
    const [activeTab, setActiveTab] = useState("overview");

    if (!open) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{t('admin.users.details.title', 'User Details')}</DialogTitle>
                    <DialogDescription>
                        {t('admin.users.details.subtitle', 'View full information about this user.')}
                    </DialogDescription>
                </DialogHeader>

                {isLoading ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : error ? (
                    <div className="text-destructive p-4 text-center">
                        {t('common.error_loading', 'Error loading user details')}
                    </div>
                ) : user ? (
                    <div className="space-y-6">
                        {/* Header Info */}
                        <div className="flex items-start justify-between">
                            <div>
                                <h3 className="text-xl font-bold">{user.firstName} {user.lastName}</h3>
                                <div className="flex items-center gap-2 text-muted-foreground mt-1">
                                    <Mail className="h-4 w-4" />
                                    <span>{user.email}</span>
                                    {user.emailVerified && (
                                        <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                                            {t('common.verified', 'Verified')}
                                        </Badge>
                                    )}
                                </div>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                                <Badge variant={user.isActive ? "default" : "destructive"}>
                                    {user.isActive ? t('common.active', 'Active') : t('common.inactive', 'Inactive')}
                                </Badge>
                                <span className="text-xs text-muted-foreground">{t('common.id', 'ID')}: {user.id}</span>
                            </div>
                        </div>

                        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                            <TabsList className="w-full justify-start overflow-x-auto">
                                <TabsTrigger value="overview">{t('admin.users.details.tabs.overview', 'Overview')}</TabsTrigger>
                                {user.companyProfile && <TabsTrigger value="company">{t('admin.users.details.tabs.company', 'Company')}</TabsTrigger>}
                                {user.guideProfile && <TabsTrigger value="guide">{t('admin.users.details.tabs.guide', 'Guide')}</TabsTrigger>}
                                {user.driverProfile && <TabsTrigger value="driver">{t('admin.users.details.tabs.driver', 'Driver')}</TabsTrigger>}
                            </TabsList>

                            <TabsContent value="overview" className="space-y-4 mt-4">
                                {/* Roles */}
                                <div className="space-y-2">
                                    <h4 className="text-sm font-medium flex items-center gap-2">
                                        <Shield className="h-4 w-4" /> {t('admin.users.details.roles', 'Roles')}
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {(user.roles || []).map(role => (
                                            <Badge key={role} variant="outline">{role}</Badge>
                                        ))}
                                    </div>
                                </div>

                                {/* Dates */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <span className="text-sm text-muted-foreground flex items-center gap-1">
                                            <Calendar className="h-3 w-3" /> {t('common.created_at', 'Created')}
                                        </span>
                                        <p>{formatDate(user.createdAt)}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <span className="text-sm text-muted-foreground flex items-center gap-1">
                                            <Calendar className="h-3 w-3" /> {t('common.updated_at', 'Updated')}
                                        </span>
                                        <p>{formatDate(user.updatedAt)}</p>
                                    </div>
                                </div>
                            </TabsContent>

                            {/* Company Profile */}
                            {user.companyProfile && (
                                <TabsContent value="company" className="space-y-4 mt-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Building className="h-5 w-5 text-primary" />
                                        <h4 className="font-semibold text-lg">{user.companyProfile.companyName}</h4>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <span className="text-muted-foreground">{t('admin.users.details.company.reg_number', 'Reg. Number')}:</span>
                                            <p>{user.companyProfile.registrationNumber || '-'}</p>
                                        </div>
                                        <div>
                                            <span className="text-muted-foreground">{t('common.phone', 'Phone')}:</span>
                                            <p className="flex items-center gap-1">
                                                {user.companyProfile.phoneNumber || '-'}
                                            </p>
                                        </div>
                                        <div>
                                            <span className="text-muted-foreground">{t('common.website', 'Website')}:</span>
                                            <p>{user.companyProfile.websiteUrl || '-'}</p>
                                        </div>
                                        <div>
                                            <span className="text-muted-foreground">{t('common.status', 'Status')}:</span>
                                            <p>{user.companyProfile.isVerified ? t('common.verified', 'Verified') : t('common.pending', 'Pending')}</p>
                                        </div>
                                        <div className="col-span-2">
                                            <span className="text-muted-foreground">{t('common.description', 'Description')}:</span>
                                            <p className="mt-1">{user.companyProfile.description || '-'}</p>
                                        </div>
                                    </div>
                                </TabsContent>
                            )}

                            {/* Guide Profile */}
                            {user.guideProfile && (
                                <TabsContent value="guide" className="space-y-4 mt-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <MapPin className="h-5 w-5 text-primary" />
                                        <h4 className="font-semibold text-lg">{t('admin.users.details.guide.title', 'Guide Profile')}</h4>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <span className="text-muted-foreground">{t('admin.users.details.guide.languages', 'Languages')}:</span>
                                            {/* Assuming languages is a JSON string or array depending on parsing. 
                                                Server sends JSON string. Client type says string | null.
                                                We should try to parse if string, or display. 
                                            */}
                                            <p>{formatLanguages(user.guideProfile.languages)}</p>
                                        </div>
                                        <div>
                                            <span className="text-muted-foreground">{t('admin.users.details.guide.experience', 'Experience')}:</span>
                                            <p>{user.guideProfile.yearsOfExperience} {t('common.years', 'years')}</p>
                                        </div>
                                        <div>
                                            <span className="text-muted-foreground">{t('common.phone', 'Phone')}:</span>
                                            <p>{user.guideProfile.phoneNumber || '-'}</p>
                                        </div>
                                        <div>
                                            <span className="text-muted-foreground">{t('common.verification', 'Verification')}:</span>
                                            <p>{user.guideProfile.isVerified ? t('common.verified', 'Verified') : t('common.pending', 'Pending')}</p>
                                        </div>
                                        <div className="col-span-2">
                                            <span className="text-muted-foreground">{t('common.bio', 'Bio')}:</span>
                                            <p className="mt-1">{user.guideProfile.bio || '-'}</p>
                                        </div>
                                    </div>
                                </TabsContent>
                            )}

                            {/* Driver Profile */}
                            {user.driverProfile && (
                                <TabsContent value="driver" className="space-y-4 mt-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Car className="h-5 w-5 text-primary" />
                                        <h4 className="font-semibold text-lg">{t('admin.users.details.driver.title', 'Driver Profile')}</h4>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <span className="text-muted-foreground">{t('admin.users.details.driver.vehicle', 'Vehicle')}:</span>
                                            <p>{user.driverProfile.vehicleMake} {user.driverProfile.vehicleModel} ({user.driverProfile.vehicleYear})</p>
                                        </div>
                                        <div>
                                            <span className="text-muted-foreground">{t('admin.users.details.driver.capacity', 'Capacity')}:</span>
                                            <p>{user.driverProfile.vehicleCapacity} {t('common.seats', 'seats')}</p>
                                        </div>
                                        <div>
                                            <span className="text-muted-foreground">{t('admin.users.details.driver.type', 'Type')}:</span>
                                            <p>{user.driverProfile.vehicleType || '-'}</p>
                                        </div>
                                        <div>
                                            <span className="text-muted-foreground">{t('admin.users.details.driver.license', 'License')}:</span>
                                            <p>{user.driverProfile.licenseNumber || '-'}</p>
                                        </div>
                                        <div>
                                            <span className="text-muted-foreground">{t('common.phone', 'Phone')}:</span>
                                            <p>{user.driverProfile.phoneNumber || '-'}</p>
                                        </div>
                                        <div>
                                            <span className="text-muted-foreground">{t('common.status', 'Status')}:</span>
                                            <p>{user.driverProfile.isVerified ? t('common.verified', 'Verified') : t('common.pending', 'Pending')}</p>
                                        </div>
                                        <div className="col-span-2">
                                            <span className="text-muted-foreground">{t('common.bio', 'Bio')}:</span>
                                            <p className="mt-1">{user.driverProfile.bio || '-'}</p>
                                        </div>
                                    </div>
                                </TabsContent>
                            )}
                        </Tabs>
                    </div>
                ) : null}
            </DialogContent>
        </Dialog>
    );
};

// Helper to format languages
function formatLanguages(languages: string | null | undefined): string {
    if (!languages) return '-';
    try {
        // If it's a JSON string array
        const parsed = JSON.parse(languages);
        if (Array.isArray(parsed)) return parsed.join(', ');
        return languages;
    } catch {
        // If it's just a string or fails to parse
        return languages;
    }
}
