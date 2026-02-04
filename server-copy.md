# Server Architecture Setup Plan for AML

## Overview
Replicate the production-grade Fastify + Prisma + MySQL server architecture from AtlasCaucasus-next into the AML project's empty server directory.

---

## Tech Stack

| Category | Technology | Version |
|----------|------------|---------|
| **Runtime** | Node.js | 20 (Alpine) |
| **Framework** | Fastify | ^5.2.1 |
| **Language** | TypeScript | ^5.7.2 |
| **ORM** | Prisma | ^6.19.1 |
| **Database** | MySQL | 8.0 |
| **Cache** | Redis | 7 (Alpine) |
| **Process Manager** | PM2 | ^6.0.14 |
| **Validation** | Zod | ^3.24.1 |

---

## Directory Structure to Create

```
server/
├── src/
│   ├── app.ts                    # Fastify app factory
│   ├── server.ts                 # Bootstrap & startup
│   │
│   ├── config/
│   │   ├── env.ts                # Zod-validated env vars
│   │   └── rateLimit.ts          # Rate limit configs
│   │
│   ├── libs/
│   │   ├── prisma.ts             # Prisma singleton
│   │   ├── redis.ts              # Redis client setup
│   │   ├── logger.ts             # Pino logger
│   │   ├── errors.ts             # AppError classes
│   │   ├── response.ts           # Response helpers
│   │   ├── pagination.ts         # Pagination utilities
│   │   ├── validation.ts         # Shared Zod schemas
│   │   ├── authorization.ts      # Role checks
│   │   └── file-upload.ts        # File upload utils
│   │
│   ├── middlewares/
│   │   ├── authGuard.ts          # JWT verification
│   │   ├── requireVerifiedEmail.ts
│   │   └── requestLogger.ts
│   │
│   ├── modules/
│   │   └── health/               # Example module
│   │       ├── health.routes.ts
│   │       └── health.controller.ts
│   │
│   ├── jobs/
│   │   └── scheduler.ts          # Background job setup
│   │
│   ├── scripts/
│   │   └── db/
│   │       └── seed.ts           # Empty seed template
│   │
│   └── public/
│       └── .gitkeep
│
├── prisma/
│   ├── schema.prisma             # Empty starter schema
│   └── seed.ts                   # Seed entry point
│
├── uploads/                      # .gitkeep only
├── logs/                         # .gitkeep only
│
├── Dockerfile
├── docker-compose.yml
├── ecosystem.config.cjs
├── package.json
├── tsconfig.json
├── .env.example
└── .gitignore
```

---

## Implementation Steps

### Step 1: Initialize Package & Dependencies
Create `package.json` with all required dependencies:

**Dependencies:**
- `fastify`, `@fastify/cors`, `@fastify/cookie`, `@fastify/csrf-protection`
- `@fastify/helmet`, `@fastify/static`, `@fastify/multipart`
- `@fastify/rate-limit`, `@fastify/websocket`
- `@prisma/client`, `prisma`
- `redis`
- `zod`
- `jsonwebtoken`, `argon2`
- `pino`, `pino-pretty`
- `node-cron`
- `uuid`, `file-type`
- `dotenv`

**Dev Dependencies:**
- `typescript`, `@types/node`, `tsx`
- `pm2`

**Scripts:**
- `dev`: `tsx watch src/server.ts`
- `build`: `tsc`
- `start`: `node dist/server.js`
- `db:up`, `db:down`, `db:logs`
- `prisma:generate`, `prisma:migrate`, `prisma:studio`, `prisma:seed`, `prisma:reset`
- `pm2:start`, `pm2:stop`, `pm2:restart`, `pm2:logs`, `pm2:monit`

---

### Step 2: TypeScript Configuration
Create `tsconfig.json`:
- Target: ES2022
- Module: NodeNext
- Strict mode enabled
- ES module resolution
- Output to `dist/`

---

### Step 3: Docker Setup
Create `docker-compose.yml`:

```yaml
name: aml  # <-- This creates the Docker group name shown in Docker Desktop

services:
  mysql:
    container_name: aml-mysql
    image: mysql:8.0
    ports: "3307:3306"
    volume: mysql_data
    healthcheck: mysqladmin ping

  phpmyadmin:
    container_name: aml-phpmyadmin
    image: phpmyadmin/phpmyadmin:latest
    ports: "8082:80"
    depends_on: mysql (healthy)

  redis:
    container_name: aml-redis
    image: redis:7-alpine
    ports: "6380:6379"
    volume: redis_data
    healthcheck: redis-cli ping

  redis-commander:
    container_name: aml-redis-ui
    image: rediscommander/redis-commander:latest
    ports: "8083:8081"
    depends_on: redis (healthy)

  app:  # Optional - for production deployment
    container_name: aml-api
    build: .
    ports: "8000:8000"
    depends_on: mysql, redis (healthy)

volumes:
  mysql_data:
  redis_data:
```

Create `Dockerfile`:
- Multi-stage build
- Node 20 Alpine
- Non-root user
- Health check on `/api/v1/health`
- PM2 runtime

---

### Step 4: Environment Configuration
Create `.env.example`:
```env
NODE_ENV=development
PORT=8000
DATABASE_URL=mysql://root:root@localhost:3307/aml_db
ACCESS_TOKEN_SECRET=your-32-char-secret-here
REFRESH_TOKEN_SECRET=your-32-char-secret-here
ACCESS_TOKEN_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:3000
CORS_ORIGINS=http://localhost:3000
REDIS_HOST=localhost
REDIS_PORT=6380
REDIS_PASSWORD=
MAX_FILE_SIZE=5242880
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/webp,image/gif
UPLOAD_DIR=uploads
STATIC_URL_PREFIX=/uploads
```

Create `config/env.ts` with Zod validation schema.

---

### Step 5: Core Libraries
Create in `src/libs/`:

1. **prisma.ts** - Singleton pattern, dev global reference
2. **redis.ts** - Main client + pub/sub client, graceful degradation
3. **logger.ts** - Pino with pretty-print for dev, JSON for prod
4. **errors.ts** - AppError hierarchy:
   - BadRequestError (400)
   - ValidationError (400)
   - UnauthorizedError (401)
   - ForbiddenError (403)
   - NotFoundError (404)
   - ConflictError (409)
   - RateLimitError (429)
   - InternalError (500)
5. **response.ts** - `successResponse()`, `paginatedResponse()`, `errorResponse()`
6. **pagination.ts** - Pagination types and helpers
7. **validation.ts** - Common Zod schemas (email, password, uuid, pagination)
8. **authorization.ts** - Role check utilities
9. **file-upload.ts** - File handling utilities

---

### Step 6: Middlewares
Create in `src/middlewares/`:

1. **authGuard.ts** - JWT verification, attach user to request
2. **requireVerifiedEmail.ts** - Check emailVerified flag
3. **requestLogger.ts** - Log incoming requests

---

### Step 7: Fastify App Setup
Create `src/app.ts`:
- Register plugins in order:
  1. @fastify/cors
  2. @fastify/cookie
  3. @fastify/csrf-protection
  4. @fastify/helmet
  5. @fastify/static
  6. @fastify/multipart
  7. @fastify/rate-limit
  8. @fastify/websocket
- Global error handler
- Route registration with `/api/v1` prefix

---

### Step 8: Server Bootstrap
Create `src/server.ts`:
- Load dotenv
- Build Fastify app
- Test DB connection
- Connect to Redis
- Start server
- Signal PM2 ready
- Start background jobs
- Graceful shutdown handlers

---

### Step 9: Health Module (Example)
Create `src/modules/health/`:
- `health.routes.ts` - Register GET `/api/v1/health`
- `health.controller.ts` - Return success response with uptime

---

### Step 10: PM2 Configuration
Create `ecosystem.config.cjs`:
- Cluster mode (all CPU cores)
- Log configuration
- Graceful shutdown settings
- Memory restart threshold

---

### Step 11: Prisma Setup
Create `prisma/schema.prisma`:
- MySQL datasource
- Generator configuration
- Empty models placeholder (User model as starter)

Create `prisma/seed.ts`:
- Empty seed template

---

### Step 12: Git Configuration
Create `.gitignore`:
- node_modules/
- dist/
- .env
- uploads/*
- logs/*
- *.log

---

## Files to Create (Summary)

| File | Purpose |
|------|---------|
| `package.json` | Dependencies & scripts |
| `tsconfig.json` | TypeScript config |
| `docker-compose.yml` | Dev environment |
| `Dockerfile` | Production build |
| `ecosystem.config.cjs` | PM2 config |
| `.env.example` | Environment template |
| `.gitignore` | Git ignore rules |
| `src/app.ts` | Fastify app factory |
| `src/server.ts` | Bootstrap & startup |
| `src/config/env.ts` | Env validation |
| `src/config/rateLimit.ts` | Rate limit config |
| `src/libs/prisma.ts` | DB singleton |
| `src/libs/redis.ts` | Redis clients |
| `src/libs/logger.ts` | Logging |
| `src/libs/errors.ts` | Error classes |
| `src/libs/response.ts` | Response helpers |
| `src/libs/pagination.ts` | Pagination |
| `src/libs/validation.ts` | Zod schemas |
| `src/libs/authorization.ts` | Auth utilities |
| `src/libs/file-upload.ts` | File handling |
| `src/middlewares/authGuard.ts` | JWT middleware |
| `src/middlewares/requireVerifiedEmail.ts` | Email check |
| `src/middlewares/requestLogger.ts` | Request logging |
| `src/modules/health/health.routes.ts` | Health routes |
| `src/modules/health/health.controller.ts` | Health handler |
| `src/jobs/scheduler.ts` | Job scheduler |
| `src/scripts/db/seed.ts` | Seed script |
| `prisma/schema.prisma` | DB schema |
| `prisma/seed.ts` | Seed entry |

---

## Verification

After implementation:
1. Run `npm install` - Should complete without errors
2. Run `npm run db:up` - Docker containers start
3. Run `npm run prisma:generate` - Prisma client generated
4. Run `npm run prisma:migrate dev --name init` - Initial migration
5. Run `npm run dev` - Server starts on port 8000
6. Test `GET http://localhost:8000/api/v1/health` - Returns success response
7. Access phpMyAdmin at `http://localhost:8082`
8. Access Redis Commander at `http://localhost:8083`

---

## Notes

- This is a **clean slate** - no business data or schemas from AtlasCaucasus-next
- The health module serves as a template for future modules
- All environment variables have sensible defaults for development
- Docker ports are offset (3307, 6380, 8082, 8083) to avoid conflicts
- Authentication/authorization middleware is included but inactive until auth module is built
