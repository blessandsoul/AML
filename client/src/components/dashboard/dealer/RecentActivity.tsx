'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const ACTIVITY = [
    {
        user: "ალექსანდრე მ.",
        action: "დადო ბიდი 2021 BMW M4-ზე",
        time: "2 წუთის წინ",
        amount: "$58,500"
    },
    {
        user: "გიორგი კ.",
        action: "შეიძინა 2020 Porsche 911",
        time: "1 საათის წინ",
        amount: "$115,000"
    },
    {
        user: "სისტემა",
        action: "ინვოისი #INV-2024-001 გადახდილია",
        time: "3 საათის წინ",
        amount: ""
    },
    {
        user: "ნინო ბ.",
        action: "დაამატა ფავორიტებში Mercedes-AMG GT",
        time: "5 საათის წინ",
        amount: ""
    },
];

export function RecentActivity() {
    return (
        <Card className="col-span-3">
            <CardHeader>
                <CardTitle>ბოლო აქტივობები</CardTitle>
                <CardDescription>
                    თქვენი განცხადებების გარშემო არსებული აქტივობა.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-8">
                    {ACTIVITY.map((item, index) => (
                        <div key={index} className="flex items-center">
                            <Avatar className="h-9 w-9">
                                <AvatarFallback>{item.user[0]}</AvatarFallback>
                            </Avatar>
                            <div className="ml-4 space-y-1">
                                <p className="text-sm font-medium leading-none">{item.user}</p>
                                <p className="text-sm text-muted-foreground">
                                    {item.action}
                                </p>
                            </div>
                            <div className="ml-auto font-medium">
                                {item.amount && <span className="text-emerald-600">+{item.amount}</span>}
                                <p className="text-xs text-muted-foreground text-right">{item.time}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
