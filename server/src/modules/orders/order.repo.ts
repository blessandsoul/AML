import { prisma } from '../../libs/prisma.js';
import { calculateOffset } from '../../libs/pagination.js';
import type { OrderStatus, Prisma } from '@prisma/client';
import type {
  OrderWithHistory,
  OrderListItem,
  CreateOrderInput,
  UpdateOrderInput,
  UpdateOrderStatusInput,
  OrderQueryParams,
} from './order.types.js';
import { randomBytes } from 'crypto';

/**
 * Selection for order list items
 */
const orderListSelect = {
  id: true,
  orderNumber: true,
  trackingCode: true,
  carMake: true,
  carModel: true,
  carYear: true,
  carImage: true,
  customerName: true,
  status: true,
  currentStage: true,
  totalPrice: true,
  estimatedArrival: true,
  createdAt: true,
} as const;

/**
 * Selection for full order details with history
 */
const orderDetailSelect = {
  id: true,
  orderNumber: true,
  trackingCode: true,
  carMake: true,
  carModel: true,
  carYear: true,
  carVin: true,
  carColor: true,
  carImage: true,
  auctionPrice: true,
  shippingCost: true,
  totalPrice: true,
  customerName: true,
  customerPhone: true,
  customerEmail: true,
  status: true,
  currentStage: true,
  auctionSource: true,
  lotNumber: true,
  originPort: true,
  destinationPort: true,
  vesselName: true,
  estimatedArrival: true,
  createdAt: true,
  updatedAt: true,
  statusHistory: {
    select: {
      id: true,
      status: true,
      stage: true,
      note: true,
      location: true,
      changedBy: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: 'desc' as const,
    },
  },
} as const;

/**
 * Generate unique order number (AML-YYYYMMDD-XXXX format)
 */
async function generateOrderNumber(): Promise<string> {
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');

  // Get count of orders created today for sequential numbering
  const startOfDay = new Date(date.setHours(0, 0, 0, 0));
  const endOfDay = new Date(date.setHours(23, 59, 59, 999));

  const count = await prisma.order.count({
    where: {
      createdAt: {
        gte: startOfDay,
        lte: endOfDay,
      },
    },
  });

  const sequence = String(count + 1).padStart(4, '0');
  return `AML-${dateStr}-${sequence}`;
}

/**
 * Generate unique tracking code (8 character alphanumeric)
 */
async function generateTrackingCode(): Promise<string> {
  let code: string;
  let exists = true;

  while (exists) {
    // Generate random 8 character alphanumeric code
    code = randomBytes(4).toString('hex').toUpperCase();

    // Check if already exists
    const existing = await prisma.order.findUnique({
      where: { trackingCode: code },
      select: { id: true },
    });

    exists = existing !== null;
  }

  return code!;
}

/**
 * Get stage number for a status
 */
function getStageForStatus(status: OrderStatus): number {
  const stageMap: Record<OrderStatus, number> = {
    WON: 1,
    PAID: 2,
    SHIPPING: 3,
    PORT: 4,
    DELIVERED: 5,
  };
  return stageMap[status];
}

/**
 * Order Repository - Database operations for orders module
 */
export const orderRepo = {
  /**
   * Find orders with pagination and filters
   */
  async findOrders(
    params: OrderQueryParams
  ): Promise<{ items: OrderListItem[]; totalItems: number }> {
    const { page, limit, status, search } = params;
    const offset = calculateOffset(page, limit);

    // Build where clause
    const where: Prisma.OrderWhereInput = {};

    // Status filter
    if (status) {
      where.status = status;
    }

    // Search filter (order number, tracking code, customer name, car details)
    if (search) {
      where.OR = [
        { orderNumber: { contains: search } },
        { trackingCode: { contains: search } },
        { customerName: { contains: search } },
        { carMake: { contains: search } },
        { carModel: { contains: search } },
        { carVin: { contains: search } },
      ];
    }

    // Execute queries in parallel
    const [items, totalItems] = await Promise.all([
      prisma.order.findMany({
        where,
        select: orderListSelect,
        orderBy: { createdAt: 'desc' },
        skip: offset,
        take: limit,
      }),
      prisma.order.count({ where }),
    ]);

    return { items: items as unknown as OrderListItem[], totalItems };
  },

  /**
   * Find order by ID
   */
  async findOrderById(id: string): Promise<OrderWithHistory | null> {
    const order = await prisma.order.findUnique({
      where: { id },
      select: orderDetailSelect,
    });

    return order as unknown as OrderWithHistory | null;
  },

  /**
   * Find order by tracking code
   */
  async findOrderByTrackingCode(code: string): Promise<OrderWithHistory | null> {
    const order = await prisma.order.findUnique({
      where: { trackingCode: code.toUpperCase() },
      select: orderDetailSelect,
    });

    return order as unknown as OrderWithHistory | null;
  },

  /**
   * Find order by order number
   */
  async findOrderByOrderNumber(orderNumber: string): Promise<OrderWithHistory | null> {
    const order = await prisma.order.findUnique({
      where: { orderNumber },
      select: orderDetailSelect,
    });

    return order as unknown as OrderWithHistory | null;
  },

  /**
   * Create a new order
   */
  async createOrder(data: CreateOrderInput): Promise<OrderWithHistory> {
    const [orderNumber, trackingCode] = await Promise.all([
      generateOrderNumber(),
      generateTrackingCode(),
    ]);

    const order = await prisma.order.create({
      data: {
        orderNumber,
        trackingCode,
        carMake: data.carMake,
        carModel: data.carModel,
        carYear: data.carYear,
        carVin: data.carVin,
        carColor: data.carColor,
        carImage: data.carImage,
        auctionPrice: data.auctionPrice,
        shippingCost: data.shippingCost,
        totalPrice: data.totalPrice,
        customerName: data.customerName,
        customerPhone: data.customerPhone,
        customerEmail: data.customerEmail,
        auctionSource: data.auctionSource,
        lotNumber: data.lotNumber,
        originPort: data.originPort,
        destinationPort: data.destinationPort,
        vesselName: data.vesselName,
        estimatedArrival: data.estimatedArrival,
        status: 'WON',
        currentStage: 1,
        // Create initial status history entry
        statusHistory: {
          create: {
            status: 'WON',
            stage: 1,
            note: 'Order created - won at auction',
          },
        },
      },
      select: orderDetailSelect,
    });

    return order as unknown as OrderWithHistory;
  },

  /**
   * Update an order
   */
  async updateOrder(
    id: string,
    data: UpdateOrderInput
  ): Promise<OrderWithHistory> {
    const order = await prisma.order.update({
      where: { id },
      data: {
        carMake: data.carMake,
        carModel: data.carModel,
        carYear: data.carYear,
        carVin: data.carVin,
        carColor: data.carColor,
        carImage: data.carImage,
        auctionPrice: data.auctionPrice,
        shippingCost: data.shippingCost,
        totalPrice: data.totalPrice,
        customerName: data.customerName,
        customerPhone: data.customerPhone,
        customerEmail: data.customerEmail,
        auctionSource: data.auctionSource,
        lotNumber: data.lotNumber,
        originPort: data.originPort,
        destinationPort: data.destinationPort,
        vesselName: data.vesselName,
        estimatedArrival: data.estimatedArrival,
      },
      select: orderDetailSelect,
    });

    return order as unknown as OrderWithHistory;
  },

  /**
   * Update order status and add history entry
   */
  async updateOrderStatus(
    id: string,
    data: UpdateOrderStatusInput
  ): Promise<OrderWithHistory> {
    const newStage = getStageForStatus(data.status);

    const order = await prisma.order.update({
      where: { id },
      data: {
        status: data.status,
        currentStage: newStage,
        statusHistory: {
          create: {
            status: data.status,
            stage: newStage,
            note: data.note,
            location: data.location,
            changedBy: data.changedBy,
          },
        },
      },
      select: orderDetailSelect,
    });

    return order as unknown as OrderWithHistory;
  },

  /**
   * Delete an order
   */
  async deleteOrder(id: string): Promise<void> {
    await prisma.order.delete({
      where: { id },
    });
  },

  /**
   * Check if order number is taken
   */
  async isOrderNumberTaken(orderNumber: string): Promise<boolean> {
    const order = await prisma.order.findUnique({
      where: { orderNumber },
      select: { id: true },
    });

    return order !== null;
  },

  /**
   * Check if tracking code is taken
   */
  async isTrackingCodeTaken(code: string): Promise<boolean> {
    const order = await prisma.order.findUnique({
      where: { trackingCode: code },
      select: { id: true },
    });

    return order !== null;
  },
};
