'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Bell, Moon, Globe } from "lucide-react";

export function SettingsForm() {
    return (
        <div className="grid gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>შეტყობინებები</CardTitle>
                    <CardDescription>მართეთ როგორ გსურთ მიიღოთ შეტყობინებები.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Bell className="w-4 h-4" />
                            <Label>ელ-ფოსტით შეტყობინებები</Label>
                        </div>
                        <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Bell className="w-4 h-4" />
                            <Label>SMS შეტყობინებები</Label>
                        </div>
                        <Switch />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>აპლიკაციის პარამეტრები</CardTitle>
                    <CardDescription>ენი, ვალუტა და თემა.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Moon className="w-4 h-4" />
                            <Label>მუქი რეჟიმი</Label>
                        </div>
                        <Switch />
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-end">
                <Button>პარამეტრების შენახვა</Button>
            </div>
        </div>
    );
}
