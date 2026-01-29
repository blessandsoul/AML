'use client';

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Car, FileText, MapPin, Package, Truck } from "lucide-react";

// Mock Data
const ORDERS = [
    {
        id: "ORD-2024-001",
        date: "2024-03-15",
        car: "2021 BMW X5 M50i",
        vin: "5UX...8291",
        price: 45200,
        status: "shipping",
        stage: 3, // 1: Won, 2: Paid, 3: Shipping, 4: Port, 5: Delivered
    },
    {
        id: "ORD-2023-089",
        date: "2023-11-20",
        car: "2020 Toyota Camry SE",
        vin: "4T1...9923",
        price: 12500,
        status: "delivered",
        stage: 5,
    },
];

const STATUS_MAP: Record<string, { label: string, color: string }> = {
    won: { label: "მოგებულია", color: "bg-blue-500" },
    paid: { label: "გადახდილია", color: "bg-indigo-500" },
    shipping: { label: "გზაშია", color: "bg-orange-500" },
    port: { label: "პორტშია", color: "bg-purple-500" },
    delivered: { label: "ჩაბარებულია", color: "bg-emerald-500" },
};

const STAGES = [
    { icon: GavelIcon, label: "მოგება" },
    { icon: FileText, label: "გადახდა" },
    { icon: Truck, label: "ტრანსპორტირება" },
    { icon: MapPin, label: "პორტი" },
    { icon: Package, label: "დანიშნულება" },
];

function GavelIcon(props: any) { return <span {...props}>🔨</span> } // Simple icon replacement for Gavel if strict on imports

export function OrderList() {
    return (
        <div className="space-y-6">
            {ORDERS.map((order) => (
                <Card key={order.id} className="overflow-hidden">
                    <CardHeader className="bg-muted/30 pb-4">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Car className="w-5 h-5 text-primary" />
                                    {order.car}
                                </CardTitle>
                                <CardDescription>VIN: {order.vin} • შეკვეთის #: {order.id}</CardDescription>
                            </div>
                            <div className="flex items-center gap-3">
                                <Badge className={STATUS_MAP[order.status]?.color}>
                                    {STATUS_MAP[order.status]?.label}
                                </Badge>
                                <Button size="sm" variant="outline">
                                    <FileText className="w-4 h-4 mr-2" />
                                    ინვოისი
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                        {/* Timeline */}
                        <div className="relative">
                            <div className="absolute top-1/2 left-0 right-0 h-1 bg-muted -translate-y-1/2 z-0 hidden md:block" />
                            <div className="grid grid-cols-5 gap-2 relative z-10">
                                {STAGES.map((stage, index) => {
                                    const isCompleted = index < order.stage;
                                    const isCurrent = index === order.stage - 1;

                                    return (
                                        <div key={stage.label} className="flex flex-col items-center gap-2 text-center group">
                                            <div
                                                className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300
                                                    ${isCompleted || isCurrent
                                                        ? "bg-primary border-primary text-primary-foreground"
                                                        : "bg-background border-muted text-muted-foreground"}
                                                `}
                                            >
                                                <stage.icon className="w-4 h-4" />
                                            </div>
                                            <span className={`text-xs font-medium ${isCompleted || isCurrent ? "text-foreground" : "text-muted-foreground"}`}>
                                                {stage.label}
                                            </span>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}

// Helper icons
// Re-importing lucide icons properly for the array
import { Gavel } from "lucide-react";
// Fixing the array usage
STAGES[0].icon = Gavel;
