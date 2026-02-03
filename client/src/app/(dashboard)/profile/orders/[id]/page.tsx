'use client';

import { useParams, useRouter } from 'next/navigation';
import { useOrder } from '@/features/orders/hooks';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import {
  ArrowLeft,
  Car,
  Check,
  ClipboardCopy,
  FileText,
  Gavel,
  MapPin,
  Package,
  Ship,
  Truck,
} from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';
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

const STAGE_ORDER: OrderStatus[] = ['WON', 'PAID', 'SHIPPING', 'PORT', 'DELIVERED'];

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

function formatPrice(amount: number | null): string {
  if (amount === null || amount === undefined) return '---';
  return `$${amount.toLocaleString('en-US')}`;
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
      title="კოპირება"
    >
      {copied ? (
        <Check className="w-3.5 h-3.5 text-emerald-500" />
      ) : (
        <ClipboardCopy className="w-3.5 h-3.5" />
      )}
    </button>
  );
}

function OrderDetailSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-9 w-40" />
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <Skeleton className="w-full md:w-64 h-48 rounded-lg" />
            <div className="flex-1 space-y-3">
              <Skeleton className="h-7 w-64" />
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-6 w-24 rounded-full" />
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-5 w-full" />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent className="space-y-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex gap-4">
              <Skeleton className="w-10 h-10 rounded-full shrink-0" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-48" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { data: order, isLoading, isError } = useOrder(id);

  if (isLoading) {
    return <OrderDetailSkeleton />;
  }

  if (isError || !order) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-6"
      >
        <Button
          variant="ghost"
          onClick={() => router.push('/profile/orders')}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          უკან დაბრუნება
        </Button>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Package className="w-12 h-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium text-muted-foreground">
              შეკვეთა ვერ მოიძებნა
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => router.push('/profile/orders')}
            >
              შეკვეთებზე დაბრუნება
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  const historyMap = new Map<OrderStatus, OrderStatusHistory>();
  order.status_history.forEach((h) => {
    historyMap.set(h.status, h);
  });

  const showShipping = order.status === 'SHIPPING' || order.status === 'PORT';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Back button */}
      <Button
        variant="ghost"
        onClick={() => router.push('/profile/orders')}
        className="gap-2"
      >
        <ArrowLeft className="w-4 h-4" />
        უკან დაბრუნება
      </Button>

      {/* Order Summary Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Car Image */}
            <div className="w-full md:w-64 h-48 rounded-lg overflow-hidden bg-muted flex items-center justify-center shrink-0">
              {order.car_image ? (
                <Image
                  src={order.car_image}
                  alt={`${order.car_year} ${order.car_make} ${order.car_model}`}
                  width={256}
                  height={192}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Car className="w-16 h-16 text-muted-foreground" />
              )}
            </div>

            {/* Car Details */}
            <div className="flex-1 space-y-3">
              <h2 className="text-2xl font-bold">
                {order.car_year} {order.car_make} {order.car_model}
              </h2>

              <div className="space-y-1.5 text-sm text-muted-foreground">
                <p className="flex items-center gap-2">
                  <span className="font-medium text-foreground">VIN:</span>
                  {order.car_vin || '---'}
                  {order.car_vin && <CopyButton text={order.car_vin} />}
                </p>
                <p className="flex items-center gap-2">
                  <span className="font-medium text-foreground">
                    შეკვეთის ნომერი:
                  </span>
                  {order.order_number}
                  <CopyButton text={order.order_number} />
                </p>
                <p className="flex items-center gap-2">
                  <span className="font-medium text-foreground">
                    თრექინგ კოდი:
                  </span>
                  {order.tracking_code}
                  <CopyButton text={order.tracking_code} />
                </p>
                {order.auction_source && (
                  <p>
                    <span className="font-medium text-foreground">
                      აუქციონი:
                    </span>{' '}
                    {order.auction_source}
                    {order.lot_number && ` / ლოტი #${order.lot_number}`}
                  </p>
                )}
              </div>

              <Badge className={STATUS_MAP[order.status]?.color}>
                {STATUS_MAP[order.status]?.label}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Price Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">ფასის დეტალები</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">აუქციონის ფასი</span>
            <span>{formatPrice(order.auction_price)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">ტრანსპორტირება</span>
            <span>{formatPrice(order.shipping_cost)}</span>
          </div>
          <Separator />
          <div className="flex justify-between font-bold">
            <span>ჯამი</span>
            <span className="text-primary">
              {formatPrice(order.total_price)}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">სტატუსის ისტორია</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            {STAGE_ORDER.map((status, index) => {
              const historyEntry = historyMap.get(status);
              const meta = STAGE_META[status];
              const StageIcon = meta.icon;
              const isCompleted = index < order.current_stage;
              const isCurrent = index === order.current_stage - 1;
              const isLast = index === STAGE_ORDER.length - 1;

              return (
                <div key={status} className="flex gap-4 relative">
                  {/* Vertical line */}
                  {!isLast && (
                    <div
                      className={`absolute left-5 top-10 w-0.5 h-full -translate-x-1/2 ${
                        isCompleted
                          ? 'bg-primary'
                          : 'bg-muted'
                      }`}
                    />
                  )}

                  {/* Icon */}
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 shrink-0 z-10 transition-all ${
                      isCompleted || isCurrent
                        ? 'bg-primary border-primary text-primary-foreground'
                        : 'bg-background border-muted text-muted-foreground'
                    }`}
                  >
                    <StageIcon className="w-4 h-4" />
                  </div>

                  {/* Content */}
                  <div className="pb-8 flex-1">
                    <p
                      className={`font-medium ${
                        isCompleted || isCurrent
                          ? 'text-foreground'
                          : 'text-muted-foreground'
                      }`}
                    >
                      {meta.label}
                    </p>
                    {historyEntry ? (
                      <div className="mt-1 space-y-0.5">
                        <p className="text-xs text-muted-foreground">
                          {formatDateTime(historyEntry.created_at)}
                        </p>
                        {historyEntry.note && (
                          <p className="text-sm text-muted-foreground">
                            {historyEntry.note}
                          </p>
                        )}
                        {historyEntry.location && (
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {historyEntry.location}
                          </p>
                        )}
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground mt-1">
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
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Ship className="w-5 h-5 text-primary" />
                ტრანსპორტირების ინფორმაცია
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {order.vessel_name && (
                  <div>
                    <p className="text-xs text-muted-foreground">გემი</p>
                    <p className="font-medium">{order.vessel_name}</p>
                  </div>
                )}
                {order.origin_port && (
                  <div>
                    <p className="text-xs text-muted-foreground">
                      გამგზავრების პორტი
                    </p>
                    <p className="font-medium">{order.origin_port}</p>
                  </div>
                )}
                {order.destination_port && (
                  <div>
                    <p className="text-xs text-muted-foreground">
                      დანიშნულების პორტი
                    </p>
                    <p className="font-medium">{order.destination_port}</p>
                  </div>
                )}
                {order.estimated_arrival && (
                  <div>
                    <p className="text-xs text-muted-foreground">
                      სავარაუდო ჩამოსვლა
                    </p>
                    <p className="font-medium">
                      {formatDate(order.estimated_arrival)}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
}
