'use client';

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, MoreHorizontal, Eye } from "lucide-react";
import Image from "next/image";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const INVENTORY = [
    {
        id: "INV-001",
        title: "2021 BMW M4 Competition",
        image: "https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=200",
        price: 58500,
        views: 1240,
        bids: 5,
        status: "active"
    },
    {
        id: "INV-002",
        title: "2018 Mercedes-Benz C300",
        image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=200",
        price: 22000,
        views: 450,
        bids: 0,
        status: "draft"
    },
    {
        id: "INV-003",
        title: "2020 Toyota Camry SE",
        image: "https://images.unsplash.com/photo-1621007947382-bb3c3968e3bb?q=80&w=200",
        price: 18500,
        views: 2100,
        bids: 12,
        status: "sold"
    },
];

export function InventoryTable() {
    return (
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>ავტომობილი</TableHead>
                        <TableHead>ფასი</TableHead>
                        <TableHead>ნახვები</TableHead>
                        <TableHead>ბიდები</TableHead>
                        <TableHead>სტატუსი</TableHead>
                        <TableHead className="text-right">მოქმედება</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {INVENTORY.map((item) => (
                        <TableRow key={item.id}>
                            <TableCell>
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-md overflow-hidden relative bg-muted">
                                        <Image src={item.image} alt={item.title} fill className="object-cover" />
                                    </div>
                                    <span className="font-medium text-sm">{item.title}</span>
                                </div>
                            </TableCell>
                            <TableCell className="font-bold">${item.price.toLocaleString()}</TableCell>
                            <TableCell>{item.views}</TableCell>
                            <TableCell>{item.bids}</TableCell>
                            <TableCell>
                                <Badge variant={item.status === 'active' ? 'default' : item.status === 'sold' ? 'secondary' : 'outline'}>
                                    {item.status === 'active' ? 'აქტიური' : item.status === 'sold' ? 'გაყიდული' : 'დრაფტი'}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                                            <MoreHorizontal className="w-4 h-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem><Edit className="w-4 h-4 mr-2" /> რედაქტირება</DropdownMenuItem>
                                        <DropdownMenuItem><Eye className="w-4 h-4 mr-2" /> ნახვა</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
