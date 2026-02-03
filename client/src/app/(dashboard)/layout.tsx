import { Sidebar } from '@/components/dashboard/Sidebar';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-[calc(100vh-80px)] container mx-auto gap-2 pt-10 md:pt-8">
            <Sidebar />
            <main className="flex-1 py-6 px-4 md:px-6 lg:py-8 overflow-x-hidden">
                {children}
            </main>
        </div>
    );
}
