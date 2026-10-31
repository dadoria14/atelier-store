# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Project state

Atelier Store is an eCommerce app at the scaffold stage. The stack is wired together: Next.js 16 App Router, TypeScript, Tailwind v4, Better Auth, and Drizzle ORM on Neon Postgres. The homepage (`src/app/page.tsx`, sections in `src/components/home/`) and the site header/footer (`src/components/layout/`, mounted in the root layout) exist. Catalog data comes from Postgres (see Database conventions); marketing content is placeholder data in `src/lib/sample-data.ts` with Unsplash images (allowed in `next.config.ts` `images.remotePatterns`). No other routes exist yet, so nav links 404. No auth UI or auth tables exist yet.

## Commands

```bash
pnpm dev               # dev server (Turbopack)
pnpm build             # production build
pnpm lint              # ESLint (flat config, eslint.config.mjs)
pnpm typecheck         # tsc --noEmit

pnpm auth:generate     # Better Auth CLI writes its tables into src/db/schema/auth.ts
pnpm db:generate       # drizzle-kit: SQL migrations from schema into ./drizzle
pnpm db:migrate        # apply migrations to DATABASE_URL
pnpm db:push           # push schema directly (no migration files)
pnpm db:studio         # Drizzle Studio
pnpm db:seed           # idempotent catalog seed (src/db/seed.ts, run with tsx)
```

No test runner is configured.

Env: copy `.env.example` to `.env`. `drizzle.config.ts` loads it with `dotenv`. Next.js loads it on its own. Without `BETTER_AUTH_SECRET`, `pnpm build` still succeeds but logs a Better Auth error.
## Architecture

- **DB client** (`src/db/index.ts`): Drizzle over the Neon HTTP driver (`drizzle-orm/neon-http`), not a pooled WebSocket connection. Interactive transactions are not supported on this driver. The client is created with `import * as schema from "./schema"`, so new tables must be re-exported from the barrel `src/db/schema/index.ts` to work with `db.query.*` and with drizzle-kit.
- **Auth server** (`src/lib/auth.ts`): `betterAuth` with `drizzleAdapter(db, { provider: "pg" })`. The `nextCookies()` plugin must stay **last** in `plugins` so Server Actions can set auth cookies. After adding Better Auth plugins or options that change tables, rerun `auth:generate`, then `db:generate`/`db:migrate`.
- **Auth route** (`src/app/api/auth/[...all]/route.ts`): catch-all that mounts Better Auth with `toNextJsHandler`.
- **Auth client** (`src/lib/auth-client.ts`): `better-auth/react` client. Its base URL comes from `NEXT_PUBLIC_APP_URL`.
- **Schema generation**: the old `@better-auth/cli` package is deprecated. The `auth:generate` script uses the `auth` package pinned to the installed `better-auth` version (1.7.13). Update that pin when you upgrade `better-auth`.

## Database conventions

- **Schema layout**: one file per domain in `src/db/schema/` (`catalog.ts`, and later `auth.ts`), each re-exported from `src/db/schema/index.ts`. `auth:generate` overwrites its output file, so it targets `schema/auth.ts` only; after running it, add `export * from "./auth";` to the barrel. Never point the generator at another schema file.
- **Migrations**: versioned only. Run `db:generate`, review the SQL in `drizzle/`, then `db:migrate`. Don't use `db:push`.
- **Keys**: identity integer primary keys; `slug` (unique) is the public identifier used in URLs.
- **Money**: integer cents (`price_cents`), never floats or `numeric`. Display with `formatPrice(cents)` from `src/lib/format.ts`.
- **Stock**: a `stock_quantity` column on `products` (check `>= 0`) until variants exist; then it moves to the variant table. The neon-http driver has no interactive transactions, so decrement in a single conditional `UPDATE … WHERE stock_quantity >= n`, not read-then-write.
- **Categories**: two levels through `parent_id` (departments → product types). Each product has exactly one `category_id`, usually a leaf; department queries include direct children. No many-to-many product/category table.
- **Reads**: the storefront reads catalog data only through `src/lib/catalog.ts`. Functions use `'use cache'` + `cacheLife('hours')` + `cacheTag('catalog')` and return plain serializable objects, not Drizzle rows. Any catalog mutation must call `updateTag('catalog')` inside a Server Action, or `revalidateTag('catalog', 'max')` elsewhere (the one-argument form is deprecated).
- **Build needs the DB**: cached queries run at prerender, so `next build` requires `DATABASE_URL` pointing at a migrated, seeded database.
- **Seed**: `src/db/seed.ts` must stay idempotent (upsert by `slug`).
- **Scope**: v1 is products, categories and stock only. Don't add carts, orders, payments, reviews, wishlists or variants unless asked.

## Design system

Tailwind v4 is configured in CSS only (no `tailwind.config`). `src/app/globals.css` imports, in order:
- `src/styles/tokens.css`: `@theme` tokens. Tailwind's default color palette and radius scale are **removed**, so only project colors exist (`ink`, `paper`, `muted`, `subtle`, `line`, `line-strong`, `surface`, `sale`, `success`, …). Classes like `bg-zinc-50` silently produce nothing.
- `src/styles/base.css`: element defaults, plus `.theme-inverse`, which flips the color tokens for dark sections.
- `src/styles/components.css`: `@utility` primitives (`btn*`, `link`, `link-quiet`, `container-*`, `section`, `stack`, `cluster`, `grid-products`, `grid-split`, `rail`, `media-product`, `media-hero`, `text-display/heading/label/meta/body`, `hairline`, `rule`).

Use these tokens and primitives instead of raw hex values or arbitrary sizes. Fonts are loaded in `src/app/layout.tsx` (Jost → `--font-jost`, EB Garamond → `--font-garamond`).

## Next.js config notes

`next.config.ts` enables `cacheComponents` and `partialPrefetching`, and runs Tailwind through the `@tailwindcss/turbopack` loader. With `cacheComponents` on, caching and dynamic rendering work differently from older Next.js versions. Read `node_modules/next/dist/docs/01-app/01-getting-started/08-caching.md` before writing data-fetching code. Use `proxy.ts` (see `16-proxy.md` in the same folder) for request interception.

Path alias: `@/*` → `src/*`.
