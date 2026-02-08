# Premium Glassmorphism Migration

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Transform the entire AML frontend from solid backgrounds to a premium glassmorphism design system with rich gradient mesh backgrounds, multi-layer glass depth, directional light borders, subtle noise textures, and brand-tinted glass surfaces.

**Architecture:** CSS-first approach. Phase 1 defines glass tokens and utilities in `globals.css` that cascade through the entire design system via Tailwind v4's `@theme` directive. Phase 2 surgically updates shadcn/ui component defaults so every consumer inherits glass automatically. Phases 3-5 enhance layout, feature components, and page backgrounds in parallel.

**Tech Stack:** Tailwind CSS v4 (inline @theme config), OKLCH colors, CSS `backdrop-filter`, Framer Motion, shadcn/ui + Radix UI

---

## What Makes This PREMIUM (Not Cheap Gray)

**Cheap glass:** `bg-gray-500/20 backdrop-blur` = flat, lifeless, boring
**Premium glass:** Multi-layer depth + rich gradient backgrounds + directional light borders + brand color tinting + noise grain texture + colored shadows

Key principles:
1. Glass needs **rich colored content behind it** (gradient mesh backgrounds)
2. **Directional borders** simulate light source (brighter top-left, dimmer bottom-right)
3. **Brand-tinted shadows** in dark mode (cerulean blue glow, not generic black)
4. **Inner glow** via inset box-shadow creates depth illusion
5. **Noise grain texture** adds physical realism
6. Different **opacity per z-level** (sections < cards < popovers)

---

## Task 1: Glass Foundation — CSS Custom Properties

**Files:**
- Modify: `client/src/app/globals.css`

### Step 1: Add glass tokens to `:root`

After line 160 (end of `:root` block), insert new glass variables inside the `:root` selector:

```css
  /* ═══ GLASSMORPHISM SYSTEM ═══ */
  /* Glass background layers (higher number = higher z-level = more opaque) */
  --glass-bg-1: oklch(1 0 0 / 55%);
  --glass-bg-2: oklch(1 0 0 / 70%);
  --glass-bg-3: oklch(1 0 0 / 80%);

  /* Blur intensity per level */
  --glass-blur-1: 12px;
  --glass-blur-2: 20px;
  --glass-blur-3: 32px;

  /* Directional light borders (light from top-left) */
  --glass-border-t: oklch(0 0 0 / 8%);
  --glass-border-l: oklch(0 0 0 / 6%);
  --glass-border-b: oklch(0 0 0 / 3%);
  --glass-border-r: oklch(0 0 0 / 3%);

  /* Brand tinting (Cerulean Blue at micro-opacity) */
  --glass-tint: oklch(0.6018 0.1239 242.355 / 3%);
  --glass-tint-hover: oklch(0.6018 0.1239 242.355 / 6%);

  /* Glass shadows */
  --glass-shadow-sm: 0 4px 16px oklch(0 0 0 / 5%);
  --glass-shadow: 0 8px 32px oklch(0 0 0 / 8%);
  --glass-shadow-lg: 0 16px 48px oklch(0 0 0 / 12%);
  --glass-inner-glow: inset 0 1px 0 0 oklch(1 0 0 / 6%);

  /* Noise texture opacity */
  --glass-noise-opacity: 0.025;
```

### Step 2: Add dark mode glass overrides

Inside `.dark` block (after line 204), add:

```css
  /* ═══ GLASSMORPHISM SYSTEM — DARK ═══ */
  --glass-bg-1: oklch(1 0 0 / 4%);
  --glass-bg-2: oklch(1 0 0 / 7%);
  --glass-bg-3: oklch(1 0 0 / 10%);

  --glass-border-t: oklch(1 0 0 / 15%);
  --glass-border-l: oklch(1 0 0 / 10%);
  --glass-border-b: oklch(1 0 0 / 4%);
  --glass-border-r: oklch(1 0 0 / 4%);

  --glass-tint: oklch(0.7518 0.1239 242.355 / 4%);
  --glass-tint-hover: oklch(0.7518 0.1239 242.355 / 8%);

  --glass-shadow-sm: 0 4px 16px oklch(0.6018 0.1239 242.355 / 6%);
  --glass-shadow: 0 8px 32px oklch(0.6018 0.1239 242.355 / 10%);
  --glass-shadow-lg: 0 16px 48px oklch(0.6018 0.1239 242.355 / 15%);
  --glass-inner-glow: inset 0 1px 0 0 oklch(1 0 0 / 10%);

  --glass-noise-opacity: 0.035;
```

### Step 3: Add `.palette-aml` glass overrides

Inside `.palette-aml` (after line 279), add same light-mode tokens.
Inside `.palette-aml.dark` (after line 326), add same dark-mode tokens.

(Same values as `:root` and `.dark` respectively — they inherit if omitted, but explicit declaration keeps the palette system independent.)

### Step 4: Verify build

Run: `cd client && npm run build`
Expected: No errors. CSS variables are purely additive.

### Step 5: Commit

```
feat: add glassmorphism CSS custom properties foundation
```

---

## Task 2: Glass Utility Classes & Gradient Backgrounds

**Files:**
- Modify: `client/src/app/globals.css`

### Step 1: Add glass utility classes

After the `@layer base` block (after line 350), add:

```css
@layer utilities {
  /* ═══ GLASS PANEL UTILITIES ═══ */

  /* Level 1: Sections, backgrounds */
  .glass-1 {
    background: var(--glass-bg-1);
    backdrop-filter: blur(var(--glass-blur-1));
    -webkit-backdrop-filter: blur(var(--glass-blur-1));
    border: 1px solid;
    border-top-color: var(--glass-border-t);
    border-left-color: var(--glass-border-l);
    border-bottom-color: var(--glass-border-b);
    border-right-color: var(--glass-border-r);
    box-shadow: var(--glass-shadow-sm), var(--glass-inner-glow);
  }

  /* Level 2: Cards, panels */
  .glass-2 {
    background: var(--glass-bg-2);
    backdrop-filter: blur(var(--glass-blur-2));
    -webkit-backdrop-filter: blur(var(--glass-blur-2));
    border: 1px solid;
    border-top-color: var(--glass-border-t);
    border-left-color: var(--glass-border-l);
    border-bottom-color: var(--glass-border-b);
    border-right-color: var(--glass-border-r);
    box-shadow: var(--glass-shadow), var(--glass-inner-glow);
  }

  /* Level 3: Dialogs, popovers, dropdowns */
  .glass-3 {
    background: var(--glass-bg-3);
    backdrop-filter: blur(var(--glass-blur-3));
    -webkit-backdrop-filter: blur(var(--glass-blur-3));
    border: 1px solid;
    border-top-color: var(--glass-border-t);
    border-left-color: var(--glass-border-l);
    border-bottom-color: var(--glass-border-b);
    border-right-color: var(--glass-border-r);
    box-shadow: var(--glass-shadow-lg), var(--glass-inner-glow);
  }

  /* Glass tint overlay (adds diagonal brand color gradient) */
  .glass-tint {
    background-image: linear-gradient(
      135deg,
      var(--glass-tint) 0%,
      transparent 50%,
      var(--glass-tint) 100%
    );
  }

  /* Glass hover enhancement */
  .glass-hover {
    transition: background 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
  }
  .glass-hover:hover {
    box-shadow: var(--glass-shadow-lg), var(--glass-inner-glow);
  }

  /* ═══ GRADIENT MESH BACKGROUNDS ═══ */
  /* Rich backgrounds that make glass surfaces shine */

  .bg-mesh {
    background-image:
      radial-gradient(ellipse at 15% 50%, oklch(0.6018 0.1239 242.355 / 8%) 0%, transparent 50%),
      radial-gradient(ellipse at 85% 15%, oklch(0.6861 0.0842 212.769 / 6%) 0%, transparent 50%),
      radial-gradient(ellipse at 55% 85%, oklch(0.65 0.15 240 / 5%) 0%, transparent 50%);
  }

  .dark .bg-mesh {
    background-image:
      radial-gradient(ellipse at 15% 50%, oklch(0.6018 0.1239 242.355 / 15%) 0%, transparent 50%),
      radial-gradient(ellipse at 85% 15%, oklch(0.6861 0.0842 212.769 / 12%) 0%, transparent 50%),
      radial-gradient(ellipse at 55% 85%, oklch(0.65 0.15 240 / 10%) 0%, transparent 50%);
  }
}
```

### Step 2: Add noise texture class in `@layer base`

Inside the existing `@layer base` block (after the `body` rule around line 336), add:

```css
  /* Noise grain texture for glass surfaces */
  .glass-noise {
    position: relative;
  }
  .glass-noise::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E");
    opacity: var(--glass-noise-opacity);
    pointer-events: none;
    z-index: 1;
    mix-blend-mode: overlay;
  }
```

### Step 3: Verify build

Run: `cd client && npm run build`
Expected: No errors.

### Step 4: Commit

```
feat: add glass utility classes, gradient mesh backgrounds, noise texture
```

---

## Task 3: Card Component — Glass Treatment

**Files:**
- Modify: `client/src/components/ui/card.tsx`

### Step 1: Update Card base classes

Change line 10 from:
```
"bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm"
```
to:
```
"text-card-foreground flex flex-col gap-6 rounded-xl py-6 glass-2 glass-tint"
```

This replaces solid `bg-card` + generic `border` + `shadow-sm` with the glass-2 utility (which includes semi-transparent bg, backdrop-blur, directional borders, shadows, inner glow).

### Step 2: Verify build + visual check

Run: `cd client && npm run dev`
Check: Open any page with cards. Cards should now have glass effect. In dark mode the effect should be more visible.

### Step 3: Commit

```
feat: apply glassmorphism to Card component
```

---

## Task 4: Dialog & Sheet — Glass Overlays

**Files:**
- Modify: `client/src/components/ui/dialog.tsx`
- Modify: `client/src/components/ui/sheet.tsx`

### Step 1: Update DialogOverlay

In `dialog.tsx` line 24, change:
```
"fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
```
to:
```
"fixed inset-0 z-50 bg-black/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
```

### Step 2: Update DialogContent

In `dialog.tsx` line 41, change:
```
"fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg"
```
to:
```
"fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 p-6 duration-200 glass-3 glass-tint sm:rounded-xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]"
```

### Step 3: Update SheetOverlay

In `sheet.tsx`, change SheetOverlay `bg-black/50` to:
```
"bg-black/40 backdrop-blur-sm"
```

### Step 4: Update SheetContent

In `sheet.tsx`, change `bg-background` in SheetContent to:
```
"glass-3"
```
Keep all side-specific classes and animations. Just replace the single `bg-background` token.

### Step 5: Verify

Run: `cd client && npm run build`
Expected: No errors.

### Step 6: Commit

```
feat: apply glassmorphism to Dialog and Sheet overlays
```

---

## Task 5: Dropdown Menu & Select — Glass Popovers

**Files:**
- Modify: `client/src/components/ui/dropdown-menu.tsx`
- Modify: `client/src/components/ui/select.tsx`

### Step 1: Update DropdownMenuContent

In `dropdown-menu.tsx` DropdownMenuContent, change `bg-popover text-popover-foreground` and `border` to:
```
"text-popover-foreground glass-3 glass-tint"
```
Keep all animation classes. Remove the standalone `border` (glass-3 includes borders). Keep `rounded-md`, `p-1`, `shadow-md` can be removed (glass-3 has shadow).

Final className should be:
```
"text-popover-foreground glass-3 glass-tint data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 max-h-(--radix-dropdown-menu-content-available-height) min-w-[8rem] origin-(--radix-dropdown-menu-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-xl p-1"
```

### Step 2: Update DropdownMenuSubContent

Same treatment as DropdownMenuContent. Replace `bg-popover text-popover-foreground` + `border` + `shadow-lg` with `glass-3 glass-tint text-popover-foreground`. Keep animations. Change `rounded-md` to `rounded-xl`.

### Step 3: Update DropdownMenuItem hover

Change `focus:bg-accent focus:text-accent-foreground` to:
```
"focus:bg-white/10 dark:focus:bg-white/10 focus:text-foreground"
```
This makes hover state glass-consistent rather than solid accent color.

### Step 4: Update SelectContent

In `select.tsx` SelectContent, replace `bg-popover text-popover-foreground` + `border` + `shadow-xl` with:
```
"text-popover-foreground glass-3 glass-tint"
```
Keep `rounded-xl`, animations, positioning.

### Step 5: Update SelectItem hover

Change `focus:bg-accent focus:text-accent-foreground` to:
```
"focus:bg-white/10 dark:focus:bg-white/10 focus:text-foreground"
```

### Step 6: Verify build

Run: `cd client && npm run build`

### Step 7: Commit

```
feat: apply glassmorphism to DropdownMenu and Select popovers
```

---

## Task 6: Button & Badge — Glass Variants

**Files:**
- Modify: `client/src/components/ui/button.tsx`
- Modify: `client/src/components/ui/badge.tsx`

### Step 1: Add glass button variant

In `button.tsx`, add after `link` variant (line 21):
```typescript
glass:
  "bg-white/10 dark:bg-white/8 backdrop-blur-xl border border-white/20 dark:border-white/15 text-foreground hover:bg-white/20 dark:hover:bg-white/15 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)] hover:shadow-[0_8px_32px_rgba(45,136,196,0.1),inset_0_1px_0_0_rgba(255,255,255,0.15)]",
```

### Step 2: Update outline variant for glass-friendliness

Change `outline` variant from:
```
"border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50"
```
to:
```
"border border-border/50 bg-background/80 dark:bg-white/5 backdrop-blur-sm shadow-xs hover:bg-accent/80 hover:text-accent-foreground dark:border-white/10 dark:hover:bg-white/10"
```

### Step 3: Add glass badge variant

In `badge.tsx`, add after `link` variant:
```typescript
glass:
  "bg-white/10 dark:bg-white/8 backdrop-blur-md border-white/20 dark:border-white/15 text-foreground shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)] [a&]:hover:bg-white/20",
```

### Step 4: Verify build

Run: `cd client && npm run build`

### Step 5: Commit

```
feat: add glass variants to Button and Badge components
```

---

## Task 7: Tabs, Input, Accordion — Glass Enhancements

**Files:**
- Modify: `client/src/components/ui/tabs.tsx`
- Modify: `client/src/components/ui/input.tsx`
- Modify: `client/src/components/ui/accordion.tsx`

### Step 1: Update TabsList default variant

In `tabs.tsx`, change default variant (line 33) from:
```
default: "bg-muted",
```
to:
```
default: "bg-muted/50 dark:bg-white/5 backdrop-blur-lg border border-white/10 dark:border-white/8",
```

### Step 2: Update TabsTrigger active state

In `tabs.tsx` line 69, change:
```
"data-[state=active]:bg-background dark:data-[state=active]:text-foreground dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 data-[state=active]:text-foreground"
```
to:
```
"data-[state=active]:bg-background/80 dark:data-[state=active]:bg-white/10 data-[state=active]:backdrop-blur-sm dark:data-[state=active]:text-foreground dark:data-[state=active]:border-white/15 data-[state=active]:text-foreground"
```

### Step 3: Update Input dark mode

In `input.tsx` line 11, the existing `dark:bg-input/30` is close but enhance. Change:
```
"dark:bg-input/30 border-input"
```
to:
```
"dark:bg-white/5 dark:backdrop-blur-sm border-input dark:border-white/10"
```

### Step 4: Update AccordionItem border

In `accordion.tsx`, change AccordionItem from:
```
"border-b last:border-b-0"
```
to:
```
"border-b border-border/50 dark:border-white/8 last:border-b-0"
```

### Step 5: Verify build

Run: `cd client && npm run build`

### Step 6: Commit

```
feat: apply glassmorphism to Tabs, Input, and Accordion
```

---

## Task 8: Alert Dialog — Glass Treatment

**Files:**
- Modify: `client/src/components/ui/alert-dialog.tsx`

### Step 1: Read the file and apply same pattern as Dialog

Update AlertDialogOverlay: `bg-black/80` → `bg-black/60 backdrop-blur-sm`
Update AlertDialogContent: replace `bg-background border shadow-lg` → `glass-3 glass-tint`

### Step 2: Commit

```
feat: apply glassmorphism to AlertDialog
```

---

## Task 9: Footer — Glass Layout

**Files:**
- Modify: `client/src/components/layout/Footer.tsx`

### Step 1: Update footer wrapper

Line 7, change:
```
"bg-background border-t border-border/40 relative overflow-hidden"
```
to:
```
"bg-background/80 dark:bg-background/60 backdrop-blur-xl border-t border-white/10 dark:border-white/8 relative overflow-hidden"
```

### Step 2: Update decorative backgrounds

Lines 9-10, replace both decorative divs with:
```tsx
<div className="absolute inset-0 bg-mesh -z-10" />
```

### Step 3: Update SocialButton

Line 129, change:
```
"w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary hover:bg-primary/5 transition-all duration-300"
```
to:
```
"w-10 h-10 rounded-full bg-white/8 dark:bg-white/5 backdrop-blur-md border border-white/15 dark:border-white/10 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/40 hover:bg-primary/10 transition-all duration-300 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]"
```

### Step 4: Update AddressItem

Line 153, change:
```
"flex items-start gap-3 p-3 rounded-2xl bg-muted/40 hover:bg-muted/70 transition-colors border border-transparent hover:border-border/50"
```
to:
```
"flex items-start gap-3 p-3 rounded-2xl bg-white/5 dark:bg-white/3 backdrop-blur-sm border border-white/8 dark:border-white/5 hover:bg-white/10 dark:hover:bg-white/8 hover:border-white/15 dark:hover:border-white/10 transition-all duration-300"
```

### Step 5: Update bottom border

Line 111, change:
```
"border-t border-border pt-8 mt-8"
```
to:
```
"border-t border-white/10 dark:border-white/8 pt-8 mt-8"
```

### Step 6: Verify build

Run: `cd client && npm run build`

### Step 7: Commit

```
feat: apply glassmorphism to Footer layout
```

---

## Task 10: CarCard — Premium Glass Card

**Files:**
- Modify: `client/src/features/catalog/components/CarCard.tsx`

### Step 1: Update main card wrapper

Line 47, change:
```
"group relative bg-card rounded-2xl border border-border overflow-hidden hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 flex flex-col h-full"
```
to:
```
"group relative rounded-2xl overflow-hidden transition-all duration-300 flex flex-col h-full glass-2 glass-tint glass-hover"
```

### Step 2: Read the full file to find spec tags and info badges

Read the file fully, then update any inline `bg-zinc-*` or `bg-muted/*` tags to use glass-consistent `bg-white/8 dark:bg-white/5 border border-white/10` patterns.

### Step 3: Verify build

Run: `cd client && npm run build`

### Step 4: Commit

```
feat: apply glassmorphism to CarCard
```

---

## Task 11: AuctionCard, BlogCard, ReviewCard — Glass Cards

**Files:**
- Modify: `client/src/features/auctions/components/AuctionCard.tsx`
- Modify: `client/src/features/blog/components/BlogCard.tsx`
- Modify: `client/src/features/reviews/components/ReviewCard.tsx`

### Step 1: Apply same pattern as CarCard

For each card, find the main wrapper className and replace `bg-card ... border border-border` with `glass-2 glass-tint glass-hover`. Keep `rounded-2xl overflow-hidden transition-all duration-300 flex flex-col h-full`.

Also update any internal `bg-muted/*` sections to `bg-white/5` glass patterns.

### Step 2: Verify build

Run: `cd client && npm run build`

### Step 3: Commit

```
feat: apply glassmorphism to AuctionCard, BlogCard, ReviewCard
```

---

## Task 12: Home Page — Gradient Mesh Background

**Files:**
- Modify: `client/src/app/page.tsx`

### Step 1: Add gradient mesh to page wrapper

Line 14, change:
```
"flex min-h-screen flex-col bg-background relative"
```
to:
```
"flex min-h-screen flex-col bg-background bg-mesh relative"
```

### Step 2: Commit

```
feat: add gradient mesh background to Home page
```

---

## Task 13: Auth Pages — Premium Glass Forms

**Files:**
- Modify: `client/src/app/(auth)/login/page.tsx`
- Modify: `client/src/app/(auth)/register/page.tsx`

### Step 1: Update login page background

Line 29, change:
```
"-mt-13 md:-mt-20 min-h-screen flex items-center justify-center p-4 bg-muted/50"
```
to:
```
"-mt-13 md:-mt-20 min-h-screen flex items-center justify-center p-4 bg-background bg-mesh"
```

### Step 2: Apply same to register page

Find the matching wrapper and apply same treatment.

### Step 3: Verify build

Run: `cd client && npm run build`

### Step 4: Commit

```
feat: add gradient mesh backgrounds to auth pages
```

---

## Task 14: Contact Page — Glass Sections

**Files:**
- Modify: `client/src/app/contact/page.tsx`

### Step 1: Add gradient mesh to page background

Find the outer wrapper and add `bg-mesh` class.

### Step 2: Update contact form card, working hours card, office cards

Replace solid `bg-card` / `bg-muted/*` backgrounds with glass equivalents:
- Form card → `glass-2 glass-tint`
- Working hours → `glass-1`
- Office cards → `glass-2 glass-tint glass-hover`

### Step 3: Verify build

Run: `cd client && npm run build`

### Step 4: Commit

```
feat: apply glassmorphism to Contact page
```

---

## Task 15: Catalog & Auctions Pages — Glass Background

**Files:**
- Modify: `client/src/app/catalog/page.tsx`
- Modify: `client/src/app/auctions/page.tsx`

### Step 1: Add `bg-mesh` to page wrappers

These pages contain CarCards and AuctionCards which are now glass, so the gradient mesh background will show through them beautifully.

### Step 2: Commit

```
feat: add gradient mesh to Catalog and Auctions pages
```

---

## Task 16: QuickCalculator & CarfaxReport — Enhanced Glass

**Files:**
- Modify: `client/src/features/catalog/components/QuickCalculator.tsx`
- Modify: `client/src/features/catalog/components/CarfaxReport.tsx`

### Step 1: Enhance QuickCalculator

Already semi-glass. Upgrade `bg-background/80 backdrop-blur-xl border border-border/50 shadow-2xl` to:
```
"glass-3 glass-tint glass-noise"
```
Add noise texture to this prominent element for premium feel.

### Step 2: Enhance CarfaxReport

Same approach — replace existing semi-glass with consistent `glass-2 glass-tint`.

### Step 3: Verify build

Run: `cd client && npm run build`

### Step 4: Commit

```
feat: enhance glassmorphism on QuickCalculator and CarfaxReport
```

---

## Task 17: Chat Assistant — Glass Chat Window

**Files:**
- Modify: `client/src/features/chat-assistant/components/ChatWindow.tsx`

### Step 1: Update chat window wrapper

Replace `bg-background border rounded-2xl shadow-2xl` with:
```
"glass-3 glass-tint glass-noise rounded-2xl"
```

### Step 2: Update chat header gradient

Replace solid gradient with glass-enhanced gradient:
```
"bg-gradient-to-r from-primary/80 to-primary/60 backdrop-blur-xl border-b border-white/15"
```

### Step 3: Commit

```
feat: apply glassmorphism to ChatAssistant window
```

---

## Task 18: Home Page Sections — Glass Sections

**Files:**
- Modify: `client/src/features/catalog/components/ProcessSteps.tsx`
- Modify: `client/src/features/catalog/components/Benefits.tsx`
- Modify: `client/src/features/catalog/components/MinimalFAQ.tsx`
- Modify: `client/src/features/reviews/components/ReviewsSection.tsx` (or index)

### Step 1: For each section

Find the main section wrapper and update backgrounds:
- Solid `bg-muted/*` → `bg-white/3 dark:bg-white/2 backdrop-blur-sm`
- Solid `bg-background` → `bg-background/90 dark:bg-background/80`
- Section borders `border-border` → `border-white/8 dark:border-white/5`

### Step 2: Verify build

Run: `cd client && npm run build`

### Step 3: Commit

```
feat: apply glassmorphism to Home page sections
```

---

## Task 19: Dashboard Components — Glass Panels

**Files:**
- Modify: `client/src/components/dashboard/dealer/StatsCards.tsx`
- Modify: `client/src/components/dashboard/profile/SecurityCard.tsx`
- Scan other dashboard components

### Step 1: Apply glass-2 to stat cards and dashboard panels

Same pattern: replace solid `bg-card border` with `glass-2 glass-tint`.

### Step 2: Commit

```
feat: apply glassmorphism to dashboard components
```

---

## Task 20: Remaining Pages — Gradient Mesh

**Files:**
- Modify: `client/src/app/about/page.tsx`
- Modify: `client/src/app/blog/page.tsx`
- Modify: `client/src/app/calculator/page.tsx`
- Modify: `client/src/app/delivery/page.tsx`
- Modify: `client/src/app/reviews/page.tsx`
- Modify: `client/src/app/track/page.tsx`

### Step 1: Add `bg-mesh` class to each page's outer wrapper

This is the simplest change — just adding the gradient mesh class so glass cards on these pages have color to blur through.

### Step 2: Verify full build

Run: `cd client && npm run build`
Expected: Clean build, no errors.

### Step 3: Commit

```
feat: add gradient mesh backgrounds to all remaining pages
```

---

## Task 21: Visual QA & Polish

### Step 1: Run dev server and test

Run: `cd client && npm run dev`

Check the following in BOTH light and dark modes:
- [ ] Home page hero → glass cards visible
- [ ] Catalog page → CarCards are glass with gradient showing through
- [ ] Contact page → form and office cards are glass
- [ ] Auth pages → glass form on gradient mesh
- [ ] Dropdown menus → glass popovers
- [ ] Mobile responsive → glass still works on small screens
- [ ] Dark mode toggle → smooth transition

### Step 2: Fix any issues found

Common issues:
- Text readability on glass → increase glass-bg opacity
- Borders too harsh → reduce border opacity
- Blur too heavy → reduce blur px
- No visual effect in light mode → increase mesh gradient opacity

### Step 3: Final commit

```
chore: visual QA polish for glassmorphism migration
```

---

## Summary

| Phase | Tasks | Files | Impact |
|-------|-------|-------|--------|
| Foundation | 1-2 | 1 (globals.css) | CSS tokens + utilities |
| shadcn/ui | 3-8 | 10 components | Cascading to all consumers |
| Layout | 9 | 1 (Footer) | Site-wide layout |
| Feature Cards | 10-11 | 4 card components | Primary content |
| Pages | 12-13, 15, 20 | ~12 page files | Backgrounds |
| Feature Components | 14, 16-19 | ~8 components | Detail polish |
| QA | 21 | — | Visual testing |

**Total: ~35 files, 21 tasks**

The cascading nature of this approach means Tasks 1-3 create ~70% of the visual impact. The rest is polish and consistency.
