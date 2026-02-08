> **SCOPE**: These rules apply specifically to the **client** directory (Next.js App Router).

# Design Aesthetics & Visual System

## Design Philosophy

**"Neuro-Minimalism"** — Clean, airy, "expensive" look inspired by Linear, Vercel, Stripe, Arc.
Every visual decision must reduce cognitive load and feel like a native app.

---

## Visual Style

### Surfaces & Depth

- **Border radius**: `12–16px` for cards, modals, and containers. Use `rounded-xl` or `rounded-2xl`.
- **Shadows**: Soft, layered. Prefer `shadow-sm` for cards, larger shadows for modals/popovers:
  ```
  0 1px 3px rgba(0,0,0,0.04)       /* card resting */
  0 8px 32px rgba(0,0,0,0.08)      /* elevated / modal */
  ```
- **Glassmorphism**: Use sparingly — only on sticky headers, floating toolbars, and modal `::backdrop`. Never on content cards.
  ```css
  backdrop-filter: blur(12px) saturate(1.5);
  background: hsl(var(--background) / 0.8);
  ```
- **Noise texture**: Optional 2% noise on large background surfaces for tactile feel (CSS background-image, tiny PNG).

### Color Refinements

> Colors are defined in `08-color-system.md` using HSL + CSS Custom Properties. These rules ADD to that system.

- **No pure black/white in UI surfaces**: Avoid `#000000` and `#FFFFFF` directly. Use your existing `--background` and `--foreground` variables which are already off-pure.
- **Single accent anchor**: The `--primary` color is your "dopamine anchor." Use it ONLY for:
  - Primary CTA buttons
  - Active/selected states
  - Key data highlights
- **90% monochrome rule**: 90% of the interface should be `background`, `foreground`, `muted`, and `border` tokens. Color is the exception, not the norm.
- **Opacity for hierarchy**: Use `bg-primary/10`, `bg-primary/5` for subtle tinted backgrounds instead of adding new color tokens.

---

## Typography

### Font Stack

- **Primary**: Inter v4 (variable) or Geist Sans via `next/font`.
- **Georgian text**: Noto Sans Georgian (variable) — load only when Georgian content is present.
- Load critical fonts with `next/font` + `display: swap`. Non-critical fonts use `display: optional`.

### Typographic Rules

- **Headings**: Use `text-wrap: balance` to prevent orphaned words.
- **Body text**: Use `text-wrap: pretty` for improved line breaking.
- **Numbers/data**: Always apply `font-variant-numeric: tabular-nums` (Tailwind: `tabular-nums`).
- **Hierarchy gap**: Headings must be visibly larger than body text. Minimum ratio:
  - H1: `text-3xl` to `text-4xl`
  - H2: `text-2xl`
  - Body: `text-base`
  - Caption/meta: `text-sm text-muted-foreground`
- **Line height**: Use comfortable line heights — `leading-relaxed` for body, `leading-tight` for headings.
- **Max reading width**: Constrain prose blocks to `max-w-prose` (~65ch) for readability.

---

## Spacing & Layout

### Whitespace as Structure

- **Whitespace IS the divider.** Prefer generous `gap`, `padding`, and `margin` over visible borders/lines.
- **Section gap**: Space between major sections should be **2x** the gap within sections.
  ```tsx
  {/* Between sections: gap-16 or gap-20 */}
  <div className="space-y-16">
    {/* Within a section: gap-6 or gap-8 */}
    <section className="space-y-6">
  ```
- **Consistent spacing scale**: Stick to Tailwind's scale: `4, 6, 8, 12, 16, 20, 24`. Avoid arbitrary values.

### Grid & Alignment

- **Strict grid**: All elements must align to a clear grid. No "floating" elements with inconsistent margins.
- **Container**: Use `container mx-auto` with consistent padding (`px-4 md:px-6 lg:px-8`).
- **Logical properties**: Prefer `ps-4` / `pe-4` / `ms-4` / `me-4` over `pl-4` / `pr-4` for RTL support readiness.

### Modern CSS Layout

- **Container Queries**: Use `@container` for component-level responsive behavior instead of only viewport breakpoints. Components should adapt to their container, not the screen.
- **Subgrid**: Use CSS Subgrid when child elements need to align with parent grid tracks (e.g., card grids where titles align).
- **`aspect-ratio`**: Use `aspect-video`, `aspect-square` for media containers instead of padding hacks.
- **Viewport units**: Use `dvh` (dynamic viewport height) for full-height layouts instead of `vh` (avoids mobile browser bar issues).

---

## Micro-Interactions & Motion

### Principles

- Every interactive element MUST have visible `:hover`, `:active`, and `:focus-visible` states.
- Motion should feel **physical** — quick ease-out, slight overshoot for spring feel.
- **Zero layout shift**: Animations must never cause CLS. Use `transform` and `opacity` only.
- Respect `prefers-reduced-motion`: Wrap all motion in a media query or use Tailwind's `motion-safe:` / `motion-reduce:` variants.

### Standard Interaction States

```tsx
// Button hover/active pattern
className="transition-all duration-200 ease-out hover:brightness-110 active:scale-[0.98]"

// Card hover pattern
className="transition-all duration-300 ease-out hover:shadow-lg hover:-translate-y-0.5"

// Link hover pattern
className="transition-colors duration-150 hover:text-primary"
```

### Advanced Motion (use sparingly)

- **Scroll-driven animations**: Use CSS `animation-timeline: scroll()` or `@starting-style` for enter animations. No scroll-jacking.
- **3D card hover**: Only on `@media (hover: hover)` (desktop with mouse). Use `transform-style: preserve-3d` with small rotation values (max 5deg).
- **Cursor spotlight**: CSS-only radial gradient that follows mouse. Desktop only, hero sections only. Must not impact performance.
- **View Transitions API**: Use for page-to-page navigation transitions in Next.js where supported.

### What NOT to animate

- Do NOT animate layout properties (`width`, `height`, `top`, `left`).
- Do NOT use scroll-jacking or hijack native scroll behavior.
- Do NOT add motion to every element — animate the focal point only.

---

## Images & Media

- **Format priority**: AVIF > WebP > JPEG fallback. Use Next.js `<Image>` which handles this.
- **LCP image**: Always add `priority` prop (sets `fetchpriority="high"`).
- **Blur placeholder**: Use `placeholder="blur"` with `blurDataURL` for perceived instant load.
- **Aspect ratio**: Always set explicit `width` and `height` or use `aspect-ratio` to prevent CLS.
- **Lazy loading**: Default for all images except LCP. Next.js handles this automatically.

---

## Modern HTML & CSS Features

Use these 2025 standards where appropriate:

| Feature | Use for |
|---------|---------|
| `<dialog>` | Modals (with glassmorphism `::backdrop`) |
| `<search>` | Wrapping search form elements |
| Popover API | Dropdowns, tooltips (instead of JS-managed popups) |
| `@layer` | CSS Cascade Layers for reset, base, components, utilities |
| `:has()` | Parent-based styling without JS |
| `content-visibility: auto` | Long lists/pages (skip off-screen rendering) |
| `accent-color` | Style native form controls (checkboxes, radios) |
| `@starting-style` | Entry animations for elements added to DOM |

---

## Dark Mode Refinements

> Dark mode setup is defined in `08-color-system.md`. These are additional visual rules.

- **Shadows in dark mode**: Reduce shadow opacity or replace with subtle light borders. Dark shadows on dark backgrounds are invisible.
- **Images in dark mode**: Consider reducing brightness slightly (`brightness-90`) to prevent eye strain.
- **Glassmorphism in dark mode**: Increase blur radius and reduce background opacity for better readability.

---

## Component Visual Patterns

### Cards
```tsx
<Card className="rounded-xl border border-border/50 bg-card shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
```

### Empty States
- Center vertically and horizontally.
- Use a muted illustration or icon (not colorful).
- One clear CTA. Keep text to 2 lines max.

### Loading
- **Skeleton loaders** over spinners. Match the shape of the content that will load.
- Show skeletons immediately. No delay before showing loading state.

### Modals
- Use native `<dialog>` or Radix Dialog.
- Glassmorphism backdrop: `backdrop:bg-background/60 backdrop:backdrop-blur-sm`.
- Max width `max-w-lg`. Always dismissible with Escape and backdrop click.

---

## AI Agent Rules

### Rule 1: Whitespace over borders
```tsx
// Bad
<div className="border-b pb-4 mb-4">

// Good
<div className="pb-8">
```
Use spacing to separate. Lines/borders only when semantically meaningful (e.g., table rows).

### Rule 2: One accent color
Never introduce a second brand color for emphasis. Use opacity variants of `--primary` instead.

### Rule 3: Motion budget
A page should have at most 2-3 animated elements in view at once. More than that creates visual noise.

### Rule 4: Shadows tell depth
Resting cards: `shadow-sm`. Hovered/elevated: `shadow-md` to `shadow-lg`. Modals/popovers: `shadow-xl`. Never skip levels.

---

## Design Checklist

- [ ] No pure black/white — using theme tokens
- [ ] Border radius 12-16px on containers
- [ ] Soft shadows, layered by elevation
- [ ] Glassmorphism only on sticky/floating elements
- [ ] Typography: `text-wrap: balance` on headings, `tabular-nums` on data
- [ ] Whitespace as primary divider (2x gap between sections vs within)
- [ ] All interactive elements have hover/active/focus-visible states
- [ ] Motion respects `prefers-reduced-motion`
- [ ] No layout-shifting animations (transform/opacity only)
- [ ] Images: AVIF, blur placeholder, explicit dimensions
- [ ] LCP image has `priority` prop
- [ ] Max 2-3 animated elements in viewport at once

---

**Last Updated**: February 2025
