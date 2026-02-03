import { prisma } from '../../libs/prisma';
import type { OrderStatus } from '@prisma/client';
import type { OrderFilters, CreateOrderDto, UpdateOrderDto } from './order.types';

const STATUS_TO_STAGE: Record<string, number> = {
  WON: 1,
  PAID: 2,
  SHIPPING: 3,
  PORT: 4,
  DELIVERED: 5,
};

export const orderRepo = {
  async findMany(filters: OrderFilters) {
    const { page = 1, limit = 10, status, search } = filters;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { order_number: { contains: search } },
        { car_vin: { contains: search } },
        { customer_name: { contains: search } },
      ];
    }

    const [items, totalItems] = await Promise.all([
      prisma.order.findMany({
        where,
        skip,
        take: limit,
        orderBy: { created_at: 'desc' },
        include: {
          status_history: {
            orderBy: { created_at: 'desc' },
          },
        },
      }),
      prisma.order.count({ where }),
    ]);

    return { items, totalItems };
  },

  async findById(id: string) {
    return prisma.order.findUnique({
      where: { id },
      include: {
        status_history: {
          orderBy: { created_at: 'desc' },
        },
      },
    });
  },

  async findByTrackingCode(code: string) {
    return prisma.order.findUnique({
      where: { tracking_code: code },
      include: {
        status_history: {
          orderBy: { created_at: 'desc' },
        },
      },
    });
  },

  async create(data: CreateOrderDto, orderNumber: string, trackingCode: string) {
    const status = data.status || 'WON';
    const stage = STATUS_TO_STAGE[status] || 1;

    return prisma.order.create({
      data: {
        order_number: orderNumber,
        tracking_code: trackingCode,
        car_make: data.car_make,
        car_model: data.car_model,
        car_year: data.car_year,
        car_vin: data.car_vin,
        car_color: data.car_color,
        car_image: data.car_image,
        auction_price: data.auction_price,
        shipping_cost: data.shipping_cost,
        total_price: data.total_price,
        customer_name: data.customer_name,
        customer_phone: data.customer_phone,
        customer_email: data.customer_email,
        status,
        current_stage: stage,
        auction_source: data.auction_source,
        lot_number: data.lot_number,
        origin_port: data.origin_port,
        destination_port: data.destination_port,
        vessel_name: data.vessel_name,
        estimated_arrival: data.estimated_arrival ? new Date(data.estimated_arrival) : undefined,
        status_history: {
          create: {
            status,
            stage,
            note: 'Order created',
          },
        },
      },
      include: {
        status_history: {
          orderBy: { created_at: 'desc' },
        },
      },
    });
  },

  async update(id: string, data: UpdateOrderDto) {
    return prisma.order.update({
      where: { id },
      data: {
        ...data,
        estimated_arrival: data.estimated_arrival !== undefined
          ? data.estimated_arrival
            ? new Date(data.estimated_arrival)
            : null
          : undefined,
      },
      include: {
        status_history: {
          orderBy: { created_at: 'desc' },
        },
      },
    });
  },

  async updateStatus(
    id: string,
    status: OrderStatus,
    stage: number,
    note?: string,
    location?: string,
    changed_by?: string
  ) {
    return prisma.order.update({
      where: { id },
      data: {
        status,
        current_stage: stage,
        status_history: {
          create: {
            status,
            stage,
            note,
            location,
            changed_by,
          },
        },
      },
      include: {
        status_history: {
          orderBy: { created_at: 'desc' },
        },
      },
    });
  },

  async delete(id: string) {
    return prisma.order.delete({ where: { id } });
  },

  async getNextOrderNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const prefix = `ORD-${year}-`;

    const lastOrder = await prisma.order.findFirst({
      where: {
        order_number: { startsWith: prefix },
      },
      orderBy: { order_number: 'desc' },
      select: { order_number: true },
    });

    if (!lastOrder) {
      return `${prefix}001`;
    }

    const lastNumber = parseInt(lastOrder.order_number.replace(prefix, ''), 10);
    const nextNumber = (lastNumber + 1).toString().padStart(3, '0');

    return `${prefix}${nextNumber}`;
  },
};
