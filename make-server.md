# Server Implementation Plan for AML (Auto Market LGC)

> This document outlines the step-by-step plan to create all server-side APIs needed to support the AML client application.

---

## Overview

**Client Stack:** Next.js 16, React 19, TypeScript, TanStack Query, Axios
**Server Stack:** Fastify, TypeScript, Prisma ORM, MySQL, Redis
**Base API URL:** `http://localhost:8080/api/v1`

---

## Phase 1: Core Infrastructure (Foundation)

### Step 1.1: Database Schema Setup

Create the complete Prisma schema with all required models.

**File:** `server/prisma/schema.prisma`

**Models to create:**

```prisma
// ==================== AUTH & USERS ====================
model User {
  id            String    @id @default(uuid())
  email         String    @unique
  password      String
  firstName     String?
  lastName      String?
  role          UserRole  @default(USER)
  isActive      Boolean   @default(true)
  lastLoginAt   DateTime?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  refreshTokens RefreshToken[]
  blogPosts     BlogPost[]

  @@map("users")
}

model RefreshToken {
  id        String   @id @default(uuid())
  token     String   @unique @db.VarChar(500)
  userId    String
  expiresAt DateTime
  createdAt DateTime @default(now())

  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([expiresAt])
  @@map("refresh_tokens")
}

enum UserRole {
  USER
  ADMIN
}

// ==================== BLOG ====================
model BlogCategory {
  id          String     @id @default(uuid())
  name        String
  slug        String     @unique
  description String?    @db.Text
  color       String?
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt

  posts       BlogPost[]

  @@map("blog_categories")
}

model BlogTag {
  id        String        @id @default(uuid())
  name      String
  slug      String        @unique
  createdAt DateTime      @default(now())

  posts     BlogPostTag[]

  @@map("blog_tags")
}

model BlogPost {
  id            String         @id @default(uuid())
  title         String
  slug          String         @unique
  content       String         @db.LongText
  excerpt       String?        @db.Text
  featuredImage String?
  images        Json?          // Array of image URLs
  status        BlogPostStatus @default(DRAFT)
  authorName    String
  authorBio     String?        @db.Text
  authorAvatar  String?
  publishedAt   DateTime?
  viewCount     Int            @default(0)
  readingTime   Int?           // in minutes
  categoryId    String?
  authorId      String?
  createdAt     DateTime       @default(now())
  updatedAt     DateTime       @updatedAt

  category      BlogCategory?  @relation(fields: [categoryId], references: [id], onDelete: SetNull)
  author        User?          @relation(fields: [authorId], references: [id], onDelete: SetNull)
  tags          BlogPostTag[]
  reactions     BlogReaction[]

  @@index([status])
  @@index([categoryId])
  @@index([publishedAt])
  @@index([slug])
  @@map("blog_posts")
}

model BlogPostTag {
  postId String
  tagId  String

  post   BlogPost @relation(fields: [postId], references: [id], onDelete: Cascade)
  tag    BlogTag  @relation(fields: [tagId], references: [id], onDelete: Cascade)

  @@id([postId, tagId])
  @@map("blog_post_tags")
}

model BlogReaction {
  id        String           @id @default(uuid())
  type      BlogReactionType
  sessionId String           // Anonymous user session
  postId    String
  createdAt DateTime         @default(now())

  post      BlogPost         @relation(fields: [postId], references: [id], onDelete: Cascade)

  @@unique([postId, sessionId, type])
  @@index([postId])
  @@map("blog_reactions")
}

enum BlogPostStatus {
  DRAFT
  PUBLISHED
  ARCHIVED
}

enum BlogReactionType {
  LIKE
  LOVE
  HELPFUL
}

// ==================== ORDERS ====================
model Order {
  id              String        @id @default(uuid())
  orderNumber     String        @unique
  trackingCode    String        @unique
  carMake         String
  carModel        String
  carYear         Int
  carVin          String?
  carColor        String?
  carImage        String?
  auctionPrice    Decimal?      @db.Decimal(12, 2)
  shippingCost    Decimal?      @db.Decimal(12, 2)
  totalPrice      Decimal?      @db.Decimal(12, 2)
  customerName    String
  customerPhone   String?
  customerEmail   String?
  status          OrderStatus   @default(WON)
  currentStage    Int           @default(1)
  auctionSource   String?
  lotNumber       String?
  originPort      String?
  destinationPort String?
  vesselName      String?
  estimatedArrival DateTime?
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt

  statusHistory   OrderStatusHistory[]

  @@index([status])
  @@index([trackingCode])
  @@index([orderNumber])
  @@map("orders")
}

model OrderStatusHistory {
  id        String      @id @default(uuid())
  status    OrderStatus
  stage     Int
  note      String?     @db.Text
  location  String?
  changedBy String?
  orderId   String
  createdAt DateTime    @default(now())

  order     Order       @relation(fields: [orderId], references: [id], onDelete: Cascade)

  @@index([orderId])
  @@map("order_status_history")
}

enum OrderStatus {
  WON
  PAID
  SHIPPING
  PORT
  DELIVERED
}

// ==================== REVIEWS ====================
model Review {
  id             String        @id @default(uuid())
  customerName   String
  customerCity   String?
  customerAvatar String?
  rating         Int           // 1-5
  text           String        @db.Text
  carMake        String?
  carModel       String?
  carYear        Int?
  isVerified     Boolean       @default(false)
  isPublished    Boolean       @default(true)
  createdAt      DateTime      @default(now())
  updatedAt      DateTime      @updatedAt

  photos         ReviewPhoto[]

  @@index([isPublished])
  @@index([rating])
  @@map("reviews")
}

model ReviewPhoto {
  id        String @id @default(uuid())
  url       String
  altText   String?
  sortOrder Int    @default(0)
  reviewId  String

  review    Review @relation(fields: [reviewId], references: [id], onDelete: Cascade)

  @@index([reviewId])
  @@map("review_photos")
}

model CompletedDeal {
  id           String               @id @default(uuid())
  carMake      String
  carModel     String
  carYear      Int
  carVin       String?
  auctionPrice Decimal              @db.Decimal(12, 2)
  marketPrice  Decimal              @db.Decimal(12, 2)
  savings      Decimal              @db.Decimal(12, 2)
  deliveryCity String?
  description  String?              @db.Text
  isPublished  Boolean              @default(true)
  createdAt    DateTime             @default(now())
  updatedAt    DateTime             @updatedAt

  photos       CompletedDealPhoto[]

  @@index([isPublished])
  @@map("completed_deals")
}

model CompletedDealPhoto {
  id              String              @id @default(uuid())
  url             String
  altText         String?
  photoType       CompletedDealPhotoType @default(AFTER)
  sortOrder       Int                 @default(0)
  completedDealId String

  completedDeal   CompletedDeal       @relation(fields: [completedDealId], references: [id], onDelete: Cascade)

  @@index([completedDealId])
  @@map("completed_deal_photos")
}

enum CompletedDealPhotoType {
  BEFORE
  AFTER
}
```

**Tasks:**
- [ ] Update `prisma/schema.prisma` with all models above
- [ ] Run `npm run prisma:migrate dev --name initial_schema`
- [ ] Update `prisma/seed.ts` with sample data for all entities

---

### Step 1.2: Shared Response Helpers

Create unified response helpers that ALL controllers must use.

**File:** `server/src/libs/response.ts`

**Functions to implement:**
```typescript
// Success response for single items
export function successResponse<T>(message: string, data: T): ApiResponse<T>

// Paginated response for lists
export function paginatedResponse<T>(
  message: string,
  items: T[],
  page: number,
  limit: number,
  totalItems: number
): PaginatedApiResponse<T>
```

**Tasks:**
- [ ] Create `response.ts` with typed response helpers
- [ ] Export `ApiResponse<T>` and `PaginatedApiResponse<T>` types

---

### Step 1.3: Error Handling System

Create custom error classes and global error handler.

**File:** `server/src/libs/errors.ts`

**Error classes to create:**
```typescript
export class AppError extends Error {
  code: string;
  statusCode: number;
}

export class BadRequestError extends AppError {}      // 400
export class UnauthorizedError extends AppError {}    // 401
export class ForbiddenError extends AppError {}       // 403
export class NotFoundError extends AppError {}        // 404
export class ConflictError extends AppError {}        // 409
export class ValidationError extends AppError {}      // 422
export class InternalError extends AppError {}        // 500
```

**File:** `server/src/middlewares/error-handler.ts`

**Tasks:**
- [ ] Create error classes with proper codes and status
- [ ] Create Fastify error handler plugin
- [ ] Register error handler in `app.ts`

---

### Step 1.4: Pagination Utilities

Create shared pagination validation and helper.

**File:** `server/src/libs/pagination.ts`

**Functions:**
```typescript
// Zod schema for pagination params
export const PaginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10)
});

export type PaginationParams = z.infer<typeof PaginationSchema>;

// Calculate offset
export function getOffset(page: number, limit: number): number;

// Calculate pagination metadata
export function getPaginationMeta(page: number, limit: number, totalItems: number);
```

**Tasks:**
- [ ] Create pagination utility file
- [ ] Export Zod schema and helper functions

---

### Step 1.5: Validation Utilities

Create shared Zod validation helpers.

**File:** `server/src/libs/validation.ts`

**Functions:**
```typescript
// Validate request body/query with Zod schema
export function validateSchema<T>(schema: ZodSchema<T>, data: unknown): T;

// Common Zod schemas
export const UUIDSchema = z.string().uuid();
export const SlugSchema = z.string().min(1).max(200).regex(/^[a-z0-9-]+$/);
```

**Tasks:**
- [ ] Create validation utility file
- [ ] Export common schemas

---

## Phase 2: Authentication Module

### Step 2.1: Auth Configuration

**File:** `server/src/config/auth.ts`

```typescript
export const AUTH_CONFIG = {
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: '15m',           // Access token
  REFRESH_TOKEN_EXPIRES_IN: '7d',   // Refresh token
  BCRYPT_SALT_ROUNDS: 12,
};
```

**Tasks:**
- [ ] Create auth configuration file
- [ ] Add JWT_SECRET to `.env`

---

### Step 2.2: Auth Service

**File:** `server/src/modules/auth/auth.service.ts`

**Functions:**
```typescript
// Register new user (no email verification)
async register(data: RegisterInput): Promise<AuthResult>

// Login user
async login(email: string, password: string): Promise<AuthResult>

// Refresh access token
async refreshToken(refreshToken: string): Promise<TokenPair>

// Logout (invalidate refresh token)
async logout(refreshToken: string): Promise<void>

// Get current user by ID
async getCurrentUser(userId: string): Promise<User>
```

**Tasks:**
- [ ] Create `auth.service.ts`
- [ ] Implement password hashing with bcrypt
- [ ] Implement JWT token generation
- [ ] Implement refresh token storage in DB

---

### Step 2.3: Auth Repository

**File:** `server/src/modules/auth/auth.repo.ts`

**Functions:**
```typescript
async findUserByEmail(email: string): Promise<User | null>
async createUser(data: CreateUserInput): Promise<User>
async saveRefreshToken(userId: string, token: string, expiresAt: Date): Promise<void>
async findRefreshToken(token: string): Promise<RefreshToken | null>
async deleteRefreshToken(token: string): Promise<void>
async deleteAllUserRefreshTokens(userId: string): Promise<void>
async updateLastLogin(userId: string): Promise<void>
```

**Tasks:**
- [ ] Create `auth.repo.ts`
- [ ] Implement all repository functions

---

### Step 2.4: Auth Schemas

**File:** `server/src/modules/auth/auth.schemas.ts`

```typescript
export const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(1).max(100).optional(),
  lastName: z.string().min(1).max(100).optional(),
});

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const RefreshTokenSchema = z.object({
  refreshToken: z.string().min(1),
});
```

**Tasks:**
- [ ] Create `auth.schemas.ts`

---

### Step 2.5: Auth Controller

**File:** `server/src/modules/auth/auth.controller.ts`

**Handlers:**
```typescript
async register(request, reply)    // POST /auth/register
async login(request, reply)       // POST /auth/login
async refreshToken(request, reply) // POST /auth/refresh
async logout(request, reply)      // POST /auth/logout
async me(request, reply)          // GET /auth/me (protected)
```

**Tasks:**
- [ ] Create `auth.controller.ts`
- [ ] Use shared response helpers

---

### Step 2.6: Auth Routes

**File:** `server/src/modules/auth/auth.routes.ts`

**Endpoints:**
```
POST /api/v1/auth/register   - Register new user
POST /api/v1/auth/login      - Login user
POST /api/v1/auth/refresh    - Refresh access token
POST /api/v1/auth/logout     - Logout user
GET  /api/v1/auth/me         - Get current user (protected)
```

**Tasks:**
- [ ] Create `auth.routes.ts`
- [ ] Register routes in app

---

### Step 2.7: Auth Middleware

**File:** `server/src/middlewares/auth.middleware.ts`

**Functions:**
```typescript
// Verify JWT and attach user to request
export async function authenticate(request, reply)

// Check if user has required role
export function requireRole(...roles: UserRole[])

// Optional auth - attach user if token present, but don't fail
export async function optionalAuth(request, reply)
```

**Tasks:**
- [ ] Create `auth.middleware.ts`
- [ ] Implement JWT verification
- [ ] Implement role checking

---

## Phase 3: Blog Module

### Step 3.1: Blog Types

**File:** `server/src/modules/blog/blog.types.ts`

Define TypeScript interfaces matching client expectations.

**Tasks:**
- [ ] Create `blog.types.ts` with all blog-related types

---

### Step 3.2: Blog Repository

**File:** `server/src/modules/blog/blog.repo.ts`

**Functions:**
```typescript
// Posts
async findPosts(params: PostQueryParams): Promise<{items: BlogPost[], totalItems: number}>
async findPostBySlug(slug: string): Promise<BlogPost | null>
async findPostById(id: string): Promise<BlogPost | null>
async createPost(data: CreatePostInput): Promise<BlogPost>
async updatePost(id: string, data: UpdatePostInput): Promise<BlogPost>
async deletePost(id: string): Promise<void>
async incrementViewCount(id: string): Promise<void>

// Categories
async findAllCategories(): Promise<BlogCategory[]>
async findCategoryById(id: string): Promise<BlogCategory | null>
async createCategory(data: CreateCategoryInput): Promise<BlogCategory>
async updateCategory(id: string, data: UpdateCategoryInput): Promise<BlogCategory>
async deleteCategory(id: string): Promise<void>

// Tags
async findAllTags(): Promise<BlogTag[]>
async findTagById(id: string): Promise<BlogTag | null>
async createTag(data: CreateTagInput): Promise<BlogTag>
async deleteTag(id: string): Promise<void>

// Reactions
async addReaction(postId: string, sessionId: string, type: ReactionType): Promise<void>
async removeReaction(postId: string, sessionId: string): Promise<void>
async getReactionCounts(postId: string): Promise<Record<ReactionType, number>>
```

**Tasks:**
- [ ] Create `blog.repo.ts`
- [ ] Implement all repository functions with proper includes/counts

---

### Step 3.3: Blog Service

**File:** `server/src/modules/blog/blog.service.ts`

**Functions:**
```typescript
// Posts
async getPosts(params): Promise<PaginatedResult<BlogPost>>
async getPostBySlug(slug: string): Promise<BlogPost>
async getPostById(id: string): Promise<BlogPost>
async createPost(data, authorId?): Promise<BlogPost>
async updatePost(id: string, data): Promise<BlogPost>
async deletePost(id: string): Promise<void>
async publishPost(id: string): Promise<BlogPost>
async unpublishPost(id: string): Promise<BlogPost>
async archivePost(id: string): Promise<BlogPost>

// Categories
async getCategories(): Promise<BlogCategory[]>
async createCategory(data): Promise<BlogCategory>
async updateCategory(id: string, data): Promise<BlogCategory>
async deleteCategory(id: string): Promise<void>

// Tags
async getTags(): Promise<BlogTag[]>
async createTag(data): Promise<BlogTag>
async deleteTag(id: string): Promise<void>

// Reactions
async addReaction(postId: string, sessionId: string, type: ReactionType): Promise<{action: string}>
async removeReaction(postId: string, sessionId: string): Promise<void>
```

**Tasks:**
- [ ] Create `blog.service.ts`
- [ ] Implement business logic with proper error handling

---

### Step 3.4: Blog Schemas

**File:** `server/src/modules/blog/blog.schemas.ts`

```typescript
// Query params
export const GetPostsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  category_id: z.string().uuid().optional(),
  tag_slug: z.string().optional(),
  search: z.string().optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
});

// Create/Update
export const CreatePostSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(1),
  excerpt: z.string().optional(),
  featured_image: z.string().url().optional(),
  images: z.array(z.string().url()).optional(),
  category_id: z.string().uuid().optional().nullable(),
  tag_ids: z.array(z.string().uuid()).optional(),
  author_name: z.string().min(1),
  author_bio: z.string().optional(),
  author_avatar: z.string().url().optional(),
  reading_time: z.number().int().positive().optional(),
});

export const UpdatePostSchema = CreatePostSchema.partial();

export const CreateCategorySchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
});

export const CreateTagSchema = z.object({
  name: z.string().min(1).max(50),
});

export const AddReactionSchema = z.object({
  type: z.enum(['LIKE', 'LOVE', 'HELPFUL']),
  session_id: z.string().min(1),
});
```

**Tasks:**
- [ ] Create `blog.schemas.ts`

---

### Step 3.5: Blog Controller

**File:** `server/src/modules/blog/blog.controller.ts`

**Handlers:**
```typescript
// Public
async getPosts(request, reply)           // GET /blog
async getPostBySlug(request, reply)      // GET /blog/slug/:slug
async getCategories(request, reply)      // GET /blog/categories
async getTags(request, reply)            // GET /blog/tags
async addReaction(request, reply)        // POST /blog/:postId/reactions
async removeReaction(request, reply)     // DELETE /blog/:postId/reactions

// Admin
async getAdminPosts(request, reply)      // GET /blog/admin/posts
async getAdminPostById(request, reply)   // GET /blog/admin/posts/:id
async createPost(request, reply)         // POST /blog/admin/posts
async updatePost(request, reply)         // PATCH /blog/admin/posts/:id
async deletePost(request, reply)         // DELETE /blog/admin/posts/:id
async publishPost(request, reply)        // POST /blog/admin/posts/:id/publish
async unpublishPost(request, reply)      // POST /blog/admin/posts/:id/unpublish
async archivePost(request, reply)        // POST /blog/admin/posts/:id/archive
async createCategory(request, reply)     // POST /blog/admin/categories
async updateCategory(request, reply)     // PATCH /blog/admin/categories/:id
async deleteCategory(request, reply)     // DELETE /blog/admin/categories/:id
async createTag(request, reply)          // POST /blog/admin/tags
async deleteTag(request, reply)          // DELETE /blog/admin/tags/:id
```

**Tasks:**
- [ ] Create `blog.controller.ts`

---

### Step 3.6: Blog Routes

**File:** `server/src/modules/blog/blog.routes.ts`

**Public Endpoints:**
```
GET    /api/v1/blog                           - Get paginated posts
GET    /api/v1/blog/slug/:slug                - Get post by slug
GET    /api/v1/blog/categories                - Get all categories
GET    /api/v1/blog/tags                      - Get all tags
POST   /api/v1/blog/:postId/reactions         - Add reaction
DELETE /api/v1/blog/:postId/reactions         - Remove reaction
```

**Admin Endpoints (Protected - ADMIN role):**
```
GET    /api/v1/blog/admin/posts               - List all posts
GET    /api/v1/blog/admin/posts/:id           - Get post by ID
POST   /api/v1/blog/admin/posts               - Create post
PATCH  /api/v1/blog/admin/posts/:id           - Update post
DELETE /api/v1/blog/admin/posts/:id           - Delete post
POST   /api/v1/blog/admin/posts/:id/publish   - Publish post
POST   /api/v1/blog/admin/posts/:id/unpublish - Unpublish post
POST   /api/v1/blog/admin/posts/:id/archive   - Archive post
POST   /api/v1/blog/admin/categories          - Create category
PATCH  /api/v1/blog/admin/categories/:id      - Update category
DELETE /api/v1/blog/admin/categories/:id      - Delete category
POST   /api/v1/blog/admin/tags                - Create tag
DELETE /api/v1/blog/admin/tags/:id            - Delete tag
```

**Tasks:**
- [ ] Create `blog.routes.ts`
- [ ] Apply auth middleware to admin routes
- [ ] Register routes in app

---

## Phase 4: Orders Module

### Step 4.1: Orders Types

**File:** `server/src/modules/orders/order.types.ts`

**Tasks:**
- [ ] Create order-related TypeScript types

---

### Step 4.2: Orders Repository

**File:** `server/src/modules/orders/order.repo.ts`

**Functions:**
```typescript
async findOrders(params): Promise<{items: Order[], totalItems: number}>
async findOrderById(id: string): Promise<Order | null>
async findOrderByTrackingCode(code: string): Promise<Order | null>
async createOrder(data): Promise<Order>
async updateOrder(id: string, data): Promise<Order>
async deleteOrder(id: string): Promise<void>
async addStatusHistory(orderId: string, data): Promise<OrderStatusHistory>
async generateOrderNumber(): Promise<string>
async generateTrackingCode(): Promise<string>
```

**Tasks:**
- [ ] Create `order.repo.ts`

---

### Step 4.3: Orders Service

**File:** `server/src/modules/orders/order.service.ts`

**Functions:**
```typescript
async getOrders(params): Promise<PaginatedResult<Order>>
async getOrderById(id: string): Promise<Order>
async trackOrder(trackingCode: string): Promise<Order>
async createOrder(data): Promise<Order>
async updateOrder(id: string, data): Promise<Order>
async updateOrderStatus(id: string, statusData): Promise<Order>
async deleteOrder(id: string): Promise<void>
```

**Tasks:**
- [ ] Create `order.service.ts`

---

### Step 4.4: Orders Schemas

**File:** `server/src/modules/orders/order.schemas.ts`

```typescript
export const GetOrdersQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  status: z.enum(['WON', 'PAID', 'SHIPPING', 'PORT', 'DELIVERED']).optional(),
  search: z.string().optional(),
});

export const CreateOrderSchema = z.object({
  car_make: z.string().min(1),
  car_model: z.string().min(1),
  car_year: z.number().int().min(1900).max(2100),
  car_vin: z.string().optional(),
  car_color: z.string().optional(),
  car_image: z.string().url().optional(),
  auction_price: z.number().positive().optional(),
  shipping_cost: z.number().positive().optional(),
  total_price: z.number().positive().optional(),
  customer_name: z.string().min(1),
  customer_phone: z.string().optional(),
  customer_email: z.string().email().optional(),
  auction_source: z.string().optional(),
  lot_number: z.string().optional(),
  origin_port: z.string().optional(),
  destination_port: z.string().optional(),
  vessel_name: z.string().optional(),
  estimated_arrival: z.string().datetime().optional(),
});

export const UpdateOrderStatusSchema = z.object({
  status: z.enum(['WON', 'PAID', 'SHIPPING', 'PORT', 'DELIVERED']),
  note: z.string().optional(),
  location: z.string().optional(),
  changed_by: z.string().optional(),
});
```

**Tasks:**
- [ ] Create `order.schemas.ts`

---

### Step 4.5: Orders Controller

**File:** `server/src/modules/orders/order.controller.ts`

**Handlers:**
```typescript
// Public
async trackOrder(request, reply)         // GET /orders/track/:code

// Admin
async getOrders(request, reply)          // GET /orders/admin/orders
async getOrderById(request, reply)       // GET /orders/admin/orders/:id
async createOrder(request, reply)        // POST /orders/admin/orders
async updateOrder(request, reply)        // PATCH /orders/admin/orders/:id
async updateOrderStatus(request, reply)  // PATCH /orders/admin/orders/:id/status
async deleteOrder(request, reply)        // DELETE /orders/admin/orders/:id
```

**Tasks:**
- [ ] Create `order.controller.ts`

---

### Step 4.6: Orders Routes

**File:** `server/src/modules/orders/order.routes.ts`

**Public Endpoints:**
```
GET /api/v1/orders/track/:code           - Track order by code
```

**Admin Endpoints (Protected - ADMIN role):**
```
GET    /api/v1/orders/admin/orders            - List orders
GET    /api/v1/orders/admin/orders/:id        - Get order by ID
POST   /api/v1/orders/admin/orders            - Create order
PATCH  /api/v1/orders/admin/orders/:id        - Update order
PATCH  /api/v1/orders/admin/orders/:id/status - Update status
DELETE /api/v1/orders/admin/orders/:id        - Delete order
```

**Tasks:**
- [ ] Create `order.routes.ts`
- [ ] Apply auth middleware to admin routes
- [ ] Register routes in app

---

## Phase 5: Reviews Module

### Step 5.1: Reviews Types

**File:** `server/src/modules/reviews/review.types.ts`

**Tasks:**
- [ ] Create review-related TypeScript types

---

### Step 5.2: Reviews Repository

**File:** `server/src/modules/reviews/review.repo.ts`

**Functions:**
```typescript
// Reviews
async findReviews(params): Promise<{items: Review[], totalItems: number}>
async findReviewById(id: string): Promise<Review | null>
async createReview(data): Promise<Review>
async updateReview(id: string, data): Promise<Review>
async deleteReview(id: string): Promise<void>
async getAggregateRating(): Promise<{averageRating: number, totalReviews: number}>

// Completed Deals
async findDeals(params): Promise<{items: CompletedDeal[], totalItems: number}>
async findDealById(id: string): Promise<CompletedDeal | null>
async createDeal(data): Promise<CompletedDeal>
async updateDeal(id: string, data): Promise<CompletedDeal>
async deleteDeal(id: string): Promise<void>
```

**Tasks:**
- [ ] Create `review.repo.ts`

---

### Step 5.3: Reviews Service

**File:** `server/src/modules/reviews/review.service.ts`

**Functions:**
```typescript
// Reviews
async getReviews(params): Promise<PaginatedResult<Review>>
async getReviewById(id: string): Promise<Review>
async createReview(data): Promise<Review>
async updateReview(id: string, data): Promise<Review>
async deleteReview(id: string): Promise<void>
async getAggregateRating(): Promise<AggregateRating>

// Completed Deals
async getDeals(params): Promise<PaginatedResult<CompletedDeal>>
async getDealById(id: string): Promise<CompletedDeal>
async createDeal(data): Promise<CompletedDeal>
async updateDeal(id: string, data): Promise<CompletedDeal>
async deleteDeal(id: string): Promise<void>
```

**Tasks:**
- [ ] Create `review.service.ts`

---

### Step 5.4: Reviews Schemas

**File:** `server/src/modules/reviews/review.schemas.ts`

```typescript
export const GetReviewsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  rating: z.coerce.number().int().min(1).max(5).optional(),
  is_verified: z.enum(['true', 'false']).transform(v => v === 'true').optional(),
});

export const CreateReviewSchema = z.object({
  customer_name: z.string().min(1),
  customer_city: z.string().optional(),
  customer_avatar: z.string().url().optional(),
  rating: z.number().int().min(1).max(5),
  text: z.string().min(1),
  car_make: z.string().optional(),
  car_model: z.string().optional(),
  car_year: z.number().int().min(1900).max(2100).optional(),
  is_verified: z.boolean().optional().default(false),
  is_published: z.boolean().optional().default(true),
  photos: z.array(z.object({
    url: z.string().url(),
    alt_text: z.string().optional(),
    sort_order: z.number().int().optional().default(0),
  })).optional(),
});

export const CreateDealSchema = z.object({
  car_make: z.string().min(1),
  car_model: z.string().min(1),
  car_year: z.number().int().min(1900).max(2100),
  car_vin: z.string().optional(),
  auction_price: z.number().positive(),
  market_price: z.number().positive(),
  savings: z.number(),
  delivery_city: z.string().optional(),
  description: z.string().optional(),
  is_published: z.boolean().optional().default(true),
  photos: z.array(z.object({
    url: z.string().url(),
    alt_text: z.string().optional(),
    photo_type: z.enum(['BEFORE', 'AFTER']).default('AFTER'),
    sort_order: z.number().int().optional().default(0),
  })).optional(),
});
```

**Tasks:**
- [ ] Create `review.schemas.ts`

---

### Step 5.5: Reviews Controller

**File:** `server/src/modules/reviews/review.controller.ts`

**Handlers:**
```typescript
// Public
async getReviews(request, reply)         // GET /reviews
async getAggregateRating(request, reply) // GET /reviews/aggregate
async getDeals(request, reply)           // GET /reviews/deals

// Admin
async getAdminReviews(request, reply)    // GET /reviews/admin/reviews
async getReviewById(request, reply)      // GET /reviews/admin/reviews/:id
async createReview(request, reply)       // POST /reviews/admin/reviews
async updateReview(request, reply)       // PATCH /reviews/admin/reviews/:id
async deleteReview(request, reply)       // DELETE /reviews/admin/reviews/:id
async getAdminDeals(request, reply)      // GET /reviews/admin/deals
async getDealById(request, reply)        // GET /reviews/admin/deals/:id
async createDeal(request, reply)         // POST /reviews/admin/deals
async updateDeal(request, reply)         // PATCH /reviews/admin/deals/:id
async deleteDeal(request, reply)         // DELETE /reviews/admin/deals/:id
```

**Tasks:**
- [ ] Create `review.controller.ts`

---

### Step 5.6: Reviews Routes

**File:** `server/src/modules/reviews/review.routes.ts`

**Public Endpoints:**
```
GET /api/v1/reviews                      - Get reviews list
GET /api/v1/reviews/aggregate            - Get aggregate rating
GET /api/v1/reviews/deals                - Get completed deals
```

**Admin Endpoints (Protected - ADMIN role):**
```
GET    /api/v1/reviews/admin/reviews          - List reviews (admin)
GET    /api/v1/reviews/admin/reviews/:id      - Get review by ID
POST   /api/v1/reviews/admin/reviews          - Create review
PATCH  /api/v1/reviews/admin/reviews/:id      - Update review
DELETE /api/v1/reviews/admin/reviews/:id      - Delete review
GET    /api/v1/reviews/admin/deals            - List deals (admin)
GET    /api/v1/reviews/admin/deals/:id        - Get deal by ID
POST   /api/v1/reviews/admin/deals            - Create deal
PATCH  /api/v1/reviews/admin/deals/:id        - Update deal
DELETE /api/v1/reviews/admin/deals/:id        - Delete deal
```

**Tasks:**
- [ ] Create `review.routes.ts`
- [ ] Apply auth middleware to admin routes
- [ ] Register routes in app

---

## Phase 6: Health Check & Final Setup

### Step 6.1: Health Module

**File:** `server/src/modules/health/health.routes.ts`

**Endpoints:**
```
GET /api/v1/health                       - Basic health check
GET /api/v1/health/ready                 - Readiness (DB + Redis)
```

**Tasks:**
- [ ] Implement health check endpoints
- [ ] Check database connectivity
- [ ] Check Redis connectivity

---

### Step 6.2: CORS Configuration

**File:** `server/src/config/cors.ts`

```typescript
export const CORS_CONFIG = {
  origin: ['http://localhost:3000'],  // Next.js dev server
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
```

**Tasks:**
- [ ] Configure CORS in Fastify
- [ ] Allow credentials for cookie-based auth

---

### Step 6.3: Rate Limiting

**File:** `server/src/middlewares/rate-limit.ts`

**Rules:**
- Public endpoints: 100 requests/minute
- Auth endpoints: 10 requests/minute
- Admin endpoints: 200 requests/minute

**Tasks:**
- [ ] Configure rate limiting with @fastify/rate-limit
- [ ] Use Redis as store

---

### Step 6.4: Route Registration

**File:** `server/src/app.ts`

```typescript
// Register all route modules
app.register(authRoutes, { prefix: '/api/v1/auth' });
app.register(blogRoutes, { prefix: '/api/v1/blog' });
app.register(orderRoutes, { prefix: '/api/v1/orders' });
app.register(reviewRoutes, { prefix: '/api/v1/reviews' });
app.register(healthRoutes, { prefix: '/api/v1/health' });
```

**Tasks:**
- [ ] Register all route modules
- [ ] Apply global middleware
- [ ] Configure error handler

---

### Step 6.5: Seed Data

**File:** `server/prisma/seed.ts`

Create comprehensive seed data for testing:

**Tasks:**
- [ ] Create admin user (email: admin@aml.ge, password: Admin123!)
- [ ] Create sample blog categories (3-5 categories)
- [ ] Create sample blog tags (5-10 tags)
- [ ] Create sample blog posts (5-10 posts with various statuses)
- [ ] Create sample orders (5-10 orders with status history)
- [ ] Create sample reviews (10-15 reviews with photos)
- [ ] Create sample completed deals (5-10 deals with photos)

---

## Phase 7: Testing & Documentation

### Step 7.1: API Documentation

**Tasks:**
- [ ] Add Swagger/OpenAPI documentation using @fastify/swagger
- [ ] Document all endpoints with request/response schemas

---

### Step 7.2: Integration Tests

**Tasks:**
- [ ] Write tests for auth endpoints
- [ ] Write tests for blog endpoints
- [ ] Write tests for orders endpoints
- [ ] Write tests for reviews endpoints

---

## Summary: Implementation Order

| Order | Phase | Module | Estimated Complexity |
|-------|-------|--------|---------------------|
| 1 | Phase 1.1 | Database Schema | Medium |
| 2 | Phase 1.2-1.5 | Shared Utilities | Low |
| 3 | Phase 2 | Authentication | High |
| 4 | Phase 3 | Blog Module | High |
| 5 | Phase 4 | Orders Module | Medium |
| 6 | Phase 5 | Reviews Module | Medium |
| 7 | Phase 6 | Health & Config | Low |
| 8 | Phase 7 | Testing & Docs | Medium |

---

## Files to Create/Modify

### New Files

```
server/
├── src/
│   ├── config/
│   │   ├── auth.ts
│   │   └── cors.ts
│   ├── libs/
│   │   ├── response.ts          (update)
│   │   ├── errors.ts            (update)
│   │   ├── pagination.ts        (new)
│   │   └── validation.ts        (new)
│   ├── middlewares/
│   │   ├── auth.middleware.ts   (new)
│   │   ├── error-handler.ts     (update)
│   │   └── rate-limit.ts        (new)
│   └── modules/
│       ├── auth/
│       │   ├── index.ts
│       │   ├── auth.controller.ts
│       │   ├── auth.routes.ts
│       │   ├── auth.service.ts
│       │   ├── auth.repo.ts
│       │   ├── auth.schemas.ts
│       │   └── auth.types.ts
│       ├── blog/
│       │   ├── index.ts
│       │   ├── blog.controller.ts
│       │   ├── blog.routes.ts
│       │   ├── blog.service.ts
│       │   ├── blog.repo.ts
│       │   ├── blog.schemas.ts
│       │   └── blog.types.ts
│       ├── orders/
│       │   ├── index.ts
│       │   ├── order.controller.ts
│       │   ├── order.routes.ts
│       │   ├── order.service.ts
│       │   ├── order.repo.ts
│       │   ├── order.schemas.ts
│       │   └── order.types.ts
│       ├── reviews/
│       │   ├── index.ts
│       │   ├── review.controller.ts
│       │   ├── review.routes.ts
│       │   ├── review.service.ts
│       │   ├── review.repo.ts
│       │   ├── review.schemas.ts
│       │   └── review.types.ts
│       └── health/
│           ├── index.ts
│           └── health.routes.ts
├── prisma/
│   ├── schema.prisma            (update)
│   └── seed.ts                  (update)
└── .env                         (update - add JWT_SECRET)
```

---

## Environment Variables Required

```env
# Add to server/.env
JWT_SECRET=your-super-secret-jwt-key-at-least-32-chars
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d
```

---

## API Response Format Reference

### Success Response
```json
{
  "success": true,
  "message": "Resource retrieved successfully",
  "data": { /* resource */ }
}
```

### Paginated Response
```json
{
  "success": true,
  "message": "Resources retrieved successfully",
  "data": {
    "items": [ /* array of resources */ ],
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
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "The requested resource was not found"
  }
}
```

---

## Ready for Review

This plan covers all the server-side APIs needed to support the AML client application. After your review, we can proceed with implementation phase by phase.

**Key decisions made:**
1. No email verification for auth (as requested)
2. Session-based reactions for blog (anonymous users)
3. Admin-only access for create/update/delete operations
4. Public read access for blog, reviews, and order tracking
5. Comprehensive seed data for testing

Please review and let me know when you're ready to proceed with implementation.
