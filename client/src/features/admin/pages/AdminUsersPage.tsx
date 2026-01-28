import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useUsers } from "@/features/users/hooks/useUsers";
import { useOnlineUsers } from "@/features/presence/hooks/useOnlineUsers";

import { Badge } from "@/components/ui/badge";
import { OnlineIndicator } from "@/components/common/OnlineIndicator";
import { Users } from "lucide-react";
import { DataTable } from '@/components/common/DataTable';
import type { ColumnDef } from '@/components/common/DataTable';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { EditUserDialog } from "../components/EditUserDialog";
import { DeleteUserDialog } from "../components/DeleteUserDialog";
import { formatDate } from "@/lib/utils/format";
import type { IUser } from "@/features/auth/types/auth.types";
import { CreateUserDialog } from "../components/CreateUserDialog";
import { UserDetailsModal } from "../components/UserDetailsModal";

const ITEMS_PER_PAGE = 10;

export const AdminUsersPage = () => {
    const { t } = useTranslation();
    const [page, setPage] = useState(1);
    const [userToEdit, setUserToEdit] = useState<IUser | null>(null);
    const [userToDelete, setUserToDelete] = useState<IUser | null>(null);
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

    const { data, isLoading, error } = useUsers({
        page,
        limit: ITEMS_PER_PAGE,
    });

    const { isUserOnline, onlineCount } = useOnlineUsers();

    const users = data?.items || [];
    const pagination = data?.pagination;

    const columns: ColumnDef<IUser>[] = useMemo(() => [
        {
            header: t('admin.users.table.name', 'Name'),
            cell: (user) => (
                <div className="font-medium">
                    {user.firstName} {user.lastName}
                </div>
            ),
            className: "w-[250px]"
        },
        {
            header: t('admin.users.table.online', 'Online'),
            cell: (user) => (
                <OnlineIndicator
                    isOnline={isUserOnline(user.id)}
                    showLabel
                />
            ),
            className: "w-[100px]"
        },
        {
            header: t('admin.users.table.email', 'Email'),
            accessorKey: 'email'
        },
        {
            header: t('admin.users.table.role', 'Role'),
            cell: (user) => (
                <div className="flex gap-1 flex-wrap">
                    {(user.roles || []).map((role) => (
                        <Badge key={role} variant="outline" className="text-xs">
                            {role}
                        </Badge>
                    ))}
                </div>
            )
        },
        {
            header: t('admin.users.table.status', 'Status'),
            cell: (user) => (
                <Badge
                    variant={user.isActive ? "default" : "secondary"}
                    className={
                        user.isActive
                            ? "bg-green-100 text-green-800 hover:bg-green-100/80 border-green-200"
                            : "bg-gray-100 text-gray-800 hover:bg-gray-100/80 border-gray-200"
                    }
                >
                    {user.isActive ? t('common.active') : t('common.inactive')}
                </Badge>
            )
        },
        {
            header: t('admin.users.table.joined', 'Joined'),
            cell: (user) => (
                <div className="text-muted-foreground">
                    {formatDate(user.createdAt)}
                </div>
            )
        }
    ], [t, isUserOnline]);

    if (error) {
        return <ErrorMessage error={error} />;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">
                        {t('admin.users.title', 'Users')}
                    </h2>
                    <p className="text-muted-foreground">
                        {t('admin.users.subtitle', 'Manage users and roles.')}
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    {onlineCount > 0 && (
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground hidden sm:block">
                            <span className="inline-block h-2 w-2 rounded-full bg-green-500" />
                            <span>
                                {t('admin.users.online_count', '{{count}} online', {
                                    count: onlineCount,
                                })}
                            </span>
                        </div>
                    )}
                    {pagination && (
                        <p className="text-sm text-muted-foreground hidden sm:block">
                            {t('admin.users.showing_count', 'Showing {{count}} of {{total}} users', {
                                count: users.length,
                                total: pagination.totalItems,
                            })}
                        </p>
                    )}
                    <CreateUserDialog />
                </div>
            </div>

            <DataTable
                data={users}
                columns={columns}
                isLoading={isLoading}
                onRowClick={(user) => setSelectedUserId(user.id)}
                onEdit={setUserToEdit}
                onDelete={setUserToDelete}
                pagination={pagination && {
                    page: pagination.page,
                    totalPages: pagination.totalPages,
                    onPageChange: setPage,
                    hasPreviousPage: pagination.hasPreviousPage,
                    hasNextPage: pagination.hasNextPage,
                    totalItems: pagination.totalItems
                }}
                emptyState={{
                    icon: Users,
                    title: t('admin.users.empty_state', 'No users found.')
                }}
            />

            <EditUserDialog
                user={userToEdit}
                open={!!userToEdit}
                onOpenChange={(open) => !open && setUserToEdit(null)}
            />

            <DeleteUserDialog
                user={userToDelete}
                open={!!userToDelete}
                onOpenChange={(open) => !open && setUserToDelete(null)}
            />

            <UserDetailsModal
                userId={selectedUserId}
                open={!!selectedUserId}
                onOpenChange={(open) => !open && setSelectedUserId(null)}
            />
        </div>
    );
};
