import type { OrderStatus, Prisma } from '@prisma/client';

// Decimal type from Prisma
type Decimal = Prisma.Decimal;

/**
 * Order Status History entity
 */
export interface OrderStatusHistoryEntity {
  id: string;
  status: OrderStatus;
  stage: number;
  note: string | null;
  location: string | null;
  changedBy: string | null;
  orderId: string;
  createdAt: Date;
}

/**
 * Order entity (basic)
 */
export interface OrderEntity {
  id: string;
  orderNumber: string;
  trackingCode: string;
  carMake: string;
  carModel: string;
  carYear: number;
  carVin: string | null;
  carColor: string | null;
  carImage: string | null;
  auctionPrice: Decimal | null;
  shippingCost: Decimal | null;
  totalPrice: Decimal | null;
  customerName: string;
  customerPhone: string | null;
  customerEmail: string | null;
  status: OrderStatus;
  currentStage: number;
  auctionSource: string | null;
  lotNumber: string | null;
  originPort: string | null;
  destinationPort: string | null;
  vesselName: string | null;
  estimatedArrival: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Order with status history relation
 */
export interface OrderWithHistory extends OrderEntity {
  statusHistory: OrderStatusHistoryEntity[];
}

/**
 * Order list item (optimized for list views)
 */
export interface OrderListItem {
  id: string;
  orderNumber: string;
  trackingCode: string;
  carMake: string;
  carModel: string;
  carYear: number;
  carImage: string | null;
  customerName: string;
  status: OrderStatus;
  currentStage: number;
  totalPrice: Decimal | null;
  estimatedArrival: Date | null;
  createdAt: Date;
}

/**
 * Input types for creating/updating
 */
export interface CreateOrderInput {
  carMake: string;
  carModel: string;
  carYear: number;
  carVin?: string | null;
  carColor?: string | null;
  carImage?: string | null;
  auctionPrice?: number | null;
  shippingCost?: number | null;
  totalPrice?: number | null;
  customerName: string;
  customerPhone?: string | null;
  customerEmail?: string | null;
  auctionSource?: string | null;
  lotNumber?: string | null;
  originPort?: string | null;
  destinationPort?: string | null;
  vesselName?: string | null;
  estimatedArrival?: Date | null;
}

export interface UpdateOrderInput {
  carMake?: string;
  carModel?: string;
  carYear?: number;
  carVin?: string | null;
  carColor?: string | null;
  carImage?: string | null;
  auctionPrice?: number | null;
  shippingCost?: number | null;
  totalPrice?: number | null;
  customerName?: string;
  customerPhone?: string | null;
  customerEmail?: string | null;
  auctionSource?: string | null;
  lotNumber?: string | null;
  originPort?: string | null;
  destinationPort?: string | null;
  vesselName?: string | null;
  estimatedArrival?: Date | null;
}

export interface UpdateOrderStatusInput {
  status: OrderStatus;
  note?: string | null;
  location?: string | null;
  changedBy?: string | null;
}

/**
 * Query parameters for finding orders
 */
export interface OrderQueryParams {
  page: number;
  limit: number;
  status?: OrderStatus;
  search?: string;
}

/**
 * Stage mapping for order status
 */
export const ORDER_STAGE_MAP: Record<OrderStatus, number> = {
  WON: 1,
  PAID: 2,
  SHIPPING: 3,
  PORT: 4,
  DELIVERED: 5,
} as const;

/**
 * API Response transformers
 */
export function toOrderResponse(order: OrderWithHistory) {
  return {
    id: order.id,
    orderNumber: order.orderNumber,
    trackingCode: order.trackingCode,
    car: {
      make: order.carMake,
      model: order.carModel,
      year: order.carYear,
      vin: order.carVin,
      color: order.carColor,
      image: order.carImage,
    },
    pricing: {
      auctionPrice: order.auctionPrice ? Number(order.auctionPrice) : null,
      shippingCost: order.shippingCost ? Number(order.shippingCost) : null,
      totalPrice: order.totalPrice ? Number(order.totalPrice) : null,
    },
    customer: {
      name: order.customerName,
      phone: order.customerPhone,
      email: order.customerEmail,
    },
    status: order.status,
    currentStage: order.currentStage,
    shipping: {
      auctionSource: order.auctionSource,
      lotNumber: order.lotNumber,
      originPort: order.originPort,
      destinationPort: order.destinationPort,
      vesselName: order.vesselName,
      estimatedArrival: order.estimatedArrival,
    },
    statusHistory: order.statusHistory.map((h) => ({
      id: h.id,
      status: h.status,
      stage: h.stage,
      note: h.note,
      location: h.location,
      changedBy: h.changedBy,
      createdAt: h.createdAt,
    })),
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
  };
}

export function toOrderListItemResponse(order: OrderListItem) {
  return {
    id: order.id,
    orderNumber: order.orderNumber,
    trackingCode: order.trackingCode,
    car: {
      make: order.carMake,
      model: order.carModel,
      year: order.carYear,
      image: order.carImage,
    },
    customerName: order.customerName,
    status: order.status,
    currentStage: order.currentStage,
    totalPrice: order.totalPrice ? Number(order.totalPrice) : null,
    estimatedArrival: order.estimatedArrival,
    createdAt: order.createdAt,
  };
}

/**
 * Tracking response (public-facing, limited info)
 */
export function toTrackingResponse(order: OrderWithHistory) {
  return {
    trackingCode: order.trackingCode,
    car: {
      make: order.carMake,
      model: order.carModel,
      year: order.carYear,
      color: order.carColor,
      image: order.carImage,
    },
    status: order.status,
    currentStage: order.currentStage,
    shipping: {
      originPort: order.originPort,
      destinationPort: order.destinationPort,
      vesselName: order.vesselName,
      estimatedArrival: order.estimatedArrival,
    },
    statusHistory: order.statusHistory.map((h) => ({
      status: h.status,
      stage: h.stage,
      note: h.note,
      location: h.location,
      createdAt: h.createdAt,
    })),
  };
}
