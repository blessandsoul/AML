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
import { Breadcrumbs } from '@/components/shared/Breadcrumbs';

export default function CatalogPage() {
    return (
        <div className="min-h-screen bg-background bg-mesh text-foreground">
            <div className="container mx-auto px-4 pb-8 pt-10 md:pt-8">
                <Breadcrumbs
                    items={[
                        { label: 'მთავარი', href: '/' },
                        { label: 'კატალოგი' },
                    ]}
                />
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar - Desktop */}
                    <aside className="hidden md:block w-64 flex-shrink-0">
                        <div className="sticky top-24">
                            <FilterSidebar />
                        </div>
                    </aside>

                    <main className="flex-1">
                        {/* Header */}
                        <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
                            <h1 className="text-2xl md:text-3xl font-bold self-start sm:self-auto">ავტომობილების კატალოგი</h1>

                            <div className="flex items-center gap-3 w-full sm:w-auto">
                                {/* Mobile Filter */}
                                <Sheet>
                                    <SheetTrigger asChild>
                                        <Button variant="outline" className="md:hidden flex-1 h-10">
                                            <Filter className="w-4 h-4 mr-2" />
                                            ფილტრები
                                        </Button>
                                    </SheetTrigger>
                                    <SheetContent side="left" className="w-[85vw] sm:w-[350px] overflow-y-auto">
                                        <div className="py-6">
                                            <FilterSidebar />
                                        </div>
                                    </SheetContent>
                                </Sheet>

                                {/* Sorting */}
                                <div className="flex-1 sm:w-[180px] sm:flex-none">
                                    <Select defaultValue="newest">
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="სორტირება" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="newest">ჯერ ახალი</SelectItem>
                                            <SelectItem value="price-asc">ჯერ იაფი</SelectItem>
                                            <SelectItem value="price-desc">ჯერ ძვირი</SelectItem>
                                            <SelectItem value="year-desc">ჯერ ახალი წლით</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>

                        {/* Results Info */}
                        <div className="mb-6 text-muted-foreground">
                            ნაპოვნია <span className="text-foreground font-medium">2,543</span> ავტომობილი
                        </div>

                        {/* Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                            {[...MOCK_CARS, ...MOCK_CARS, ...MOCK_CARS].map((car, i) => (
                                <CarCard key={`${car.id}-${i}`} car={car} index={i} />
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
        </div>
    );
}
