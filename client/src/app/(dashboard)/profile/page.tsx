import { ProfileForm } from "@/components/dashboard/profile/ProfileForm";
import { SecurityCard } from "@/components/dashboard/profile/SecurityCard";
import { ShieldCheck } from "lucide-react";

export default function ProfilePage() {
    return (
        <div className="space-y-8 max-w-5xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">ჩემი პროფილი</h1>
                    <p className="text-muted-foreground mt-1">მართეთ თქვენი პირადი ინფორმაცია და უსაფრთხოება.</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-600 rounded-full w-fit border border-emerald-500/20">
                    <ShieldCheck className="w-5 h-5" />
                    <span className="font-bold text-sm">ვერიფიცირებული</span>
                </div>
            </div>

            <div className="grid gap-8">
                <ProfileForm />
                <SecurityCard />
            </div>
        </div>
    );
}
