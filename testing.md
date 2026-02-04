# Playwright E2E Testing Plan for AML Client

## Overview

This plan outlines comprehensive end-to-end testing using Playwright MCP tools to fully test the AML (Auto Market LGC) client application. The goal is to:
1. Verify all user-facing features work correctly
2. Identify missing backend integrations
3. Discover bugs and UI issues
4. Validate forms, navigation, and interactive components

---

## Testing Strategy

### Approach
- **Browser**: Chromium (via Playwright MCP)
- **Base URL**: `http://localhost:3000` (client dev server)
- **Method**: Interactive testing using `browser_snapshot`, `browser_click`, `browser_type`, `browser_fill_form`
- **Documentation**: Record all findings (bugs, missing APIs, UI issues) in a findings report

### Test Execution Order
1. **Phase 1**: Public pages (no auth required)
2. **Phase 2**: Authentication flows
3. **Phase 3**: Protected user pages
4. **Phase 4**: Dealer dashboard features
5. **Phase 5**: Admin features
6. **Phase 6**: Interactive components & edge cases

---

## Phase 1: Public Pages Testing

### 1.1 Homepage (`/`)
**Actions:**
1. Navigate to `/`
2. Take snapshot to verify page loads
3. Verify Hero section renders with CTAs
4. Verify navigation header is present
5. Verify footer is present
6. Check all navigation links are clickable
7. Test language switcher (GE, EN, UA, RU, AR)
8. Test mobile menu toggle

**Expected Findings:**
- [ ] All sections render correctly
- [ ] CTAs are functional
- [ ] No console errors

**API Dependencies:**
- Featured cars data
- Stats/metrics display

---

### 1.2 Catalog Page (`/catalog`)
**Actions:**
1. Navigate to `/catalog`
2. Verify car listing grid loads
3. Test filter sidebar:
   - Price range slider (min/max)
   - Vehicle type checkboxes
   - Make/Brand checkboxes
   - Auction type filters
4. Verify car cards display:
   - Image, title, price, year, mileage
   - "Unlock Price" button
5. Test pagination if exists
6. Click on a car card to navigate to details

**Expected Findings:**
- [ ] Filters update URL params
- [ ] Car cards render with mock/API data
- [ ] Navigation to car details works

**API Dependencies:**
- `GET /api/v1/cars` - Car listing
- `GET /api/v1/cars?filters=...` - Filtered results

---

### 1.3 Car Details Page (`/catalog/[id]`)
**Actions:**
1. Navigate to a car detail page
2. Verify car gallery loads images
3. Verify car info section (title, price, specs)
4. Verify car specifications table
5. Test "Lead Capture" modal trigger
6. Fill and submit lead form (name, phone, email)
7. Verify similar cars section

**Expected Findings:**
- [ ] Car data loads correctly
- [ ] Gallery is interactive (swipe/click)
- [ ] Lead form validates inputs
- [ ] Lead form submits successfully

**API Dependencies:**
- `GET /api/v1/cars/:id` - Single car details
- `POST /api/v1/leads` - Lead submission

---

### 1.4 Blog Page (`/blog`)
**Actions:**
1. Navigate to `/blog`
2. Verify blog grid loads
3. Test category filter
4. Click on a blog post card

**API Dependencies:**
- `GET /api/v1/posts` - Blog posts list
- `GET /api/v1/posts/categories` - Categories

---

### 1.5 Blog Post Page (`/blog/[slug]`)
**Actions:**
1. Navigate to a blog post
2. Verify post content renders
3. Verify author info, date, reading time
4. Test reaction buttons (like, etc.)
5. Test social share buttons
6. Verify related posts section

**API Dependencies:**
- `GET /api/v1/posts/:slug` - Single post
- `POST /api/v1/posts/:id/reactions` - Add reaction

---

### 1.6 Reviews Page (`/reviews`)
**Actions:**
1. Navigate to `/reviews`
2. Verify reviews list loads
3. Check star rating display
4. Verify completed deals gallery (if present)

**API Dependencies:**
- `GET /api/v1/reviews` - Reviews list
- `GET /api/v1/deals` - Completed deals

---

### 1.7 Order Tracking (`/track`)
**Actions:**
1. Navigate to `/track`
2. Verify tracking input form
3. Enter a tracking code
4. Submit and navigate to `/track/[code]`
5. Verify tracking status display

**API Dependencies:**
- `GET /api/v1/orders/track/:code` - Order tracking

---

### 1.8 About & Contact Pages
**Actions:**
1. Navigate to `/about`
2. Verify content renders
3. Navigate to `/contact`
4. Test contact form (if exists)

---

### 1.9 Auctions Page (`/auctions`)
**Actions:**
1. Navigate to `/auctions`
2. Verify auction categories
3. Test auction filters
4. Check live ticker (if active)
5. Click auction card for details

**API Dependencies:**
- `GET /api/v1/auctions` - Auction listings

---

## Phase 2: Authentication Testing

### 2.1 Registration Flow (`/register`)
**Actions:**
1. Navigate to `/register`
2. Verify registration form renders
3. Test validation:
   - Empty fields
   - Invalid email format
   - Password < 8 chars
   - Password missing uppercase/lowercase/number
   - Password confirmation mismatch
4. Submit valid registration
5. Verify redirect to dashboard/profile
6. Check auth token stored

**API Dependencies:**
- `POST /api/v1/auth/register`

---

### 2.2 Login Flow (`/login`)
**Actions:**
1. Navigate to `/login`
2. Verify login form renders
3. Test validation:
   - Empty fields
   - Invalid email format
4. Test invalid credentials (expect error message)
5. Submit valid login
6. Verify redirect to `/profile`
7. Check auth cookie and Redux state

**API Dependencies:**
- `POST /api/v1/auth/login`

---

### 2.3 Protected Route Redirect
**Actions:**
1. Clear auth cookies/state
2. Navigate to `/profile`
3. Verify redirect to `/login?from=/profile`
4. After login, verify redirect back to `/profile`

---

### 2.4 Logout Flow
**Actions:**
1. Login first
2. Find and click logout button (in profile dropdown)
3. Verify redirect to home or login
4. Verify auth state cleared
5. Navigate to protected route, verify redirect to login

**API Dependencies:**
- `POST /api/v1/auth/logout`

---

### 2.5 Token Refresh (Advanced)
**Actions:**
1. Login with valid credentials
2. Wait/simulate token expiry
3. Make API request
4. Verify token refresh happens automatically
5. Verify request retried successfully

**API Dependencies:**
- `POST /api/v1/auth/refresh`

---

## Phase 3: User Dashboard Testing

### 3.1 Profile Page (`/profile`)
**Actions:**
1. Login and navigate to `/profile`
2. Verify user info displays
3. Test profile edit form
4. Update profile fields
5. Submit and verify changes saved

**API Dependencies:**
- `GET /api/v1/users/me` - Current user
- `PATCH /api/v1/users/me` - Update profile

---

### 3.2 Orders/Shipments (`/profile/orders`)
**Actions:**
1. Navigate to `/profile/orders`
2. Verify orders list loads
3. Click on order to view details (`/profile/orders/[id]`)
4. Verify order details display

**API Dependencies:**
- `GET /api/v1/orders` - User orders
- `GET /api/v1/orders/:id` - Order details

---

### 3.3 Favorites/Wishlist (`/profile/favorites`)
**Actions:**
1. Navigate to `/profile/favorites`
2. Verify favorites list loads
3. Remove item from favorites
4. Verify list updates

**API Dependencies:**
- `GET /api/v1/users/me/favorites`
- `DELETE /api/v1/users/me/favorites/:carId`

---

### 3.4 Messages (`/messages`)
**Actions:**
1. Navigate to `/messages`
2. Verify chat interface loads
3. View conversation list
4. Select conversation
5. Send a message
6. Verify message appears

**API Dependencies:**
- `GET /api/v1/messages/conversations`
- `GET /api/v1/messages/:conversationId`
- `POST /api/v1/messages`

---

### 3.5 Settings (`/settings`)
**Actions:**
1. Navigate to `/settings`
2. Verify settings form loads
3. Change password (if available)
4. Update notification preferences
5. Submit changes

**API Dependencies:**
- `PATCH /api/v1/users/me/password`
- `PATCH /api/v1/users/me/settings`

---

## Phase 4: Dealer Dashboard Testing

### 4.1 Dealer Mode Switch
**Actions:**
1. Login as dealer-capable user
2. Find mode toggle in sidebar
3. Switch to dealer mode
4. Verify sidebar shows dealer navigation

---

### 4.2 Dealer Dashboard (`/dealer/dashboard`)
**Actions:**
1. Navigate to `/dealer/dashboard`
2. Verify stats cards display
3. Verify sales chart renders
4. Verify recent activity section

**API Dependencies:**
- `GET /api/v1/dealer/stats`
- `GET /api/v1/dealer/activity`

---

### 4.3 Add Listing (`/dealer/add-listing`)
**Actions:**
1. Navigate to `/dealer/add-listing`
2. Verify multi-step wizard loads
3. Complete Step 1: Basic info (title, price, year)
4. Complete Step 2: Specifications
5. Complete Step 3: Images upload
6. Complete Step 4: Review & Submit
7. Submit and verify listing created

**API Dependencies:**
- `POST /api/v1/cars` - Create listing
- `POST /api/v1/upload` - Image upload

---

### 4.4 Manage Listings (`/dealer/listings`)
**Actions:**
1. Navigate to `/dealer/listings`
2. Verify inventory table loads
3. Edit a listing
4. Delete a listing
5. Change listing status (active/inactive)

**API Dependencies:**
- `GET /api/v1/dealer/listings`
- `PATCH /api/v1/cars/:id`
- `DELETE /api/v1/cars/:id`

---

### 4.5 Bids (`/dealer/bids`)
**Actions:**
1. Navigate to `/dealer/bids`
2. Verify bids table loads
3. View bid details
4. Accept/reject bid

**API Dependencies:**
- `GET /api/v1/dealer/bids`
- `PATCH /api/v1/bids/:id`

---

### 4.6 Invoices (`/dealer/invoices`)
**Actions:**
1. Navigate to `/dealer/invoices`
2. Verify invoice table loads
3. View invoice details
4. Download invoice (if available)

**API Dependencies:**
- `GET /api/v1/dealer/invoices`
- `GET /api/v1/invoices/:id`

---

## Phase 5: Admin Features Testing

### 5.1 Blog Management (`/admin/blog`)
**Actions:**
1. Navigate to `/admin/blog`
2. Verify posts list loads
3. Click "New Post" button

---

### 5.2 Create Blog Post (`/admin/blog/new`)
**Actions:**
1. Navigate to `/admin/blog/new`
2. Verify TipTap editor loads
3. Enter title
4. Use toolbar: bold, italic, heading, list
5. Insert image via URL
6. Add categories/tags
7. Save as draft
8. Publish post

**API Dependencies:**
- `POST /api/v1/posts` - Create post

---

### 5.3 Edit Blog Post (`/admin/blog/[id]/edit`)
**Actions:**
1. Navigate to edit page for existing post
2. Verify content loads in editor
3. Make changes
4. Save changes

**API Dependencies:**
- `GET /api/v1/posts/:id`
- `PATCH /api/v1/posts/:id`

---

## Phase 6: Interactive Components Testing

### 6.1 Chat Assistant
**Actions:**
1. Find floating chat button (bottom-right)
2. Click to open chat window
3. Verify chat interface renders
4. Use quick action buttons
5. Type a message
6. Submit message
7. Verify response (mock or API)
8. Close chat window

**API Dependencies:**
- `POST /api/v1/chat` - Chat message

---

### 6.2 Lead Capture Modal
**Actions:**
1. Navigate to catalog
2. Click "Unlock Price" on car card
3. Verify modal opens
4. Test form validation:
   - Empty fields
   - Invalid phone format
   - Invalid email format
5. Submit valid form
6. Verify success state
7. Close modal

**API Dependencies:**
- `POST /api/v1/leads`

---

### 6.3 Language Switcher
**Actions:**
1. Find language dropdown in header
2. Click to open
3. Select each language (GE, EN, UA, RU, AR)
4. Verify UI language changes
5. Verify flag icon updates

---

### 6.4 Mobile Navigation
**Actions:**
1. Resize browser to mobile width (375px)
2. Verify hamburger menu appears
3. Click hamburger to open mobile menu
4. Navigate using mobile menu
5. Close mobile menu

---

### 6.5 Filters & Search (Catalog)
**Actions:**
1. Navigate to `/catalog`
2. Adjust price range slider
3. Check/uncheck filter checkboxes
4. Click "Clear filters"
5. Verify URL updates with filter params
6. Verify filtered results display

---

### 6.6 Car Gallery
**Actions:**
1. Navigate to car details page
2. Verify main image displays
3. Click thumbnail to change main image
4. Test swipe/arrows for navigation
5. Open fullscreen view (if available)

---

### 6.7 Forms Validation (All Forms)
**Test Each Form:**
- Login form
- Register form
- Profile edit form
- Lead capture form
- Contact form
- Listing wizard forms

**Validation Checks:**
- Required field errors
- Email format validation
- Password strength requirements
- Phone number format
- Field length limits

---

## Testing Checklist Summary

### Public Pages
- [ ] Homepage loads
- [ ] Catalog loads and filters work
- [ ] Car details page works
- [ ] Blog listing and posts work
- [ ] Reviews page loads
- [ ] Order tracking works
- [ ] About/Contact pages load
- [ ] Auctions page loads

### Authentication
- [ ] Registration with validation
- [ ] Login with validation
- [ ] Protected route redirects
- [ ] Logout clears state
- [ ] Token refresh works

### User Dashboard
- [ ] Profile view/edit
- [ ] Orders listing
- [ ] Favorites management
- [ ] Messages interface
- [ ] Settings page

### Dealer Dashboard
- [ ] Mode switch works
- [ ] Dashboard stats load
- [ ] Add listing wizard
- [ ] Manage listings CRUD
- [ ] Bids management
- [ ] Invoices viewing

### Admin
- [ ] Blog management
- [ ] Create/edit posts
- [ ] Rich text editor

### Components
- [ ] Chat assistant
- [ ] Lead capture modal
- [ ] Language switcher
- [ ] Mobile navigation
- [ ] Filters & search
- [ ] Image gallery

---

## Findings Report Template

### Bug Report Format
```
BUG-001: [Short Description]
- Page/Component: /path or ComponentName
- Severity: Critical/High/Medium/Low
- Steps to Reproduce: 1, 2, 3...
- Expected: What should happen
- Actual: What actually happens
- Screenshot: [if available]
```

### Missing API Integration Format
```
API-001: [Endpoint Description]
- Feature: Feature name
- Expected Endpoint: METHOD /api/v1/...
- Current State: Returns 404 / Not implemented / Mock data
- Priority: High/Medium/Low
```

### UI Issue Format
```
UI-001: [Short Description]
- Page/Component: /path or ComponentName
- Issue: Description of visual/UX issue
- Suggestion: How to fix
```

---

## Implementation Notes

### Prerequisites
1. Client dev server running on `http://localhost:3000`
2. Backend server running on `http://localhost:8080` (if testing real API)
3. Playwright MCP tools available

### Test Data Requirements
- Test user account (for login/protected routes)
- Test dealer account (for dealer features)
- Test admin account (for admin features)
- Sample car data (for catalog testing)
- Sample blog posts (for blog testing)

### Execution Commands
```bash
# Start client dev server
cd client && npm run dev

# Start backend server
cd server && npm run dev

# Tests will use Playwright MCP tools
```

---

## Files to Create After Testing

1. `client/tests/e2e/auth.spec.ts` - Authentication tests
2. `client/tests/e2e/catalog.spec.ts` - Catalog tests
3. `client/tests/e2e/dashboard.spec.ts` - Dashboard tests
4. `client/tests/e2e/dealer.spec.ts` - Dealer tests
5. `client/tests/e2e/blog.spec.ts` - Blog tests
6. `client/playwright.config.ts` - Playwright configuration
7. `TESTING_FINDINGS.md` - Test results and findings report
