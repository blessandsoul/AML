// Order Module Exports

export { orderRoutes } from './order.routes.js';
export { orderController } from './order.controller.js';
export { orderService } from './order.service.js';
export { orderRepo } from './order.repo.js';

// Schema exports
export {
  getOrdersQuerySchema,
  idParamSchema,
  trackingCodeParamSchema,
  createOrderSchema,
  updateOrderSchema,
  updateOrderStatusSchema,
  type GetOrdersQuery,
  type IdParam,
  type TrackingCodeParam,
  type CreateOrderBody,
  type UpdateOrderBody,
  type UpdateOrderStatusBody,
} from './order.schemas.js';

// Type exports
export type {
  OrderStatusHistoryEntity,
  OrderEntity,
  OrderWithHistory,
  OrderListItem,
  CreateOrderInput,
  UpdateOrderInput,
  UpdateOrderStatusInput,
  OrderQueryParams,
} from './order.types.js';

export {
  ORDER_STAGE_MAP,
  toOrderResponse,
  toOrderListItemResponse,
  toTrackingResponse,
} from './order.types.js';
