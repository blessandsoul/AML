'use client';

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Car, FileText, Gavel, MapPin, Package, Truck } from "lucide-react";
import { useOrders } from "@/features/orders/hooks";
import Link from "next/link";
import { motion } from "framer-motion";
import type { OrderStatus, OrderStatusHistory } from "@/features/orders/types";

const STATUS_MAP: Record<OrderStatus, { label: string; color: string }> = {
  WON: { label: "მოგებულია", color: "bg-blue-500" },
  PAID: { label: "გადახდილია", color: "bg-indigo-500" },
  SHIPPING: { label: "გზაშია", color: "bg-orange-500" },
  PORT: { label: "პორტშია", color: "bg-purple-500" },
  DELIVERED: { label: "ჩაბარებულია", color: "bg-emerald-500" },
};

const STAGES = [
  { icon: Gavel, label: "მოგება", status: "WON" as OrderStatus },
  { icon: FileText, label: "გადახდა", status: "PAID" as OrderStatus },
  { icon: Truck, label: "ტრანსპორტირება", status: "SHIPPING" as OrderStatus },
  { icon: MapPin, label: "პორტი", status: "PORT" as OrderStatus },
  { icon: Package, label: "დანიშნულება", status: "DELIVERED" as OrderStatus },
];

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('ka-GE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

function getTimestampForStage(
  stageStatus: OrderStatus,
  statusHistory: OrderStatusHistory[]
): string | null {
  const entry = statusHistory.find((h) => h.status === stageStatus);
  return entry ? formatDate(entry.created_at) : null;
}

function OrderSkeleton() {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-muted/30 pb-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <Skeleton className="h-6 w-56" />
            <Skeleton className="h-4 w-72" />
          </div>
          <div className="flex items-center gap-3">
            <Skeleton className="h-6 w-24 rounded-full" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-5 gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <Skeleton className="w-8 h-8 rounded-full" />
              <Skeleton className="h-3 w-16" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function OrderList() {
  const { data, isLoading, isError } = useOrders();

  if (isLoading) {
    return (
      <div className="space-y-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <OrderSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (isError || !data?.items || data.items.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Package className="w-12 h-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium text-muted-foreground">
              შეკვეთები ვერ მოიძებნა
            </p>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      {data.items.map((order, index) => (
        <motion.div
          key={order.id}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <Link href={`/profile/orders/${order.id}`} className="block group">
            <Card className="overflow-hidden transition-shadow duration-200 hover:shadow-md group-hover:border-primary/30">
              <CardHeader className="bg-muted/30 pb-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Car className="w-5 h-5 text-primary" />
                      {order.car_year} {order.car_make} {order.car_model}
                    </CardTitle>
                    <CardDescription>
                      VIN: {order.car_vin || '---'} &bull; შეკვეთის #: {order.order_number}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={STATUS_MAP[order.status]?.color}>
                      {STATUS_MAP[order.status]?.label}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="relative">
                  <div className="absolute top-4 left-0 right-0 h-0.5 bg-muted z-0 hidden md:block" />
                  <div className="grid grid-cols-5 gap-2 relative z-10">
                    {STAGES.map((stage, stageIndex) => {
                      const isCompleted = stageIndex < order.current_stage;
                      const isCurrent = stageIndex === order.current_stage - 1;
                      const timestamp = getTimestampForStage(
                        stage.status,
                        order.status_history
                      );

                      return (
                        <div
                          key={stage.label}
                          className="flex flex-col items-center gap-2 text-center"
                        >
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300
                              ${
                                isCompleted || isCurrent
                                  ? "bg-primary border-primary text-primary-foreground"
                                  : "bg-background border-muted text-muted-foreground"
                              }
                            `}
                          >
                            <stage.icon className="w-4 h-4" />
                          </div>
                          <span
                            className={`text-xs font-medium ${
                              isCompleted || isCurrent
                                ? "text-foreground"
                                : "text-muted-foreground"
                            }`}
                          >
                            {stage.label}
                          </span>
                          {timestamp && (
                            <span className="text-[10px] text-muted-foreground leading-tight">
                              {timestamp}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
