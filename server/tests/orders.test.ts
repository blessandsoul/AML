import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { FastifyInstance } from 'fastify';
import {
  buildTestApp,
  closeTestApp,
  createTestAdmin,
  cleanupTestUsers,
  cleanupTestOrders,
  authHeader,
} from './helpers.js';

describe('Orders Endpoints', () => {
  let app: FastifyInstance;
  let adminToken: string;
  let testOrderId: string;
  let testTrackingCode: string;

  beforeAll(async () => {
    app = await buildTestApp();

    // Create admin user
    const admin = await createTestAdmin();
    adminToken = admin.tokens.accessToken;
  });

  afterAll(async () => {
    await cleanupTestOrders();
    await cleanupTestUsers();
    await closeTestApp(app);
  });

  // ============================================
  // ADMIN: ORDER MANAGEMENT
  // ============================================

  describe('POST /api/v1/orders/admin/orders', () => {
    it('should create an order (admin)', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/v1/orders/admin/orders',
        headers: authHeader(adminToken),
        payload: {
          car_make: 'Toyota',
          car_model: 'Camry',
          car_year: 2023,
          car_vin: 'TESTVIN12345678901',
          car_color: 'Silver',
          auction_price: 15000,
          shipping_cost: 2500,
          total_price: 17500,
          customer_name: 'Test Customer',
          customer_phone: '+995599123456',
          customer_email: 'customer@test.com',
          auction_source: 'Copart',
          lot_number: 'LOT12345',
          origin_port: 'Savannah',
          destination_port: 'Poti',
        },
      });

      expect(response.statusCode).toBe(201);

      const body = JSON.parse(response.body);
      expect(body.success).toBe(true);
      expect(body.data.carMake).toBe('Toyota');
      expect(body.data.carModel).toBe('Camry');
      expect(body.data.status).toBe('WON');
      expect(body.data.currentStage).toBe(1);
      expect(body.data.orderNumber).toBeDefined();
      expect(body.data.trackingCode).toBeDefined();

      testOrderId = body.data.id;
      testTrackingCode = body.data.trackingCode;
    });

    it('should reject order creation without required fields', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/v1/orders/admin/orders',
        headers: authHeader(adminToken),
        payload: {
          car_make: 'Honda',
          // Missing car_model, car_year, customer_name
        },
      });

      expect(response.statusCode).toBe(400);
    });

    it('should reject order creation without auth', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/v1/orders/admin/orders',
        payload: {
          car_make: 'Toyota',
          car_model: 'Camry',
          car_year: 2023,
          customer_name: 'Test',
        },
      });

      expect(response.statusCode).toBe(401);
    });
  });

  describe('GET /api/v1/orders/admin/orders', () => {
    it('should list all orders (admin)', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/v1/orders/admin/orders',
        headers: authHeader(adminToken),
      });

      expect(response.statusCode).toBe(200);

      const body = JSON.parse(response.body);
      expect(body.success).toBe(true);
      expect(body.data.items).toBeDefined();
      expect(body.data.pagination).toBeDefined();
    });

    it('should filter orders by status', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/v1/orders/admin/orders?status=WON',
        headers: authHeader(adminToken),
      });

      expect(response.statusCode).toBe(200);

      const body = JSON.parse(response.body);
      expect(body.success).toBe(true);
      body.data.items.forEach((order: any) => {
        expect(order.status).toBe('WON');
      });
    });

    it('should search orders', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/v1/orders/admin/orders?search=Toyota',
        headers: authHeader(adminToken),
      });

      expect(response.statusCode).toBe(200);

      const body = JSON.parse(response.body);
      expect(body.success).toBe(true);
    });
  });

  describe('GET /api/v1/orders/admin/orders/:id', () => {
    it('should get an order by ID (admin)', async () => {
      const response = await app.inject({
        method: 'GET',
        url: `/api/v1/orders/admin/orders/${testOrderId}`,
        headers: authHeader(adminToken),
      });

      expect(response.statusCode).toBe(200);

      const body = JSON.parse(response.body);
      expect(body.success).toBe(true);
      expect(body.data.id).toBe(testOrderId);
      expect(body.data.statusHistory).toBeDefined();
    });

    it('should return 404 for non-existent order', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/v1/orders/admin/orders/00000000-0000-0000-0000-000000000000',
        headers: authHeader(adminToken),
      });

      expect(response.statusCode).toBe(404);
    });
  });

  // ============================================
  // PUBLIC: ORDER TRACKING
  // ============================================

  describe('GET /api/v1/orders/track/:code', () => {
    it('should track order by tracking code (public)', async () => {
      const response = await app.inject({
        method: 'GET',
        url: `/api/v1/orders/track/${testTrackingCode}`,
      });

      expect(response.statusCode).toBe(200);

      const body = JSON.parse(response.body);
      expect(body.success).toBe(true);
      expect(body.data.trackingCode).toBe(testTrackingCode);
      expect(body.data.carMake).toBe('Toyota');
      expect(body.data.carModel).toBe('Camry');
      expect(body.data.status).toBeDefined();
      expect(body.data.statusHistory).toBeDefined();

      // Should NOT expose sensitive customer info
      expect(body.data.customerEmail).toBeUndefined();
      expect(body.data.customerPhone).toBeUndefined();
      expect(body.data.auctionPrice).toBeUndefined();
    });

    it('should return 404 for non-existent tracking code', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/v1/orders/track/INVALID-CODE',
      });

      expect(response.statusCode).toBe(404);
    });
  });

  // ============================================
  // ADMIN: UPDATE ORDER
  // ============================================

  describe('PATCH /api/v1/orders/admin/orders/:id', () => {
    it('should update order details', async () => {
      const response = await app.inject({
        method: 'PATCH',
        url: `/api/v1/orders/admin/orders/${testOrderId}`,
        headers: authHeader(adminToken),
        payload: {
          vessel_name: 'MSC Test Vessel',
          estimated_arrival: '2025-03-15T00:00:00.000Z',
        },
      });

      expect(response.statusCode).toBe(200);

      const body = JSON.parse(response.body);
      expect(body.success).toBe(true);
      expect(body.data.vesselName).toBe('MSC Test Vessel');
    });
  });

  describe('PATCH /api/v1/orders/admin/orders/:id/status', () => {
    it('should update order status to PAID', async () => {
      const response = await app.inject({
        method: 'PATCH',
        url: `/api/v1/orders/admin/orders/${testOrderId}/status`,
        headers: authHeader(adminToken),
        payload: {
          status: 'PAID',
          note: 'Payment received',
          changed_by: 'Admin',
        },
      });

      expect(response.statusCode).toBe(200);

      const body = JSON.parse(response.body);
      expect(body.success).toBe(true);
      expect(body.data.status).toBe('PAID');
      expect(body.data.currentStage).toBe(2);
    });

    it('should update order status to SHIPPING', async () => {
      const response = await app.inject({
        method: 'PATCH',
        url: `/api/v1/orders/admin/orders/${testOrderId}/status`,
        headers: authHeader(adminToken),
        payload: {
          status: 'SHIPPING',
          note: 'Vehicle loaded on vessel',
          location: 'Savannah Port',
        },
      });

      expect(response.statusCode).toBe(200);

      const body = JSON.parse(response.body);
      expect(body.success).toBe(true);
      expect(body.data.status).toBe('SHIPPING');
      expect(body.data.currentStage).toBe(3);
    });

    it('should verify status history is updated', async () => {
      const response = await app.inject({
        method: 'GET',
        url: `/api/v1/orders/admin/orders/${testOrderId}`,
        headers: authHeader(adminToken),
      });

      expect(response.statusCode).toBe(200);

      const body = JSON.parse(response.body);
      expect(body.data.statusHistory.length).toBeGreaterThanOrEqual(3);
    });
  });

  // ============================================
  // ADMIN: DELETE ORDER
  // ============================================

  describe('DELETE /api/v1/orders/admin/orders/:id', () => {
    let orderToDelete: string;

    beforeAll(async () => {
      // Create another order to delete
      const response = await app.inject({
        method: 'POST',
        url: '/api/v1/orders/admin/orders',
        headers: authHeader(adminToken),
        payload: {
          car_make: 'Honda',
          car_model: 'Civic',
          car_year: 2022,
          customer_name: 'Delete Test',
        },
      });

      const body = JSON.parse(response.body);
      orderToDelete = body.data.id;
    });

    it('should delete an order', async () => {
      const response = await app.inject({
        method: 'DELETE',
        url: `/api/v1/orders/admin/orders/${orderToDelete}`,
        headers: authHeader(adminToken),
      });

      expect(response.statusCode).toBe(200);

      const body = JSON.parse(response.body);
      expect(body.success).toBe(true);
    });

    it('should return 404 when trying to get deleted order', async () => {
      const response = await app.inject({
        method: 'GET',
        url: `/api/v1/orders/admin/orders/${orderToDelete}`,
        headers: authHeader(adminToken),
      });

      expect(response.statusCode).toBe(404);
    });
  });
});
