# Core Development Rules

> **This is the only file that loads automatically.**
> Detailed guides are in `.claude/docs/` - request explicitly when needed.

---

## 1. Project Structure

### Server (Fastify + Prisma + MySQL)
```
src/
├── app.ts                 # Fastify instance
├── server.ts              # Bootstrap (listen only)
├── config/                # env, constants
├── libs/                  # prisma, redis, logger, auth
├── shared/
│   ├── errors/            # AppError classes
│   ├── helpers/           # response, pagination
│   └── schemas/           # shared Zod schemas
├── modules/<domain>/
│   ├── <domain>.routes.ts
│   ├── <domain>.controller.ts
│   ├── <domain>.service.ts
│   ├── <domain>.repo.ts
│   ├── <domain>.schemas.ts
│   └── <domain>.types.ts
└── plugins/               # auth, rate-limit, cors
```

### Client (React + Vite + TanStack Query)
```
src/
├── components/
│   ├── ui/                # shadcn/ui primitives
│   ├── common/            # LoadingSpinner, ErrorMessage, etc.
│   └── layout/            # Header, Footer, Sidebar
├── features/<feature>/
│   ├── components/
│   ├── hooks/
│   ├── services/
│   ├── types/
│   └── schemas/
├── hooks/                 # Global hooks
├── lib/                   # utils, api config, constants
├── store/                 # Redux/Zustand
└── types/                 # Global types
```

---

## 2. Layered Architecture (Server)

```
Request → Routes → Controller → Service → Repository → Database
```

| Layer | Can Call | Returns |
|-------|----------|---------|
| Controller | Service only | `reply.send(successResponse(...))` |
| Service | Repo, other Services | Data or throws AppError |
| Repository | Prisma only | Raw data |

**CRITICAL:**
- Controllers: NO business logic, NO direct Prisma calls
- Services: NO Fastify objects (request/reply), HTTP-agnostic
- Repos: NO business logic, only database queries

---

## 3. Response Format (MANDATORY)

### Success
```json
{ "success": true, "message": "string", "data": {} }
```

### Error
```json
{ "success": false, "error": { "code": "ERROR_CODE", "message": "string" } }
```

### Pagination
```json
{
  "success": true,
  "message": "string",
  "data": {
    "items": [],
    "pagination": {
      "page": 1, "limit": 10,
      "totalItems": 100, "totalPages": 10,
      "hasNextPage": true, "hasPreviousPage": false
    }
  }
}
```

**Always use helpers:** `successResponse()`, `paginatedResponse()`
**Never:** `reply.send(data)`, `reply.send({ error: "..." })`

---

## 4. Error Handling

### Throw Typed Errors Only
```typescript
throw new NotFoundError('TOUR_NOT_FOUND', 'Tour does not exist');
throw new BadRequestError('INVALID_DATE', 'Date cannot be in the past');
throw new UnauthorizedError('TOKEN_EXPIRED', 'Access token has expired');
throw new ForbiddenError('NO_PERMISSION', 'Cannot modify this resource');
```

**Never:** `throw new Error("message")`, `throw "string"`

### Error Classes
- `BadRequestError` (400)
- `ValidationError` (400)
- `UnauthorizedError` (401)
- `ForbiddenError` (403)
- `NotFoundError` (404)
- `ConflictError` (409)
- `InternalError` (500)

---

## 5. Database (Prisma)

### Development
```bash
npm run prisma:migrate dev --name description   # Create migration
npm run prisma:reset                             # Reset DB + rerun migrations
npm run prisma:seed                              # Seed data
```

### Production
```bash
npm run prisma:migrate deploy   # Apply migrations (ONLY this!)
```

**NEVER in production:** `prisma:reset`, `db push`

### Naming
- Tables: `snake_case` plural (`tour_locations`)
- Columns: `snake_case` (`created_at`, `user_id`)
- Models: `PascalCase` singular (`TourLocation`)

---

## 6. TypeScript Rules

- **Strict mode:** Always enabled
- **No `any`:** Use `unknown` or proper types
- **Explicit returns:** On public functions
- **Zod:** For all input validation

```typescript
// ✅ Good
async function createTour(dto: CreateTourDto): Promise<Tour>

// ❌ Bad
async function createTour(dto: any)
```

---

## 7. Client State Management

| State Type | Tool |
|------------|------|
| Server data | TanStack Query |
| Global client | Redux/Zustand |
| Forms | React Hook Form + Zod |
| URL | useSearchParams |
| Local | useState |

---

## 8. File Naming

| Type | Pattern | Example |
|------|---------|---------|
| Component | PascalCase | `TourCard.tsx` |
| Hook | camelCase + use | `useTours.ts` |
| Service | camelCase.service | `tour.service.ts` |
| Types | camelCase.types | `tour.types.ts` |
| Schema | camelCase.schemas | `tour.schemas.ts` |

---

## 9. Git Commits

Format: `<type>(<scope>): <subject>`

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

Examples:
```
feat(tours): add search by location
fix(auth): resolve token refresh loop
refactor(api): extract validation middleware
```

---

## 10. Security Essentials

- **Never expose:** API keys, tokens, stack traces, SQL errors
- **Always validate:** All inputs with Zod
- **Never interpolate:** Raw values into SQL
- **Token storage:** httpOnly cookies preferred, or memory
- **External links:** Always `rel="noopener noreferrer"`

---

## 📚 Detailed Guides (Request When Needed)

**Client:**
- Component patterns → `.claude/docs/client-rules/02-component-patterns.md`
- State management → `.claude/docs/client-rules/04-state-management.md`
- API integration → `.claude/docs/client-rules/05-api-integration.md`
- Forms & validation → `.claude/docs/client-rules/06-forms-validation.md`
- Color system → `.claude/docs/client/color-system.md`
- Security → `.claude/docs/client/security-rules.md`

**Server:**
- Architecture → `.claude/docs/server-rules/01-architecture.md`
- Database & migrations → `.claude/docs/server-rules/02-database-and-migrations.md`
- Response handling → `.claude/docs/server-rules/03-response-handling.md`
- Pagination → `.claude/docs/server-rules/04-pagination.md`
- PM2 & deployment → `.claude/docs/server/pm2-guide.md`

**Global:**
- Git conventions → `.claude/docs/global-rules/git-conventions.md`
- Testing → `.claude/docs/global-rules/testing-conventions.md`
- AI edit safety → `.claude/docs/global-rules/ai-edit-safety.md`
