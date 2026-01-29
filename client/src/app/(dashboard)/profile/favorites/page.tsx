import { FavoritesGrid } from "@/components/dashboard/favorites/FavoritesGrid";

export default function FavoritesPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">ფავორიტები</h1>
                <p className="text-muted-foreground">თქვენი შენახული ავტომობილების სია.</p>
            </div>

            <FavoritesGrid />
        </div>
    );
}
