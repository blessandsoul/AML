import { BidsTable } from "@/components/dashboard/dealer/BidsTable";

export default function DealerBidsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">ჩემი ბიდები</h1>
                <p className="text-muted-foreground">თქვენი აქტიური და დასრულებული ბიდები.</p>
            </div>

            <BidsTable />
        </div>
    );
}
