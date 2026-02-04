'use client';

import { useQuery } from '@tanstack/react-query';
import { reviewService } from '../services/review.service';
import { reviewKeys } from '../utils/review.keys';
import type { ReviewFilters, Review } from '../types';

// Use environment variable to toggle mock data
const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

const MOCK_REVIEWS: Review[] = [
  {
    id: '1',
    customerName: 'გიორგი მ.',
    customerCity: 'თბილისი',
    customerAvatar: null,
    rating: 5,
    text: 'საუკეთესო სერვისი! BMW X5 ამერიკიდან ჩამოვიტანე და ყველაფერი გამჭვირვალე იყო. ვიდეო რეპორტები ყოველ ეტაპზე მიღებდი.',
    car: { make: 'BMW', model: 'X5 M50i', year: 2021 },
    isVerified: true,
    isPublished: true,
    photos: [
      {
        id: 'p1-1',
        url: 'https://images.unsplash.com/photo-1616422285623-13ff0162193c?w=400&h=300&fit=crop',
        altText: 'BMW X5 M50i',
        sortOrder: 0,
      },
    ],
    createdAt: '2024-11-15T10:00:00Z',
    updatedAt: '2024-11-15T10:00:00Z',
  },
  {
    id: '2',
    customerName: 'ანა კ.',
    customerCity: 'ბათუმი',
    customerAvatar: null,
    rating: 5,
    text: 'მეორედ ვსარგებლობ Auto Market Logistic-ის სერვისით. Mercedes-AMG GT შევიძინე Copart-იდან. დაზოგილმა თანხამ $8,200 შეადგინა!',
    car: { make: 'Mercedes-Benz', model: 'AMG GT', year: 2020 },
    isVerified: true,
    isPublished: true,
    photos: [
      {
        id: 'p2-1',
        url: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=400&h=300&fit=crop',
        altText: 'Mercedes-AMG GT',
        sortOrder: 0,
      },
    ],
    createdAt: '2024-10-20T14:30:00Z',
    updatedAt: '2024-10-20T14:30:00Z',
  },
  {
    id: '3',
    customerName: 'დავით ლ.',
    customerCity: 'ქუთაისი',
    customerAvatar: null,
    rating: 4,
    text: 'Porsche 911 Turbo S ჩამოვიტანე. პროცესი ცოტა გრძელი იყო, მაგრამ საბოლოო შედეგით ძალიან კმაყოფილი ვარ. $15,100 დავზოგე.',
    car: { make: 'Porsche', model: '911 Turbo S', year: 2022 },
    isVerified: true,
    isPublished: true,
    photos: [
      {
        id: 'p3-1',
        url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=300&fit=crop',
        altText: 'Porsche 911 Turbo S',
        sortOrder: 0,
      },
    ],
    createdAt: '2024-09-10T09:15:00Z',
    updatedAt: '2024-09-10T09:15:00Z',
  },
  {
    id: '4',
    customerName: 'ნინო თ.',
    customerCity: 'თბილისი',
    customerAvatar: null,
    rating: 5,
    text: 'Toyota Camry SE ჩამოვიტანე ოჯახისთვის. ძალიან სწრაფი პროცესი იყო — 3 კვირაში მანქანა უკვე საქართველოში იყო.',
    car: { make: 'Toyota', model: 'Camry SE', year: 2023 },
    isVerified: true,
    isPublished: true,
    photos: [
      {
        id: 'p4-1',
        url: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400&h=300&fit=crop',
        altText: 'Toyota Camry SE',
        sortOrder: 0,
      },
    ],
    createdAt: '2024-08-05T11:00:00Z',
    updatedAt: '2024-08-05T11:00:00Z',
  },
  {
    id: '5',
    customerName: 'ლაშა ბ.',
    customerCity: 'რუსთავი',
    customerAvatar: null,
    rating: 5,
    text: 'Audi RS Q8 IAAI-დან. კონსულტანტმა ყველაფერი დეტალურად ამიხსნა, კალკულატორით ზუსტი ფასი წინასწარ ვიცოდი.',
    car: { make: 'Audi', model: 'RS Q8', year: 2021 },
    isVerified: true,
    isPublished: true,
    photos: [
      {
        id: 'p5-1',
        url: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400&h=300&fit=crop',
        altText: 'Audi RS Q8',
        sortOrder: 0,
      },
    ],
    createdAt: '2024-07-22T16:45:00Z',
    updatedAt: '2024-07-22T16:45:00Z',
  },
  {
    id: '6',
    customerName: 'მარიამ ჯ.',
    customerCity: 'ბათუმი',
    customerAvatar: null,
    rating: 4,
    text: 'Range Rover Sport ამერიკიდან შევიძინე. ტრანსპორტირების დროს მუდმივად ინფორმირებული ვიყავი სტატუსის შესახებ.',
    car: { make: 'Land Rover', model: 'Range Rover Sport', year: 2022 },
    isVerified: false,
    isPublished: true,
    photos: [
      {
        id: 'p6-1',
        url: 'https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?w=400&h=300&fit=crop',
        altText: 'Range Rover Sport',
        sortOrder: 0,
      },
    ],
    createdAt: '2024-06-18T13:20:00Z',
    updatedAt: '2024-06-18T13:20:00Z',
  },
];

function getMockReviews(filters: ReviewFilters) {
  let filtered = [...MOCK_REVIEWS];

  if (filters.rating) {
    filtered = filtered.filter((r) => r.rating === filters.rating);
  }
  if (filters.isVerified !== undefined) {
    filtered = filtered.filter((r) => r.isVerified === filters.isVerified);
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

export function useReviews(filters: ReviewFilters = {}) {
  return useQuery({
    queryKey: reviewKeys.list(filters),
    queryFn: async () => {
      if (USE_MOCK_DATA) {
        await new Promise((r) => setTimeout(r, 300));
        return getMockReviews(filters);
      }
      return reviewService.getReviews(filters);
    },
  });
}

export function useAggregateRating() {
  return useQuery({
    queryKey: reviewKeys.aggregate(),
    queryFn: async () => {
      if (USE_MOCK_DATA) {
        await new Promise((r) => setTimeout(r, 200));
        const total = MOCK_REVIEWS.length;
        const avg = MOCK_REVIEWS.reduce((sum, r) => sum + r.rating, 0) / total;
        return {
          averageRating: Math.round(avg * 10) / 10,
          totalReviews: 2547, // Realistic number for marketing
        };
      }
      return reviewService.getAggregateRating();
    },
  });
}
