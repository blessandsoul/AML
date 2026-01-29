import { SettingsForm } from "@/components/dashboard/shared/SettingsForm";

export default function SettingsPage() {
    return (
        <div className="space-y-6 max-w-4xl">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">პარამეტრები</h1>
                <p className="text-muted-foreground">მართეთ თქვენი ანგარიშის პარამეტრები.</p>
            </div>

            <SettingsForm />
        </div>
    );
}
