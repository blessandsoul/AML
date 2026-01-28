'use client';

import * as React from 'react';
import { FilterSidebar } from '@/features/catalog/components/FilterSidebar';
import { CarCard } from '@/features/catalog/components/CarCard';
import { MOCK_CARS } from '@/features/catalog/data/mock-cars';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Filter } from 'lucide-react';

export default function CatalogPage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row gap-8">
                {/* Sidebar - Desktop */}
                <aside className="hidden md:block w-64 flex-shrink-0">
                    <div className="sticky top-24">
                        <FilterSidebar />
                    </div>
                </aside>

                <main className="flex-1">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-3xl font-bold">Каталог авто</h1>

                        <div className="flex items-center gap-4">
                            {/* Mobile Filter */}
                            <Sheet>
                                <SheetTrigger asChild>
                                    <Button variant="outline" className="md:hidden">
                                        <Filter className="w-4 h-4 mr-2" />
                                        Фильтры
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="left" className="w-[300px] overflow-y-auto">
                                    <div className="py-6">
                                        <FilterSidebar />
                                    </div>
                                </SheetContent>
                            </Sheet>

                            {/* Sorting */}
                            <Select defaultValue="newest">
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Сортировка" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="newest">Сначала новые</SelectItem>
                                    <SelectItem value="price-asc">Сначала дешевле</SelectItem>
                                    <SelectItem value="price-desc">Сначала дороже</SelectItem>
                                    <SelectItem value="year-desc">Сначала свежие</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Results Info */}
                    <div className="mb-6 text-muted-foreground">
                        Найдено <span className="text-foreground font-medium">2,543</span> автомобиля
                    </div>

                    {/* Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                        {[...MOCK_CARS, ...MOCK_CARS, ...MOCK_CARS].map((car, i) => (
                            <CarCard key={`${car.id}-${i}`} car={car} />
                        ))}
                    </div>

                    {/* Pagination */}
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious href="#" />
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationLink href="#" isActive>1</PaginationLink>
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationLink href="#">2</PaginationLink>
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationLink href="#">3</PaginationLink>
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationEllipsis />
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationNext href="#" />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </main>
            </div>
        </div>
    );
}
