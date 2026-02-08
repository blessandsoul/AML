> **SCOPE**: These rules apply specifically to the **client** directory (Next.js App Router).

# Client Rules — Core Index

**Do NOT read every rule file upfront.** Use this index to find the right rules for your current task.

---

## When to read which file

| You are doing... | Read this |
|------------------|-----------|
| Creating files, organizing folders, setting up a feature module | `01-project-structure.md` |
| Building a component (Server or Client) | `02-component-patterns.md` |
| Writing TypeScript types, interfaces, generics | `03-typescript-rules.md` |
| Managing state (Redux, React Query, URL, local) | `04-state-management.md` |
| Fetching data, calling APIs, handling errors | `05-api-integration.md` |
| Building a form with validation | `06-forms-validation.md` |
| Using hooks, pagination, filters, common UI patterns | `07-common-patterns.md` |
| Choosing colors, theming, dark mode | `08-color-system.md` |
| Handling auth tokens, input sanitization, security | `09-security-rules.md` |
| Designing UI, spacing, typography, shadows, animations | `10-design-aesthetics.md` |
| UX psychology, cognitive load, Nielsen's heuristics, a11y, performance targets | `11-neuro-ux-checklist.md` |

---

## Architecture at a glance

```
Page (Server Component — fetches data)
  -> Feature Components (Server or Client)
      -> Client Components ('use client' — interactivity, hooks, state)
      -> Server Components (default — no hooks, no browser APIs)

State:
  Server data (SSR)     -> Server Components (fetch directly)
  Server data (client)  -> React Query (useTours, useMutation)
  Global client state   -> Redux (auth, user)
  Local state           -> useState / useReducer
  URL state             -> useSearchParams
```

**Key boundaries:**
1. **Server Components** (default) — fetch data, render HTML. No hooks, no event handlers.
2. **Client Components** (`'use client'`) — interactivity, state, effects. Keep as leaf components.
3. **Feature modules** (`src/features/<domain>/`) — components, hooks, services, types, actions grouped by domain.

---

## Non-negotiable rules (always apply)

1. **Server Components by default**: Only add `'use client'` when you need hooks, state, or event handlers.
2. **Component limits**: Max 250 lines, max 5 props, max 3 levels of JSX nesting.
3. **No hardcoded colors**: Use Tailwind tokens (`bg-primary`, `text-foreground`). Never hex/rgb values.
4. **No inline styles**: Tailwind only. Use `cn()` for conditional classes.
5. **Import order**: React/Next -> third-party -> UI -> local -> hooks -> services -> types -> utils.
6. **Forms**: Validate with Zod. Always validate client-side AND server-side.
7. **Security**: Never inject raw HTML without sanitization. Never prefix secrets with `NEXT_PUBLIC_`.
