import { InventoryTable } from "@/components/dashboard/dealer/InventoryTable";

export default function DealerListingsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">ჩემი განცხადებები</h1>
                <p className="text-muted-foreground">მართეთ თქვენი ავტოპარკი და გაყიდვები.</p>
                <div className="mt-4 p-4 bg-muted/50 rounded-lg border text-sm text-muted-foreground">
                    <p>
                        ეს მოდული მისცემს საშუალებას დილერს, გაყიდოს გზიდან ჩამოსაყვანი ან პრობლემური ავტომობილი ჩვენთანვე საიტზე, რადგან ადამიანები ვინებიც ეძებენ მანქანებს ჩვენ გვყავს. ეს გაამოვა იგივე რასაც ლაიონი თუ კავკასუსი აკეთებს, ოღონდ ჩვენთან ეს ჩვენთვის უფასოდ იქნება და დილერის თანხაშიც შეგვიძლია წილში გასვლა (ზემოდან)
                    </p>
                </div>
            </div>

            <InventoryTable />
        </div>
    );
}
