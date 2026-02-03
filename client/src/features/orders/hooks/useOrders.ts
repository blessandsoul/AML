'use client';

import { useQuery } from '@tanstack/react-query';
import { orderService } from '../services/order.service';
import { orderKeys } from '../utils/order.keys';
import type { OrderFilters, Order } from '../types';

const USE_MOCK_DATA = true;

const MOCK_ORDERS: Order[] = [
  {
    id: '1',
    order_number: 'ORD-2024-001',
    tracking_code: 'AML8K2X9',
    car_make: 'BMW',
    car_model: 'X5 M50i',
    car_year: 2021,
    car_vin: '5UX23EM05N9K58291',
    car_color: 'Alpine White',
    car_image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800',
    auction_price: 38500,
    shipping_cost: 3200,
    total_price: 45200,
    customer_name: 'გიორგი მ.',
    customer_phone: '+995599123456',
    customer_email: 'giorgi@example.com',
    status: 'SHIPPING',
    current_stage: 3,
    auction_source: 'Copart',
    lot_number: '78234521',
    origin_port: 'Savannah, GA',
    destination_port: 'ფოთი',
    vessel_name: 'MSC Fantasia',
    estimated_arrival: '2024-04-15T00:00:00Z',
    status_history: [
      { id: 'h1', status: 'WON', stage: 1, note: 'აუქციონზე მოგებული', location: 'Copart, Dallas TX', changed_by: 'System', order_id: '1', created_at: '2024-03-01T10:00:00Z' },
      { id: 'h2', status: 'PAID', stage: 2, note: 'გადახდა დასრულებულია', location: null, changed_by: 'ანა კ.', order_id: '1', created_at: '2024-03-03T14:30:00Z' },
      { id: 'h3', status: 'SHIPPING', stage: 3, note: 'გემში ჩატვირთვა დასრულებულია', location: 'Savannah Port, GA', changed_by: 'დავით ლ.', order_id: '1', created_at: '2024-03-15T09:00:00Z' },
    ],
    created_at: '2024-03-01T10:00:00Z',
    updated_at: '2024-03-15T09:00:00Z',
  },
  {
    id: '2',
    order_number: 'ORD-2023-089',
    tracking_code: 'AML3P7W2',
    car_make: 'Toyota',
    car_model: 'Camry SE',
    car_year: 2020,
    car_vin: '4T1B11HK5LU923456',
    car_color: 'Midnight Black',
    car_image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800',
    auction_price: 9800,
    shipping_cost: 2700,
    total_price: 12500,
    customer_name: 'ნინო თ.',
    customer_phone: '+995599654321',
    customer_email: 'nino@example.com',
    status: 'DELIVERED',
    current_stage: 5,
    auction_source: 'IAAI',
    lot_number: '34567890',
    origin_port: 'Newark, NJ',
    destination_port: 'ფოთი',
    vessel_name: 'Maersk Sealand',
    estimated_arrival: null,
    status_history: [
      { id: 'h4', status: 'WON', stage: 1, note: 'აუქციონზე მოგებული', location: 'IAAI, New Jersey', changed_by: 'System', order_id: '2', created_at: '2023-10-15T10:00:00Z' },
      { id: 'h5', status: 'PAID', stage: 2, note: 'გადახდა დასრულებულია', location: null, changed_by: 'ანა კ.', order_id: '2', created_at: '2023-10-17T11:00:00Z' },
      { id: 'h6', status: 'SHIPPING', stage: 3, note: 'გემში ჩატვირთვა', location: 'Newark Port, NJ', changed_by: 'დავით ლ.', order_id: '2', created_at: '2023-10-25T08:00:00Z' },
      { id: 'h7', status: 'PORT', stage: 4, note: 'ფოთის პორტში ჩამოსულია', location: 'ფოთი, საქართველო', changed_by: 'System', order_id: '2', created_at: '2023-11-10T14:00:00Z' },
      { id: 'h8', status: 'DELIVERED', stage: 5, note: 'კლიენტს ჩაბარდა', location: 'თბილისი', changed_by: 'გიორგი მ.', order_id: '2', created_at: '2023-11-15T16:00:00Z' },
    ],
    created_at: '2023-10-15T10:00:00Z',
    updated_at: '2023-11-15T16:00:00Z',
  },
];

function getMockOrders(filters: OrderFilters) {
  let filtered = [...MOCK_ORDERS];

  if (filters.status) {
    filtered = filtered.filter((o) => o.status === filters.status);
  }
  if (filters.search) {
    const search = filters.search.toLowerCase();
    filtered = filtered.filter(
      (o) =>
        o.order_number.toLowerCase().includes(search) ||
        o.car_vin?.toLowerCase().includes(search) ||
        o.customer_name.toLowerCase().includes(search)
    );
  }

  const page = filters.page || 1;
  const limit = filters.limit || 10;
  const start = (page - 1) * limit;
  const items = filtered.slice(start, start + limit);

  return {
    items,
    pagination: {
      page,
      limit,
      totalItems: filtered.length,
      totalPages: Math.ceil(filtered.length / limit),
      hasNextPage: start + limit < filtered.length,
      hasPreviousPage: page > 1,
    },
  };
}

export function useOrders(filters: OrderFilters = {}) {
  return useQuery({
    queryKey: orderKeys.list(filters),
    queryFn: async () => {
      if (USE_MOCK_DATA) {
        await new Promise((r) => setTimeout(r, 300));
        return getMockOrders(filters);
      }
      return orderService.getOrders(filters);
    },
  });
}

export { MOCK_ORDERS };
