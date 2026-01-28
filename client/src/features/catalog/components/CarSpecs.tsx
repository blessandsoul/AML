import {
    Table,
    TableBody,
    TableCell,
    TableRow,
} from '@/components/ui/table';
import { Car } from '../data/mock-cars';
import { Calendar, Fuel, Gauge, MapPin, Settings2, Info } from 'lucide-react';

interface CarSpecsProps {
    car: Car;
}

export function CarSpecs({ car }: CarSpecsProps) {
    const specs = [
        { icon: Calendar, label: 'Год выпуска', value: car.year },
        { icon: Gauge, label: 'Пробег', value: `${car.mileage.toLocaleString()} mi` },
        { icon: Settings2, label: 'Двигатель', value: car.engine },
        { icon: Fuel, label: 'Топливо', value: car.fuel },
        { icon: MapPin, label: 'Локация', value: car.location },
        { icon: Info, label: 'Номер лота', value: car.lotNumber || 'N/A' },
        { icon: Info, label: 'Аукцион', value: car.auction || 'N/A' },
        { icon: Info, label: 'Статус', value: car.status },
    ];

    return (
        <div className="rounded-xl border bg-card">
            <div className="p-4 border-b bg-muted/20">
                <h3 className="font-semibold">Характеристики</h3>
            </div>
            <Table>
                <TableBody>
                    {specs.map((spec) => (
                        <TableRow key={spec.label}>
                            <TableCell className="font-medium flex items-center gap-2 text-muted-foreground">
                                <spec.icon className="w-4 h-4" />
                                {spec.label}
                            </TableCell>
                            <TableCell className="text-right font-medium">{spec.value}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
