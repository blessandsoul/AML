import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useUpdateUserRole } from '@/features/users/hooks/useUpdateUserRole';
import { USER_ROLES } from '@/lib/constants/app.constants';
import type { IUser } from '@/features/auth/types/auth.types';

interface UpdateRoleDialogProps {
    user: IUser | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const UpdateRoleDialog = ({ user, open, onOpenChange }: UpdateRoleDialogProps) => {
    const { t } = useTranslation();
    const [role, setRole] = useState<string>('');
    const updateRole = useUpdateUserRole();

    const handleSubmit = async () => {
        if (!user || !role) return;

        try {
            await updateRole.mutateAsync({ userId: user.id, role });
            onOpenChange(false);
            setRole('');
        } catch (error) {
            // Error handled by hook
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t('admin.users.updateRole', 'Update User Role')}</DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label>{t('admin.users.selectRole', 'Select Role to Add')}</Label>
                        <Select value={role} onValueChange={setRole}>
                            <SelectTrigger>
                                <SelectValue placeholder={t('admin.users.selectRolePlaceholder', 'Select a role')} />
                            </SelectTrigger>
                            <SelectContent>
                                {Object.values(USER_ROLES).map((r) => (
                                    <SelectItem key={r} value={r}>
                                        {r}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        {t('admin.users.currentRoles', 'Current Roles')}: {user?.roles?.join(', ')}
                    </p>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        {t('common.cancel', 'Cancel')}
                    </Button>
                    <Button onClick={handleSubmit} disabled={!role || updateRole.isPending}>
                        {updateRole.isPending ? t('common.saving', 'Saving...') : t('common.save', 'Save')}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
