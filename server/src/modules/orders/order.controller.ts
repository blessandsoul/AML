import type { FastifyRequest, FastifyReply } from 'fastify';
import { orderService } from './order.service.js';
import {
  getOrdersQuerySchema,
  idParamSchema,
  trackingCodeParamSchema,
  createOrderSchema,
  updateOrderSchema,
  updateOrderStatusSchema,
} from './order.schemas.js';
import { successResponse, paginatedResponse } from '../../libs/response.js';
import { ValidationError } from '../../libs/errors.js';
import {
  toOrderResponse,
  toOrderListItemResponse,
  toTrackingResponse,
} from './order.types.js';

/**
 * Order Controller - HTTP request handlers
 */
export const orderController = {
  // ============================================
  // PUBLIC - TRACKING
  // ============================================

  /**
   * Track order by tracking code (public)
   * GET /orders/track/:code
   */
  async trackOrder(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const parsed = trackingCodeParamSchema.safeParse(request.params);
    if (!parsed.success) {
      throw new ValidationError(
        'Validation failed',
        parsed.error.flatten().fieldErrors as Record<string, string[]>
      );
    }

    const order = await orderService.trackOrder(parsed.data.code);

    return reply.send(
      successResponse('Order tracking retrieved successfully', toTrackingResponse(order))
    );
  },

  // ============================================
  // ADMIN - ORDERS
  // ============================================

  /**
   * Get all orders (admin)
   * GET /orders/admin/orders
   */
  async getOrders(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const parsed = getOrdersQuerySchema.safeParse(request.query);
    if (!parsed.success) {
      throw new ValidationError(
        'Validation failed',
        parsed.error.flatten().fieldErrors as Record<string, string[]>
      );
    }

    const { page, limit, status, search } = parsed.data;

    const result = await orderService.getOrders({
      page,
      limit,
      status,
      search,
    });

    return reply.send(
      paginatedResponse(
        'Orders retrieved successfully',
        result.items.map(toOrderListItemResponse),
        page,
        limit,
        result.totalItems
      )
    );
  },

  /**
   * Get order by ID (admin)
   * GET /orders/admin/orders/:id
   */
  async getOrderById(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const parsed = idParamSchema.safeParse(request.params);
    if (!parsed.success) {
      throw new ValidationError(
        'Validation failed',
        parsed.error.flatten().fieldErrors as Record<string, string[]>
      );
    }

    const order = await orderService.getOrderById(parsed.data.id);

    return reply.send(
      successResponse('Order retrieved successfully', toOrderResponse(order))
    );
  },

  /**
   * Create a new order (admin)
   * POST /orders/admin/orders
   */
  async createOrder(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const parsed = createOrderSchema.safeParse(request.body);
    if (!parsed.success) {
      throw new ValidationError(
        'Validation failed',
        parsed.error.flatten().fieldErrors as Record<string, string[]>
      );
    }

    const {
      car_make,
      car_model,
      car_year,
      car_vin,
      car_color,
      car_image,
      auction_price,
      shipping_cost,
      total_price,
      customer_name,
      customer_phone,
      customer_email,
      auction_source,
      lot_number,
      origin_port,
      destination_port,
      vessel_name,
      estimated_arrival,
    } = parsed.data;

    const order = await orderService.createOrder({
      carMake: car_make,
      carModel: car_model,
      carYear: car_year,
      carVin: car_vin,
      carColor: car_color,
      carImage: car_image,
      auctionPrice: auction_price,
      shippingCost: shipping_cost,
      totalPrice: total_price,
      customerName: customer_name,
      customerPhone: customer_phone,
      customerEmail: customer_email,
      auctionSource: auction_source,
      lotNumber: lot_number,
      originPort: origin_port,
      destinationPort: destination_port,
      vesselName: vessel_name,
      estimatedArrival: estimated_arrival,
    });

    return reply.status(201).send(
      successResponse('Order created successfully', toOrderResponse(order))
    );
  },

  /**
   * Update an order (admin)
   * PATCH /orders/admin/orders/:id
   */
  async updateOrder(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const paramsParsed = idParamSchema.safeParse(request.params);
    if (!paramsParsed.success) {
      throw new ValidationError(
        'Validation failed',
        paramsParsed.error.flatten().fieldErrors as Record<string, string[]>
      );
    }

    const bodyParsed = updateOrderSchema.safeParse(request.body);
    if (!bodyParsed.success) {
      throw new ValidationError(
        'Validation failed',
        bodyParsed.error.flatten().fieldErrors as Record<string, string[]>
      );
    }

    const { id } = paramsParsed.data;
    const {
      car_make,
      car_model,
      car_year,
      car_vin,
      car_color,
      car_image,
      auction_price,
      shipping_cost,
      total_price,
      customer_name,
      customer_phone,
      customer_email,
      auction_source,
      lot_number,
      origin_port,
      destination_port,
      vessel_name,
      estimated_arrival,
    } = bodyParsed.data;

    const order = await orderService.updateOrder(id, {
      carMake: car_make,
      carModel: car_model,
      carYear: car_year,
      carVin: car_vin,
      carColor: car_color,
      carImage: car_image,
      auctionPrice: auction_price,
      shippingCost: shipping_cost,
      totalPrice: total_price,
      customerName: customer_name,
      customerPhone: customer_phone,
      customerEmail: customer_email,
      auctionSource: auction_source,
      lotNumber: lot_number,
      originPort: origin_port,
      destinationPort: destination_port,
      vesselName: vessel_name,
      estimatedArrival: estimated_arrival,
    });

    return reply.send(
      successResponse('Order updated successfully', toOrderResponse(order))
    );
  },

  /**
   * Update order status (admin)
   * PATCH /orders/admin/orders/:id/status
   */
  async updateOrderStatus(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const paramsParsed = idParamSchema.safeParse(request.params);
    if (!paramsParsed.success) {
      throw new ValidationError(
        'Validation failed',
        paramsParsed.error.flatten().fieldErrors as Record<string, string[]>
      );
    }

    const bodyParsed = updateOrderStatusSchema.safeParse(request.body);
    if (!bodyParsed.success) {
      throw new ValidationError(
        'Validation failed',
        bodyParsed.error.flatten().fieldErrors as Record<string, string[]>
      );
    }

    const { id } = paramsParsed.data;
    const { status, note, location, changed_by } = bodyParsed.data;

    const order = await orderService.updateOrderStatus(id, {
      status,
      note,
      location,
      changedBy: changed_by,
    });

    return reply.send(
      successResponse('Order status updated successfully', toOrderResponse(order))
    );
  },

  /**
   * Delete an order (admin)
   * DELETE /orders/admin/orders/:id
   */
  async deleteOrder(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const parsed = idParamSchema.safeParse(request.params);
    if (!parsed.success) {
      throw new ValidationError(
        'Validation failed',
        parsed.error.flatten().fieldErrors as Record<string, string[]>
      );
    }

    await orderService.deleteOrder(parsed.data.id);

    return reply.send(
      successResponse('Order deleted successfully', null)
    );
  },
};
