'use client';

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    FileText, Scale, ShieldCheck, AlertTriangle,
    Banknote, Car, Clock, Phone
} from "lucide-react";

export default function TermsPage() {
    const lastUpdated = "2025-01-15";

    const sections = [
        {
            id: "general",
            icon: <FileText className="w-6 h-6" />,
            title: "ზოგადი პირობები",
            content: [
                "წინამდებარე პირობები წარმოადგენს სავალდებულო შეთანხმებას Auto Market Logistic-სა და მომხმარებელს შორის.",
                "სერვისით სარგებლობით თქვენ ეთანხმებით ამ პირობებს სრულად.",
                "კომპანია იტოვებს უფლებას შეცვალოს პირობები წინასწარი შეტყობინებით."
            ]
        },
        {
            id: "services",
            icon: <Car className="w-6 h-6" />,
            title: "მომსახურების პირობები",
            content: [
                "ავტომობილის შერჩევა და აუქციონზე წარმომადგენლობა.",
                "ავტომობილის ტრანსპორტირება აშშ-დან/ევროპიდან საქართველოში.",
                "განბაჟება და დოკუმენტაციის მოწესრიგება.",
                "ავტომობილის ჩაბარება მომხმარებლისთვის."
            ]
        },
        {
            id: "payment",
            icon: <Banknote className="w-6 h-6" />,
            title: "გადახდის პირობები",
            content: [
                "შეკვეთის დადასტურებისთვის საჭიროა წინასწარი გადახდა.",
                "სრული ანგარიშსწორება ხდება ავტომობილის ჩაბარებამდე.",
                "გადახდა შესაძლებელია ბანკის გადარიცხვით ან ნაღდი ანგარიშსწორებით.",
                "ყველა ფასი მითითებულია აშშ დოლარში ან ლარში."
            ]
        },
        {
            id: "delivery",
            icon: <Clock className="w-6 h-6" />,
            title: "მიწოდების ვადები",
            content: [
                "სტანდარტული მიწოდების ვადა აშშ-დან: 35-45 დღე.",
                "ევროპიდან მიწოდება: 15-25 დღე.",
                "ვადები შეიძლება შეიცვალოს გარე ფაქტორების გამო (ამინდი, საბაჟო და ა.შ.).",
                "კომპანია არ არის პასუხისმგებელი ფორსმაჟორული გარემოებებით გამოწვეულ დაგვიანებაზე."
            ]
        },
        {
            id: "warranty",
            icon: <ShieldCheck className="w-6 h-6" />,
            title: "გარანტია და პასუხისმგებლობა",
            content: [
                "კომპანია გარანტიას იძლევა ავტომობილის მდგომარეობის შესაბამისობაზე აუქციონის აღწერილობასთან.",
                "ტრანსპორტირების დროს მიყენებული ზიანი ანაზღაურდება დაზღვევით.",
                "მომხმარებელი ვალდებულია შეამოწმოს ავტომობილი ჩაბარებისას.",
                "პრეტენზიები მიიღება ჩაბარებიდან 24 საათის განმავლობაში."
            ]
        },
        {
            id: "cancellation",
            icon: <AlertTriangle className="w-6 h-6" />,
            title: "გაუქმება და დაბრუნება",
            content: [
                "შეკვეთის გაუქმება შესაძლებელია აუქციონზე შეძენამდე.",
                "აუქციონზე შეძენის შემდეგ გაუქმება არ ხდება.",
                "წინასწარი გადახდა არ ბრუნდება შეკვეთის გაუქმების შემთხვევაში (აუქციონზე შეძენის შემდეგ).",
                "კომპანიის ბრალით შეკვეთის შეუსრულებლობის შემთხვევაში თანხა სრულად ბრუნდება."
            ]
        },
        {
            id: "disputes",
            icon: <Scale className="w-6 h-6" />,
            title: "დავების გადაწყვეტა",
            content: [
                "ყველა დავა გადაწყდება მოლაპარაკების გზით.",
                "შეთანხმების მიუღწევლობის შემთხვევაში დავა განიხილება საქართველოს კანონმდებლობის შესაბამისად.",
                "მხარეები თანხმდებიან თბილისის საქალაქო სასამართლოს იურისდიქციაზე."
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
                    className="text-4xl md:text-6xl font-black mb-6 bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent uppercase tracking-wide"
                >
                    მომსახურების პირობები
                </motion.h1>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="flex items-center justify-center gap-2 text-muted-foreground"
                >
                    <Clock className="w-4 h-4" />
                    <span>განახლებულია: {lastUpdated}</span>
                </motion.div>
            </div>

            {/* Table of Contents */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
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

            {/* Contact */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="max-w-2xl mx-auto mt-16 text-center"
            >
                <Card className="bg-muted/50">
                    <CardContent className="p-8">
                        <Phone className="w-10 h-10 mx-auto mb-4 text-primary" />
                        <h3 className="text-xl font-bold mb-2">გაქვთ კითხვები?</h3>
                        <p className="text-muted-foreground mb-4">
                            თუ გაქვთ კითხვები მომსახურების პირობებთან დაკავშირებით, გთხოვთ დაგვიკავშირდეთ.
                        </p>
                        <a
                            href="tel:+995599000000"
                            className="text-primary hover:underline font-medium"
                        >
                            +995 599 00 00 00
                        </a>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
