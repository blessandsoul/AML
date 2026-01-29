'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Car, Gavel, Activity, ArrowUpRight, ArrowDownRight } from "lucide-react";

const STATS = [
    {
        title: "სულ გაყიდვები",
        value: "₾ 45,231.89",
        change: "+20.1%",
        trend: "up",
        icon: DollarSign,
        gradient: "from-blue-500/10 to-cyan-500/10 border-blue-200/20",
        iconColor: "text-blue-500"
    },
    {
        title: "აქტიური განცხადებები",
        value: "12",
        change: "+2 ახალი",
        trend: "up",
        icon: Car,
        gradient: "from-emerald-500/10 to-green-500/10 border-emerald-200/20",
        iconColor: "text-emerald-500"
    },
    {
        title: "აქტიური ბიდები",
        value: "5",
        change: "-1 გუშინ",
        trend: "down",
        icon: Gavel,
        gradient: "from-amber-500/10 to-orange-500/10 border-amber-200/20",
        iconColor: "text-amber-500"
    },
    {
        title: "თვიური შემოსავალი",
        value: "₾ 12,450.00",
        change: "+15%",
        trend: "up",
        icon: Activity,
        gradient: "from-purple-500/10 to-pink-500/10 border-purple-200/20",
        iconColor: "text-purple-500"
    },
];

export function StatsCards() {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {STATS.map((stat) => (
                <Card key={stat.title} className={`relative overflow-hidden border transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-gradient-to-br ${stat.gradient}`}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            {stat.title}
                        </CardTitle>
                        <div className={`p-2 rounded-lg bg-background/50 backdrop-blur-sm ${stat.iconColor}`}>
                            <stat.icon className="h-4 w-4" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold tracking-tight">{stat.value}</div>
                        <div className="flex items-center gap-2 mt-1">
                            {stat.trend === 'up' ? (
                                <span className="flex items-center text-xs font-bold text-emerald-600 bg-emerald-100/50 px-1.5 py-0.5 rounded">
                                    <ArrowUpRight className="w-3 h-3 mr-1" />
                                    {stat.change}
                                </span>
                            ) : (
                                <span className="flex items-center text-xs font-bold text-rose-600 bg-rose-100/50 px-1.5 py-0.5 rounded">
                                    <ArrowDownRight className="w-3 h-3 mr-1" />
                                    {stat.change}
                                </span>
                            )}
                            <span className="text-[10px] text-muted-foreground uppercase opacity-70">ბოლო 30 დღე</span>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
