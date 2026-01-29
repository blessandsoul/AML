import { InventoryTable } from "@/components/dashboard/dealer/InventoryTable";

export default function DealerListingsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">ჩემი განცხადებები</h1>
                <p className="text-muted-foreground">მართეთ თქვენი ავტოპარკი და გაყიდვები.</p>
            </div>

            <InventoryTable />
        </div>
    );
}
