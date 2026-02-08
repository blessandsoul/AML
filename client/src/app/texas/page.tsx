'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Phone, CheckCircle2, Truck, Clock, Shield, Building2 } from 'lucide-react';

export default function TexasPage() {
    // Houston office data (from contact page)
    const houstonOffice = {
        city: 'ჰიუსტონი',
        state: 'ტეხასი',
        country: 'აშშ',
        address: '3635 Trailmobile Rd',
        phone: '+1 201 600 2192',
        mapQuery: '3635+Trailmobile+Rd,+Houston,+TX',
    };

    // Regional benefits
    const benefits = [
        {
            title: 'სტრატეგიული მდებარეობა',
            description: 'ტეხასი მდებარეობს აშშ-ს სამხრეთ ნაწილში, რაც უზრუნველყოფს სწრაფ წვდომას მთავარ საექსპორტო პორტებთან',
            icon: MapPin,
        },
        {
            title: 'უმსხვილესი აუქციონები',
            description: 'ტეხასში განლაგებულია აშშ-ს უმსხვილესი Copart და IAAI აუქციონები Dallas, Houston და San Antonio-ში',
            icon: Building2,
        },
        {
            title: 'სწრაფი დოკუმენტირება',
            description: 'ჩვენი Houston-ის ოფისი უზრუნველყოფს ყველა დოკუმენტის ადგილზე მომზადებას და სწრაფ გაფორმებას',
            icon: Clock,
        },
        {
            title: 'ჩვენი ოფისი ადგილზე',
            description: 'პროფესიონალი გუნდი Houston-ში უზრუნველყოფს თქვენი ავტომობილის უსაფრთხო ტრანსპორტირებას და კონტროლს',
            icon: Shield,
        },
    ];

    return (
        <div className="min-h-screen bg-background bg-mesh text-foreground pt-40 pb-16 px-4 md:px-8">
            {/* Hero Section */}
            <section className="max-w-4xl mx-auto text-center mb-16">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-4xl md:text-6xl font-black mb-6 bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent"
                >
                    ტეხასის{' '}
                    <span className="text-primary">პარტნიორები</span>
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto"
                >
                    ჩვენი ოფისი ჰიუსტონში - თქვენი საიმედო პარტნიორი ამერიკაში
                </motion.p>
            </section>

            {/* Houston Office Section */}
            <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="max-w-4xl mx-auto mb-20"
            >
                <Card className="glass-2 glass-tint rounded-2xl overflow-hidden border-0">
                    <CardContent className="p-6 md:p-8">
                        <div className="grid md:grid-cols-2 gap-8">
                            {/* Office Info */}
                            <div>
                                <h2 className="text-2xl md:text-3xl font-bold mb-6 bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
                                    Houston Office
                                </h2>
                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <MapPin className="w-5 h-5 text-primary mt-1 shrink-0" />
                                        <div>
                                            <p className="text-sm text-muted-foreground mb-1">მისამართი</p>
                                            <p className="font-medium text-foreground">{houstonOffice.address}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {houstonOffice.city}, {houstonOffice.state}, {houstonOffice.country}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Phone className="w-5 h-5 text-primary shrink-0" />
                                        <div>
                                            <p className="text-sm text-muted-foreground mb-1">ტელეფონი</p>
                                            <a
                                                href={`tel:${houstonOffice.phone}`}
                                                className="font-medium text-foreground hover:text-primary transition-colors"
                                            >
                                                {houstonOffice.phone}
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Map */}
                            <div className="relative rounded-xl overflow-hidden glass-1 border border-white/10">
                                <iframe
                                    src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${houstonOffice.mapQuery}&zoom=15`}
                                    className="w-full h-64 md:h-full min-h-[256px]"
                                    style={{ border: 0 }}
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.section>

            {/* Benefits Section */}
            <section className="max-w-5xl mx-auto">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-3xl md:text-4xl font-bold text-center mb-12"
                >
                    რატომ{' '}
                    <span className="bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
                        ტეხასი
                    </span>
                    ?
                </motion.h2>
                <div className="grid md:grid-cols-2 gap-6">
                    {benefits.map((benefit, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1, duration: 0.5 }}
                        >
                            <Card className="glass-2 glass-tint glass-hover rounded-2xl h-full border-0 group">
                                <CardContent className="p-6">
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 rounded-xl glass-1 group-hover:scale-110 transition-transform duration-300">
                                            <benefit.icon className="w-6 h-6 text-primary" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-xl font-bold mb-2 text-foreground">
                                                {benefit.title}
                                            </h3>
                                            <p className="text-muted-foreground leading-relaxed">
                                                {benefit.description}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </section>
        </div>
    );
}
