import { FastifyRequest, FastifyReply } from 'fastify';
import { orderService } from './order.service';
import { successResponse, paginatedResponse } from '../../shared/helpers';
import {
  CreateOrderSchema,
  UpdateOrderSchema,
  UpdateStatusSchema,
  OrderFiltersSchema,
} from './order.schemas';

type IdParams = { id: string };
type CodeParams = { code: string };

export const orderController = {
  // ===== PUBLIC ENDPOINTS =====

  async trackOrder(request: FastifyRequest<{ Params: CodeParams }>, reply: FastifyReply) {
    const order = await orderService.findByTrackingCode(request.params.code);
    return reply.send(successResponse('Order retrieved successfully', order));
  },

  // ===== ADMIN ENDPOINTS =====

  async getAllOrders(request: FastifyRequest, reply: FastifyReply) {
    const filters = OrderFiltersSchema.parse(request.query);
    const { items, totalItems } = await orderService.findAll(filters);

    return reply.send(
      paginatedResponse('Orders retrieved successfully', items, filters.page, filters.limit, totalItems)
    );
  },

  async getOrderById(request: FastifyRequest<{ Params: IdParams }>, reply: FastifyReply) {
    const order = await orderService.findById(request.params.id);
    return reply.send(successResponse('Order retrieved successfully', order));
  },

  async createOrder(request: FastifyRequest, reply: FastifyReply) {
    const dto = CreateOrderSchema.parse(request.body);
    const order = await orderService.create(dto);

    return reply.status(201).send(successResponse('Order created successfully', order));
  },

  async updateOrder(request: FastifyRequest<{ Params: IdParams }>, reply: FastifyReply) {
    const dto = UpdateOrderSchema.parse(request.body);
    const order = await orderService.update(request.params.id, dto);

    return reply.send(successResponse('Order updated successfully', order));
  },

  async updateOrderStatus(request: FastifyRequest<{ Params: IdParams }>, reply: FastifyReply) {
    const dto = UpdateStatusSchema.parse(request.body);
    const order = await orderService.updateStatus(request.params.id, dto);

    return reply.send(successResponse('Order status updated successfully', order));
  },

  async deleteOrder(request: FastifyRequest<{ Params: IdParams }>, reply: FastifyReply) {
    await orderService.delete(request.params.id);
    return reply.send(successResponse('Order deleted successfully', null));
  },
};
