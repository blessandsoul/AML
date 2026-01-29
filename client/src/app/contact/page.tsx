"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
    Facebook,
    Instagram,
    Mail,
    MapPin,
    Phone,
    Send,
    Linkedin,
    Clock,
    MessageCircle,
    MessageSquare
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

export default function ContactPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        await new Promise((resolve) => setTimeout(resolve, 1500));
        toast.success("შეტყობინება წარმატებით გაიგზავნა!");
        setIsSubmitting(false);
        (e.target as HTMLFormElement).reset();
    };

    return (
        <div className="min-h-screen bg-background pt-24 pb-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-16">
                {/* Header Section */}
                <div className="text-center space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
                        კონტაქტი
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        გაქვთ კითხვები ან გჭირდებათ დახმარება? ჩვენი გუნდი მზადაა გიპასუხოთ ნებისმიერ დროს.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
                    {/* Left Column: Info, Hours, Messengers */}
                    <div className="space-y-12 animate-in fade-in slide-in-from-left-8 duration-700 delay-150">

                        {/* Contact Info */}
                        <div className="space-y-6">
                            <h2 className="text-2xl font-semibold text-foreground">
                                საკონტაქტო ინფორმაცია
                            </h2>
                            <div className="space-y-4">
                                <ContactItem
                                    icon={<Phone className="size-6 text-primary" />}
                                    title="ტელეფონი"
                                    content="+995 555 12 34 56"
                                    href="tel:+995555123456"
                                />
                                <ContactItem
                                    icon={<Mail className="size-6 text-primary" />}
                                    title="ელ-ფოსტა"
                                    content="info@aml.ge"
                                    href="mailto:info@aml.ge"
                                />
                                <ContactItem
                                    icon={<MapPin className="size-6 text-primary" />}
                                    title="მისამართი"
                                    content="თბილისი, დ. უზნაძის ქ. 2"
                                />
                            </div>
                        </div>

                        {/* Working Hours using a Card style */}
                        <div className="bg-muted/30 rounded-2xl p-6 border border-border/50 space-y-4">
                            <div className="flex items-center gap-3">
                                <Clock className="size-6 text-primary" />
                                <h3 className="text-xl font-semibold text-foreground">სამუშაო საათები</h3>
                            </div>
                            <div className="space-y-2 text-muted-foreground">
                                <div className="flex justify-between border-b border-border/50 pb-2">
                                    <span>ორშაბათი - პარასკევი</span>
                                    <span className="font-medium text-foreground">10:00 - 19:00</span>
                                </div>
                                <div className="flex justify-between border-b border-border/50 pb-2">
                                    <span>შაბათი</span>
                                    <span className="font-medium text-foreground">11:00 - 16:00</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>კვირა</span>
                                    <span className="text-destructive font-medium">დასვენება</span>
                                </div>
                            </div>
                        </div>

                        {/* Messengers */}
                        <div className="space-y-6">
                            <h3 className="text-xl font-medium text-foreground">
                                მოგვწერეთ პირდაპირ
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                <MessengerButton
                                    icon={<MessageCircle className="size-5" />}
                                    label="WhatsApp"
                                    href="https://wa.me/995555123456"
                                    color="bg-[#25D366] hover:bg-[#20bd5a]"
                                />
                                <MessengerButton
                                    icon={<MessageSquare className="size-5" />}
                                    label="Viber"
                                    href="viber://chat?number=%2B995555123456"
                                    color="bg-[#7360f2] hover:bg-[#6655d9]"
                                />
                                <MessengerButton
                                    icon={<Send className="size-5" />}
                                    label="Telegram"
                                    href="https://t.me/username"
                                    color="bg-[#229ED9] hover:bg-[#1e8cc0]"
                                />
                            </div>
                        </div>

                        {/* Social Media */}
                        <div className="pt-4 space-y-4">
                            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">სოციალური ქსელები</h3>
                            <div className="flex gap-4">
                                <SocialButton icon={<Facebook className="size-5" />} href="#" label="Facebook" />
                                <SocialButton icon={<Instagram className="size-5" />} href="#" label="Instagram" />
                                <SocialButton icon={<Linkedin className="size-5" />} href="#" label="LinkedIn" />
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Form + FAQ */}
                    <div className="space-y-12 animate-in fade-in slide-in-from-right-8 duration-700 delay-300">
                        {/* Contact Form */}
                        <div className="bg-card border border-border/50 rounded-2xl p-6 md:p-8 shadow-sm backdrop-blur-sm">
                            <h2 className="text-2xl font-semibold text-foreground mb-6">
                                მოგვწერეთ
                            </h2>
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label htmlFor="name" className="text-xs font-medium uppercase text-muted-foreground tracking-wide">სახელი</label>
                                        <Input id="name" required placeholder="თქვენი სახელი" className="bg-background/50 focus:bg-background transition-colors h-11" />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="email" className="text-xs font-medium uppercase text-muted-foreground tracking-wide">ელ-ფოსტა</label>
                                        <Input id="email" type="email" required placeholder="example@mail.com" className="bg-background/50 focus:bg-background transition-colors h-11" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="topic" className="text-xs font-medium uppercase text-muted-foreground tracking-wide">თემა</label>
                                    <Input id="topic" placeholder="შეტყობინების თემა" className="bg-background/50 focus:bg-background transition-colors h-11" />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="message" className="text-xs font-medium uppercase text-muted-foreground tracking-wide">შეტყობინება</label>
                                    <textarea
                                        id="message"
                                        required
                                        rows={4}
                                        placeholder="წერილის ტექსტი..."
                                        className={cn(
                                            "flex w-full rounded-md border border-input bg-background/50 px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm resize-none focus:bg-background transition-colors"
                                        )}
                                    />
                                </div>
                                <Button type="submit" className="w-full text-base font-medium h-12" disabled={isSubmitting}>
                                    {isSubmitting ? <span className="animate-pulse">იგზავნება...</span> : "გაგზავნა"}
                                </Button>
                            </form>
                        </div>

                        {/* FAQ Section */}
                        <div className="space-y-6">
                            <h2 className="text-2xl font-semibold text-foreground">ხშირად დასმული კითხვები</h2>
                            <Accordion type="single" collapsible className="w-full">
                                <AccordionItem value="item-1">
                                    <AccordionTrigger>რამდენი დრო სჭირდება ტრანსპორტირებას?</AccordionTrigger>
                                    <AccordionContent>
                                        ტრანსპორტირების დრო დამოკიდებულია ლოკაციაზე. ამერიკიდან საშუალოდ 45-60 დღე, ევროპიდან 15-20 დღე.
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-2">
                                    <AccordionTrigger>როგორ ხდება გადახდა?</AccordionTrigger>
                                    <AccordionContent>
                                        გადახდა ხდება ორ ეტაპად: ავტომობილის ღირებულება ინვოისით, შემდეგ კი ტრანსპორტირების საფასური ჩამოსვლისას.
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-3">
                                    <AccordionTrigger>ამოწმებთ თუ არა ავტომობილს?</AccordionTrigger>
                                    <AccordionContent>
                                        დიახ, თითოეული ავტომობილი გადის დეტალურ შემოწმებას Carfax-ის ისტორიით და ვიზუალური დათვალიერებით აუქციონის ფოტოებით.
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </div>
                    </div>
                </div>

                {/* Map Section - Full Width */}
                <div className="rounded-3xl overflow-hidden border border-border/50 h-[450px] w-full animate-in fade-in slide-in-from-bottom-8 duration-700 delay-500 bg-muted relative shadow-xl">
                    <iframe
                        src="https://maps.google.com/maps?width=100%&height=100%&hl=en&q=2%20Dimitri%20Uznadze%20St%2C%20Tbilisi%2C%20GE&t=&z=15&ie=UTF8&iwloc=B&output=embed"
                        className="w-full h-full grayscale-[100%] invert-[90%] opacity-80 hover:grayscale-0 hover:invert-0 hover:opacity-100 transition-all duration-700 ease-in-out"
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>

                    {/* Overlay hint that disappears on hover/interaction */}
                    <div className="absolute top-4 right-4 bg-background/90 backdrop-blur text-foreground px-4 py-2 rounded-xl border border-border shadow-lg text-sm font-medium pointer-events-none opacity-80">
                        📍 თბილისი, დ. უზნაძის ქ. 2
                    </div>
                </div>
            </div>
        </div>
    );
}

// Helper Components

function ContactItem({ icon, title, content, href }: { icon: React.ReactNode; title: string; content: string; href?: string }) {
    const Wrapper = href ? "a" : "div";
    return (
        <Wrapper
            href={href}
            className={cn(
                "flex items-center gap-4 p-4 rounded-xl border border-transparent transition-all duration-300",
                href ? "hover:bg-muted hover:border-border/50 cursor-pointer" : "bg-transparent"
            )}
        >
            <div className="shrink-0 p-3 rounded-full bg-primary/10 text-primary">
                {icon}
            </div>
            <div className="space-y-0.5">
                <p className="font-medium text-muted-foreground text-xs uppercase tracking-wider">{title}</p>
                <p className="font-semibold text-lg text-foreground">{content}</p>
            </div>
        </Wrapper>
    );
}

function MessengerButton({ icon, label, href, color }: { icon: React.ReactNode; label: string; href: string; color: string }) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
                "flex flex-col items-center justify-center gap-2 p-4 rounded-xl text-white transition-all duration-300 hover:scale-105 shadow-md",
                color
            )}
        >
            {icon}
            <span className="font-medium text-sm">{label}</span>
            <span className="text-[10px] opacity-80 uppercase tracking-widest">Chat</span>
        </a>
    )
}

function SocialButton({ icon, href, label }: { icon: React.ReactNode; href: string; label: string }) {
    return (
        <a
            href={href}
            title={label}
            className="p-3 rounded-full bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-110"
            target="_blank"
            rel="noopener noreferrer"
        >
            {icon}
        </a>
    );
}
