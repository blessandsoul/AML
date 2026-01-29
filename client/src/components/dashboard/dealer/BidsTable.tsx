'use client';

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Timer, ArrowUpRight } from "lucide-react";
import Image from "next/image";

const BIDS = [
    {
        id: "BID-102",
        car: "2021 BMW M4 Competition",
        image: "https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=200",
        currentBid: 58500,
        myMaxBid: 60000,
        endTime: "2სთ 15წთ",
        status: "winning"
    },
    {
        id: "BID-098",
        car: "2020 Porsche 911 Carrera S",
        image: "https://images.unsplash.com/photo-1503376763036-066120622c74?q=80&w=200",
        currentBid: 115000,
        myMaxBid: 112000,
        endTime: "45წთ",
        status: "losing"
    },
    {
        id: "BID-085",
        car: "2019 Audi RS5 Sportback",
        image: "https://images.unsplash.com/photo-1606152421811-996d5db24c30?q=80&w=200",
        currentBid: 42000,
        myMaxBid: 45000,
        endTime: "დასრულებული",
        status: "won"
    },
];

export function BidsTable() {
    return (
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>ავტომობილი</TableHead>
                        <TableHead>მიმდინარე ბიდი</TableHead>
                        <TableHead>ჩემი მაქსიმუმი</TableHead>
                        <TableHead>დრო</TableHead>
                        <TableHead>სტატუსი</TableHead>
                        <TableHead className="text-right">მოქმედება</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {BIDS.map((bid) => (
                        <TableRow key={bid.id}>
                            <TableCell>
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-md overflow-hidden relative bg-muted">
                                        <Image src={bid.image} alt={bid.car} fill className="object-cover" />
                                    </div>
                                    <span className="font-medium text-sm">{bid.car}</span>
                                </div>
                            </TableCell>
                            <TableCell className="font-bold">${bid.currentBid.toLocaleString()}</TableCell>
                            <TableCell className="text-muted-foreground">${bid.myMaxBid.toLocaleString()}</TableCell>
                            <TableCell>
                                <div className="flex items-center gap-1.5 text-xs font-mono bg-muted/50 w-fit px-2 py-1 rounded">
                                    <Timer className="w-3 h-3" />
                                    {bid.endTime}
                                </div>
                            </TableCell>
                            <TableCell>
                                {bid.status === 'winning' && (
                                    <Badge className="bg-emerald-500 hover:bg-emerald-600">იგებთ</Badge>
                                )}
                                {bid.status === 'losing' && (
                                    <Badge variant="destructive">აგებთ</Badge>
                                )}
                                {bid.status === 'won' && (
                                    <Badge variant="outline" className="border-emerald-500 text-emerald-500">მოგებული</Badge>
                                )}
                            </TableCell>
                            <TableCell className="text-right">
                                <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                                    <ArrowUpRight className="w-4 h-4" />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
