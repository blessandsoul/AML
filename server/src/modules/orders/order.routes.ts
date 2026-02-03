import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { orderController } from './order.controller';

export async function orderRoutes(fastify: FastifyInstance, options: FastifyPluginOptions) {
  // ===== PUBLIC ROUTES =====

  // Track order by tracking code
  fastify.get('/track/:code', orderController.trackOrder);

  // ===== ADMIN ROUTES (MVP: No auth) =====

  // Get all orders (paginated)
  fastify.get('/admin/orders', orderController.getAllOrders);

  // Get single order by ID
  fastify.get('/admin/orders/:id', orderController.getOrderById);

  // Create order
  fastify.post('/admin/orders', orderController.createOrder);

  // Update order
  fastify.patch('/admin/orders/:id', orderController.updateOrder);

  // Update order status
  fastify.patch('/admin/orders/:id/status', orderController.updateOrderStatus);

  // Delete order
  fastify.delete('/admin/orders/:id', orderController.deleteOrder);
}
