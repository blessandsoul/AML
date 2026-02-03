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
                            <span className="text-xl font-black tracking-tight text-foreground">ავტო მარკეტი</span>
                        </Link>
                        <p className="text-muted-foreground text-sm leading-relaxed max-w-xs font-medium">
                            თქვენი სანდო პარტნიორი ავტო აუქციონებსა და ლოჯისტიკაში. სრული მომსახურება ყიდვიდან ჩაბარებამდე.
                        </p>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="font-bold text-foreground mb-6 uppercase tracking-wider text-xs">კომპანია</h4>
                        <ul className="space-y-4 text-sm font-medium text-muted-foreground">
                            <li><Link href="/about" className="hover:text-primary transition-colors">ჩვენს შესახებ</Link></li>
                            <li><Link href="/reviews" className="hover:text-primary transition-colors">მიმოხილვები</Link></li>
                            <li><Link href="/contact" className="hover:text-primary transition-colors">კონტაქტი</Link></li>
                            <li><Link href="/blog" className="hover:text-primary transition-colors">ბლოგი</Link></li>
                        </ul>
                    </div>

                    {/* Services */}
                    <div>
                        <h4 className="font-bold text-foreground mb-6 uppercase tracking-wider text-xs">სერვისები</h4>
                        <ul className="space-y-4 text-sm font-medium text-muted-foreground">
                            <li><Link href="/catalog" className="hover:text-primary transition-colors">კატალოგი</Link></li>
                            <li><Link href="/calculator" className="hover:text-primary transition-colors">კალკულატორი</Link></li>
                            <li><Link href="/track" className="hover:text-primary transition-colors">თრექინგი</Link></li>
                            <li><Link href="/delivery" className="hover:text-primary transition-colors">ტრანსპორტირება</Link></li>
                        </ul>
                    </div>

                    {/* Contact & Addresses */}
                    <div>
                        <h4 className="font-bold text-foreground mb-6 uppercase tracking-wider text-xs">მისამართები</h4>
                        <ul className="space-y-4 text-sm font-medium text-muted-foreground">
                            <li className="flex items-start gap-3">
                                <div className="w-5 h-3.5 mt-1 rounded-sm overflow-hidden relative shadow-sm">
                                    <svg viewBox="0 0 640 480" className="w-full h-full object-cover">
                                        <path fill="#fff" d="M0 0h640v480H0z" />
                                        <path fill="#f00" d="M260 0h120v480H260zM0 180h640v120H0z" />
                                        <g fill="#f00">
                                            <path d="M100 60h60v60h-60zM500 60h60v60h-60zM100 360h60v60h-60zM500 360h60v60h-60z" />
                                        </g>
                                    </svg>
                                </div>
                                <span className="flex-1">2 Dimitri Uznadze St, Tbilisi, GE</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <div className="w-5 h-3.5 mt-1 rounded-sm overflow-hidden relative shadow-sm">
                                    <svg viewBox="0 0 640 480" className="w-full h-full object-cover">
                                        <path fill="#fff" d="M0 0h640v480H0z" />
                                        <path fill="#f00" d="M260 0h120v480H260zM0 180h640v120H0z" />
                                        <g fill="#f00">
                                            <path d="M100 60h60v60h-60zM500 60h60v60h-60zM100 360h60v60h-60zM500 360h60v60h-60z" />
                                        </g>
                                    </svg>
                                </div>
                                <span className="flex-1">77 K Cholokashvili St, Batumi, GE</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <div className="w-5 h-3.5 mt-1 rounded-sm overflow-hidden relative shadow-sm">
                                    <svg viewBox="0 0 640 480" className="w-full h-full object-cover">
                                        <g fillRule="evenodd" strokeWidth="1pt">
                                            <path fill="#ffd700" d="M0 0h640v240H0z" />
                                            <path fill="#0057b8" d="M0 240h640v240H0z" />
                                        </g>
                                    </svg>
                                </div>
                                <span className="flex-1">48А Hanny Mykhailenko St, Odesa, UA</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <div className="w-5 h-3.5 mt-1 rounded-sm overflow-hidden relative shadow-sm">
                                    <svg viewBox="0 0 1235 650" className="w-full h-full object-cover">
                                        <path fill="#b22234" d="M0 0h1235v650H0z" />
                                        <path fill="#fff" d="M0 50h1235v50H0M0 150h1235v50H0M0 250h1235v50H0M0 350h1235v50H0M0 450h1235v50H0M0 550h1235v50H0" />
                                        <path fill="#3c3b6e" d="M0 0h494v350H0z" />
                                    </svg>
                                </div>
                                <span className="flex-1">3635 Trailmobile Rd, Houston, TX, US</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-border pt-8 text-center text-sm font-medium text-muted-foreground">
                    <p suppressHydrationWarning>&copy; {new Date().getFullYear()} Auto Market LGC. ყველა უფლება დაცულია.</p>
                </div>
            </div>
        </footer>
    );
}
