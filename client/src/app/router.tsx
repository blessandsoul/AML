import { createBrowserRouter, Navigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { HomePage } from '@/pages/HomePage';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { LoginPage } from '@/features/auth/pages/LoginPage';
import { RegisterPage } from '@/features/auth/pages/RegisterPage';
import { CompanyRegisterPage } from '@/features/auth/pages/CompanyRegisterPage';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DashboardPage } from '@/features/dashboard/pages/DashboardPage';
import { ProfilePage } from '@/features/users/pages/ProfilePage';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import { CompanyManagementPage } from '@/features/company/pages/CompanyManagementPage';
import { CreateAgentPage } from '@/features/company/pages/CreateAgentPage';
import { CompanyAgentsPage } from '@/features/company/pages/operations/CompanyAgentsPage';
import { OperationsLayout } from '@/features/company/pages/operations/OperationsLayout';
import { ChatsPage } from '@/features/chat/pages/ChatsPage';
import { AdminLayout } from '@/features/admin/pages/AdminLayout';
import { AdminUsersPage } from '@/features/admin/pages/AdminUsersPage';
import { AdminLocationsPage } from '@/features/admin/pages/AdminLocationsPage';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <MainLayout />,
        errorElement: <ErrorBoundary><div className="min-h-screen flex items-center justify-center"><h1>404</h1></div></ErrorBoundary>,
        children: [
            { index: true, element: <HomePage /> },
            {
                path: 'dashboard',
                element: <ProtectedRoute><DashboardLayout /></ProtectedRoute>,
                children: [
                    { index: true, element: <DashboardPage /> },
                    { path: 'profile', element: <ProfilePage /> },
                    { 
                        path: 'company', 
                        element: <ProtectedRoute allowedRoles={['COMPANY']}><CompanyManagementPage /></ProtectedRoute> 
                    },
                    {
                        path: 'operations',
                        element: <ProtectedRoute allowedRoles={['COMPANY']}><OperationsLayout /></ProtectedRoute>,
                        children: [
                            { index: true, element: <Navigate to="agents" replace /> },
                            { path: 'agents', element: <CompanyAgentsPage /> },
                        ]
                    },
                    { 
                        path: 'create-agent', 
                        element: <ProtectedRoute allowedRoles={['COMPANY']}><CreateAgentPage /></ProtectedRoute> 
                    },
                    {
                        path: 'admin',
                        element: <ProtectedRoute allowedRoles={['ADMIN']}><AdminLayout /></ProtectedRoute>,
                        children: [
                            { index: true, element: <Navigate to="locations" replace /> },
                            { path: 'locations', element: <AdminLocationsPage /> },
                            { path: 'users', element: <AdminUsersPage /> },
                        ]
                    },
                    { path: 'chats', element: <ChatsPage /> },
                    { path: 'chats/:chatId', element: <ChatsPage /> },
                ],
            },
        ],
    },
    { path: '/login', element: <LoginPage /> },
    { path: '/register', element: <RegisterPage /> },
    { path: '/register-company', element: <CompanyRegisterPage /> },
]);
