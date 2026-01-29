'use client';

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, FileText } from "lucide-react";

const INVOICES = [
    {
        id: "INV-2024-001",
        date: "2024-03-20",
        amount: 2500,
        description: "ტრანსპორტირება (Container #MSKU123)",
        status: "unpaid"
    },
    {
        id: "INV-2024-002",
        date: "2024-03-15",
        amount: 15300,
        description: "ავტომობილის ღირებულება (BMW M4)",
        status: "paid"
    },
    {
        id: "INV-2024-003",
        date: "2024-02-28",
        amount: 500,
        description: "სადილერო მომსახურება (თებერვალი)",
        status: "overdue"
    },
];

export function InvoiceTable() {
    return (
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>ინვოისი #</TableHead>
                        <TableHead>თარიღი</TableHead>
                        <TableHead>აღწერა</TableHead>
                        <TableHead>თანხა ($)</TableHead>
                        <TableHead>სტატუსი</TableHead>
                        <TableHead className="text-right">ჩამოტვირთვა</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {INVOICES.map((inv) => (
                        <TableRow key={inv.id}>
                            <TableCell className="font-mono">{inv.id}</TableCell>
                            <TableCell>{inv.date}</TableCell>
                            <TableCell>{inv.description}</TableCell>
                            <TableCell className="font-bold">{inv.amount.toLocaleString()}</TableCell>
                            <TableCell>
                                <Badge variant={inv.status === 'paid' ? 'default' : inv.status === 'overdue' ? 'destructive' : 'outline'}>
                                    {inv.status === 'paid' ? 'გადახდილი' : inv.status === 'overdue' ? 'ვადაგადაცილებული' : 'გადასახდელი'}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                                <Button size="sm" variant="ghost">
                                    <Download className="w-4 h-4" />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
