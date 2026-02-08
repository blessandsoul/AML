> **SCOPE**: These rules apply specifically to the **client** directory (Next.js App Router).

# Neuro-UX & Cognitive Load Checklist

## Purpose

This file defines UX rules rooted in cognitive psychology and usability research. Apply these when building any user-facing page or component. The goal: **reduce user stress, increase clarity, make actions feel instant.**

---

## 1. Cognitive Load — Miller's Law (Rule of 7)

- **No viewport section should contain more than 5-7 distinct interactive elements.**
- If a section has more, use **Progressive Disclosure**:
  - Tabs, accordions, "Show more" buttons, or carousels to hide secondary content.
  - Prioritize: What does the user need FIRST?
- **Audit every page**: Count interactive elements per visible section. Refactor if over 7.

```tsx
// Bad: 12 buttons/links visible at once in one section
// Good: 5 primary actions visible, rest in dropdown or "More" menu
```

---

## 2. Gestalt Principles

### Proximity (Grouping)

- Related items must be visually close. Unrelated items must have clear separation.
- **Gap between groups = 2x gap within groups** (see `10-design-aesthetics.md` spacing rules).

### Pregnanz (Simplicity)

- All elements must align to a strict grid. The eye should detect simple geometric shapes (rectangles, clean rows/columns).
- No "floating" elements with inconsistent or arbitrary positioning.

### Similarity

- Elements that do the same thing must look the same (same size, color, shape).
- Don't use different button styles for the same action type across pages.

### Common Region

- Group related controls inside a visual container (card, well, bordered section).
- Use `bg-muted/50` or subtle borders to define regions without adding visual weight.

---

## 3. Dopamine Feedback — Instant Response

### Every action must have a visible result

| User action | Required feedback | Timing |
|-------------|-------------------|--------|
| Click button | Visual press state (`active:scale-[0.98]`) | Instant (<50ms) |
| Submit form | Loading state on button + disable | Instant |
| Successful action | Toast notification | <500ms |
| Failed action | Inline error OR toast | <500ms |
| Navigate | Page transition or skeleton | Instant |
| Hover interactive element | Visual change (color, shadow, scale) | <100ms |

### Optimistic UI

- UI should update **immediately** on user action, before server confirms.
- If the server rejects, revert and show error.
- This eliminates perceived latency and keeps users in flow.

```tsx
// Example: Like button updates instantly
const handleLike = () => {
  setLiked(true);              // Optimistic update
  likeMutation.mutate(tourId); // Server call in background
};
```

### Loading States

- **Skeleton loaders** over spinners. Always.
- Skeletons must match the shape of the incoming content.
- Show skeletons immediately — no artificial delay.
- Spinners are allowed ONLY inside buttons during form submission.

---

## 4. Nielsen's 10 Usability Heuristics (2025)

Apply these to every page. When reviewing work, audit against this list.

### H1: Visibility of System Status
- Always show loading state (skeleton, progress bar, spinner in button).
- Show toast for completed actions (success, error).
- Forms must show inline validation as user types.

### H2: Match Between System and Real World
- Use human language, not technical terms. "Sign in" not "Authenticate."
- Icons must be universally understood (trash = delete, pencil = edit).
- Dates in user's locale format. Currencies with proper symbols.

### H3: User Control and Freedom
- Every modal/drawer must be dismissible with Escape key and backdrop click.
- Every destructive action must have an "Undo" option or confirmation dialog.
- "Back" navigation must always work. Never trap the user.
- Multi-step forms must allow going back to previous steps.

### H4: Consistency and Standards
- Same action = same button style, same position, same label across all pages.
- Consistent spacing, border radius, shadow depth everywhere.
- Follow platform conventions (e.g., search icon = magnifying glass).

### H5: Error Prevention
- Validate inputs in real-time as the user types (Zod + React Hook Form).
- Disable submit button until form is valid.
- Use type-appropriate inputs (`type="email"`, `type="tel"`, date pickers).
- For destructive actions, require confirmation ("Are you sure?").

### H6: Recognition Rather Than Recall
- Show recent searches, saved filters, previously viewed items.
- Labels must always be visible (don't rely on placeholder-only inputs).
- Navigation items must be visible, not hidden behind menus on desktop.

### H7: Flexibility and Efficiency
- Support keyboard shortcuts for power users (Cmd+K search, Escape to close).
- Preserve user's filter/sort preferences in URL state (`useSearchParams`).
- Allow bulk actions where appropriate (select multiple, batch delete).

### H8: Aesthetic and Minimalist Design
- Every element must earn its place. Remove decorative-only elements.
- If content can be shown in 5 words, don't use 15.
- Prefer whitespace over visual separators.

### H9: Help Users Recover from Errors
- Error messages must say: **what went wrong** + **how to fix it**.
  ```
  Bad:  "Error 422"
  Good: "Email is already registered. Try signing in instead."
  ```
- Highlight the exact field with the error (red border + message below field).
- Never clear the entire form on error — preserve user input.

### H10: Help and Documentation
- Use contextual tooltips for complex features (hover info icons).
- Provide onboarding hints for first-time users (but dismissible).
- Link to docs/help from within the interface where relevant.

---

## 5. Performance Targets

These are UX requirements, not just engineering metrics — slow UI causes user frustration.

| Metric | Target | Why |
|--------|--------|-----|
| Lighthouse Performance | 98+ | Perceived speed |
| Lighthouse Accessibility | 98+ | Inclusive design |
| LCP (Largest Contentful Paint) | <2.5s | User sees content fast |
| CLS (Cumulative Layout Shift) | 0 | Nothing jumps around |
| INP (Interaction to Next Paint) | <200ms | Clicks feel instant |

### How to hit these

- Images: AVIF format, `priority` on LCP image, blur placeholders.
- Fonts: `next/font` with `display: swap`, preload critical fonts.
- JS: No unused imports. Tree-shake. Lazy-load below-fold components.
- CSS: Use `content-visibility: auto` for long lists.
- Lists: Virtualize lists with 50+ items (`@tanstack/react-virtual`).

---

## 6. Accessibility (A11y) Requirements

### Keyboard Navigation
- All interactive elements must be reachable via Tab.
- Focus rings visible only on keyboard interaction (`:focus-visible`, not `:focus`).
- Custom focus styles that match the design system (e.g., ring-2 ring-primary/50).

### Screen Readers
- Meaningful `alt` text on all images. Decorative images: `alt=""`.
- `aria-label` on icon-only buttons.
- Correct heading hierarchy (one `h1` per page, no skipped levels).
- Live regions (`aria-live="polite"`) for dynamic content updates (toasts, counters).

### Motion
- All animations wrapped in `motion-safe:` variant or `@media (prefers-reduced-motion: no-preference)`.
- With reduced motion: transitions should still exist but be instant (`duration-0`) rather than removed entirely.

### Contrast
- Text on backgrounds: minimum WCAG AA (4.5:1 ratio).
- Large text / UI elements: minimum 3:1 ratio.
- Test with browser DevTools contrast checker or axe.

---

## 7. Microcopy & Tone

### Button Labels
- Use action verbs: "Save changes", "Create tour", "Delete account".
- Never generic: "Submit", "OK", "Click here".
- Destructive actions: Be specific — "Delete tour" not just "Delete".

### Toast Messages
- Success: Short, confirming. "Tour created successfully."
- Error: What happened + what to do. "Failed to save. Check your connection and try again."
- Keep under 10 words when possible.

### Empty States
- Explain what this area is for + how to fill it.
  ```
  "No tours yet. Create your first tour to get started."
  ```
- Always include a CTA button to resolve the empty state.

### Error Messages (Forms)
- Specific to the field: "Email must be a valid address" not "Invalid input."
- Appear below the field, not in an alert box.
- Red text (`text-destructive`) + red border on the field.

---

## AI Agent Audit Process

When building or reviewing a page, run through this checklist:

1. **Count**: How many interactive elements per viewport section? (Must be ≤ 7)
2. **Grid**: Do all elements align to a visible grid? Any floating/misaligned items?
3. **Feedback**: Does every button/link have hover + active + focus-visible states?
4. **Loading**: Are there skeletons for async content? (Not spinners)
5. **Errors**: Do all forms show inline field-level errors?
6. **Escape**: Can the user dismiss every modal/dialog with Escape?
7. **Keyboard**: Can you Tab through all interactive elements in logical order?
8. **Contrast**: Does text pass WCAG AA contrast ratio?
9. **Motion**: Is all animation wrapped in `motion-safe:`?
10. **Performance**: Is the LCP image marked with `priority`?

---

## UX Checklist

- [ ] ≤ 7 interactive elements per viewport section
- [ ] Strict grid alignment — no floating elements
- [ ] Progressive disclosure for complex sections
- [ ] Every interaction has instant visual feedback
- [ ] Optimistic UI for mutations
- [ ] Skeleton loaders for all async content
- [ ] Nielsen's H1-H10 addressed
- [ ] Error messages: specific, actionable, field-level
- [ ] Empty states: explanation + CTA
- [ ] Keyboard navigable, correct focus order
- [ ] Focus-visible rings (not focus)
- [ ] WCAG AA contrast on all text
- [ ] `prefers-reduced-motion` respected
- [ ] Lighthouse 98+ (Performance + Accessibility)
- [ ] CLS 0, INP < 200ms

---

**Last Updated**: February 2025
