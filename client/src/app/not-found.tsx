import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Car, Home, Search } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 text-center">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6 animate-bounce">
                <Car className="w-12 h-12 text-muted-foreground" />
            </div>

            <h1 className="text-4xl md:text-6xl font-black text-foreground mb-4">404</h1>
            <h2 className="text-xl md:text-2xl font-bold text-foreground mb-6">
                გვერდი ვერ მოიძებნა
            </h2>

            <p className="text-muted-foreground max-w-md mb-8 leading-relaxed">
                სამწუხაროდ, თქვენ მიერ მოთხოვნილი გვერდი არ არსებობს ან გადატანილია.
                შესაძლოა მისამართი არასწორად აკრიფეთ.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="rounded-xl font-bold">
                    <Link href="/">
                        <Home className="w-4 h-4 mr-2" />
                        მთავარზე დაბრუნება
                    </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="rounded-xl font-bold">
                    <Link href="/catalog">
                        <Search className="w-4 h-4 mr-2" />
                        კატალოგში გადასვლა
                    </Link>
                </Button>
            </div>
        </div>
    );
}
