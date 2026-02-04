import Link from 'next/link';
import { Car, Facebook, Instagram, Twitter } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Footer() {
    return (
        <footer className="bg-background border-t border-border/40 relative overflow-hidden">
            {/* Decorational background elements */}
            <div className="absolute inset-0 bg-grid-slate-50/[0.04] -z-10" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-background via-muted/20 to-muted/50 -z-10" />

            <div className="container mx-auto px-4 pt-16 pb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
                    {/* Brand & Socials (Col 1-4) */}
                    <div className="md:col-span-2 lg:col-span-4 space-y-6">
                        <Link href="/" className="inline-flex items-center gap-3 group">
                            <div className="bg-primary text-primary-foreground p-2.5 rounded-xl shadow-lg shadow-primary/20 transition-transform group-hover:scale-105" suppressHydrationWarning>
                                <Car className="w-6 h-6" />
                            </div>
                            <span className="text-2xl font-black tracking-tight text-foreground">Auto Market Logistic</span>
                        </Link>
                        <p className="text-muted-foreground text-sm leading-relaxed max-w-sm font-medium">
                            თქვენი სანდო პარტნიორი ავტო აუქციონებსა და ლოჯისტიკაში. სრული მომსახურება ყიდვიდან ჩაბარებამდე.
                        </p>

                        {/* Social Links */}
                        <div className="flex items-center gap-3 pt-2">
                            <SocialButton href="#" icon={Facebook} label="Facebook" />
                            <SocialButton href="#" icon={Instagram} label="Instagram" />
                            <SocialButton href="#" icon={Twitter} label="Twitter" />
                        </div>
                    </div>

                    {/* Links Group (Col 5-8) - 2 Columns on Mobile */}
                    <div className="md:col-span-2 lg:col-span-4 grid grid-cols-2 gap-8">
                        {/* Company */}
                        <div>
                            <h4 className="font-bold text-foreground mb-6 uppercase tracking-wider text-xs flex items-center gap-2">
                                <span className="w-1 h-4 bg-primary rounded-full"></span>
                                კომპანია
                            </h4>
                            <ul className="space-y-3.5">
                                <FooterLink href="/about">ჩვენს შესახებ</FooterLink>
                                <FooterLink href="/reviews">მიმოხილვები</FooterLink>
                                <FooterLink href="/contact">კონტაქტი</FooterLink>
                                <FooterLink href="/blog">ბლოგი</FooterLink>
                            </ul>
                        </div>

                        {/* Services */}
                        <div>
                            <h4 className="font-bold text-foreground mb-6 uppercase tracking-wider text-xs flex items-center gap-2">
                                <span className="w-1 h-4 bg-primary rounded-full"></span>
                                სერვისები
                            </h4>
                            <ul className="space-y-3.5">
                                <FooterLink href="/catalog">კატალოგი</FooterLink>
                                <FooterLink href="/calculator">კალკულატორი</FooterLink>
                                <FooterLink href="/track">თრექინგი</FooterLink>
                                <FooterLink href="/delivery">ტრანსპორტირება</FooterLink>
                            </ul>
                        </div>
                    </div>

                    {/* Contact & Addresses (Col 9-12) */}
                    <div className="md:col-span-2 lg:col-span-4">
                        <h4 className="font-bold text-foreground mb-6 uppercase tracking-wider text-xs flex items-center gap-2">
                            <span className="w-1 h-4 bg-primary rounded-full"></span>
                            მისამართები
                        </h4>
                        <ul className="space-y-4">
                            <AddressItem
                                flag={
                                    <svg viewBox="0 0 640 480" className="w-full h-full object-cover">
                                        <path fill="#fff" d="M0 0h640v480H0z" />
                                        <path fill="#f00" d="M260 0h120v480H260zM0 180h640v120H0z" />
                                        <g fill="#f00">
                                            <path d="M100 60h60v60h-60zM500 60h60v60h-60zM100 360h60v60h-60zM500 360h60v60h-60z" />
                                        </g>
                                    </svg>
                                }
                                text="დიმიტრი უზნაძის 2, თბილისი, საქართველო"
                            />
                            <AddressItem
                                flag={
                                    <svg viewBox="0 0 640 480" className="w-full h-full object-cover">
                                        <path fill="#fff" d="M0 0h640v480H0z" />
                                        <path fill="#f00" d="M260 0h120v480H260zM0 180h640v120H0z" />
                                        <g fill="#f00">
                                            <path d="M100 60h60v60h-60zM500 60h60v60h-60zM100 360h60v60h-60zM500 360h60v60h-60z" />
                                        </g>
                                    </svg>
                                }
                                text="ქ. ჩოლოყაშვილის 77, ბათუმი, საქართველო"
                            />
                            <AddressItem
                                flag={
                                    <svg viewBox="0 0 640 480" className="w-full h-full object-cover">
                                        <g fillRule="evenodd" strokeWidth="1pt">
                                            <path fill="#ffd700" d="M0 0h640v240H0z" />
                                            <path fill="#0057b8" d="M0 240h640v240H0z" />
                                        </g>
                                    </svg>
                                }
                                text="ჰანი მიხაილენკოს 48ა, ოდესა, უკრაინა"
                            />
                        </ul>
                    </div>
                </div>

                <div className="border-t border-border pt-8 mt-8 flex flex-col md:flex-row items-center justify-center md:justify-between gap-4 text-center md:text-left">
                    <p className="text-sm font-medium text-muted-foreground" suppressHydrationWarning>
                        &copy; {new Date().getFullYear()} Auto Market Logistic. ყველა უფლება დაცულია.
                    </p>
                    <div className="flex items-center gap-6 text-xs text-muted-foreground font-medium">
                        <Link href="/privacy" className="hover:text-primary transition-colors">კონფიდენციალობა</Link>
                        <Link href="/terms" className="hover:text-primary transition-colors">წესები და პირობები</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}

function SocialButton({ href, icon: Icon, label }: { href: string; icon: any; label: string }) {
    return (
        <a
            href={href}
            className="w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary hover:bg-primary/5 transition-all duration-300"
            aria-label={label}
        >
            <Icon className="w-5 h-5" />
        </a>
    );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
    return (
        <li>
            <Link
                href={href}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group"
            >
                <span className="w-1.5 h-1.5 rounded-full bg-border group-hover:bg-primary transition-colors" />
                {children}
            </Link>
        </li>
    );
}

function AddressItem({ flag, text }: { flag: React.ReactNode; text: string }) {
    return (
        <li className="flex items-start gap-3 p-3 rounded-2xl bg-muted/40 hover:bg-muted/70 transition-colors border border-transparent hover:border-border/50">
            <div className="w-6 h-4.5 mt-0.5 rounded-sm overflow-hidden relative shadow-sm shrink-0">
                {flag}
            </div>
            <span className="flex-1 text-sm font-medium text-muted-foreground leading-snug">{text}</span>
        </li>
    );
}
