import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight, ShieldCheck, Tag, Users, Mountain, Wine, Tent, Waves, ChevronRight, ChevronLeft, Star } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

import { HeroSection } from '@/components/home/HeroSection';
import { PromotionalBanner } from '@/components/home/PromotionalBanner';
import { TourCard } from '@/features/tours/components/TourCard';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useTours } from '@/features/tours/hooks/useTours';
import { ROUTES } from '@/lib/constants/routes';
import { cn } from '@/lib/cn';

export const HomePage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // Fetch featured tours (limit to 6 for carousel)
    const { data, isLoading } = useTours({ limit: 6 });
    const featuredTours = data?.items || [];

    // CTA Parallax
    const { scrollYProgress } = useScroll();
    const ctaY = useTransform(scrollYProgress, [0.8, 1], [0, -100]);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const scrollAmount = 400;
            scrollContainerRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    const destinations = [
        {
            name: "Tbilisi",
            image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=1000&auto=format&fit=crop", // Random City
            tours: 124,
            className: "md:col-span-2 md:row-span-2"
        },
        {
            name: "Batumi",
            image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=1000&auto=format&fit=crop", // Random Sea/Nature
            tours: 85,
            className: "md:col-span-1 md:row-span-2"
        },
        {
            name: "Kazbegi",
            image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1000&auto=format&fit=crop", // Random Mountains
            tours: 42,
            className: "md:col-span-1 md:row-span-1"
        },
        {
            name: "Kutaisi",
            image: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?q=80&w=1000&auto=format&fit=crop", // Random Architecture
            tours: 56,
            className: "md:col-span-1 md:row-span-1"
        }
    ];

    const categories = [
        { id: 'hiking', icon: <Mountain />, color: "bg-emerald-100 text-emerald-600" },
        { id: 'wine', icon: <Wine />, color: "bg-rose-100 text-rose-600" },
        { id: 'culture', icon: <Tent />, color: "bg-amber-100 text-amber-600" },
        { id: 'sea', icon: <Waves />, color: "bg-blue-100 text-blue-600" },
        { id: 'adventure', icon: <Mountain />, color: "bg-stone-100 text-stone-600" },
    ];

    const testimonials = [
        { text: "review_1", author: "Sarah M.", location: "UK" },
        { text: "review_2", author: "James D.", location: "USA" },
        { text: "review_3", author: "Elena K.", location: "Germany" },
        { text: "review_4", author: "Michael R.", location: "Canada" },
    ];

    return (
        <div className="flex flex-col min-h-screen bg-background overflow-x-hidden">
            <HeroSection />

            {/* Categories / Find your Vibe */}
            <section className="py-16 container mx-auto px-4">
                <div className="text-center mb-12">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-4xl font-bold tracking-tight mb-2 text-gradient leading-tight pb-2"
                    >
                        {t('home.categories.title')}
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        viewport={{ once: true }}
                        className="text-muted-foreground"
                    >
                        {t('home.categories.subtitle')}
                    </motion.p>
                </div>

                <div className="flex flex-wrap justify-center gap-6 md:gap-10">
                    {categories.map((cat, i) => (
                        <motion.button
                            key={cat.id}
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.1 }}
                            whileHover={{ scale: 1.1, y: -5 }}
                            whileTap={{ scale: 0.95 }}
                            viewport={{ once: true }}
                            className="flex flex-col items-center gap-3 group"
                        >
                            <div className={cn(
                                "w-20 h-20 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 group-hover:shadow-xl relative",
                                "before:absolute before:inset-[-3px] before:rounded-full before:bg-gradient-to-r before:from-primary before:via-cyan-400 before:to-primary before:opacity-0 before:group-hover:opacity-100 before:transition-opacity before:duration-300 before:-z-10",
                                cat.color
                            )}>
                                {cat.icon}
                            </div>
                            <span className="font-medium text-sm group-hover:text-primary transition-colors">
                                {t(`home.categories.items.${cat.id}`)}
                            </span>
                        </motion.button>
                    ))}
                </div>
            </section>

            {/* Featured Tours Carousel */}
            <section className="py-20 bg-muted/20 overflow-hidden">
                <div className="container mx-auto px-4 mb-10 flex items-end justify-between">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-2 text-gradient leading-tight pb-2">{t('home.features.title')}</h2>
                        <p className="text-muted-foreground">{t('home.features.subtitle')}</p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="icon" onClick={() => scroll('left')} className="rounded-full">
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" onClick={() => scroll('right')} className="rounded-full">
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                <div
                    ref={scrollContainerRef}
                    className="flex overflow-x-auto gap-6 px-4 md:px-8 pb-8 snap-x snap-mandatory scrollbar-hide container mx-auto scroll-smooth"
                >
                    {isLoading ? (
                        Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="min-w-[300px] md:min-w-[350px] snap-center">
                                <Skeleton className="h-[400px] w-full rounded-2xl" />
                            </div>
                        ))
                    ) : (
                        featuredTours.map((tour, i) => (
                            <motion.div
                                key={tour.id}
                                initial={{ opacity: 0, x: 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                viewport={{ once: true }}
                                className="min-w-[300px] md:min-w-[350px] snap-center"
                            >
                                <TourCard tour={tour} className="h-full" />
                            </motion.div>
                        ))
                    )}
                </div>
            </section>

            {/* Bento Grid Destinations */}
            <section className="py-24 container mx-auto px-4">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-10 text-center text-gradient leading-tight pb-2">{t('home.destinations.title')}</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-auto md:h-[600px]">
                    {destinations.map((dest, index) => (
                        <motion.div
                            key={dest.name}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className={cn(
                                "group relative overflow-hidden rounded-3xl cursor-pointer min-h-[200px] shimmer",
                                dest.className
                            )}
                            onClick={() => navigate(`${ROUTES.EXPLORE_TOURS}?city=${dest.name}`)}
                        >
                            <img
                                src={dest.image}
                                alt={dest.name}
                                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-90" />

                            <div className="absolute bottom-6 left-6 text-white p-4">
                                <h3 className="text-2xl font-bold mb-1 transform transition-transform duration-300 group-hover:-translate-y-1 leading-tight pb-1">{dest.name}</h3>
                                <div className="flex items-center gap-2 opacity-0 transform translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                                    <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium border border-white/30">
                                        {t('home.destinations.tours_count', { count: dest.tours })}
                                    </span>
                                    <ArrowRight className="h-4 w-4" />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            <PromotionalBanner />

            {/* Why Choose Us - 3D Cards */}
            <section className="py-24 bg-gradient-to-b from-background to-muted/20">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-gradient leading-tight pb-2">{t('home.why_choose.title')}</h2>
                        <p className="text-muted-foreground text-lg">{t('home.why_choose.subtitle')}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: <ShieldCheck className="h-10 w-10 text-primary" />,
                                title: t('home.why_choose.verified_guides'),
                                desc: t('home.why_choose.verified_guides_desc'),
                                delay: 0.1
                            },
                            {
                                icon: <Tag className="h-10 w-10 text-primary" />,
                                title: t('home.why_choose.best_prices'),
                                desc: t('home.why_choose.best_prices_desc'),
                                delay: 0.2
                            },
                            {
                                icon: <Users className="h-10 w-10 text-primary" />,
                                title: t('home.why_choose.support'),
                                desc: t('home.why_choose.support_desc'),
                                delay: 0.3
                            }
                        ].map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: feature.delay }}
                                viewport={{ once: true }}
                                className="bg-card p-8 rounded-3xl border shadow-sm hover:shadow-lg hover:border-primary/50 transition-all duration-300 group"
                            >
                                <div className="h-20 w-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold mb-3 leading-tight pb-1">{feature.title}</h3>
                                <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-20 overflow-hidden bg-background relative">
                {/* Floating Decorations */}
                <div className="floating-blob w-64 h-64 bg-primary/30 top-10 -left-20" />
                <div className="floating-blob w-48 h-48 bg-cyan-400/30 bottom-10 -right-10" style={{ animationDelay: '2s' }} />

                <div className="container mx-auto px-4 mb-10 text-center relative z-10">
                    <h2 className="text-3xl md:text-4xl font-bold text-gradient leading-tight pb-2">{t('home.testimonials.title')}</h2>
                </div>

                <div className="relative flex overflow-x-hidden">
                    <div className="animate-marquee whitespace-nowrap flex gap-8 py-4">
                        {[...testimonials, ...testimonials].map((review, i) => (
                            <div key={i} className="inline-flex flex-col w-[350px] p-6 rounded-2xl bg-card/80 backdrop-blur-sm border border-primary/10 mx-4 whitespace-normal shadow-lg hover:shadow-xl transition-shadow">
                                <div className="flex gap-1 mb-4 text-amber-400">
                                    {[1, 2, 3, 4, 5].map(s => <Star key={s} className="h-4 w-4 fill-current" />)}
                                </div>
                                <p className="text-muted-foreground italic mb-4 flex-1">"{t(`home.testimonials.${review.text}`)}"</p>
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-cyan-400 flex items-center justify-center font-bold text-white ring-2 ring-primary/20 ring-offset-2 ring-offset-card">
                                        {review.author.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm">{review.author}</p>
                                        <p className="text-xs text-muted-foreground">{review.location}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    {/* Duplicate for seamless loop - CSS animation handles the movement */}
                    <div className="absolute top-0 animate-marquee2 whitespace-nowrap flex gap-8 py-4">
                        {[...testimonials, ...testimonials].map((review, i) => (
                            <div key={`dup-${i}`} className="inline-flex flex-col w-[350px] p-6 rounded-2xl bg-card/80 backdrop-blur-sm border border-primary/10 mx-4 whitespace-normal shadow-lg">
                                <div className="flex gap-1 mb-4 text-amber-400">
                                    {[1, 2, 3, 4, 5].map(s => <Star key={s} className="h-4 w-4 fill-current" />)}
                                </div>
                                <p className="text-muted-foreground italic mb-4 flex-1">"{t(`home.testimonials.${review.text}`)}"</p>
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-cyan-400 flex items-center justify-center font-bold text-white ring-2 ring-primary/20 ring-offset-2 ring-offset-card">
                                        {review.author.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm">{review.author}</p>
                                        <p className="text-xs text-muted-foreground">{review.location}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </section>

            {/* CTA Section - Immersive Parallax Background */}
            <section className="min-h-[600px] relative flex items-center justify-center overflow-hidden">
                <motion.div
                    style={{ y: ctaY }}
                    className="absolute inset-0 w-full h-[120%]"
                >
                    <img
                        src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/Chaukhi_Mountain_%26_Tina_Lake%2C_Juta_Valley%2C_Mtskheta-Mtianeti%2C_Georgia.jpg/2560px-Chaukhi_Mountain_%26_Tina_Lake%2C_Juta_Valley%2C_Mtskheta-Mtianeti%2C_Georgia.jpg"
                        alt="Chaukhi Mountain & Tina Lake"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40" />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="container mx-auto px-4 relative z-10 text-center"
                >
                    <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 drop-shadow-lg leading-tight pb-2">{t('home.cta.title')}</h2>
                    <p className="text-white/90 text-xl max-w-2xl mx-auto mb-10 drop-shadow-md">
                        {t('home.cta.subtitle')}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-6 justify-center">
                        <Button size="lg" className="rounded-full text-lg h-14 px-10 shadow-xl hover:scale-105 transition-transform" onClick={() => navigate(ROUTES.REGISTER)}>
                            {t('home.cta.get_started')}
                        </Button>
                        <Button size="lg" variant="outline" className="rounded-full text-lg h-14 px-10 bg-white/10 text-white border-white/40 hover:bg-white/20 hover:text-white hover:scale-105 transition-all backdrop-blur-md" onClick={() => navigate(ROUTES.EXPLORE_TOURS)}>
                            {t('home.cta.browse_tours')}
                        </Button>
                    </div>
                </motion.div>
            </section>
        </div>
    );
};
