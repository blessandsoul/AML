'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';

export function FilterSidebar() {
    const [priceRange, setPriceRange] = React.useState([0, 100000]);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg">Фильтры</h3>
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                    Сбросить
                </Button>
            </div>

            <Accordion type="multiple" defaultValue={['price', 'make', 'type']} className="w-full">
                {/* Price Range */}
                <AccordionItem value="price">
                    <AccordionTrigger>Цена</AccordionTrigger>
                    <AccordionContent className="pt-4 px-1">
                        <Slider
                            defaultValue={[0, 100000]}
                            max={100000}
                            step={1000}
                            value={priceRange}
                            onValueChange={setPriceRange}
                            className="mb-4"
                        />
                        <div className="flex items-center justify-between text-sm">
                            <div className="border rounded px-2 py-1">${priceRange[0]}</div>
                            <div className="border rounded px-2 py-1">${priceRange[1]}</div>
                        </div>
                    </AccordionContent>
                </AccordionItem>

                {/* Categories */}
                <AccordionItem value="type">
                    <AccordionTrigger>Тип транспорта</AccordionTrigger>
                    <AccordionContent className="space-y-2">
                        <div className="flex items-center space-x-2">
                            <Checkbox id="cars" checked />
                            <Label htmlFor="cars">Легковые</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox id="moto" />
                            <Label htmlFor="moto">Мотоциклы</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox id="heavy" />
                            <Label htmlFor="heavy">Спецтехника</Label>
                        </div>
                    </AccordionContent>
                </AccordionItem>

                {/* Makes */}
                <AccordionItem value="make">
                    <AccordionTrigger>Марка</AccordionTrigger>
                    <AccordionContent className="space-y-2">
                        {['BMW', 'Mercedes-Benz', 'Toyota', 'Honda', 'Ford', 'Chevrolet'].map((make) => (
                            <div key={make} className="flex items-center space-x-2">
                                <Checkbox id={make.toLowerCase()} />
                                <Label htmlFor={make.toLowerCase()}>{make}</Label>
                            </div>
                        ))}
                    </AccordionContent>
                </AccordionItem>

                {/* Auctions */}
                <AccordionItem value="auction">
                    <AccordionTrigger>Аукцион</AccordionTrigger>
                    <AccordionContent className="space-y-2">
                        <div className="flex items-center space-x-2">
                            <Checkbox id="copart" />
                            <Label htmlFor="copart">Copart</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox id="iaai" />
                            <Label htmlFor="iaai">IAAI</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox id="manheim" />
                            <Label htmlFor="manheim">Manheim</Label>
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>

            <Button className="w-full">Применить (124)</Button>
        </div>
    );
}
