'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUp } from "lucide-react";

// Mock Data for the chart
const DATA = [
    { label: "იან", value: 12000, height: "40%" },
    { label: "თებ", value: 18000, height: "60%" },
    { label: "მარ", value: 15000, height: "50%" },
    { label: "აპრ", value: 25000, height: "80%" },
    { label: "მაი", value: 22000, height: "70%" },
    { label: "ივნ", value: 30000, height: "100%" },
    { label: "ივლ", value: 28000, height: "90%" },
    { label: "აგვ", value: 24000, height: "75%" },
    { label: "სექ", value: 20000, height: "65%" },
    { label: "ოქტ", value: 10000, height: "35%" },
    { label: "ნოე", value: 5000, height: "15%" },
    { label: "დეკ", value: 15000, height: "50%" },
];

export function SalesChart() {
    return (
        <Card className="col-span-4 transition-all duration-300 hover:shadow-md">
            <CardHeader>
                <CardTitle>გაყიდვების დინამიკა</CardTitle>
                <CardDescription>
                    ბოლო 12 თვის მიმოხილვა
                </CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
                <div className="h-[350px] w-full flex items-end justify-between gap-2 px-4 pb-2 pt-6">
                    {DATA.map((item, index) => (
                        <div key={index} className="flex flex-col items-center gap-2 group flex-1 h-full justify-end">
                            <div className="relative w-full max-w-[40px] flex items-end justify-center h-full">
                                <div
                                    className="w-full bg-primary/80 rounded-t-sm group-hover:bg-primary transition-all duration-300 relative"
                                    style={{ height: item.height }}
                                >
                                    {/* Tooltip-ish value on hover */}
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground text-xs font-bold px-2 py-1 rounded shadow-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                                        ₾ {item.value.toLocaleString()}
                                    </div>
                                </div>
                            </div>
                            <span className="text-xs text-muted-foreground font-medium uppercase">{item.label}</span>
                        </div>
                    ))}
                </div>
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mt-4">
                    <div className="flex items-center gap-1 text-emerald-600 font-bold bg-emerald-100/50 px-2 py-1 rounded-full">
                        <ArrowUp className="w-4 h-4" />
                        +12.5%
                    </div>
                    <span>წინა წელთან შედარებით</span>
                </div>
            </CardContent>
        </Card>
    );
}
