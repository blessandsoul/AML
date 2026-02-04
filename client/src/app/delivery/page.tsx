'use client';

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Ship, Truck, Package, Clock, MapPin, CheckCircle2,
    Globe, Shield, FileText, Phone
} from "lucide-react";

export default function DeliveryPage() {
    const deliverySteps = [
        {
            step: 1,
            title: "აუქციონზე შეძენა",
            description: "თქვენს მიერ არჩეული ავტომობილის შეძენა აუქციონზე ჩვენი ლიცენზირებული წარმომადგენლის მეშვეობით.",
            icon: <FileText className="w-6 h-6" />,
            duration: "1-3 დღე"
        },
        {
            step: 2,
            title: "პორტში ტრანსპორტირება",
            description: "ავტომობილის გადაყვანა აშშ-ს შიდა პორტში (ჯორჯია, ტეხასი, ნიუ ჯერსი).",
            icon: <Truck className="w-6 h-6" />,
            duration: "5-14 დღე"
        },
        {
            step: 3,
            title: "ზღვით გადაზიდვა",
            description: "კონტეინერული ან RoRo გადაზიდვა ფოთის ან ბათუმის პორტამდე.",
            icon: <Ship className="w-6 h-6" />,
            duration: "25-35 დღე"
        },
        {
            step: 4,
            title: "განბაჟება",
            description: "საქართველოს საბაჟოზე ყველა პროცედურის სრული წარმოება.",
            icon: <Shield className="w-6 h-6" />,
            duration: "1-2 დღე"
        },
        {
            step: 5,
            title: "ჩაბარება",
            description: "ავტომობილის ჩაბარება თქვენს მიერ მითითებულ ადგილზე საქართველოში.",
            icon: <Package className="w-6 h-6" />,
            duration: "1-3 დღე"
        }
    ];

    const ports = [
        { name: "ფოთი", country: "საქართველო", primary: true },
        { name: "ბათუმი", country: "საქართველო", primary: true },
        { name: "კლაიპედა", country: "ლიტვა", primary: false },
        { name: "ბრემერჰაფენი", country: "გერმანია", primary: false }
    ];

    const features = [
        {
            icon: <Clock className="w-8 h-8 text-primary" />,
            title: "სწრაფი მიწოდება",
            description: "საშუალო ვადა 35-45 დღე აშშ-დან"
        },
        {
            icon: <Shield className="w-8 h-8 text-green-500" />,
            title: "სრული დაზღვევა",
            description: "ავტომობილი დაზღვეულია მთელი გზის მანძილზე"
        },
        {
            icon: <Globe className="w-8 h-8 text-blue-500" />,
            title: "GPS თრექინგი",
            description: "თვალყური ადევნეთ თქვენს ავტომობილს რეალურ დროში"
        },
        {
            icon: <CheckCircle2 className="w-8 h-8 text-purple-500" />,
            title: "ვიდეო რეპორტები",
            description: "ყოველ ეტაპზე მიიღებთ ვიდეო განახლებას"
        }
    ];

    return (
        <div className="min-h-screen bg-background text-foreground pt-40 pb-16 px-4 md:px-8">
            {/* Hero Section */}
            <div className="max-w-4xl mx-auto text-center mb-20">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl md:text-6xl font-black mb-6 bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent uppercase tracking-wide"
                >
                    მიწოდება
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto"
                >
                    ავტომობილის შეძენიდან ჩაბარებამდე - სრული კონტროლი და გამჭვირვალობა ყველა ეტაპზე.
                </motion.p>
            </div>

            {/* Features Grid */}
            <div className="max-w-6xl mx-auto mb-20">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <Card className="h-full hover:shadow-lg transition-shadow">
                                <CardContent className="p-6 text-center">
                                    <div className="mb-4 flex justify-center">{feature.icon}</div>
                                    <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Delivery Steps */}
            <div className="max-w-5xl mx-auto mb-20">
                <h2 className="text-3xl font-bold text-center mb-12">მიწოდების ეტაპები</h2>
                <div className="space-y-6">
                    {deliverySteps.map((step, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <Card className="overflow-hidden">
                                <CardContent className="p-6">
                                    <div className="flex items-start gap-6">
                                        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                            {step.icon}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <Badge variant="outline" className="text-primary border-primary/30">
                                                    ეტაპი {step.step}
                                                </Badge>
                                                <Badge variant="secondary" className="text-muted-foreground">
                                                    <Clock className="w-3 h-3 mr-1" />
                                                    {step.duration}
                                                </Badge>
                                            </div>
                                            <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                                            <p className="text-muted-foreground">{step.description}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Ports */}
            <div className="max-w-4xl mx-auto mb-20">
                <h2 className="text-3xl font-bold text-center mb-12">მიღების პორტები</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {ports.map((port, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <Card className={port.primary ? "border-primary/50" : ""}>
                                <CardContent className="p-4 text-center">
                                    <MapPin className={`w-6 h-6 mx-auto mb-2 ${port.primary ? "text-primary" : "text-muted-foreground"}`} />
                                    <h3 className="font-bold">{port.name}</h3>
                                    <p className="text-sm text-muted-foreground">{port.country}</p>
                                    {port.primary && (
                                        <Badge className="mt-2" variant="secondary">ძირითადი</Badge>
                                    )}
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Contact CTA */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="max-w-2xl mx-auto text-center"
            >
                <Card className="bg-primary/5 border-primary/20">
                    <CardContent className="p-8">
                        <Phone className="w-12 h-12 mx-auto mb-4 text-primary" />
                        <h3 className="text-2xl font-bold mb-4">გაქვთ კითხვები მიწოდებაზე?</h3>
                        <p className="text-muted-foreground mb-6">
                            დაგვიკავშირდით და მიიღეთ დეტალური კონსულტაცია თქვენი ავტომობილის მიწოდების შესახებ.
                        </p>
                        <a
                            href="tel:+995599000000"
                            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-bold hover:bg-primary/90 transition-colors"
                        >
                            <Phone className="w-5 h-5" />
                            +995 599 00 00 00
                        </a>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
