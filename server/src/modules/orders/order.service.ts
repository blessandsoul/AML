import { orderRepo } from './order.repo.js';
import { NotFoundError, BadRequestError } from '../../libs/errors.js';
import type { OrderStatus } from '@prisma/client';
import type { PaginatedResult } from '../../libs/pagination.js';
import type {
  OrderWithHistory,
  OrderListItem,
  CreateOrderInput,
  UpdateOrderInput,
  UpdateOrderStatusInput,
  ORDER_STAGE_MAP,
} from './order.types.js';

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
 * Order Service - Business logic for orders module
 */
export const orderService = {
  /**
   * Get all orders (admin)
   */
  async getOrders(params: {
    page: number;
    limit: number;
    status?: OrderStatus;
    search?: string;
  }): Promise<PaginatedResult<OrderListItem>> {
    return orderRepo.findOrders(params);
  },

  /**
   * Get order by ID (admin)
   */
  async getOrderById(id: string): Promise<OrderWithHistory> {
    const order = await orderRepo.findOrderById(id);

    if (!order) {
      throw new NotFoundError('Order', 'ORDER_NOT_FOUND');
    }

    return order;
  },

  /**
   * Track order by tracking code (public)
   */
  async trackOrder(trackingCode: string): Promise<OrderWithHistory> {
    const order = await orderRepo.findOrderByTrackingCode(trackingCode);

    if (!order) {
      throw new NotFoundError('Order', 'ORDER_NOT_FOUND');
    }

    return order;
  },

  /**
   * Create a new order
   */
  async createOrder(data: CreateOrderInput): Promise<OrderWithHistory> {
    // Validate email format if provided
    if (data.customerEmail) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.customerEmail)) {
        throw new BadRequestError('Invalid email format', 'INVALID_EMAIL');
      }
    }

    // Validate car year is reasonable
    const currentYear = new Date().getFullYear();
    if (data.carYear > currentYear + 1) {
      throw new BadRequestError(
        'Car year cannot be more than 1 year in the future',
        'INVALID_CAR_YEAR'
      );
    }

    return orderRepo.createOrder(data);
  },

  /**
   * Update an order
   */
  async updateOrder(
    id: string,
    data: UpdateOrderInput
  ): Promise<OrderWithHistory> {
    // Check if order exists
    const existingOrder = await orderRepo.findOrderById(id);
    if (!existingOrder) {
      throw new NotFoundError('Order', 'ORDER_NOT_FOUND');
    }

    // Validate email format if provided
    if (data.customerEmail) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.customerEmail)) {
        throw new BadRequestError('Invalid email format', 'INVALID_EMAIL');
      }
    }

    // Validate car year if provided
    if (data.carYear) {
      const currentYear = new Date().getFullYear();
      if (data.carYear > currentYear + 1) {
        throw new BadRequestError(
          'Car year cannot be more than 1 year in the future',
          'INVALID_CAR_YEAR'
        );
      }
    }

    return orderRepo.updateOrder(id, data);
  },

  /**
   * Update order status
   */
  async updateOrderStatus(
    id: string,
    data: UpdateOrderStatusInput
  ): Promise<OrderWithHistory> {
    const existingOrder = await orderRepo.findOrderById(id);
    if (!existingOrder) {
      throw new NotFoundError('Order', 'ORDER_NOT_FOUND');
    }

    const currentStage = existingOrder.currentStage;
    const newStage = getStageForStatus(data.status);

    // Validate status progression (can only go forward or stay same)
    // Allow going backwards for corrections, but log a warning
    if (newStage < currentStage) {
      // Allow it but could log warning here
      // logger.warn({ orderId: id, from: currentStage, to: newStage }, 'Order status moved backwards');
    }

    // Check if already at this status
    if (existingOrder.status === data.status) {
      throw new BadRequestError(
        `Order is already at status ${data.status}`,
        'ALREADY_AT_STATUS'
      );
    }

    return orderRepo.updateOrderStatus(id, data);
  },

  /**
   * Delete an order
   */
  async deleteOrder(id: string): Promise<void> {
    const order = await orderRepo.findOrderById(id);
    if (!order) {
      throw new NotFoundError('Order', 'ORDER_NOT_FOUND');
    }

    // Prevent deletion of delivered orders
    if (order.status === 'DELIVERED') {
      throw new BadRequestError(
        'Cannot delete delivered orders',
        'CANNOT_DELETE_DELIVERED'
      );
    }

    await orderRepo.deleteOrder(id);
  },
};
