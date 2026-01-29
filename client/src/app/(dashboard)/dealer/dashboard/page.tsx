import { RecentActivity } from "@/components/dashboard/dealer/RecentActivity";
import { StatsCards } from "@/components/dashboard/dealer/StatsCards";
import { SalesChart } from "@/components/dashboard/dealer/SalesChart";

export default function DealerDashboardPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">მართვის პანელი</h1>
                <p className="text-muted-foreground">თქვენი ბიზნესის მიმოხილვა და სტატისტიკა.</p>
            </div>

            <StatsCards />

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <SalesChart />
                <RecentActivity />
            </div>
        </div>
    );
}
