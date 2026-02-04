import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { FastifyInstance } from 'fastify';
import {
  buildTestApp,
  closeTestApp,
  createTestAdmin,
  cleanupTestUsers,
  cleanupTestReviews,
  authHeader,
} from './helpers.js';

describe('Reviews Endpoints', () => {
  let app: FastifyInstance;
  let adminToken: string;
  let testReviewId: string;
  let testDealId: string;

  beforeAll(async () => {
    app = await buildTestApp();

    // Create admin user
    const admin = await createTestAdmin();
    adminToken = admin.tokens.accessToken;
  });

  afterAll(async () => {
    await cleanupTestReviews();
    await cleanupTestUsers();
    await closeTestApp(app);
  });

  // ============================================
  // ADMIN: REVIEW MANAGEMENT
  // ============================================

  describe('POST /api/v1/reviews/admin/reviews', () => {
    it('should create a review (admin)', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/v1/reviews/admin/reviews',
        headers: authHeader(adminToken),
        payload: {
          customer_name: 'Test Customer',
          customer_city: 'Tbilisi',
          rating: 5,
          text: 'Excellent service! The car arrived exactly as described.',
          car_make: 'BMW',
          car_model: 'X5',
          car_year: 2022,
          is_verified: true,
          is_published: true,
          photos: [
            {
              url: 'https://example.com/photo1.jpg',
              alt_text: 'Car front view',
              sort_order: 0,
            },
          ],
        },
      });

      expect(response.statusCode).toBe(201);

      const body = JSON.parse(response.body);
      expect(body.success).toBe(true);
      expect(body.data.customerName).toBe('Test Customer');
      expect(body.data.rating).toBe(5);
      expect(body.data.isVerified).toBe(true);
      expect(body.data.photos).toBeDefined();
      expect(body.data.photos.length).toBe(1);

      testReviewId = body.data.id;
    });

    it('should reject review creation without required fields', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/v1/reviews/admin/reviews',
        headers: authHeader(adminToken),
        payload: {
          customer_name: 'Test',
          // Missing rating and text
        },
      });

      expect(response.statusCode).toBe(400);
    });

    it('should reject invalid rating (out of range)', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/v1/reviews/admin/reviews',
        headers: authHeader(adminToken),
        payload: {
          customer_name: 'Test Customer',
          rating: 6, // Invalid: max is 5
          text: 'Test review',
        },
      });

      expect(response.statusCode).toBe(400);
    });
  });

  describe('GET /api/v1/reviews/admin/reviews', () => {
    it('should list all reviews (admin)', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/v1/reviews/admin/reviews',
        headers: authHeader(adminToken),
      });

      expect(response.statusCode).toBe(200);

      const body = JSON.parse(response.body);
      expect(body.success).toBe(true);
      expect(body.data.items).toBeDefined();
      expect(body.data.pagination).toBeDefined();
    });

    it('should filter reviews by rating', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/v1/reviews/admin/reviews?rating=5',
        headers: authHeader(adminToken),
      });

      expect(response.statusCode).toBe(200);

      const body = JSON.parse(response.body);
      expect(body.success).toBe(true);
      body.data.items.forEach((review: any) => {
        expect(review.rating).toBe(5);
      });
    });

    it('should filter reviews by verified status', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/v1/reviews/admin/reviews?is_verified=true',
        headers: authHeader(adminToken),
      });

      expect(response.statusCode).toBe(200);

      const body = JSON.parse(response.body);
      expect(body.success).toBe(true);
      body.data.items.forEach((review: any) => {
        expect(review.isVerified).toBe(true);
      });
    });
  });

  describe('GET /api/v1/reviews/admin/reviews/:id', () => {
    it('should get a review by ID (admin)', async () => {
      const response = await app.inject({
        method: 'GET',
        url: `/api/v1/reviews/admin/reviews/${testReviewId}`,
        headers: authHeader(adminToken),
      });

      expect(response.statusCode).toBe(200);

      const body = JSON.parse(response.body);
      expect(body.success).toBe(true);
      expect(body.data.id).toBe(testReviewId);
      expect(body.data.photos).toBeDefined();
    });
  });

  // ============================================
  // PUBLIC: REVIEWS
  // ============================================

  describe('GET /api/v1/reviews', () => {
    it('should list published reviews (public)', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/v1/reviews',
      });

      expect(response.statusCode).toBe(200);

      const body = JSON.parse(response.body);
      expect(body.success).toBe(true);
      expect(body.data.items).toBeDefined();

      // All returned reviews should be published
      body.data.items.forEach((review: any) => {
        expect(review.isPublished).toBe(true);
      });
    });

    it('should support pagination and filtering', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/v1/reviews?page=1&limit=5&rating=5',
      });

      expect(response.statusCode).toBe(200);

      const body = JSON.parse(response.body);
      expect(body.data.pagination.page).toBe(1);
      expect(body.data.pagination.limit).toBe(5);
    });
  });

  describe('GET /api/v1/reviews/aggregate', () => {
    it('should return aggregate rating statistics', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/v1/reviews/aggregate',
      });

      expect(response.statusCode).toBe(200);

      const body = JSON.parse(response.body);
      expect(body.success).toBe(true);
      expect(body.data.averageRating).toBeDefined();
      expect(body.data.totalReviews).toBeDefined();
      expect(body.data.ratingDistribution).toBeDefined();
    });
  });

  // ============================================
  // ADMIN: COMPLETED DEALS
  // ============================================

  describe('POST /api/v1/reviews/admin/deals', () => {
    it('should create a completed deal (admin)', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/v1/reviews/admin/deals',
        headers: authHeader(adminToken),
        payload: {
          car_make: 'Mercedes',
          car_model: 'E-Class',
          car_year: 2021,
          car_vin: 'TESTVIN987654321',
          auction_price: 25000,
          market_price: 35000,
          savings: 10000,
          delivery_city: 'Tbilisi',
          description: 'Excellent condition, fully loaded',
          is_published: true,
          photos: [
            {
              url: 'https://example.com/before.jpg',
              photo_type: 'BEFORE',
              sort_order: 0,
            },
            {
              url: 'https://example.com/after.jpg',
              photo_type: 'AFTER',
              sort_order: 1,
            },
          ],
        },
      });

      expect(response.statusCode).toBe(201);

      const body = JSON.parse(response.body);
      expect(body.success).toBe(true);
      expect(body.data.carMake).toBe('Mercedes');
      expect(body.data.auctionPrice).toBe('25000');
      expect(body.data.savings).toBe('10000');
      expect(body.data.photos).toBeDefined();
      expect(body.data.photos.length).toBe(2);

      testDealId = body.data.id;
    });

    it('should reject deal creation without required fields', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/v1/reviews/admin/deals',
        headers: authHeader(adminToken),
        payload: {
          car_make: 'Toyota',
          // Missing car_model, car_year, prices, savings
        },
      });

      expect(response.statusCode).toBe(400);
    });
  });

  describe('GET /api/v1/reviews/admin/deals', () => {
    it('should list all completed deals (admin)', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/v1/reviews/admin/deals',
        headers: authHeader(adminToken),
      });

      expect(response.statusCode).toBe(200);

      const body = JSON.parse(response.body);
      expect(body.success).toBe(true);
      expect(body.data.items).toBeDefined();
      expect(body.data.pagination).toBeDefined();
    });
  });

  describe('GET /api/v1/reviews/admin/deals/:id', () => {
    it('should get a deal by ID (admin)', async () => {
      const response = await app.inject({
        method: 'GET',
        url: `/api/v1/reviews/admin/deals/${testDealId}`,
        headers: authHeader(adminToken),
      });

      expect(response.statusCode).toBe(200);

      const body = JSON.parse(response.body);
      expect(body.success).toBe(true);
      expect(body.data.id).toBe(testDealId);
      expect(body.data.photos).toBeDefined();
    });
  });

  // ============================================
  // PUBLIC: COMPLETED DEALS
  // ============================================

  describe('GET /api/v1/reviews/deals', () => {
    it('should list published completed deals (public)', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/v1/reviews/deals',
      });

      expect(response.statusCode).toBe(200);

      const body = JSON.parse(response.body);
      expect(body.success).toBe(true);
      expect(body.data.items).toBeDefined();

      // All returned deals should be published
      body.data.items.forEach((deal: any) => {
        expect(deal.isPublished).toBe(true);
      });
    });
  });

  // ============================================
  // ADMIN: UPDATE AND DELETE
  // ============================================

  describe('PATCH /api/v1/reviews/admin/reviews/:id', () => {
    it('should update a review', async () => {
      const response = await app.inject({
        method: 'PATCH',
        url: `/api/v1/reviews/admin/reviews/${testReviewId}`,
        headers: authHeader(adminToken),
        payload: {
          text: 'Updated review text - still excellent!',
        },
      });

      expect(response.statusCode).toBe(200);

      const body = JSON.parse(response.body);
      expect(body.success).toBe(true);
      expect(body.data.text).toContain('Updated review text');
    });
  });

  describe('PATCH /api/v1/reviews/admin/deals/:id', () => {
    it('should update a completed deal', async () => {
      const response = await app.inject({
        method: 'PATCH',
        url: `/api/v1/reviews/admin/deals/${testDealId}`,
        headers: authHeader(adminToken),
        payload: {
          description: 'Updated description - pristine condition',
        },
      });

      expect(response.statusCode).toBe(200);

      const body = JSON.parse(response.body);
      expect(body.success).toBe(true);
      expect(body.data.description).toContain('Updated description');
    });
  });

  describe('DELETE /api/v1/reviews/admin/reviews/:id', () => {
    let reviewToDelete: string;

    beforeAll(async () => {
      // Create another review to delete
      const response = await app.inject({
        method: 'POST',
        url: '/api/v1/reviews/admin/reviews',
        headers: authHeader(adminToken),
        payload: {
          customer_name: 'Test Delete Review',
          rating: 4,
          text: 'Review to be deleted',
        },
      });

      const body = JSON.parse(response.body);
      reviewToDelete = body.data.id;
    });

    it('should delete a review', async () => {
      const response = await app.inject({
        method: 'DELETE',
        url: `/api/v1/reviews/admin/reviews/${reviewToDelete}`,
        headers: authHeader(adminToken),
      });

      expect(response.statusCode).toBe(200);

      const body = JSON.parse(response.body);
      expect(body.success).toBe(true);
    });
  });

  describe('DELETE /api/v1/reviews/admin/deals/:id', () => {
    let dealToDelete: string;

    beforeAll(async () => {
      // Create another deal to delete
      const response = await app.inject({
        method: 'POST',
        url: '/api/v1/reviews/admin/deals',
        headers: authHeader(adminToken),
        payload: {
          car_make: 'Honda',
          car_model: 'Accord',
          car_year: 2020,
          car_vin: 'TESTDELETEVIN123',
          auction_price: 15000,
          market_price: 20000,
          savings: 5000,
        },
      });

      const body = JSON.parse(response.body);
      dealToDelete = body.data.id;
    });

    it('should delete a completed deal', async () => {
      const response = await app.inject({
        method: 'DELETE',
        url: `/api/v1/reviews/admin/deals/${dealToDelete}`,
        headers: authHeader(adminToken),
      });

      expect(response.statusCode).toBe(200);

      const body = JSON.parse(response.body);
      expect(body.success).toBe(true);
    });
  });
});
