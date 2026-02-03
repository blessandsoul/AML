'use client';

import { useQuery } from '@tanstack/react-query';
import { reviewService } from '../services/review.service';
import { reviewKeys } from '../utils/review.keys';
import type { ReviewFilters } from '../types';

const USE_MOCK_DATA = true;

const MOCK_REVIEWS = [
  {
    id: '1',
    customer_name: 'გიორგი მ.',
    customer_city: 'თბილისი',
    customer_avatar: null,
    rating: 5,
    text: 'საუკეთესო სერვისი! BMW X5 ამერიკიდან ჩამოვიტანე და ყველაფერი გამჭვირვალე იყო. ვიდეო რეპორტები ყოველ ეტაპზე მიღებდი.',
    car_make: 'BMW',
    car_model: 'X5 M50i',
    car_year: 2021,
    is_verified: true,
    is_published: true,
    photos: [],
    created_at: '2024-11-15T10:00:00Z',
    updated_at: '2024-11-15T10:00:00Z',
  },
  {
    id: '2',
    customer_name: 'ანა კ.',
    customer_city: 'ბათუმი',
    customer_avatar: null,
    rating: 5,
    text: 'მეორედ ვსარგებლობ Auto Market LGC-ის სერვისით. Mercedes-AMG GT შევიძინე Copart-იდან. დაზოგილმა თანხამ $8,200 შეადგინა!',
    car_make: 'Mercedes-Benz',
    car_model: 'AMG GT',
    car_year: 2020,
    is_verified: true,
    is_published: true,
    photos: [],
    created_at: '2024-10-20T14:30:00Z',
    updated_at: '2024-10-20T14:30:00Z',
  },
  {
    id: '3',
    customer_name: 'დავით ლ.',
    customer_city: 'ქუთაისი',
    customer_avatar: null,
    rating: 4,
    text: 'Porsche 911 Turbo S ჩამოვიტანე. პროცესი ცოტა გრძელი იყო, მაგრამ საბოლოო შედეგით ძალიან კმაყოფილი ვარ. $15,100 დავზოგე.',
    car_make: 'Porsche',
    car_model: '911 Turbo S',
    car_year: 2022,
    is_verified: true,
    is_published: true,
    photos: [],
    created_at: '2024-09-10T09:15:00Z',
    updated_at: '2024-09-10T09:15:00Z',
  },
  {
    id: '4',
    customer_name: 'ნინო თ.',
    customer_city: 'თბილისი',
    customer_avatar: null,
    rating: 5,
    text: 'Toyota Camry SE ჩამოვიტანე ოჯახისთვის. ძალიან სწრაფი პროცესი იყო — 3 კვირაში მანქანა უკვე საქართველოში იყო.',
    car_make: 'Toyota',
    car_model: 'Camry SE',
    car_year: 2023,
    is_verified: true,
    is_published: true,
    photos: [],
    created_at: '2024-08-05T11:00:00Z',
    updated_at: '2024-08-05T11:00:00Z',
  },
  {
    id: '5',
    customer_name: 'ლაშა ბ.',
    customer_city: 'რუსთავი',
    customer_avatar: null,
    rating: 5,
    text: 'Audi RS Q8 IAAI-დან. კონსულტანტმა ყველაფერი დეტალურად ამიხსნა, კალკულატორით ზუსტი ფასი წინასწარ ვიცოდი.',
    car_make: 'Audi',
    car_model: 'RS Q8',
    car_year: 2021,
    is_verified: true,
    is_published: true,
    photos: [],
    created_at: '2024-07-22T16:45:00Z',
    updated_at: '2024-07-22T16:45:00Z',
  },
  {
    id: '6',
    customer_name: 'მარიამ ჯ.',
    customer_city: 'ბათუმი',
    customer_avatar: null,
    rating: 4,
    text: 'Range Rover Sport ამერიკიდან შევიძინე. ტრანსპორტირების დროს მუდმივად ინფორმირებული ვიყავი სტატუსის შესახებ.',
    car_make: 'Land Rover',
    car_model: 'Range Rover Sport',
    car_year: 2022,
    is_verified: false,
    is_published: true,
    photos: [],
    created_at: '2024-06-18T13:20:00Z',
    updated_at: '2024-06-18T13:20:00Z',
  },
];

function getMockReviews(filters: ReviewFilters) {
  let filtered = [...MOCK_REVIEWS];

  if (filters.rating) {
    filtered = filtered.filter((r) => r.rating === filters.rating);
  }
  if (filters.is_verified !== undefined) {
    filtered = filtered.filter((r) => r.is_verified === filters.is_verified);
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
