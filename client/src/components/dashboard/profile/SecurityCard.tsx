'use client';

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Lock, Smartphone } from "lucide-react"
import { Switch } from "@/components/ui/switch"

export function SecurityCard() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>უსაფრთხოება</CardTitle>
                <CardDescription>
                    პაროლის შეცვლა და უსაფრთხოების დამატებითი პარამეტრები.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">

                {/* Password Change Section - Simplified visual representation */}
                <div className="grid gap-4">
                    <div className="space-y-2">
                        <Label>ახალი პაროლი</Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input type="password" placeholder="••••••••" className="pl-9" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>გაიმეორეთ პაროლი</Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input type="password" placeholder="••••••••" className="pl-9" />
                        </div>
                    </div>
                    <Button variant="outline" className="w-fit">პაროლის განახლება</Button>
                </div>

                <div className="h-[1px] bg-border my-6" />

                {/* 2FA Section */}
                <div className="flex items-center justify-between space-x-2">
                    <div className="flex flex-col space-y-1">
                        <span className="font-medium flex items-center gap-2">
                            <Smartphone className="h-4 w-4 text-primary" />
                            ორფაქტორიანი აუთენტიფიკაცია (2FA)
                        </span>
                        <span className="text-sm text-muted-foreground">
                            დაამატეთ უსაფრთხოების დამატებითი შრე თქვენს ანგარიშზე.
                        </span>
                    </div>
                    <Switch />
                </div>
            </CardContent>
        </Card>
    )
}
