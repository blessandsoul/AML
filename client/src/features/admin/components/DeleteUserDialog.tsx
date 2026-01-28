import { useTranslation } from 'react-i18next';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useDeleteUser } from '@/features/users/hooks/useDeleteUser';
import type { IUser } from '@/features/auth/types/auth.types';

interface DeleteUserDialogProps {
    user: IUser | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const DeleteUserDialog = ({ user, open, onOpenChange }: DeleteUserDialogProps) => {
    const { t } = useTranslation();
    const deleteUser = useDeleteUser();

    const handleDelete = async () => {
        if (!user) return;

        try {
            await deleteUser.mutateAsync(user.id);
            onOpenChange(false);
        } catch (error) {
            // Error handled by hook
        }
    };

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{t('admin.users.deleteTitle', 'Delete User?')}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {t('admin.users.deleteConfirm', 'Are you sure you want to delete user {{email}}? This action cannot be undone.', { email: user?.email })}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={deleteUser.isPending}>{t('common.cancel', 'Cancel')}</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={(e) => {
                            e.preventDefault();
                            handleDelete();
                        }}
                        disabled={deleteUser.isPending}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                        {deleteUser.isPending ? t('common.deleting', 'Deleting...') : t('common.delete', 'Delete')}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};
