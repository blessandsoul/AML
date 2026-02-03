'use client';

import { useParams } from 'next/navigation';
import { useTrackOrder } from '@/features/orders/hooks';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  ArrowLeft,
  Car,
  FileText,
  Gavel,
  MapPin,
  Package,
  Search,
  Ship,
  Truck,
} from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { motion } from 'framer-motion';
import Link from 'next/link';
import type { OrderStatus, OrderStatusHistory } from '@/features/orders/types';

const STATUS_MAP: Record<OrderStatus, { label: string; color: string }> = {
  WON: { label: 'მოგებულია', color: 'bg-blue-500' },
  PAID: { label: 'გადახდილია', color: 'bg-indigo-500' },
  SHIPPING: { label: 'გზაშია', color: 'bg-orange-500' },
  PORT: { label: 'პორტშია', color: 'bg-purple-500' },
  DELIVERED: { label: 'ჩაბარებულია', color: 'bg-emerald-500' },
};

const STAGE_META: Record<
  OrderStatus,
  { icon: React.ElementType; label: string }
> = {
  WON: { icon: Gavel, label: 'აუქციონზე მოგება' },
  PAID: { icon: FileText, label: 'გადახდა' },
  SHIPPING: { icon: Truck, label: 'ტრანსპორტირება' },
  PORT: { icon: MapPin, label: 'პორტში ჩამოსვლა' },
  DELIVERED: { icon: Package, label: 'ჩაბარება' },
};

const STAGE_ORDER: OrderStatus[] = [
  'WON',
  'PAID',
  'SHIPPING',
  'PORT',
  'DELIVERED',
];

function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('ka-GE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('ka-GE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

function TrackingSkeleton() {
  return (
    <div className="max-w-2xl mx-auto space-y-3 pt-2 pb-6 px-4">
      <Skeleton className="h-8 w-20" />
      <Card>
        <CardContent className="p-4 space-y-3">
          <Skeleton className="h-6 w-56" />
          <Skeleton className="h-3 w-40" />
          <Skeleton className="h-2 w-full rounded-full" />
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex gap-3">
              <Skeleton className="w-8 h-8 rounded-full shrink-0" />
              <div className="space-y-1.5 flex-1">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-3 w-40" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

export default function TrackResultPage() {
  const params = useParams();
  const code = params.code as string;
  const { data: order, isLoading, isError } = useTrackOrder(code);

  if (isLoading) {
    return (
      <MainLayout>
        <TrackingSkeleton />
      </MainLayout>
    );
  }

  if (isError || !order) {
    return (
      <MainLayout>
        <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="max-w-md">
              <CardContent className="flex flex-col items-center justify-center py-12 px-8">
                <Package className="w-10 h-10 text-muted-foreground mb-3" />
                <p className="text-base font-medium text-muted-foreground mb-1">
                  შეკვეთა ვერ მოიძებნა
                </p>
                <p className="text-sm text-muted-foreground mb-5 text-center">
                  თრექინგ კოდი &quot;{code}&quot; არ შეესაბამება არცერთ შეკვეთას
                </p>
                <Link href="/track">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Search className="w-4 h-4" />
                    ხელახლა ძებნა
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </MainLayout>
    );
  }

  const historyMap = new Map<OrderStatus, OrderStatusHistory>();
  order.status_history.forEach((h) => {
    historyMap.set(h.status, h);
  });

  const showShipping = order.status === 'SHIPPING' || order.status === 'PORT';
  const progressPercent = (order.current_stage / 5) * 100;

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto pt-2 pb-6 px-4 space-y-3">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-3"
        >
          {/* Back link */}
          <div className="mb-1">
            <Link href="/track">
              <Button variant="ghost" size="sm" className="gap-1.5 -ml-2 text-muted-foreground">
                <ArrowLeft className="w-3.5 h-3.5" />
                უკან
              </Button>
            </Link>
          </div>

          {/* Order Info + Progress combined */}
          <Card>
            <CardContent className="p-4 space-y-4">
              {/* Car info row */}
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1 min-w-0">
                  <h2 className="text-lg font-bold flex items-center gap-2">
                    <Car className="w-5 h-5 text-primary shrink-0" />
                    {order.car_year} {order.car_make} {order.car_model}
                  </h2>
                  <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-muted-foreground">
                    <span>
                      <span className="font-medium text-foreground">შეკვეთა:</span>{' '}
                      {order.order_number}
                    </span>
                    <span>
                      <span className="font-medium text-foreground">კოდი:</span>{' '}
                      <span className="font-mono">{order.tracking_code}</span>
                    </span>
                  </div>
                </div>
                <Badge className={`${STATUS_MAP[order.status]?.color} shrink-0`}>
                  {STATUS_MAP[order.status]?.label}
                </Badge>
              </div>

              {/* Progress bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-[10px] text-muted-foreground">
                  <span>პროგრესი</span>
                  <span>{order.current_stage}/5</span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-primary rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                  />
                </div>
                <div className="flex justify-between">
                  {STAGE_ORDER.map((status, index) => {
                    const meta = STAGE_META[status];
                    const isActive = index < order.current_stage;
                    return (
                      <span
                        key={status}
                        className={`text-[10px] ${
                          isActive
                            ? 'text-foreground font-medium'
                            : 'text-muted-foreground'
                        }`}
                      >
                        {meta.label.split(' ')[0]}
                      </span>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardContent className="p-4">
              <p className="text-sm font-semibold mb-3">სტატუსის ისტორია</p>
              <div className="relative">
                {STAGE_ORDER.map((status, index) => {
                  const historyEntry = historyMap.get(status);
                  const meta = STAGE_META[status];
                  const StageIcon = meta.icon;
                  const isCompleted = index < order.current_stage;
                  const isCurrent = index === order.current_stage - 1;
                  const isLast = index === STAGE_ORDER.length - 1;

                  return (
                    <div key={status} className="flex gap-3 relative">
                      {/* Vertical line */}
                      {!isLast && (
                        <div
                          className={`absolute left-4 top-8 w-0.5 h-full -translate-x-1/2 ${
                            isCompleted ? 'bg-primary' : 'bg-muted'
                          }`}
                        />
                      )}

                      {/* Icon */}
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center border-2 shrink-0 z-10 ${
                          isCompleted || isCurrent
                            ? 'bg-primary border-primary text-primary-foreground'
                            : 'bg-background border-muted text-muted-foreground'
                        }`}
                      >
                        <StageIcon className="w-3.5 h-3.5" />
                      </div>

                      {/* Content */}
                      <div className={`flex-1 ${isLast ? 'pb-0' : 'pb-4'}`}>
                        <p
                          className={`text-sm font-medium leading-8 ${
                            isCompleted || isCurrent
                              ? 'text-foreground'
                              : 'text-muted-foreground'
                          }`}
                        >
                          {meta.label}
                        </p>
                        {historyEntry ? (
                          <div className="space-y-0.5 -mt-1">
                            <p className="text-[11px] text-muted-foreground">
                              {formatDateTime(historyEntry.created_at)}
                              {historyEntry.location && (
                                <span className="inline-flex items-center gap-0.5 ml-2">
                                  <MapPin className="w-2.5 h-2.5 inline" />
                                  {historyEntry.location}
                                </span>
                              )}
                            </p>
                            {historyEntry.note && (
                              <p className="text-xs text-muted-foreground">
                                {historyEntry.note}
                              </p>
                            )}
                          </div>
                        ) : (
                          <p className="text-[11px] text-muted-foreground -mt-1">
                            მოლოდინში
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Shipping Info */}
          {showShipping && (
            <Card>
              <CardContent className="p-4">
                <p className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <Ship className="w-4 h-4 text-primary" />
                  ტრანსპორტირება
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {order.vessel_name && (
                    <div>
                      <p className="text-[11px] text-muted-foreground">გემი</p>
                      <p className="text-sm font-medium">{order.vessel_name}</p>
                    </div>
                  )}
                  {order.origin_port && (
                    <div>
                      <p className="text-[11px] text-muted-foreground">საიდან</p>
                      <p className="text-sm font-medium">{order.origin_port}</p>
                    </div>
                  )}
                  {order.destination_port && (
                    <div>
                      <p className="text-[11px] text-muted-foreground">სად</p>
                      <p className="text-sm font-medium">{order.destination_port}</p>
                    </div>
                  )}
                  {order.estimated_arrival && (
                    <div>
                      <p className="text-[11px] text-muted-foreground">ჩამოსვლა</p>
                      <p className="text-sm font-medium">
                        {formatDate(order.estimated_arrival)}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>
    </MainLayout>
  );
}
