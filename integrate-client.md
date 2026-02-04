# Client Integration Plan for AML (Auto Market LGC)

> This document outlines the step-by-step plan to fully integrate the AML client with the server APIs.

---

## Current State Assessment

### What's Working
| Feature | Service | Hooks | Types | Mock Data |
|---------|---------|-------|-------|-----------|
| Blog | ✅ Complete | ✅ Complete | ✅ Complete | ✅ Ready |
| Orders | ✅ Complete | ⚠️ Partial | ✅ Complete | ✅ Ready |
| Reviews | ✅ Complete | ⚠️ Partial | ✅ Complete | ✅ Ready |

### What's MISSING (Critical)
| Feature | Status | Priority |
|---------|--------|----------|
| Auth Feature | ❌ Entire feature missing | 🔴 BLOCKING |
| Redux Store | ❌ Not configured | 🔴 BLOCKING |
| Login/Register Pages | ❌ Not created | 🔴 BLOCKING |
| Route Middleware | ❌ No protection | 🔴 HIGH |
| Admin Order Hooks | ❌ No mutations | 🟡 MEDIUM |
| Admin Review Hooks | ❌ No mutations | 🟡 MEDIUM |
| Mock Data Flags | ⚠️ Still enabled | 🟡 MEDIUM |

---

## Phase 1: Foundation Setup (Prerequisites)

### Step 1.1: Install Missing Dependencies

**File:** `client/package.json`

```bash
cd client
npm install @reduxjs/toolkit react-redux
```

**Dependencies to add:**
- `@reduxjs/toolkit` - Redux state management
- `react-redux` - React bindings for Redux

**Tasks:**
- [ ] Run `npm install @reduxjs/toolkit react-redux`
- [ ] Verify installation in package.json

---

### Step 1.2: Create Redux Store

**File:** `client/src/store/index.ts`

```typescript
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/features/auth/store/authSlice';

const loadAuthState = () => {
  if (typeof window === 'undefined') return undefined;
  try {
    const state = localStorage.getItem('auth');
    return state ? JSON.parse(state) : undefined;
  } catch {
    return undefined;
  }
};

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  preloadedState: {
    auth: loadAuthState(),
  },
});

// Persist auth state to localStorage
if (typeof window !== 'undefined') {
  store.subscribe(() => {
    try {
      localStorage.setItem('auth', JSON.stringify(store.getState().auth));
    } catch {}
  });
}

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

**Tasks:**
- [ ] Create `src/store/` directory
- [ ] Create `src/store/index.ts` with store configuration
- [ ] Add localStorage persistence for auth state

---

### Step 1.3: Create Typed Redux Hooks

**File:** `client/src/store/hooks.ts`

```typescript
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './index';

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
```

**Tasks:**
- [ ] Create `src/store/hooks.ts`
- [ ] Export typed hooks

---

### Step 1.4: Create Redux Provider

**File:** `client/src/providers/redux-provider.tsx`

```typescript
'use client';

import { Provider } from 'react-redux';
import { store } from '@/store';

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}
```

**Tasks:**
- [ ] Create `src/providers/redux-provider.tsx`

---

### Step 1.5: Update App Layout with Redux Provider

**File:** `client/src/app/layout.tsx`

Update to wrap with Redux provider:

```typescript
import { ReduxProvider } from '@/providers/redux-provider';
import { QueryProvider } from '@/providers/query-provider';
import { ThemeProvider } from 'next-themes';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ka" suppressHydrationWarning>
      <body>
        <ReduxProvider>
          <QueryProvider>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
              {children}
              <Toaster />
            </ThemeProvider>
          </QueryProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
```

**Tasks:**
- [ ] Import ReduxProvider in layout.tsx
- [ ] Wrap app with ReduxProvider (outermost)
- [ ] Add ThemeProvider for dark mode support (optional)

---

## Phase 2: Auth Feature (Critical)

### Step 2.1: Create Auth Types

**File:** `client/src/features/auth/types/auth.types.ts`

```typescript
export interface IUser {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: UserRole;
  isActive: boolean;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export type UserRole = 'USER' | 'ADMIN';

export interface IAuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface ILoginRequest {
  email: string;
  password: string;
}

export interface IRegisterRequest {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface IAuthResponse {
  user: IUser;
  tokens: IAuthTokens;
}

export interface IAuthState {
  user: IUser | null;
  tokens: IAuthTokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
```

**Tasks:**
- [ ] Create `src/features/auth/` directory structure
- [ ] Create `src/features/auth/types/auth.types.ts`

---

### Step 2.2: Create Auth Slice (Redux)

**File:** `client/src/features/auth/store/authSlice.ts`

```typescript
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { IUser, IAuthTokens, IAuthState } from '../types/auth.types';

const initialState: IAuthState = {
  user: null,
  tokens: null,
  isAuthenticated: false,
  isLoading: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: IUser; tokens: IAuthTokens }>
    ) => {
      state.user = action.payload.user;
      state.tokens = action.payload.tokens;
      state.isAuthenticated = true;
      state.isLoading = false;
    },
    updateTokens: (state, action: PayloadAction<IAuthTokens>) => {
      state.tokens = action.payload;
    },
    updateUser: (state, action: PayloadAction<IUser>) => {
      state.user = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.tokens = null;
      state.isAuthenticated = false;
      state.isLoading = false;
    },
  },
});

export const { setCredentials, updateTokens, updateUser, setLoading, logout } =
  authSlice.actions;
export default authSlice.reducer;
```

**Tasks:**
- [ ] Create `src/features/auth/store/` directory
- [ ] Create `src/features/auth/store/authSlice.ts`

---

### Step 2.3: Create Auth Service

**File:** `client/src/features/auth/services/auth.service.ts`

```typescript
import { apiClient } from '@/lib/api/axios.config';
import type {
  IAuthResponse,
  ILoginRequest,
  IRegisterRequest,
  IAuthTokens,
  IUser,
} from '../types/auth.types';
import type { ApiResponse } from '@/lib/api/api.types';

const AUTH_ENDPOINTS = {
  REGISTER: '/auth/register',
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  REFRESH: '/auth/refresh',
  ME: '/auth/me',
} as const;

class AuthService {
  async register(data: IRegisterRequest): Promise<IAuthResponse> {
    const response = await apiClient.post<ApiResponse<IAuthResponse>>(
      AUTH_ENDPOINTS.REGISTER,
      data
    );
    return response.data.data;
  }

  async login(data: ILoginRequest): Promise<IAuthResponse> {
    const response = await apiClient.post<ApiResponse<IAuthResponse>>(
      AUTH_ENDPOINTS.LOGIN,
      data
    );
    return response.data.data;
  }

  async logout(): Promise<void> {
    await apiClient.post(AUTH_ENDPOINTS.LOGOUT);
  }

  async refreshToken(refreshToken: string): Promise<IAuthTokens> {
    const response = await apiClient.post<ApiResponse<IAuthTokens>>(
      AUTH_ENDPOINTS.REFRESH,
      { refreshToken }
    );
    return response.data.data;
  }

  async getMe(): Promise<IUser> {
    const response = await apiClient.get<ApiResponse<IUser>>(AUTH_ENDPOINTS.ME);
    return response.data.data;
  }
}

export const authService = new AuthService();
```

**Tasks:**
- [ ] Create `src/features/auth/services/` directory
- [ ] Create `src/features/auth/services/auth.service.ts`

---

### Step 2.4: Create Auth Hooks

**File:** `client/src/features/auth/hooks/useAuth.ts`

```typescript
'use client';

import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setCredentials, logout as logoutAction, setLoading } from '../store/authSlice';
import { authService } from '../services/auth.service';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { getErrorMessage } from '@/lib/api/api.types';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { user, isAuthenticated, tokens, isLoading } = useAppSelector(
    (state) => state.auth
  );

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch {
      // Ignore logout errors
    } finally {
      dispatch(logoutAction());
      localStorage.removeItem('auth');
      router.push('/login');
    }
  }, [dispatch, router]);

  return {
    user,
    isAuthenticated,
    tokens,
    isLoading,
    logout,
  };
};
```

**File:** `client/src/features/auth/hooks/useLogin.ts`

```typescript
'use client';

import { useMutation } from '@tanstack/react-query';
import { useAppDispatch } from '@/store/hooks';
import { setCredentials } from '../store/authSlice';
import { authService } from '../services/auth.service';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { getErrorMessage } from '@/lib/api/api.types';
import type { ILoginRequest } from '../types/auth.types';

export const useLogin = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: ILoginRequest) => authService.login(data),
    onSuccess: (data) => {
      dispatch(setCredentials(data));
      toast.success('შესვლა წარმატებულია!');
      router.push('/profile');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
};
```

**File:** `client/src/features/auth/hooks/useRegister.ts`

```typescript
'use client';

import { useMutation } from '@tanstack/react-query';
import { useAppDispatch } from '@/store/hooks';
import { setCredentials } from '../store/authSlice';
import { authService } from '../services/auth.service';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { getErrorMessage } from '@/lib/api/api.types';
import type { IRegisterRequest } from '../types/auth.types';

export const useRegister = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: IRegisterRequest) => authService.register(data),
    onSuccess: (data) => {
      dispatch(setCredentials(data));
      toast.success('რეგისტრაცია წარმატებულია!');
      router.push('/profile');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
};
```

**File:** `client/src/features/auth/hooks/index.ts`

```typescript
export { useAuth } from './useAuth';
export { useLogin } from './useLogin';
export { useRegister } from './useRegister';
```

**Tasks:**
- [ ] Create `src/features/auth/hooks/` directory
- [ ] Create `useAuth.ts`, `useLogin.ts`, `useRegister.ts`
- [ ] Create barrel export `index.ts`

---

### Step 2.5: Create Auth Schemas (Validation)

**File:** `client/src/features/auth/schemas/auth.schemas.ts`

```typescript
import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('არასწორი ელ-ფოსტა'),
  password: z.string().min(1, 'პაროლი აუცილებელია'),
});

export const registerSchema = z.object({
  email: z.string().email('არასწორი ელ-ფოსტა'),
  password: z
    .string()
    .min(8, 'პაროლი უნდა იყოს მინიმუმ 8 სიმბოლო')
    .regex(/[A-Z]/, 'პაროლი უნდა შეიცავდეს დიდ ასოს')
    .regex(/[a-z]/, 'პაროლი უნდა შეიცავდეს პატარა ასოს')
    .regex(/[0-9]/, 'პაროლი უნდა შეიცავდეს ციფრს'),
  confirmPassword: z.string(),
  firstName: z.string().min(1, 'სახელი აუცილებელია').max(100).optional(),
  lastName: z.string().min(1, 'გვარი აუცილებელია').max(100).optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'პაროლები არ ემთხვევა',
  path: ['confirmPassword'],
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
```

**Tasks:**
- [ ] Create `src/features/auth/schemas/` directory
- [ ] Create `auth.schemas.ts` with Zod validation

---

### Step 2.6: Create Login Form Component

**File:** `client/src/features/auth/components/LoginForm.tsx`

```typescript
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLogin } from '../hooks';
import { loginSchema, type LoginFormData } from '../schemas/auth.schemas';
import Link from 'next/link';

export const LoginForm = () => {
  const { mutate: login, isPending } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormData) => {
    login(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">ელ-ფოსტა</Label>
        <Input
          id="email"
          type="email"
          placeholder="example@mail.com"
          {...register('email')}
          aria-invalid={!!errors.email}
        />
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">პაროლი</Label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          {...register('password')}
          aria-invalid={!!errors.password}
        />
        {errors.password && (
          <p className="text-sm text-destructive">{errors.password.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? 'შესვლა...' : 'შესვლა'}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        არ გაქვთ ანგარიში?{' '}
        <Link href="/register" className="text-primary hover:underline">
          რეგისტრაცია
        </Link>
      </p>
    </form>
  );
};
```

**Tasks:**
- [ ] Create `src/features/auth/components/` directory
- [ ] Create `LoginForm.tsx`

---

### Step 2.7: Create Register Form Component

**File:** `client/src/features/auth/components/RegisterForm.tsx`

```typescript
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRegister } from '../hooks';
import { registerSchema, type RegisterFormData } from '../schemas/auth.schemas';
import Link from 'next/link';

export const RegisterForm = () => {
  const { mutate: register, isPending } = useRegister();

  const {
    register: formRegister,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data: RegisterFormData) => {
    const { confirmPassword, ...registerData } = data;
    register(registerData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">სახელი</Label>
          <Input
            id="firstName"
            placeholder="გიორგი"
            {...formRegister('firstName')}
            aria-invalid={!!errors.firstName}
          />
          {errors.firstName && (
            <p className="text-sm text-destructive">{errors.firstName.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName">გვარი</Label>
          <Input
            id="lastName"
            placeholder="ბერიძე"
            {...formRegister('lastName')}
            aria-invalid={!!errors.lastName}
          />
          {errors.lastName && (
            <p className="text-sm text-destructive">{errors.lastName.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">ელ-ფოსტა</Label>
        <Input
          id="email"
          type="email"
          placeholder="example@mail.com"
          {...formRegister('email')}
          aria-invalid={!!errors.email}
        />
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">პაროლი</Label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          {...formRegister('password')}
          aria-invalid={!!errors.password}
        />
        {errors.password && (
          <p className="text-sm text-destructive">{errors.password.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">პაროლის დადასტურება</Label>
        <Input
          id="confirmPassword"
          type="password"
          placeholder="••••••••"
          {...formRegister('confirmPassword')}
          aria-invalid={!!errors.confirmPassword}
        />
        {errors.confirmPassword && (
          <p className="text-sm text-destructive">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? 'რეგისტრაცია...' : 'რეგისტრაცია'}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        უკვე გაქვთ ანგარიში?{' '}
        <Link href="/login" className="text-primary hover:underline">
          შესვლა
        </Link>
      </p>
    </form>
  );
};
```

**Tasks:**
- [ ] Create `RegisterForm.tsx`

---

### Step 2.8: Create Auth Components Index

**File:** `client/src/features/auth/components/index.ts`

```typescript
export { LoginForm } from './LoginForm';
export { RegisterForm } from './RegisterForm';
```

**Tasks:**
- [ ] Create barrel export for auth components

---

### Step 2.9: Create Auth Feature Index

**File:** `client/src/features/auth/index.ts`

```typescript
export * from './components';
export * from './hooks';
export * from './types/auth.types';
export { authService } from './services/auth.service';
```

**Tasks:**
- [ ] Create `src/features/auth/index.ts`

---

### Step 2.10: Create Login Page

**File:** `client/src/app/(auth)/login/page.tsx`

```typescript
import { LoginForm } from '@/features/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata = {
  title: 'შესვლა | AML',
  description: 'შედით თქვენს AML ანგარიშზე',
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-muted/50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">შესვლა</CardTitle>
          <CardDescription>
            შეიყვანეთ თქვენი მონაცემები ანგარიშზე შესასვლელად
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </div>
  );
}
```

**Tasks:**
- [ ] Create `src/app/(auth)/` directory (auth route group)
- [ ] Create `src/app/(auth)/login/page.tsx`

---

### Step 2.11: Create Register Page

**File:** `client/src/app/(auth)/register/page.tsx`

```typescript
import { RegisterForm } from '@/features/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata = {
  title: 'რეგისტრაცია | AML',
  description: 'შექმენით ახალი AML ანგარიში',
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-muted/50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">რეგისტრაცია</CardTitle>
          <CardDescription>
            შექმენით ახალი ანგარიში AML-ზე
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RegisterForm />
        </CardContent>
      </Card>
    </div>
  );
}
```

**Tasks:**
- [ ] Create `src/app/(auth)/register/page.tsx`

---

### Step 2.12: Create Auth Layout

**File:** `client/src/app/(auth)/layout.tsx`

```typescript
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      {children}
    </div>
  );
}
```

**Tasks:**
- [ ] Create `src/app/(auth)/layout.tsx`

---

## Phase 3: Route Protection Middleware

### Step 3.1: Create Middleware

**File:** `client/src/middleware.ts`

```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedPaths = [
  '/profile',
  '/settings',
  '/messages',
  '/dealer',
  '/admin',
];

const authPaths = ['/login', '/register'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check for auth token in cookies
  const token = request.cookies.get('accessToken')?.value;

  // Also check localStorage token via a custom header (set by client)
  const authHeader = request.headers.get('authorization');
  const hasToken = token || authHeader;

  // For protected routes - redirect to login if no token
  const isProtectedPath = protectedPaths.some((path) =>
    pathname.startsWith(path)
  );

  if (isProtectedPath && !hasToken) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // For auth pages - redirect to profile if already logged in
  const isAuthPath = authPaths.some((path) => pathname.startsWith(path));

  if (isAuthPath && hasToken) {
    return NextResponse.redirect(new URL('/profile', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/profile/:path*',
    '/settings/:path*',
    '/messages/:path*',
    '/dealer/:path*',
    '/admin/:path*',
    '/login',
    '/register',
  ],
};
```

**Tasks:**
- [ ] Create `src/middleware.ts`
- [ ] Configure protected and auth paths

---

## Phase 4: Update Axios Interceptor

### Step 4.1: Upgrade Axios Config with Token Refresh

**File:** `client/src/lib/api/axios.config.ts`

```typescript
import axios from 'axios';
import { store } from '@/store';
import { updateTokens, logout } from '@/features/auth/store/authSlice';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  timeout: 30000,
});

// Request interceptor - Add auth token from Redux
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = store.getState().auth.tokens?.accessToken;
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - Handle token refresh
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token);
    }
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 and not already retrying
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Queue the request while refreshing
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = store.getState().auth.tokens?.refreshToken;

        if (!refreshToken) {
          throw new Error('No refresh token');
        }

        const response = await axios.post(
          `${API_BASE_URL}/api/v1/auth/refresh`,
          { refreshToken }
        );

        const { accessToken, refreshToken: newRefreshToken } = response.data.data;

        store.dispatch(
          updateTokens({
            accessToken,
            refreshToken: newRefreshToken,
          })
        );

        processQueue(null, accessToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        store.dispatch(logout());

        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth');
          window.location.href = '/login';
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
```

**Tasks:**
- [ ] Update `axios.config.ts` with token refresh logic
- [ ] Add queue mechanism for concurrent requests
- [ ] Add auto-redirect on auth failure

---

## Phase 5: Admin Hooks for Orders

### Step 5.1: Create Order Mutation Hooks

**File:** `client/src/features/orders/hooks/useOrderMutations.ts`

```typescript
'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { orderService } from '../services/order.service';
import { toast } from 'sonner';
import { getErrorMessage } from '@/lib/api/api.types';
import { orderKeys } from '../utils/query-keys';
import type { CreateOrderData, UpdateOrderData, UpdateOrderStatusData } from '../types/order.types';

export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateOrderData) => orderService.createOrder(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.all });
      toast.success('შეკვეთა წარმატებით შეიქმნა');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
};

export const useUpdateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateOrderData }) =>
      orderService.updateOrder(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: orderKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
      toast.success('შეკვეთა წარმატებით განახლდა');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateOrderStatusData }) =>
      orderService.updateOrderStatus(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: orderKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
      toast.success('სტატუსი წარმატებით განახლდა');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
};

export const useDeleteOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => orderService.deleteOrder(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.all });
      toast.success('შეკვეთა წარმატებით წაიშალა');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
};
```

**Tasks:**
- [ ] Create `useOrderMutations.ts`
- [ ] Add to hooks index export

---

### Step 5.2: Create Order Query Keys

**File:** `client/src/features/orders/utils/query-keys.ts`

```typescript
export const orderKeys = {
  all: ['orders'] as const,
  lists: () => [...orderKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...orderKeys.lists(), filters] as const,
  details: () => [...orderKeys.all, 'detail'] as const,
  detail: (id: string) => [...orderKeys.details(), id] as const,
  track: (code: string) => [...orderKeys.all, 'track', code] as const,
};
```

**Tasks:**
- [ ] Create `src/features/orders/utils/` directory
- [ ] Create `query-keys.ts`

---

### Step 5.3: Update Orders Hooks Index

**File:** `client/src/features/orders/hooks/index.ts`

```typescript
export { useOrders, useOrder, useTrackOrder, useAdminOrders } from './useOrders';
export {
  useCreateOrder,
  useUpdateOrder,
  useUpdateOrderStatus,
  useDeleteOrder,
} from './useOrderMutations';
```

**Tasks:**
- [ ] Update hooks index to export new mutations

---

## Phase 6: Admin Hooks for Reviews

### Step 6.1: Create Review Mutation Hooks

**File:** `client/src/features/reviews/hooks/useReviewMutations.ts`

```typescript
'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { reviewService } from '../services/review.service';
import { toast } from 'sonner';
import { getErrorMessage } from '@/lib/api/api.types';
import { reviewKeys } from '../utils/query-keys';
import type { CreateReviewData, UpdateReviewData } from '../types/review.types';

export const useCreateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateReviewData) => reviewService.createReview(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reviewKeys.all });
      toast.success('მიმოხილვა წარმატებით დაემატა');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
};

export const useUpdateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateReviewData }) =>
      reviewService.updateReview(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: reviewKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: reviewKeys.lists() });
      toast.success('მიმოხილვა წარმატებით განახლდა');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
};

export const useDeleteReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => reviewService.deleteReview(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reviewKeys.all });
      toast.success('მიმოხილვა წარმატებით წაიშალა');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
};
```

**Tasks:**
- [ ] Create `useReviewMutations.ts`

---

### Step 6.2: Create Deal Mutation Hooks

**File:** `client/src/features/reviews/hooks/useDealMutations.ts`

```typescript
'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { reviewService } from '../services/review.service';
import { toast } from 'sonner';
import { getErrorMessage } from '@/lib/api/api.types';
import { dealKeys } from '../utils/query-keys';
import type { CreateDealData, UpdateDealData } from '../types/review.types';

export const useCreateDeal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateDealData) => reviewService.createDeal(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dealKeys.all });
      toast.success('გარიგება წარმატებით დაემატა');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
};

export const useUpdateDeal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateDealData }) =>
      reviewService.updateDeal(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: dealKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: dealKeys.lists() });
      toast.success('გარიგება წარმატებით განახლდა');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
};

export const useDeleteDeal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => reviewService.deleteDeal(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dealKeys.all });
      toast.success('გარიგება წარმატებით წაიშალა');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
};
```

**Tasks:**
- [ ] Create `useDealMutations.ts`

---

### Step 6.3: Create Review Query Keys

**File:** `client/src/features/reviews/utils/query-keys.ts`

```typescript
export const reviewKeys = {
  all: ['reviews'] as const,
  lists: () => [...reviewKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...reviewKeys.lists(), filters] as const,
  details: () => [...reviewKeys.all, 'detail'] as const,
  detail: (id: string) => [...reviewKeys.details(), id] as const,
  aggregate: () => [...reviewKeys.all, 'aggregate'] as const,
};

export const dealKeys = {
  all: ['deals'] as const,
  lists: () => [...dealKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...dealKeys.lists(), filters] as const,
  details: () => [...dealKeys.all, 'detail'] as const,
  detail: (id: string) => [...dealKeys.details(), id] as const,
};
```

**Tasks:**
- [ ] Create `src/features/reviews/utils/` directory
- [ ] Create `query-keys.ts`

---

### Step 6.4: Update Reviews Hooks Index

**File:** `client/src/features/reviews/hooks/index.ts`

```typescript
export { useReviews, useAdminReviews, useAggregateRating } from './useReviews';
export { useDeals, useAdminDeals } from './useDeals';
export { useCreateReview, useUpdateReview, useDeleteReview } from './useReviewMutations';
export { useCreateDeal, useUpdateDeal, useDeleteDeal } from './useDealMutations';
```

**Tasks:**
- [ ] Update hooks index

---

## Phase 7: Disable Mock Data

### Step 7.1: Update Blog Hooks

**File:** `client/src/features/blog/hooks/usePosts.ts`

Change:
```typescript
const USE_MOCK_DATA = true;  // BEFORE
const USE_MOCK_DATA = false; // AFTER
```

Or better, use environment variable:
```typescript
const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';
```

**Tasks:**
- [ ] Update `usePosts.ts` to disable mock data
- [ ] Update `usePost.ts` to disable mock data

---

### Step 7.2: Update Orders Hooks

**File:** `client/src/features/orders/hooks/useOrders.ts`

Change mock data flag to false or use env variable.

**Tasks:**
- [ ] Update `useOrders.ts` to disable mock data
- [ ] Update `useTrackOrder.ts` to disable mock data

---

### Step 7.3: Update Reviews Hooks

**File:** `client/src/features/reviews/hooks/useReviews.ts`

Change mock data flag to false or use env variable.

**Tasks:**
- [ ] Update `useReviews.ts` to disable mock data
- [ ] Update `useDeals.ts` to disable mock data

---

### Step 7.4: Add Environment Variable

**File:** `client/.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_USE_MOCK_DATA=false
```

**Tasks:**
- [ ] Add `NEXT_PUBLIC_USE_MOCK_DATA=false` to `.env.local`
- [ ] Add to `.env.local.example` for documentation

---

## Phase 8: Testing Integration

### Step 8.1: Start Server

```bash
cd server
npm run dev  # Starts on http://localhost:8080
```

**Tasks:**
- [ ] Verify server is running
- [ ] Check health endpoint: `GET http://localhost:8080/api/v1/health`

---

### Step 8.2: Start Client

```bash
cd client
npm run dev  # Starts on http://localhost:3000
```

**Tasks:**
- [ ] Verify client is running
- [ ] Check browser console for errors

---

### Step 8.3: Test Auth Flow

1. Navigate to `/register`
2. Create a new account
3. Verify redirect to `/profile`
4. Click logout
5. Navigate to `/login`
6. Login with created account
7. Verify token refresh works (wait 15+ minutes or manually expire token)

**Tasks:**
- [ ] Test registration flow
- [ ] Test login flow
- [ ] Test logout flow
- [ ] Test token refresh

---

### Step 8.4: Test Blog Integration

1. Navigate to `/blog`
2. Verify posts load from server (not mock data)
3. Click on a blog post
4. Verify post detail page works
5. Test reactions (if implemented)

**Tasks:**
- [ ] Test blog list
- [ ] Test blog detail
- [ ] Test categories filter
- [ ] Test search

---

### Step 8.5: Test Orders Integration

1. Navigate to `/track`
2. Enter a valid tracking code from seed data
3. Verify order details display

**Tasks:**
- [ ] Test order tracking

---

### Step 8.6: Test Reviews Integration

1. Navigate to `/reviews`
2. Verify reviews load from server
3. Check aggregate rating displays
4. Check completed deals section

**Tasks:**
- [ ] Test reviews list
- [ ] Test aggregate rating
- [ ] Test completed deals

---

## Summary: Files to Create

### New Directories
```
client/src/
├── store/
│   ├── index.ts
│   └── hooks.ts
├── features/auth/
│   ├── components/
│   │   ├── LoginForm.tsx
│   │   ├── RegisterForm.tsx
│   │   └── index.ts
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useLogin.ts
│   │   ├── useRegister.ts
│   │   └── index.ts
│   ├── services/
│   │   └── auth.service.ts
│   ├── store/
│   │   └── authSlice.ts
│   ├── schemas/
│   │   └── auth.schemas.ts
│   ├── types/
│   │   └── auth.types.ts
│   └── index.ts
├── providers/
│   └── redux-provider.tsx
├── app/(auth)/
│   ├── layout.tsx
│   ├── login/
│   │   └── page.tsx
│   └── register/
│       └── page.tsx
└── middleware.ts
```

### Files to Modify
```
client/src/
├── app/layout.tsx              (add ReduxProvider)
├── lib/api/axios.config.ts     (upgrade interceptor)
├── features/orders/hooks/      (add mutation hooks)
├── features/reviews/hooks/     (add mutation hooks)
└── .env.local                  (add USE_MOCK_DATA=false)
```

---

## Implementation Checklist

### Phase 1: Foundation
- [ ] Install Redux dependencies
- [ ] Create store configuration
- [ ] Create typed hooks
- [ ] Create Redux provider
- [ ] Update layout with provider

### Phase 2: Auth Feature
- [ ] Create auth types
- [ ] Create auth slice
- [ ] Create auth service
- [ ] Create auth hooks
- [ ] Create auth schemas
- [ ] Create LoginForm
- [ ] Create RegisterForm
- [ ] Create login page
- [ ] Create register page
- [ ] Create auth layout

### Phase 3: Middleware
- [ ] Create route protection middleware

### Phase 4: Axios Upgrade
- [ ] Add token refresh logic
- [ ] Add request queue
- [ ] Add auto-redirect

### Phase 5: Order Mutations
- [ ] Create order mutation hooks
- [ ] Create query keys
- [ ] Update exports

### Phase 6: Review Mutations
- [ ] Create review mutation hooks
- [ ] Create deal mutation hooks
- [ ] Create query keys
- [ ] Update exports

### Phase 7: Disable Mock Data
- [ ] Update blog hooks
- [ ] Update orders hooks
- [ ] Update reviews hooks
- [ ] Add environment variable

### Phase 8: Testing
- [ ] Test auth flow
- [ ] Test blog integration
- [ ] Test orders integration
- [ ] Test reviews integration

---

## Estimated Effort

| Phase | Tasks | Priority |
|-------|-------|----------|
| Phase 1 | 5 tasks | 🔴 BLOCKING |
| Phase 2 | 12 tasks | 🔴 BLOCKING |
| Phase 3 | 1 task | 🔴 HIGH |
| Phase 4 | 1 task | 🔴 HIGH |
| Phase 5 | 3 tasks | 🟡 MEDIUM |
| Phase 6 | 4 tasks | 🟡 MEDIUM |
| Phase 7 | 4 tasks | 🟡 MEDIUM |
| Phase 8 | 6 tasks | 🟢 FINAL |

**Total: ~36 tasks**

---

## Ready for Implementation

Follow this plan step-by-step. Each phase builds on the previous one. Start with Phase 1 (Redux setup) as it's required by Phase 2 (Auth).

When ready to implement, tell me which phase to start with!
