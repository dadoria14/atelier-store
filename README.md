This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
pnpm install
pnpm dev
```

This repo uses pnpm (`pnpm-lock.yaml`); don't commit an npm or yarn lockfile.

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `src/app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to load [Jost](https://fonts.google.com/specimen/Jost) (sans) and [EB Garamond](https://fonts.google.com/specimen/EB+Garamond) (display) from Google Fonts.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Stack setup

- **Next.js** (App Router, TypeScript, Tailwind CSS v4)
- **Better Auth**: server config in `src/lib/auth.ts`, client in `src/lib/auth-client.ts`, handler at `src/app/api/auth/[...all]/route.ts`
- **Drizzle ORM + Neon Postgres**: client in `src/db/index.ts`, schema in `src/db/schema/` (re-exported from `index.ts`), config in `drizzle.config.ts`

### First run

```bash
cp .env.example .env    # fill in DATABASE_URL and BETTER_AUTH_SECRET
pnpm install
pnpm db:migrate         # apply the migrations in ./drizzle to Neon
pnpm db:seed            # load the sample catalog (safe to re-run)
pnpm dev
```

When you add auth, run `pnpm auth:generate` (writes `src/db/schema/auth.ts`), export it from `src/db/schema/index.ts`, then `pnpm db:generate` and `pnpm db:migrate`.
