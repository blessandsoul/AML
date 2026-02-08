> **SCOPE**: These rules apply to the **entire workspace** (server + client). Always active.

# Global Rules — Core Index

These rules are always in effect regardless of which directory you are working in.

---

## When to read which file

| You are doing... | Read this |
|------------------|-----------|
| Making any code change | This file (rules below always apply) |
| Need full details on safe editing | `ai-edit-safety.md` |

---

## Non-negotiable rules (always apply)

1. **Small, focused changes**: Only modify what's necessary. Don't restructure code unless asked.
2. **Preserve signatures**: Don't change existing function signatures, exports, or imports unless explicitly requested.
3. **Extend, don't rewrite**: Add to existing modules. Don't gut and rebuild.
4. **Protect critical flows**: Never break existing auth, payment, or core business logic behavior.
5. **No half-done work**: If something is incomplete, add a `// TODO:` with explanation.
6. **No noisy logs**: No debug logs in production code. Mark temporary ones with `// TODO: remove debug log`.
7. **Call out breaking changes**: If a change is unavoidable, state it clearly in your explanation.
