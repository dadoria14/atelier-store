// Drizzle table definitions. Every table must be re-exported here so it is
// visible to db.query.* and drizzle-kit.
// Better Auth tables: run `npm run auth:generate` (writes ./auth.ts), then add
// `export * from "./auth";` below.
export * from "./catalog";
