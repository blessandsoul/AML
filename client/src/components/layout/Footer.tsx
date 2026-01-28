import Link from 'next/link';
import { Car, Facebook, Instagram, Twitter } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Footer() {
    return (
        <footer className="bg-muted/30 border-t border-border pt-20 pb-12">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    {/* Brand */}
                    <div className="space-y-6">
                        <Link href="/" className="flex items-center gap-3">
                            <div className="bg-primary text-primary-foreground p-2 rounded-xl" suppressHydrationWarning>
                                <Car className="w-5 h-5" />
                            </div>
                            <span className="text-xl font-black tracking-tight text-foreground">Auto Market</span>
                        </Link>
                        <p className="text-muted-foreground text-sm leading-relaxed max-w-xs font-medium">
                            Your trusted partner for car auctions and logistics. Full service from bidding to delivery.
                        </p>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="font-bold text-foreground mb-6 uppercase tracking-wider text-xs">Company</h4>
                        <ul className="space-y-4 text-sm font-medium text-muted-foreground">
                            <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
                            <li><Link href="/contact" className="hover:text-primary transition-colors">Contacts</Link></li>
                            <li><Link href="/careers" className="hover:text-primary transition-colors">Careers</Link></li>
                            <li><Link href="/blog" className="hover:text-primary transition-colors">Blog</Link></li>
                        </ul>
                    </div>

                    {/* Services */}
                    <div>
                        <h4 className="font-bold text-foreground mb-6 uppercase tracking-wider text-xs">Services</h4>
                        <ul className="space-y-4 text-sm font-medium text-muted-foreground">
                            <li><Link href="/catalog" className="hover:text-primary transition-colors">Catalog</Link></li>
                            <li><Link href="/calculator" className="hover:text-primary transition-colors">Calculator</Link></li>
                            <li><Link href="/tracking" className="hover:text-primary transition-colors">Tracking</Link></li>
                            <li><Link href="/delivery" className="hover:text-primary transition-colors">Delivery</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="font-bold text-foreground mb-6 uppercase tracking-wider text-xs">Social</h4>
                        <div className="flex gap-3">
                            <Link href="#" className="p-3 bg-background hover:bg-primary hover:text-primary-foreground rounded-full transition-all border border-border shadow-sm hover:shadow-md hover:-translate-y-1">
                                <Facebook className="w-5 h-5" />
                            </Link>
                            <Link href="#" className="p-3 bg-background hover:bg-primary hover:text-primary-foreground rounded-full transition-all border border-border shadow-sm hover:shadow-md hover:-translate-y-1">
                                <Instagram className="w-5 h-5" />
                            </Link>
                            <Link href="#" className="p-3 bg-background hover:bg-primary hover:text-primary-foreground rounded-full transition-all border border-border shadow-sm hover:shadow-md hover:-translate-y-1">
                                <Twitter className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="border-t border-border pt-8 text-center text-sm font-medium text-muted-foreground">
                    <p suppressHydrationWarning>&copy; {new Date().getFullYear()} Auto Market LGC. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
