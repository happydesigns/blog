# Contributing

Read `README.md` and `ARCHITECTURE.md` before making changes.

Keep changes focused and use Conventional Commits. Treat module options,
content schemas, routes, feeds, exports, components, composables, and status
semantics as public contracts. Add regression tests when any of them changes.

Prefer explicit types, meaningful errors, and small adapters. Do not add a
dependency when the current Nuxt stack or a small deterministic function solves
the problem. Never hardcode secrets, customer content, brand assets, or
deployment-specific endpoints.

Before review, run:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm prepack
pnpm dev:build
```

