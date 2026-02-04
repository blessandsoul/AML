'use client';

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Shield, Eye, Database, Lock, UserCheck,
    Cookie, Mail, Clock, Phone
} from "lucide-react";

export default function PrivacyPage() {
    const lastUpdated = "2025-01-15";

    const sections = [
        {
            id: "collection",
            icon: <Database className="w-6 h-6" />,
            title: "რა ინფორმაციას ვაგროვებთ",
            content: [
                "სახელი, გვარი და საკონტაქტო ინფორმაცია (ტელეფონი, ელ.ფოსტა).",
                "პირადობის დამადასტურებელი დოკუმენტის მონაცემები (შეკვეთის დადასტურებისთვის).",
                "მისამართი ავტომობილის ჩაბარებისთვის.",
                "გადახდის ინფორმაცია (საბანკო რეკვიზიტები).",
                "კომუნიკაციის ისტორია ჩვენს გუნდთან."
            ]
        },
        {
            id: "usage",
            icon: <Eye className="w-6 h-6" />,
            title: "როგორ ვიყენებთ თქვენს მონაცემებს",
            content: [
                "შეკვეთის დამუშავება და შესრულება.",
                "ავტომობილის ტრანსპორტირებისა და განბაჟების პროცესის წარმართვა.",
                "თქვენთან კომუნიკაცია შეკვეთის სტატუსის შესახებ.",
                "გადახდების დამუშავება და ფინანსური ანგარიშგება.",
                "მომსახურების ხარისხის გაუმჯობესება."
            ]
        },
        {
            id: "protection",
            icon: <Lock className="w-6 h-6" />,
            title: "მონაცემების დაცვა",
            content: [
                "ვიყენებთ SSL დაშიფვრას ყველა კომუნიკაციისთვის.",
                "პერსონალური მონაცემები ინახება დაცულ სერვერებზე.",
                "წვდომა მონაცემებზე აქვთ მხოლოდ უფლებამოსილ თანამშრომლებს.",
                "რეგულარულად ვახორციელებთ უსაფრთხოების აუდიტს.",
                "მონაცემები არ გადაეცემა მესამე მხარეს თქვენი თანხმობის გარეშე."
            ]
        },
        {
            id: "sharing",
            icon: <UserCheck className="w-6 h-6" />,
            title: "მონაცემების გაზიარება",
            content: [
                "აუქციონის კომპანიებთან - შეკვეთის შესასრულებლად.",
                "ლოგისტიკურ პარტნიორებთან - ტრანსპორტირებისთვის.",
                "საბაჟო ორგანოებთან - კანონით გათვალისწინებულ შემთხვევებში.",
                "საბანკო დაწესებულებებთან - გადახდების დასამუშავებლად.",
                "სამართალდამცავ ორგანოებთან - კანონის მოთხოვნის შემთხვევაში."
            ]
        },
        {
            id: "cookies",
            icon: <Cookie className="w-6 h-6" />,
            title: "ქუქი-ფაილები (Cookies)",
            content: [
                "ვიყენებთ ქუქი-ფაილებს ვებგვერდის ფუნქციონირებისთვის.",
                "ანალიტიკური ქუქიები გვეხმარება ვებგვერდის გაუმჯობესებაში.",
                "თქვენ შეგიძლიათ გამორთოთ ქუქიები ბრაუზერის პარამეტრებში.",
                "ქუქიების გამორთვამ შეიძლება გავლენა იქონიოს ვებგვერდის ფუნქციონალზე."
            ]
        },
        {
            id: "rights",
            icon: <Shield className="w-6 h-6" />,
            title: "თქვენი უფლებები",
            content: [
                "უფლება მოითხოვოთ წვდომა თქვენს პერსონალურ მონაცემებზე.",
                "უფლება მოითხოვოთ მონაცემების გასწორება ან წაშლა.",
                "უფლება გააპროტესტოთ მონაცემების დამუშავება.",
                "უფლება მოითხოვოთ მონაცემების პორტაბელურობა.",
                "უფლება გააუქმოთ თანხმობა მონაცემების დამუშავებაზე."
            ]
        },
        {
            id: "retention",
            icon: <Clock className="w-6 h-6" />,
            title: "მონაცემების შენახვის ვადა",
            content: [
                "შეკვეთის მონაცემები ინახება 7 წლის განმავლობაში (საგადასახადო მოთხოვნა).",
                "კომუნიკაციის ისტორია ინახება 3 წლის განმავლობაში.",
                "ანალიტიკური მონაცემები ინახება 2 წლის განმავლობაში.",
                "თქვენი მოთხოვნით მონაცემები შეიძლება წაიშალოს უფრო ადრე (კანონით დაშვებულ ფარგლებში)."
            ]
        },
        {
            id: "contact",
            icon: <Mail className="w-6 h-6" />,
            title: "კონტაქტი კონფიდენციალურობის საკითხებზე",
            content: [
                "პერსონალურ მონაცემებთან დაკავშირებული კითხვებისთვის დაგვიკავშირდით:",
                "ელ.ფოსტა: privacy@automarketlogistic.ge",
                "ტელეფონი: +995 599 00 00 00",
                "მისამართი: თბილისი, საქართველო"
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-background text-foreground pt-40 pb-16 px-4 md:px-8">
            {/* Hero Section */}
            <div className="max-w-4xl mx-auto text-center mb-16">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl md:text-6xl font-black mb-6 bg-gradient-to-r from-primary to-green-400 bg-clip-text text-transparent uppercase tracking-wide"
                >
                    კონფიდენციალურობა
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-lg text-muted-foreground mb-4"
                >
                    თქვენი პერსონალური მონაცემების დაცვა ჩვენი პრიორიტეტია
                </motion.p>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="flex items-center justify-center gap-2 text-muted-foreground text-sm"
                >
                    <Clock className="w-4 h-4" />
                    <span>განახლებულია: {lastUpdated}</span>
                </motion.div>
            </div>

            {/* Quick Summary */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="max-w-4xl mx-auto mb-12"
            >
                <Card className="bg-primary/5 border-primary/20">
                    <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                            <Shield className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
                            <div>
                                <h2 className="text-lg font-bold mb-2">მოკლედ:</h2>
                                <p className="text-muted-foreground">
                                    ჩვენ ვაგროვებთ მხოლოდ იმ მონაცემებს, რომლებიც აუცილებელია თქვენი შეკვეთის შესასრულებლად.
                                    თქვენი ინფორმაცია დაცულია და არ გადაეცემა მესამე მხარეს თქვენი თანხმობის გარეშე.
                                    თქვენ გაქვთ სრული კონტროლი თქვენს მონაცემებზე.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Table of Contents */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="max-w-4xl mx-auto mb-12"
            >
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">სარჩევი</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-2">
                            {sections.map((section, i) => (
                                <a
                                    key={section.id}
                                    href={`#${section.id}`}
                                    className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
                                >
                                    <Badge variant="outline" className="hover:border-primary">
                                        {i + 1}. {section.title}
                                    </Badge>
                                </a>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Sections */}
            <div className="max-w-4xl mx-auto space-y-8">
                {sections.map((section, i) => (
                    <motion.div
                        key={section.id}
                        id={section.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.05 }}
                    >
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                        {section.icon}
                                    </div>
                                    <span>{i + 1}. {section.title}</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-3">
                                    {section.content.map((item, j) => (
                                        <li key={j} className="flex items-start gap-3 text-muted-foreground">
                                            <span className="text-primary font-bold">{i + 1}.{j + 1}</span>
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Contact CTA */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="max-w-2xl mx-auto mt-16 text-center"
            >
                <Card className="bg-muted/50">
                    <CardContent className="p-8">
                        <Phone className="w-10 h-10 mx-auto mb-4 text-primary" />
                        <h3 className="text-xl font-bold mb-2">კითხვები კონფიდენციალურობაზე?</h3>
                        <p className="text-muted-foreground mb-4">
                            თუ გაქვთ კითხვები თქვენი პერსონალური მონაცემების დამუშავებასთან დაკავშირებით, დაგვიკავშირდით.
                        </p>
                        <div className="space-y-2">
                            <a
                                href="mailto:privacy@automarketlogistic.ge"
                                className="block text-primary hover:underline font-medium"
                            >
                                privacy@automarketlogistic.ge
                            </a>
                            <a
                                href="tel:+995599000000"
                                className="block text-primary hover:underline font-medium"
                            >
                                +995 599 00 00 00
                            </a>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
