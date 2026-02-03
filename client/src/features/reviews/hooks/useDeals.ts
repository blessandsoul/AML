'use client';

import { useQuery } from '@tanstack/react-query';
import { reviewService } from '../services/review.service';
import { reviewKeys } from '../utils/review.keys';
import type { DealFilters } from '../types';

const USE_MOCK_DATA = true;

const MOCK_DEALS = [
  {
    id: '1',
    car_make: 'BMW',
    car_model: 'X5 M50i',
    car_year: 2021,
    car_vin: '5UX23EM05N9K58291',
    auction_price: 38500,
    market_price: 52000,
    savings: 13500,
    delivery_city: 'თბილისი',
    description: 'Copart-იდან შეძენილი, მინიმალური დაზიანებით. სრული აღდგენა ჩატარდა.',
    is_published: true,
    photos: [
      { id: '1a', url: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800', alt_text: 'BMW X5 after', photo_type: 'AFTER' as const, sort_order: 0 },
    ],
    created_at: '2024-11-01T10:00:00Z',
    updated_at: '2024-11-01T10:00:00Z',
  },
  {
    id: '2',
    car_make: 'Mercedes-Benz',
    car_model: 'AMG GT',
    car_year: 2020,
    car_vin: null,
    auction_price: 61000,
    market_price: 78000,
    savings: 17000,
    delivery_city: 'ბათუმი',
    description: 'IAAI აუქციონიდან. Clean title, მინიმალური გარბენი.',
    is_published: true,
    photos: [
      { id: '2a', url: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800', alt_text: 'Mercedes AMG GT after', photo_type: 'AFTER' as const, sort_order: 0 },
    ],
    created_at: '2024-10-15T14:00:00Z',
    updated_at: '2024-10-15T14:00:00Z',
  },
  {
    id: '3',
    car_make: 'Porsche',
    car_model: '911 Turbo S',
    car_year: 2022,
    car_vin: null,
    auction_price: 95000,
    market_price: 125000,
    savings: 30000,
    delivery_city: 'ქუთაისი',
    description: 'Manheim აუქციონიდან. პრემიუმ კლასის ავტომობილი საუკეთესო ფასად.',
    is_published: true,
    photos: [
      { id: '3a', url: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=800', alt_text: 'Porsche 911 after', photo_type: 'AFTER' as const, sort_order: 0 },
    ],
    created_at: '2024-09-20T09:00:00Z',
    updated_at: '2024-09-20T09:00:00Z',
  },
  {
    id: '4',
    car_make: 'Audi',
    car_model: 'RS Q8',
    car_year: 2021,
    car_vin: null,
    auction_price: 72000,
    market_price: 95000,
    savings: 23000,
    delivery_city: 'თბილისი',
    description: 'Copart აუქციონიდან, clean title. სრულყოფილ მდგომარეობაში.',
    is_published: true,
    photos: [
      { id: '4a', url: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800', alt_text: 'Audi RS Q8 after', photo_type: 'AFTER' as const, sort_order: 0 },
    ],
    created_at: '2024-08-10T11:00:00Z',
    updated_at: '2024-08-10T11:00:00Z',
  },
];

function getMockDeals(filters: DealFilters) {
  const page = filters.page || 1;
  const limit = filters.limit || 12;
  const start = (page - 1) * limit;
  const items = MOCK_DEALS.slice(start, start + limit);

  return {
    items,
    pagination: {
      page,
      limit,
      totalItems: MOCK_DEALS.length,
      totalPages: Math.ceil(MOCK_DEALS.length / limit),
      hasNextPage: start + limit < MOCK_DEALS.length,
      hasPreviousPage: page > 1,
    },
  };
}

export function useDeals(filters: DealFilters = {}) {
  return useQuery({
    queryKey: reviewKeys.dealList(filters),
    queryFn: async () => {
      if (USE_MOCK_DATA) {
        await new Promise((r) => setTimeout(r, 300));
        return getMockDeals(filters);
      }
      return reviewService.getDeals(filters);
    },
  });
}
