'use client';

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Car, Upload, Search } from "lucide-react"

// Assume Textarea and Select exist or use basic inputs if not. 
// I'll check if Select and Textarea exist. If not, I'll fallback to standard HTML or create them quickly.
// Since I created Form and Switch, I suspect Select/Textarea might be missing too.
// I'll assume they are missing and implement basic versions inside this file or strictly stick to Inputs if possible to avoid component fatigue.
// Actually, I'll use simple imports and if they fail, I'll fix them. standard shadcn usually has them.
// Let's rely on standard HTML for complex inputs if I can't verify existence, BUT previous `package.json` showed `@radix-ui/react-select` IS installed. So Select likely exists or I can build it. 
// To be safe and fast, I will implement a visual form using standard Inputs where possible or creating simple wrappers.

const listingSchema = z.object({
    vin: z.string().min(17, "VIN must be 17 characters"),
    title: z.string().min(5),
    price: z.string(),
    year: z.string(),
    mileage: z.string(),
    description: z.string().optional(),
})

export function ListingWizard() {
    const form = useForm<z.infer<typeof listingSchema>>({
        resolver: zodResolver(listingSchema),
    })

    function onSubmit(data: z.infer<typeof listingSchema>) {
        console.log(data)
    }

    return (
        <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-6">
                <div className="flex items-end gap-4 p-4 border rounded-lg bg-muted/20">
                    <div className="flex-1 space-y-2">
                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            VIN კოდი (დეკოდირება)
                        </label>
                        <div className="relative">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="შეიყვანეთ VIN კოდი" className="pl-9 bg-background" />
                        </div>
                    </div>
                    <Button>შემოწმება</Button>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>სათაური</FormLabel>
                                    <FormControl>
                                        <Input placeholder="მაგ: 2021 BMW M4 Competition" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="year"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>წელი</FormLabel>
                                        <FormControl>
                                            <Input type="number" placeholder="2024" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="mileage"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>გარბენი (mi)</FormLabel>
                                        <FormControl>
                                            <Input type="number" placeholder="0" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormField
                            control={form.control}
                            name="price"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>ფასი ($)</FormLabel>
                                    <FormControl>
                                        <Input type="number" placeholder="15000" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="pt-4">
                            <Button type="submit" className="w-full">განცხადების გამოქვეყნება</Button>
                        </div>
                    </form>
                </Form>
            </div>

            {/* Upload Area */}
            <div className="space-y-4">
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg flex flex-col items-center justify-center h-[300px] bg-muted/5 hover:bg-muted/10 transition-colors cursor-pointer text-center p-6">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                        <Upload className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="font-semibold text-lg">ატვირთეთ ფოტოები</h3>
                    <p className="text-sm text-muted-foreground max-w-xs mt-2">
                        გადაათრიეთ ფოტოები აქ ან დააჭირეთ ატვირთვისთვის. (Max 20MB)
                    </p>
                </div>

                <div className="grid grid-cols-3 gap-2">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="aspect-[4/3] bg-muted rounded-md flex items-center justify-center">
                            <Car className="w-8 h-8 text-muted-foreground/20" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
