import { InvoiceTable } from "@/components/dashboard/dealer/InvoiceTable";

export default function DealerInvoicesPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">ინვოისები</h1>
                <p className="text-muted-foreground">თქვენი ფინანსური დოკუმენტები და გადახდები.</p>
            </div>

            <InvoiceTable />
        </div>
    );
}
