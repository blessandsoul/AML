import type { FastifyDynamicSwaggerOptions } from '@fastify/swagger';
import type { FastifySwaggerUiOptions } from '@fastify/swagger-ui';
import { env, isProd } from './env.js';

/**
 * Swagger/OpenAPI configuration
 */
export const swaggerConfig: FastifyDynamicSwaggerOptions = {
  openapi: {
    openapi: '3.0.3',
    info: {
      title: 'AML API',
      description: `
## Auto Market LGC (AML) API Documentation

This API provides endpoints for managing:
- **Authentication** - User registration, login, and token management
- **Blog** - Posts, categories, tags, and reactions
- **Orders** - Order management and tracking
- **Reviews** - Customer reviews and completed deals

### Authentication
Most admin endpoints require a Bearer token in the Authorization header:
\`\`\`
Authorization: Bearer <access_token>
\`\`\`

### Response Format
All responses follow a consistent format:

**Success Response:**
\`\`\`json
{
  "success": true,
  "message": "Description of the operation",
  "data": { ... }
}
\`\`\`

**Error Response:**
\`\`\`json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message"
  }
}
\`\`\`

**Paginated Response:**
\`\`\`json
{
  "success": true,
  "message": "Description",
  "data": {
    "items": [...],
    "pagination": {
      "page": 1,
      "limit": 10,
      "totalItems": 100,
      "totalPages": 10,
      "hasNextPage": true,
      "hasPreviousPage": false
    }
  }
}
\`\`\`
      `,
      version: '1.0.0',
      contact: {
        name: 'AML Support',
        email: 'support@aml.ge',
      },
    },
    servers: [
      {
        url: isProd ? 'https://api.aml.ge' : `http://localhost:${env.PORT}`,
        description: isProd ? 'Production server' : 'Development server',
      },
    ],
    tags: [
      { name: 'Health', description: 'Health check endpoints' },
      { name: 'Auth', description: 'Authentication endpoints' },
      { name: 'Blog - Public', description: 'Public blog endpoints' },
      { name: 'Blog - Admin', description: 'Admin blog management endpoints' },
      { name: 'Orders - Public', description: 'Public order tracking endpoints' },
      { name: 'Orders - Admin', description: 'Admin order management endpoints' },
      { name: 'Reviews - Public', description: 'Public reviews endpoints' },
      { name: 'Reviews - Admin', description: 'Admin reviews management endpoints' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT access token',
        },
      },
      schemas: {
        // Common schemas
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            error: {
              type: 'object',
              properties: {
                code: { type: 'string', example: 'ERROR_CODE' },
                message: { type: 'string', example: 'Error description' },
                details: {
                  type: 'object',
                  additionalProperties: {
                    type: 'array',
                    items: { type: 'string' },
                  },
                },
              },
            },
          },
        },
        Pagination: {
          type: 'object',
          properties: {
            page: { type: 'integer', example: 1 },
            limit: { type: 'integer', example: 10 },
            totalItems: { type: 'integer', example: 100 },
            totalPages: { type: 'integer', example: 10 },
            hasNextPage: { type: 'boolean', example: true },
            hasPreviousPage: { type: 'boolean', example: false },
          },
        },

        // Auth schemas
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            email: { type: 'string', format: 'email' },
            firstName: { type: 'string', nullable: true },
            lastName: { type: 'string', nullable: true },
            role: { type: 'string', enum: ['USER', 'ADMIN'] },
            isActive: { type: 'boolean' },
            lastLoginAt: { type: 'string', format: 'date-time', nullable: true },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        RegisterRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email', example: 'user@example.com' },
            password: { type: 'string', minLength: 8, example: 'SecurePass123!' },
            firstName: { type: 'string', example: 'John' },
            lastName: { type: 'string', example: 'Doe' },
          },
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email', example: 'user@example.com' },
            password: { type: 'string', example: 'SecurePass123!' },
          },
        },
        TokenPair: {
          type: 'object',
          properties: {
            accessToken: { type: 'string' },
            refreshToken: { type: 'string' },
          },
        },
        RefreshRequest: {
          type: 'object',
          required: ['refreshToken'],
          properties: {
            refreshToken: { type: 'string' },
          },
        },

        // Blog schemas
        BlogCategory: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            name: { type: 'string' },
            slug: { type: 'string' },
            description: { type: 'string', nullable: true },
            color: { type: 'string', nullable: true },
            _count: {
              type: 'object',
              properties: {
                posts: { type: 'integer' },
              },
            },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        BlogTag: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            name: { type: 'string' },
            slug: { type: 'string' },
            _count: {
              type: 'object',
              properties: {
                posts: { type: 'integer' },
              },
            },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        BlogPost: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            title: { type: 'string' },
            slug: { type: 'string' },
            content: { type: 'string' },
            excerpt: { type: 'string', nullable: true },
            featuredImage: { type: 'string', nullable: true },
            images: { type: 'array', items: { type: 'string' }, nullable: true },
            status: { type: 'string', enum: ['DRAFT', 'PUBLISHED', 'ARCHIVED'] },
            authorName: { type: 'string' },
            authorBio: { type: 'string', nullable: true },
            authorAvatar: { type: 'string', nullable: true },
            publishedAt: { type: 'string', format: 'date-time', nullable: true },
            viewCount: { type: 'integer' },
            readingTime: { type: 'integer', nullable: true },
            category: { $ref: '#/components/schemas/BlogCategory' },
            tags: {
              type: 'array',
              items: { $ref: '#/components/schemas/BlogTag' },
            },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        CreatePostRequest: {
          type: 'object',
          required: ['title', 'content', 'author_name'],
          properties: {
            title: { type: 'string', maxLength: 200 },
            slug: { type: 'string', maxLength: 200 },
            content: { type: 'string' },
            excerpt: { type: 'string', maxLength: 500 },
            featured_image: { type: 'string', format: 'uri' },
            images: { type: 'array', items: { type: 'string', format: 'uri' } },
            category_id: { type: 'string', format: 'uuid' },
            tag_ids: { type: 'array', items: { type: 'string', format: 'uuid' } },
            author_name: { type: 'string', maxLength: 100 },
            author_bio: { type: 'string', maxLength: 500 },
            author_avatar: { type: 'string', format: 'uri' },
            reading_time: { type: 'integer' },
          },
        },
        CreateCategoryRequest: {
          type: 'object',
          required: ['name'],
          properties: {
            name: { type: 'string', maxLength: 100 },
            slug: { type: 'string', maxLength: 200 },
            description: { type: 'string', maxLength: 500 },
            color: { type: 'string', pattern: '^#[0-9A-Fa-f]{6}$' },
          },
        },
        CreateTagRequest: {
          type: 'object',
          required: ['name'],
          properties: {
            name: { type: 'string', maxLength: 50 },
            slug: { type: 'string', maxLength: 200 },
          },
        },
        AddReactionRequest: {
          type: 'object',
          required: ['type', 'session_id'],
          properties: {
            type: { type: 'string', enum: ['LIKE', 'LOVE', 'HELPFUL'] },
            session_id: { type: 'string' },
          },
        },

        // Order schemas
        Order: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            orderNumber: { type: 'string' },
            trackingCode: { type: 'string' },
            carMake: { type: 'string' },
            carModel: { type: 'string' },
            carYear: { type: 'integer' },
            carVin: { type: 'string', nullable: true },
            carColor: { type: 'string', nullable: true },
            carImage: { type: 'string', nullable: true },
            auctionPrice: { type: 'number', nullable: true },
            shippingCost: { type: 'number', nullable: true },
            totalPrice: { type: 'number', nullable: true },
            customerName: { type: 'string' },
            customerPhone: { type: 'string', nullable: true },
            customerEmail: { type: 'string', nullable: true },
            status: { type: 'string', enum: ['WON', 'PAID', 'SHIPPING', 'PORT', 'DELIVERED'] },
            currentStage: { type: 'integer' },
            auctionSource: { type: 'string', nullable: true },
            lotNumber: { type: 'string', nullable: true },
            originPort: { type: 'string', nullable: true },
            destinationPort: { type: 'string', nullable: true },
            vesselName: { type: 'string', nullable: true },
            estimatedArrival: { type: 'string', format: 'date-time', nullable: true },
            statusHistory: {
              type: 'array',
              items: { $ref: '#/components/schemas/OrderStatusHistory' },
            },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        OrderStatusHistory: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            status: { type: 'string', enum: ['WON', 'PAID', 'SHIPPING', 'PORT', 'DELIVERED'] },
            stage: { type: 'integer' },
            note: { type: 'string', nullable: true },
            location: { type: 'string', nullable: true },
            changedBy: { type: 'string', nullable: true },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        CreateOrderRequest: {
          type: 'object',
          required: ['car_make', 'car_model', 'car_year', 'customer_name'],
          properties: {
            car_make: { type: 'string', maxLength: 100 },
            car_model: { type: 'string', maxLength: 100 },
            car_year: { type: 'integer', minimum: 1900, maximum: 2100 },
            car_vin: { type: 'string', maxLength: 50 },
            car_color: { type: 'string', maxLength: 50 },
            car_image: { type: 'string', format: 'uri' },
            auction_price: { type: 'number' },
            shipping_cost: { type: 'number' },
            total_price: { type: 'number' },
            customer_name: { type: 'string', maxLength: 200 },
            customer_phone: { type: 'string', maxLength: 50 },
            customer_email: { type: 'string', format: 'email' },
            auction_source: { type: 'string', maxLength: 100 },
            lot_number: { type: 'string', maxLength: 50 },
            origin_port: { type: 'string', maxLength: 100 },
            destination_port: { type: 'string', maxLength: 100 },
            vessel_name: { type: 'string', maxLength: 100 },
            estimated_arrival: { type: 'string', format: 'date-time' },
          },
        },
        UpdateOrderStatusRequest: {
          type: 'object',
          required: ['status'],
          properties: {
            status: { type: 'string', enum: ['WON', 'PAID', 'SHIPPING', 'PORT', 'DELIVERED'] },
            note: { type: 'string', maxLength: 1000 },
            location: { type: 'string', maxLength: 200 },
            changed_by: { type: 'string', maxLength: 200 },
          },
        },

        // Review schemas
        Review: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            customerName: { type: 'string' },
            customerCity: { type: 'string', nullable: true },
            customerAvatar: { type: 'string', nullable: true },
            rating: { type: 'integer', minimum: 1, maximum: 5 },
            text: { type: 'string' },
            carMake: { type: 'string', nullable: true },
            carModel: { type: 'string', nullable: true },
            carYear: { type: 'integer', nullable: true },
            isVerified: { type: 'boolean' },
            isPublished: { type: 'boolean' },
            photos: {
              type: 'array',
              items: { $ref: '#/components/schemas/ReviewPhoto' },
            },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        ReviewPhoto: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            url: { type: 'string' },
            altText: { type: 'string', nullable: true },
            sortOrder: { type: 'integer' },
          },
        },
        CreateReviewRequest: {
          type: 'object',
          required: ['customer_name', 'rating', 'text'],
          properties: {
            customer_name: { type: 'string', maxLength: 200 },
            customer_city: { type: 'string', maxLength: 100 },
            customer_avatar: { type: 'string', format: 'uri' },
            rating: { type: 'integer', minimum: 1, maximum: 5 },
            text: { type: 'string', maxLength: 5000 },
            car_make: { type: 'string', maxLength: 100 },
            car_model: { type: 'string', maxLength: 100 },
            car_year: { type: 'integer', minimum: 1900, maximum: 2100 },
            is_verified: { type: 'boolean', default: false },
            is_published: { type: 'boolean', default: true },
            photos: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  url: { type: 'string', format: 'uri' },
                  alt_text: { type: 'string' },
                  sort_order: { type: 'integer' },
                },
              },
            },
          },
        },
        AggregateRating: {
          type: 'object',
          properties: {
            averageRating: { type: 'number' },
            totalReviews: { type: 'integer' },
            ratingDistribution: {
              type: 'object',
              properties: {
                '1': { type: 'integer' },
                '2': { type: 'integer' },
                '3': { type: 'integer' },
                '4': { type: 'integer' },
                '5': { type: 'integer' },
              },
            },
          },
        },
        CompletedDeal: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            carMake: { type: 'string' },
            carModel: { type: 'string' },
            carYear: { type: 'integer' },
            carVin: { type: 'string', nullable: true },
            auctionPrice: { type: 'number' },
            marketPrice: { type: 'number' },
            savings: { type: 'number' },
            deliveryCity: { type: 'string', nullable: true },
            description: { type: 'string', nullable: true },
            isPublished: { type: 'boolean' },
            photos: {
              type: 'array',
              items: { $ref: '#/components/schemas/CompletedDealPhoto' },
            },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        CompletedDealPhoto: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            url: { type: 'string' },
            altText: { type: 'string', nullable: true },
            photoType: { type: 'string', enum: ['BEFORE', 'AFTER'] },
            sortOrder: { type: 'integer' },
          },
        },
        CreateCompletedDealRequest: {
          type: 'object',
          required: ['car_make', 'car_model', 'car_year', 'auction_price', 'market_price', 'savings'],
          properties: {
            car_make: { type: 'string', maxLength: 100 },
            car_model: { type: 'string', maxLength: 100 },
            car_year: { type: 'integer', minimum: 1900, maximum: 2100 },
            car_vin: { type: 'string', maxLength: 50 },
            auction_price: { type: 'number' },
            market_price: { type: 'number' },
            savings: { type: 'number' },
            delivery_city: { type: 'string', maxLength: 100 },
            description: { type: 'string', maxLength: 5000 },
            is_published: { type: 'boolean', default: true },
            photos: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  url: { type: 'string', format: 'uri' },
                  alt_text: { type: 'string' },
                  photo_type: { type: 'string', enum: ['BEFORE', 'AFTER'] },
                  sort_order: { type: 'integer' },
                },
              },
            },
          },
        },
      },
    },
  },
};

/**
 * Swagger UI configuration
 */
export const swaggerUiConfig: FastifySwaggerUiOptions = {
  routePrefix: '/docs',
  uiConfig: {
    docExpansion: 'list',
    deepLinking: true,
    persistAuthorization: true,
    displayRequestDuration: true,
    filter: true,
    syntaxHighlight: {
      theme: 'monokai',
    },
  },
  staticCSP: true,
  transformStaticCSP: (header) => header,
};
