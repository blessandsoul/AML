import { NotFoundError, BadRequestError } from '../../shared/errors';
import { orderRepo } from './order.repo';
import type { CreateOrderDto, UpdateOrderDto, UpdateStatusDto, OrderFilters } from './order.types';

const STATUS_TO_STAGE: Record<string, number> = {
  WON: 1,
  PAID: 2,
  SHIPPING: 3,
  PORT: 4,
  DELIVERED: 5,
};

function generateTrackingCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export const orderService = {
  async findAll(filters: OrderFilters) {
    return orderRepo.findMany(filters);
  },

  async findById(id: string) {
    const order = await orderRepo.findById(id);

    if (!order) {
      throw new NotFoundError('ORDER_NOT_FOUND', 'Order does not exist');
    }

    return order;
  },

  async findByTrackingCode(code: string) {
    const order = await orderRepo.findByTrackingCode(code);

    if (!order) {
      throw new NotFoundError('ORDER_NOT_FOUND', 'Order with this tracking code does not exist');
    }

    return order;
  },

  async create(dto: CreateOrderDto) {
    const orderNumber = await orderRepo.getNextOrderNumber();
    const trackingCode = generateTrackingCode();

    return orderRepo.create(dto, orderNumber, trackingCode);
  },

  async update(id: string, dto: UpdateOrderDto) {
    const order = await orderRepo.findById(id);

    if (!order) {
      throw new NotFoundError('ORDER_NOT_FOUND', 'Order does not exist');
    }

    return orderRepo.update(id, dto);
  },

  async updateStatus(id: string, statusDto: UpdateStatusDto) {
    const order = await orderRepo.findById(id);

    if (!order) {
      throw new NotFoundError('ORDER_NOT_FOUND', 'Order does not exist');
    }

    const newStage = STATUS_TO_STAGE[statusDto.status];
    const currentStage = order.current_stage;

    if (currentStage >= newStage) {
      throw new BadRequestError(
        'INVALID_STATUS_TRANSITION',
        `Cannot transition from stage ${currentStage} to stage ${newStage}. Status can only move forward.`
      );
    }

    return orderRepo.updateStatus(
      id,
      statusDto.status,
      newStage,
      statusDto.note,
      statusDto.location,
      statusDto.changed_by
    );
  },

  async delete(id: string) {
    const order = await orderRepo.findById(id);

    if (!order) {
      throw new NotFoundError('ORDER_NOT_FOUND', 'Order does not exist');
    }

    await orderRepo.delete(id);
  },
};
