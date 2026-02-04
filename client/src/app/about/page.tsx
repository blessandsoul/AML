'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Rocket, Globe, Trophy, Briefcase, Building2, Truck, Video, ShieldCheck, MapPin,
    Users, Car, CheckCircle2, ArrowRight, Phone
} from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";

export default function AboutPage() {
    const stats = [
        { value: "13+", label: "წელი ბაზარზე", icon: <Building2 className="w-5 h-5" /> },
        { value: "10,000+", label: "იმპორტირებული ავტო", icon: <Car className="w-5 h-5" /> },
        { value: "11", label: "ფილიალი მსოფლიოში", icon: <Globe className="w-5 h-5" /> },
        { value: "100+", label: "თანამშრომელი", icon: <Users className="w-5 h-5" /> },
    ];

    const values = [
        {
            title: "100% გამჭვირვალობა",
            desc: "არავითარი ფარული ხარჯი. დამკვეთი იღებს წვდომას ყველა ოფიციალურ ინვოისზე და გადარიცხვაზე.",
            icon: <ShieldCheck className="w-8 h-8 text-primary" />
        },
        {
            title: "საკუთარი ლოგისტიკა",
            desc: "ჩვენ ვფლობთ ოფიციალურ ლიცენზიებს აშშ-სა და ევროპაში, რაც გამორიცხავს შუამავლებს.",
            icon: <Truck className="w-8 h-8 text-blue-500" />
        },
        {
            title: "სრული კონტროლი",
            desc: "ვიდეო რეპორტები ყველა ეტაპზე და 24/7 მხარდაჭერა თქვენი პირადი მენეჯერისგან.",
            icon: <Video className="w-8 h-8 text-red-500" />
        },
    ];

    const timeline = [
        {
            year: "2012",
            title: "დასაწყისი",
            description: "კომპანია \"Auto Market Logistic\" დაარსდა და საფუძველი ჩაეყარა წარმატებულ საქმიანობას ავტო იმპორტის სფეროში.",
            icon: <Building2 className="w-6 h-6 text-primary" />,
        },
        {
            year: "2013-2014",
            title: "ლიდერის აღიარება",
            description: "საქართველოს ნაციონალური ბიზნეს რეიტინგების კვლევის მიხედვით, კომპანიას მიენიჭა ლიდერის სტატუსი ავტო იმპორტის დარგში.",
            icon: <Trophy className="w-6 h-6 text-yellow-500" />,
        },
        {
            year: "2018",
            title: "უკრაინის ბაზარი",
            description: "ოფიციალური შესვლა უკრაინის ბაზარზე. კომპანიამ მალევე დაიკავა წამყვანი პოზიციები როგორც საცალო, ასევე B2B მიმართულებით.",
            icon: <Globe className="w-6 h-6 text-blue-400" />,
        },
        {
            year: "2019",
            title: "ქსელის გაფართოება",
            description: "Auto Market Ukraine უკვე ფლობს 5 ფილიალს უკრაინის სხვადასხვა დიდ ქალაქში.",
            icon: <MapPin className="w-6 h-6 text-green-500" />,
        },
        {
            year: "2020",
            title: "ამერიკული ლიცენზია",
            description: "Auto Market Logistic (USA) იღებს ოფიციალურ საექსპორტო ლიცენზიას, რაც საშუალებას გვაძლევს ვიმოქმედოთ შუამავლების გარეშე და გავზარდოთ ეფექტურობა.",
            icon: <Briefcase className="w-6 h-6 text-purple-500" />,
        },
        {
            year: "2022",
            title: "ევროპული ლოგისტიკა",
            description: "უკრაინაში ომის გამოწვევების საპასუხოდ დაფუძნდა Auto Market Logistic – Lithuania. კლაიპედას პორტიდან გაიხსნა ახალი ლოგისტიკური არხი ევროპისა და უკრაინისთვის.",
            icon: <Truck className="w-6 h-6 text-indigo-500" />,
        },
        {
            year: "2022-2023",
            title: "გამჭვირვალობა და ინოვაცია",
            description: "ახალი სტანდარტი: სრული ვიდეო გაშუქება ავტომობილის შეძენიდან ჩაბარებამდე. მაქსიმალური გამჭვირვალობა და გაორმაგებული ნდობა მომხმარებლისგან.",
            icon: <Video className="w-6 h-6 text-red-500" />,
        },
        {
            year: "2024",
            title: "ახალი ჰორიზონტები",
            description: "დღეისათვის კომპანია აერთიანებს 11 ფილიალს და 100-ზე მეტ თანამშრომელს. იწყება ახალი პროექტები ჩვენი ავტოდილერებისა და საცალო მომხმარებლებისთვის.",
            icon: <ShieldCheck className="w-6 h-6 text-teal-500" />,
        },
        {
            year: "2025-2026",
            title: "ემირატების დაპყრობა",
            description: "ჩვენი ამბიციური გეგმა: მასშტაბური შესვლა არაბთა გაერთიანებული საამიროების (UAE) ბაზარზე. ახალი სავაჭრო ჰაბის შექმნა და გლობალური ექსპანსია ახლო აღმოსავლეთში.",
            icon: <Rocket className="w-6 h-6 text-orange-500" />,
            highlight: true,
        },
    ];

    return (
        <div className="min-h-screen bg-background text-foreground pt-40 pb-16 px-4 md:px-8 overflow-hidden">
            {/* Hero Section */}
            <div className="max-w-4xl mx-auto text-center mb-20 relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-primary/20 blur-[120px] rounded-full -z-10" />
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl md:text-6xl font-black mb-6 bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent uppercase tracking-wide py-2 leading-normal"
                >
                    ჩვენი ისტორია
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-10 font-medium max-w-2xl mx-auto"
                >
                    გზა 2012 წლიდან დღემდე — ინოვაციების, გამოწვევებისა და მუდმივი განვითარების ისტორია.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                    className="relative w-full aspect-[16/9] md:aspect-[21/9] rounded-3xl overflow-hidden shadow-2xl border border-white/10 group bg-card"
                >
                    <Image
                        src="/about-hero.png"
                        alt="Auto Market Logistic Team"
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                    <div className="absolute bottom-6 left-6 z-20 text-white font-bold bg-black/40 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/10 flex items-center gap-3">
                        <Badge variant="secondary" className="bg-primary text-primary-foreground hover:bg-primary border-none">AML Teams</Badge>
                        <span className="hidden sm:inline">ჩვენი გუნდი</span>
                    </div>
                </motion.div>
            </div>

            {/* Stats Section (New) */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto mb-20"
            >
                {stats.map((stat, i) => (
                    <div key={i} className="flex flex-col items-center justify-center p-6 bg-card/50 border border-border/50 rounded-2xl backdrop-blur-sm hover:bg-card/80 transition-all text-center group">
                        <div className="mb-3 p-3 bg-primary/10 rounded-full text-primary group-hover:scale-110 transition-transform">
                            {stat.icon}
                        </div>
                        <div className="text-3xl font-black text-foreground mb-1">{stat.value}</div>
                        <div className="text-sm font-medium text-muted-foreground">{stat.label}</div>
                    </div>
                ))}
            </motion.div>

            {/* Why Us / Values (New) */}
            <div className="max-w-6xl mx-auto mb-32">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold mb-4">რატომ Auto Market Logistic?</h2>
                    <p className="text-muted-foreground">ჩვენ ვქმნით სანდოობისა და ხარისხის ახალ სტანდარტს</p>
                </div>
                <div className="grid md:grid-cols-3 gap-8">
                    {values.map((val, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-card border border-border p-8 rounded-3xl relative overflow-hidden group hover:shadow-lg transition-all"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500" />
                            <div className="mb-6">{val.icon}</div>
                            <h3 className="text-xl font-bold mb-3">{val.title}</h3>
                            <p className="text-muted-foreground leading-relaxed">{val.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Timeline Section */}
            <div className="relative max-w-5xl mx-auto mb-32">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold mb-4">განვითარების გზა</h2>
                    <p className="text-muted-foreground">ნაბიჯ-ნაბიჯ წარმატებისკენ</p>
                </div>

                <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/0 via-primary/50 to-primary/0 md:-translate-x-1/2" />

                <div className="flex flex-col gap-12 md:gap-24 relative">
                    {timeline.map((item, index) => {
                        const isEven = index % 2 === 0;
                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className={`relative flex flex-col md:flex-row items-start ${isEven ? 'md:flex-row-reverse' : ''} gap-8 group`}
                            >
                                <div className="hidden md:flex flex-1" />
                                <div className="absolute left-4 md:left-1/2 w-4 h-4 rounded-full bg-background border-[3px] border-primary z-10 mt-6 md:-translate-x-1/2 shadow-[0_0_15px_rgba(var(--primary),0.5)] group-hover:scale-125 transition-transform duration-300" />
                                <div className="flex-1 ml-12 md:ml-0">
                                    <div className={`
                                        relative overflow-hidden rounded-2xl border border-border/50 bg-card/40 backdrop-blur-sm p-6 hover:bg-card/60 transition-colors duration-300
                                        ${item.highlight ? 'border-primary/50 bg-primary/5 shadow-[0_0_30px_rgba(var(--primary),0.1)]' : ''}
                                    `}>
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="p-3 rounded-xl bg-background/50 border border-border shadow-sm text-primary">
                                                {item.icon}
                                            </div>
                                            <Badge variant="outline" className="text-lg font-bold border-primary/30 text-primary px-3 py-1">
                                                {item.year}
                                            </Badge>
                                        </div>
                                        <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                                        <p className="text-muted-foreground leading-relaxed">
                                            {item.description}
                                        </p>
                                        {item.highlight && (
                                            <div className="absolute -right-8 -bottom-8 opacity-10 pointer-events-none animate-pulse">
                                                <Rocket className="w-48 h-48" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            {/* Partners Section (New) */}
            <div className="max-w-5xl mx-auto mb-32">
                <div className="text-center mb-10">
                    <h2 className="text-2xl font-bold opacity-80 uppercase tracking-widest">ჩვენი ოფიციალური პარტნიორები</h2>
                </div>
                <div className="flex flex-wrap justify-center items-end gap-x-12 gap-y-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                    {/* Replaced Text with simple styled placeholders for now as we have no logos - mimicking logos */}
                    {['COPART', 'IAAI', 'MANHEIM'].map((partner) => (
                        <div key={partner} className="text-2xl md:text-3xl font-black text-foreground/80 hover:text-primary transition-colors cursor-default">
                            {partner}
                        </div>
                    ))}
                </div>
            </div>

            {/* Lead Gen CTA (New) */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="max-w-4xl mx-auto relative group"
            >
                <div className="absolute -inset-1 bg-gradient-to-r from-primary to-purple-600 rounded-[2.5rem] blur opacity-30 group-hover:opacity-60 transition duration-500" />
                <div className="relative bg-card border border-border p-8 md:p-12 rounded-[2.5rem] overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full -mr-32 -mt-32" />

                    <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
                        <div className="flex-1 text-center md:text-left">
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">დაიწყეთ დღესვე!</h2>
                            <p className="text-muted-foreground text-lg mb-6">
                                დაგვიტოვეთ თქვენი საკონტაქტო ნომერი და მიიღეთ უფასო კონსულტაცია ჩვენი ექსპერტისგან.
                            </p>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground justify-center md:justify-start">
                                <CheckCircle2 className="w-4 h-4 text-green-500" />
                                <span>უფასო კონსულტაცია</span>
                                <CheckCircle2 className="w-4 h-4 text-green-500" />
                                <span>ინდივიდუალური შერჩევა</span>
                            </div>
                        </div>

                        <div className="w-full md:w-auto flex flex-col gap-4 min-w-[300px]">
                            <div className="relative">
                                <Phone className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                                <Input
                                    type="tel"
                                    placeholder="+995 5XX XX XX XX"
                                    className="pl-10 h-12 bg-background border-border"
                                />
                            </div>
                            <Button size="lg" className="h-12 text-base font-bold shadow-lg shadow-primary/25 w-full">
                                ზარის შეკვეთა <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                            <p className="text-xs text-center text-muted-foreground">
                                ჩვენ დაგიკავშირდებით 15 წუთის განმავლობაში
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
