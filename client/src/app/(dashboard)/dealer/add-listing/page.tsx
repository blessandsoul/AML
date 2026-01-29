import { ListingWizard } from "@/components/dashboard/dealer/ListingWizard";

export default function AddListingPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">განცხადების დამატება</h1>
                <p className="text-muted-foreground">ატვირთეთ ახალი ავტომობილი გასაყიდად.</p>
            </div>

            <ListingWizard />
        </div>
    );
}
