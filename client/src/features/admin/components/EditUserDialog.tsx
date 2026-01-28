import { useState, useEffect } from 'react';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useUpdateUser } from '@/features/users/hooks/useUpdateUser';
import { useUpdateUserRole } from '@/features/users/hooks/useUpdateUserRole';
import { useRemoveUserRole } from '@/features/users/hooks/useRemoveUserRole';
import { USER_ROLES } from '@/lib/constants/app.constants';
import type { IUser } from '@/features/auth/types/auth.types';
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface EditUserDialogProps {
    user: IUser | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const EditUserDialog = ({ user, open, onOpenChange }: EditUserDialogProps) => {
    const { t } = useTranslation();
    const updateUser = useUpdateUser();
    const updateRole = useUpdateUserRole();
    const removeRole = useRemoveUserRole();

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        isActive: true,
    });
    // Local state to manage roles before saving
    const [currentRoles, setCurrentRoles] = useState<string[]>([]);
    const [newRole, setNewRole] = useState<string>('');

    useEffect(() => {
        if (user) {
            setFormData({
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                isActive: user.isActive,
            });
            setCurrentRoles(user.roles || []);
            setNewRole('');
        }
    }, [user]);

    const handleAddRole = () => {
        if (newRole && !currentRoles.includes(newRole)) {
            setCurrentRoles([...currentRoles, newRole]);
            setNewRole('');
        }
    };

    // When role is selected from dropdown, try to add it immediately or wait for button?
    // The previous UI had separate "Add" flow implicitly.
    // Let's explicitly add it when selected in the dropdown if that's the UX, 
    // BUT the previous code did `if (newRole) await ...` on verify.
    // Let's auto-add to the list when selected from dropdown to make it clear.
    useEffect(() => {
        if (newRole) {
            handleAddRole();
        }
    }, [newRole]);

    const handleRemoveRoleLocal = (role: string) => {
        setCurrentRoles(currentRoles.filter(r => r !== role));
    };

    const handleSubmit = async () => {
        if (!user) return;

        try {
            // 1. Update Profile Fields
            await updateUser.mutateAsync({
                userId: user.id,
                data: formData,
            });

            // 2. Calculate Role Changes
            const originalRoles = user.roles || [];

            // Roles to Add: in current but not in original
            const rolesToAdd = currentRoles.filter(r => !originalRoles.includes(r));

            // Roles to Remove: in original but not in current
            const rolesToRemove = originalRoles.filter(r => !currentRoles.includes(r));

            const promises = [
                ...rolesToAdd.map(role => updateRole.mutateAsync({ userId: user.id, role })),
                ...rolesToRemove.map(role => removeRole.mutateAsync({ userId: user.id, role }))
            ];

            await Promise.all(promises);

            onOpenChange(false);
        } catch (error) {
            // Handled by hooks
        }
    };

    const isPending = updateUser.isPending || updateRole.isPending || removeRole.isPending;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{t('admin.users.editUser', 'Edit User')}</DialogTitle>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="firstName">{t('admin.users.table.name', 'First Name')}</Label>
                            <Input
                                id="firstName"
                                value={formData.firstName}
                                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="lastName">{t('admin.users.table.surname', 'Last Name')}</Label>
                            <Input
                                id="lastName"
                                value={formData.lastName}
                                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">{t('admin.users.table.email', 'Email')}</Label>
                        <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>

                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="isActive"
                            checked={formData.isActive}
                            onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked as boolean })}
                        />
                        <Label htmlFor="isActive">{t('admin.users.active', 'Active Account')}</Label>
                    </div>

                    <div className="space-y-2 border-t pt-4 mt-2">
                        <Label>{t('admin.users.addRole', 'Add Role')}</Label>
                        <div className="flex gap-2">
                            <Select value={newRole} onValueChange={setNewRole}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder={t('admin.users.selectRolePlaceholder', 'Select a role')} />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.values(USER_ROLES)
                                        .filter(r => !currentRoles.includes(r)) // Filter out already selected roles
                                        .map((r) => (
                                            <SelectItem key={r} value={r}>
                                                {r}
                                            </SelectItem>
                                        ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <Label>{t('admin.users.currentRoles', 'Current Roles')}:</Label>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {currentRoles.map((role) => (
                                <Badge key={role} variant="outline" className="flex items-center gap-1">
                                    {role}
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-4 w-4 p-0 ml-1 hover:bg-destructive/10 hover:text-destructive rounded-full"
                                        onClick={() => handleRemoveRoleLocal(role)}
                                        disabled={isPending}
                                        title={t('admin.users.removeRole', 'Remove Role')}
                                        type="button" // Prevent form submission
                                    >
                                        <X className="h-3 w-3" />
                                    </Button>
                                </Badge>
                            ))}
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        {t('common.cancel', 'Cancel')}
                    </Button>
                    <Button onClick={handleSubmit} disabled={isPending}>
                        {isPending ? t('common.saving', 'Saving...') : t('common.save', 'Save')}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
