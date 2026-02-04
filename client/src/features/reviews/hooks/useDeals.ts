'use client';

import { useQuery } from '@tanstack/react-query';
import { reviewService } from '../services/review.service';
import { reviewKeys } from '../utils/review.keys';
import type { DealFilters, CompletedDeal } from '../types';

// Use environment variable to toggle mock data
const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

const MOCK_DEALS: CompletedDeal[] = [
  {
    id: '1',
    car: { make: 'BMW', model: 'X5 M50i', year: 2021 },
    pricing: { auctionPrice: 38500, marketPrice: 52000, savings: 13500 },
    deliveryCity: 'თბილისი',
    description: 'Copart-იდან შეძენილი, მინიმალური დაზიანებით. სრული აღდგენა ჩატარდა.',
    isPublished: true,
    photos: [
      { id: '1a', url: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800', altText: 'BMW X5 after', photoType: 'AFTER', sortOrder: 0 },
    ],
    createdAt: '2024-11-01T10:00:00Z',
    updatedAt: '2024-11-01T10:00:00Z',
  },
  {
    id: '2',
    car: { make: 'Mercedes-Benz', model: 'AMG GT', year: 2020 },
    pricing: { auctionPrice: 61000, marketPrice: 78000, savings: 17000 },
    deliveryCity: 'ბათუმი',
    description: 'IAAI აუქციონიდან. Clean title, მინიმალური გარბენი.',
    isPublished: true,
    photos: [
      { id: '2a', url: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800', altText: 'Mercedes AMG GT after', photoType: 'AFTER', sortOrder: 0 },
    ],
    createdAt: '2024-10-15T14:00:00Z',
    updatedAt: '2024-10-15T14:00:00Z',
  },
  {
    id: '3',
    car: { make: 'Porsche', model: '911 Turbo S', year: 2022 },
    pricing: { auctionPrice: 95000, marketPrice: 125000, savings: 30000 },
    deliveryCity: 'ქუთაისი',
    description: 'Manheim აუქციონიდან. პრემიუმ კლასის ავტომობილი საუკეთესო ფასად.',
    isPublished: true,
    photos: [
      { id: '3a', url: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=800', altText: 'Porsche 911 after', photoType: 'AFTER', sortOrder: 0 },
    ],
    createdAt: '2024-09-20T09:00:00Z',
    updatedAt: '2024-09-20T09:00:00Z',
  },
  {
    id: '4',
    car: { make: 'Audi', model: 'RS Q8', year: 2021 },
    pricing: { auctionPrice: 72000, marketPrice: 95000, savings: 23000 },
    deliveryCity: 'თბილისი',
    description: 'Copart აუქციონიდან, clean title. სრულყოფილ მდგომარეობაში.',
    isPublished: true,
    photos: [
      { id: '4a', url: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800', altText: 'Audi RS Q8 after', photoType: 'AFTER', sortOrder: 0 },
    ],
    createdAt: '2024-08-10T11:00:00Z',
    updatedAt: '2024-08-10T11:00:00Z',
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
