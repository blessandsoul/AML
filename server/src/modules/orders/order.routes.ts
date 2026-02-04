import type { FastifyInstance } from 'fastify';
import { orderController } from './order.controller.js';
import { requireRoles } from '../../middlewares/authGuard.js';

// Inline body schemas for validation
const CreateOrderBodySchema = {
  type: 'object',
  required: ['car_make', 'car_model', 'car_year', 'customer_name'],
  properties: {
    car_make: { type: 'string', maxLength: 100 },
    car_model: { type: 'string', maxLength: 100 },
    car_year: { type: 'integer', minimum: 1900, maximum: 2100 },
    car_vin: { type: 'string', maxLength: 50 },
    car_color: { type: 'string', maxLength: 50 },
    car_image: { type: 'string', format: 'uri' },
    auction_price: { type: 'number' },
    shipping_cost: { type: 'number' },
    total_price: { type: 'number' },
    customer_name: { type: 'string', maxLength: 200 },
    customer_phone: { type: 'string', maxLength: 50 },
    customer_email: { type: 'string', format: 'email' },
    auction_source: { type: 'string', maxLength: 100 },
    lot_number: { type: 'string', maxLength: 50 },
    origin_port: { type: 'string', maxLength: 100 },
    destination_port: { type: 'string', maxLength: 100 },
    vessel_name: { type: 'string', maxLength: 100 },
    estimated_arrival: { type: 'string', format: 'date-time' },
  },
} as const;

const UpdateOrderStatusBodySchema = {
  type: 'object',
  required: ['status'],
  properties: {
    status: { type: 'string', enum: ['WON', 'PAID', 'SHIPPING', 'PORT', 'DELIVERED'] },
    note: { type: 'string', maxLength: 1000 },
    location: { type: 'string', maxLength: 200 },
    changed_by: { type: 'string', maxLength: 200 },
  },
} as const;

/**
 * Order Routes
 * Prefix: /api/v1/orders
 */
export async function orderRoutes(app: FastifyInstance): Promise<void> {
  // ============================================
  // PUBLIC ENDPOINTS
  // ============================================

  /**
   * GET /api/v1/orders/track/:code
   * Track order by tracking code (public)
   */
  app.get('/orders/track/:code', {
    schema: {
      tags: ['Orders - Public'],
      summary: 'Track order',
      description: 'Track an order by its tracking code. Returns limited order info for customer tracking.',
      params: {
        type: 'object',
        required: ['code'],
        properties: {
          code: { type: 'string', minLength: 1, maxLength: 50 },
        },
      },
    },
  }, orderController.trackOrder);

  // ============================================
  // ADMIN ENDPOINTS (Protected - ADMIN role)
  // ============================================

  /**
   * GET /api/v1/orders/admin/orders
   * List all orders (admin)
   */
  app.get('/orders/admin/orders', {
    preHandler: [requireRoles('ADMIN')],
    schema: {
      tags: ['Orders - Admin'],
      summary: 'List all orders',
      description: 'Get a paginated list of all orders. Requires ADMIN role.',
      security: [{ bearerAuth: [] }],
      querystring: {
        type: 'object',
        properties: {
          page: { type: 'integer', minimum: 1, default: 1 },
          limit: { type: 'integer', minimum: 1, maximum: 100, default: 10 },
          status: { type: 'string', enum: ['WON', 'PAID', 'SHIPPING', 'PORT', 'DELIVERED'] },
          search: { type: 'string', maxLength: 200 },
        },
      },
    },
  }, orderController.getOrders);

  /**
   * GET /api/v1/orders/admin/orders/:id
   * Get order by ID (admin)
   */
  app.get('/orders/admin/orders/:id', {
    preHandler: [requireRoles('ADMIN')],
    schema: {
      tags: ['Orders - Admin'],
      summary: 'Get order by ID',
      description: 'Get full order details including all status history. Requires ADMIN role.',
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string', format: 'uuid' },
        },
      },
    },
  }, orderController.getOrderById);

  /**
   * POST /api/v1/orders/admin/orders
   * Create a new order (admin)
   */
  app.post('/orders/admin/orders', {
    preHandler: [requireRoles('ADMIN')],
    schema: {
      tags: ['Orders - Admin'],
      summary: 'Create order',
      description: 'Create a new order. Requires ADMIN role.',
      security: [{ bearerAuth: [] }],
      body: CreateOrderBodySchema,
    },
  }, orderController.createOrder);

  /**
   * PATCH /api/v1/orders/admin/orders/:id
   * Update order details (admin)
   */
  app.patch('/orders/admin/orders/:id', {
    preHandler: [requireRoles('ADMIN')],
    schema: {
      tags: ['Orders - Admin'],
      summary: 'Update order',
      description: 'Update order details. Requires ADMIN role.',
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string', format: 'uuid' },
        },
      },
      body: CreateOrderBodySchema,
    },
  }, orderController.updateOrder);

  /**
   * PATCH /api/v1/orders/admin/orders/:id/status
   * Update order status (admin)
   */
  app.patch('/orders/admin/orders/:id/status', {
    preHandler: [requireRoles('ADMIN')],
    schema: {
      tags: ['Orders - Admin'],
      summary: 'Update order status',
      description: 'Update order status and create a new status history entry. Requires ADMIN role.',
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string', format: 'uuid' },
        },
      },
      body: UpdateOrderStatusBodySchema,
    },
  }, orderController.updateOrderStatus);

  /**
   * DELETE /api/v1/orders/admin/orders/:id
   * Delete an order (admin)
   */
  app.delete('/orders/admin/orders/:id', {
    preHandler: [requireRoles('ADMIN')],
    schema: {
      tags: ['Orders - Admin'],
      summary: 'Delete order',
      description: 'Delete an order. Cannot delete delivered orders. Requires ADMIN role.',
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string', format: 'uuid' },
        },
      },
    },
  }, orderController.deleteOrder);
}
