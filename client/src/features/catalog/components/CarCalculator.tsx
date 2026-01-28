'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Car } from '../data/mock-cars';
import { Calculator as CalcIcon, Truck, Anchor, Landmark } from 'lucide-react';

interface CarCalculatorProps {
    car: Car;
}

export function CarCalculator({ car }: CarCalculatorProps) {
    const [auctionFee] = React.useState(500);
    const [deliveryUSA] = React.useState(350);
    const [shipping] = React.useState(1200);

    const total = car.price + auctionFee + deliveryUSA + shipping;

    return (
        <Card className="border-primary/20 shadow-lg sticky top-24">
            <CardHeader className="bg-primary/5 pb-4">
                <CardTitle className="flex items-center gap-2">
                    <CalcIcon className="w-5 h-5 text-primary" />
                    Калькулятор стоимости
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
                <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Цена лота</span>
                        <span className="font-semibold">${car.price.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground flex items-center gap-1">
                            <Landmark className="w-3 h-3" /> Сбор аукциона
                        </span>
                        <span>${auctionFee}</span>
                    </div>
                </div>

                <Separator />

                <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground flex items-center gap-1">
                            <Truck className="w-3 h-3" /> Доставка по США
                        </span>
                        <span>${deliveryUSA}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground flex items-center gap-1">
                            <Anchor className="w-3 h-3" /> Доставка морем (Poti)
                        </span>
                        <span>${shipping}</span>
                    </div>
                </div>

                <Separator className="my-4" />

                <div className="flex justify-between items-end">
                    <span className="font-semibold text-lg">Итого в Грузии</span>
                    <span className="font-bold text-2xl text-primary">
                        ${total.toLocaleString()}
                    </span>
                </div>

                <Button className="w-full text-lg h-12 mt-4" size="lg">
                    Заказать авто
                </Button>
                <p className="text-xs text-center text-muted-foreground mt-2">
                    * Стоимость растаможки рассчитывается отдельно
                </p>
            </CardContent>
        </Card>
    );
}
