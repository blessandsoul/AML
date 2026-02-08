# Create Client Project

You are scaffolding a new Next.js App Router + TypeScript client project. The project name is: **$ARGUMENTS**

If no project name is provided, ask the user for one before proceeding.

---

## Instructions

Create a complete, production-ready Next.js client project following the architecture and rules defined in `.claude/rules/client/`. Read those rules before generating any code.

### Step 1: Create Next.js Project

Run:
```bash
npx create-next-app@latest $ARGUMENTS --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --no-turbopack
```

Then install additional dependencies:
```bash
# State & Data
npm install @reduxjs/toolkit react-redux @tanstack/react-query axios

# Forms & Validation
npm install react-hook-form @hookform/resolvers zod

# UI
npm install sonner next-themes lucide-react class-variance-authority clsx tailwind-merge tailwindcss-animate

# Init shadcn/ui
npx shadcn@latest init
```

When initializing shadcn, select:
- Style: Default
- Base color: Slate
- CSS variables: Yes

Then install core shadcn components:
```bash
npx shadcn@latest add button card input label skeleton alert-dialog select table badge
```

---

### Step 2: Project Structure

Create the following directory structure under `src/`:

```
src/
├── app/
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Home page
│   ├── providers.tsx           # Client providers (Redux, React Query, Theme)
│   ├── globals.css             # Global styles with CSS variables
│   ├── loading.tsx             # Global loading
│   ├── error.tsx               # Global error boundary
│   ├── not-found.tsx           # 404 page
│   ├── (auth)/
│   │   ├── layout.tsx          # Auth layout (centered, minimal)
│   │   ├── login/
│   │   │   └── page.tsx        # Login page
│   │   └── register/
│   │       └── page.tsx        # Register page
│   └── (main)/
│       ├── layout.tsx          # Main layout with Header/Footer
│       └── dashboard/
│           └── page.tsx        # Dashboard page (protected)
├── components/
│   ├── ui/                     # shadcn/ui components (auto-generated)
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── MainLayout.tsx
│   └── common/
│       ├── LoadingSpinner.tsx
│       ├── EmptyState.tsx
│       └── Pagination.tsx
├── features/
│   └── auth/
│       ├── components/
│       │   ├── LoginForm.tsx
│       │   └── RegisterForm.tsx
│       ├── hooks/
│       │   └── useAuth.ts
│       ├── services/
│       │   └── auth.service.ts
│       ├── store/
│       │   └── authSlice.ts
│       └── types/
│           └── auth.types.ts
├── hooks/
│   ├── useDebounce.ts
│   ├── useLocalStorage.ts
│   └── useMediaQuery.ts
├── lib/
│   ├── api/
│   │   ├── axios.config.ts
│   │   └── api.types.ts
│   ├── constants/
│   │   ├── routes.ts
│   │   ├── api-endpoints.ts
│   │   └── app.constants.ts
│   ├── utils/
│   │   ├── format.ts
│   │   ├── error.ts
│   │   └── security.ts
│   └── utils.ts                # cn() helper
├── store/
│   ├── index.ts
│   └── hooks.ts
├── types/
│   └── index.ts
└── middleware.ts
```

---

### Step 3: Configuration Files

#### `tailwind.config.ts`
Set up the full Tailwind config as specified in `08-color-system.md`:
- darkMode: "class"
- Content paths include src/features/**
- Extend colors with ALL semantic tokens: primary, secondary, destructive, muted, accent, popover, card, border, input, ring, brand (primary, secondary, accent), success, warning, info
- Container config: centered, 2rem padding, 1400px max
- Include tailwindcss-animate plugin

#### `src/app/globals.css`
Implement the FULL CSS variable system from `08-color-system.md`:
- `:root` with ALL light mode variables (background, foreground, primary, secondary, muted, accent, destructive, popover, card, border, input, ring, radius, brand colors, semantic colors: success, warning, info)
- `.dark` with ALL dark mode variables
- Base layer: `border-border` on all elements, `bg-background text-foreground` on body

#### `next.config.ts`
- Add security headers from `09-security-rules.md`: X-Frame-Options, X-Content-Type-Options, Referrer-Policy, X-XSS-Protection
- Configure images.remotePatterns if needed

#### `.env.local` and `.env.local.example`
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api/v1
NEXT_PUBLIC_APP_NAME=$ARGUMENTS
```

---

### Step 4: Core Library Files

#### `src/lib/utils.ts`
```typescript
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

#### `src/lib/api/api.types.ts`
Define ALL API response types from `03-typescript-rules.md`:
- `ApiResponse<T>` — `{ success: true, message: string, data: T }`
- `PaginatedApiResponse<T>` — with items array and pagination object (page, limit, totalItems, totalPages, hasNextPage, hasPreviousPage)
- `ApiError` — `{ success: false, error: { code: string, message: string } }`
- `PaginationParams` — `{ page?: number, limit?: number }`

#### `src/lib/api/axios.config.ts`
Implement the FULL Axios config from `05-api-integration.md`:
- Base URL from env
- Request interceptor: attach Bearer token from Redux store (client-side only with `typeof window` check)
- Response interceptor: handle 401 with token refresh flow, dispatch logout on failure
- 30s timeout

#### `src/lib/constants/api-endpoints.ts`
```typescript
export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    ME: '/auth/me',
    VERIFY_EMAIL: '/auth/verify-email',
    RESEND_VERIFICATION: '/auth/resend-verification',
    REQUEST_PASSWORD_RESET: '/auth/request-password-reset',
    RESET_PASSWORD: '/auth/reset-password',
  },
  USERS: {
    ME: '/users/me',
    UPDATE_ME: '/users/me',
    DELETE_ME: '/users/me',
  },
} as const;
```

#### `src/lib/constants/routes.ts`
```typescript
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  VERIFY_EMAIL: '/verify-email',
  RESET_PASSWORD: '/reset-password',
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
} as const;
```

#### `src/lib/constants/app.constants.ts`
```typescript
export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || '$ARGUMENTS';

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
} as const;

export const USER_ROLES = {
  USER: 'USER',
  COMPANY: 'COMPANY',
  ADMIN: 'ADMIN',
  GUIDE: 'GUIDE',
  DRIVER: 'DRIVER',
} as const;
```

#### `src/lib/utils/error.ts`
Implement the error utility from `05-api-integration.md`:
- `getErrorMessage(error: unknown): string`
- `getErrorCode(error: unknown): string | undefined`
- `isErrorCode(error: unknown, code: string): boolean`

#### `src/lib/utils/format.ts`
Implement from `07-common-patterns.md`:
- `formatCurrency(amount, currency)`
- `formatDate(date)`
- `formatRelativeTime(date)`
- `truncate(str, length)`

#### `src/lib/utils/security.ts`
Implement from `09-security-rules.md`:
- `isSafeUrl(url: string): boolean`
- `sanitizeString(input: string): string`
- `sanitizeEmail(email: string): string`
- `maskEmail(email: string): string`

---

### Step 5: State Management

#### `src/store/index.ts`
Redux store setup from `04-state-management.md`:
- Configure store with auth reducer
- Load auth state from localStorage (with SSR guard)
- Subscribe to save auth state to localStorage (with SSR guard)
- Export `RootState` and `AppDispatch` types

#### `src/store/hooks.ts`
Typed Redux hooks:
- `useAppDispatch`
- `useAppSelector`

#### `src/features/auth/store/authSlice.ts`
Auth slice from `04-state-management.md`:
- State: `{ user, tokens, isAuthenticated }`
- Reducers: `setCredentials`, `updateTokens`, `logout`

#### `src/features/auth/types/auth.types.ts`
Auth types from `03-typescript-rules.md`:
- `IUser` interface
- `UserRole` type
- `IAuthTokens` interface
- `ILoginRequest`, `IRegisterRequest` interfaces
- `IAuthState` interface

#### `src/features/auth/services/auth.service.ts`
Auth service from `05-api-integration.md`:
- `register`, `login`, `logout`, `refreshToken`, `getMe`, `verifyEmail`, `requestPasswordReset`, `resetPassword`

#### `src/features/auth/hooks/useAuth.ts`
Auth hook from `07-common-patterns.md`:
- Returns `{ user, isAuthenticated, login, logout, isLoggingIn }`
- Uses Redux dispatch + React Query mutation for login
- Handles logout with redirect

---

### Step 6: Providers & Layout

#### `src/app/providers.tsx`
Client component with ALL providers from `07-common-patterns.md`:
- `ReduxProvider` wrapping `QueryClientProvider` wrapping `ThemeProvider`
- React Query client with: staleTime 5min, gcTime 10min, refetchOnWindowFocus false, retry 1
- Sonner `Toaster` component (position: top-right, richColors)

#### `src/app/layout.tsx`
Root layout:
- Import and use `next/font` (Inter or Geist Sans)
- `<html lang="en" suppressHydrationWarning>`
- Wrap children in `<Providers>`
- Default metadata with app name

#### `src/app/(main)/layout.tsx`
Main layout with Header and Footer wrapping children in a flex column min-h-screen structure.

#### `src/app/(auth)/layout.tsx`
Auth layout: centered, minimal — flex items-center justify-center min-h-screen.

---

### Step 7: Common Components

#### `src/components/layout/Header.tsx`
Client component with:
- App name / logo link to home
- Navigation links
- Auth-aware: show Login/Register or user menu based on auth state
- Theme toggle button (from `08-color-system.md`)
- Responsive (mobile menu)

#### `src/components/layout/Footer.tsx`
Server component, simple footer with copyright.

#### `src/components/common/LoadingSpinner.tsx`
Using Lucide `Loader2` icon with spin animation. Accept `size` prop.

#### `src/components/common/EmptyState.tsx`
From `07-common-patterns.md`: icon, title, description, optional CTA with Link.

#### `src/components/common/Pagination.tsx`
Client component from `07-common-patterns.md`: uses `useSearchParams` to build page URLs, prev/next buttons.

---

### Step 8: Global Custom Hooks

#### `src/hooks/useDebounce.ts`
From `07-common-patterns.md`.

#### `src/hooks/useLocalStorage.ts`
From `07-common-patterns.md` with SSR hydration guard.

#### `src/hooks/useMediaQuery.ts`
From `07-common-patterns.md` with `useIsMobile` and `useIsTablet` exports.

---

### Step 9: Auth Pages

#### `src/app/(auth)/login/page.tsx`
Server component page that renders `LoginForm`.

#### `src/app/(auth)/register/page.tsx`
Server component page that renders `RegisterForm`.

#### `src/features/auth/components/LoginForm.tsx`
Client component from `06-forms-validation.md`:
- React Hook Form + Zod validation
- Email + password fields
- Submit button with loading state
- Link to register page
- Uses `useAuth` hook for login

#### `src/features/auth/components/RegisterForm.tsx`
Client component:
- React Hook Form + Zod validation
- First name, last name, email, password, confirm password
- Submit button with loading state
- Link to login page

---

### Step 10: Dashboard & Home Pages

#### `src/app/page.tsx`
Simple home page (Server Component). Welcome message with links to login/register or dashboard.

#### `src/app/(main)/dashboard/page.tsx`
Simple dashboard page placeholder (Server Component). Shows "Welcome to your dashboard."

#### `src/app/loading.tsx`
Global loading component with LoadingSpinner.

#### `src/app/error.tsx`
Client component global error boundary from `05-api-integration.md`.

#### `src/app/not-found.tsx`
Simple 404 page with link to home.

---

### Step 11: Middleware

#### `src/middleware.ts`
From `07-common-patterns.md`:
- Protect routes: `/dashboard`, `/profile`
- Redirect authenticated users away from `/login`, `/register`
- Check for `accessToken` cookie
- Matcher config for relevant paths

---

### Step 12: Global Types

#### `src/types/index.ts`
Shared utility types:
```typescript
export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type AsyncResult<T> = Promise<T>;
```

---

### Step 13: Final Verification

After creating all files:
1. Run `npm run dev` to verify the project starts without errors
2. Check that the home page renders at `http://localhost:3001` (or the configured port)
3. Verify no TypeScript errors

---

## IMPORTANT RULES

- Follow ALL rules from `.claude/rules/client/` and `.claude/rules/global/`
- Server Components by default — only add `'use client'` when hooks/state/events are needed
- Max 250 lines per component, max 5 props, max 3 JSX nesting levels
- No hardcoded colors — use Tailwind semantic tokens only (`bg-primary`, `text-foreground`)
- No inline styles — Tailwind only with `cn()` for conditional classes
- Import order: React/Next → third-party → UI → local → hooks → services → types → utils
- Forms: validate with Zod client-side AND server-side
- Never prefix secrets with `NEXT_PUBLIC_`
- Use `next/image` for images, `next/link` for navigation
- Pair background with foreground colors (`bg-primary text-primary-foreground`)
- All interactive elements need hover/active/focus-visible states
