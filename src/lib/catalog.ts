// Read-only catalog queries for the storefront.
import {
  and,
  asc,
  desc,
  eq,
  inArray,
  isNotNull,
  isNull,
  or,
} from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";

import { db } from "@/db";
import { categories, products } from "@/db/schema";

export type ProductSummary = {
  slug: string;
  name: string;
  categoryName: string;
  priceCents: number;
  imageUrl: string;
  badge: string | null;
  inStock: boolean;
};

export type Department = {
  slug: string;
  name: string;
  imageUrl: string;
};

const DEFAULT_PRODUCT_LIMIT = 50;
const MAX_PRODUCT_LIMIT = 100;

// Coerce a caller-supplied limit into 1..MAX_PRODUCT_LIMIT.
function clampLimit(limit: number | undefined, fallback = DEFAULT_PRODUCT_LIMIT) {
  if (limit === undefined || !Number.isFinite(limit)) return fallback;
  return Math.min(Math.max(1, Math.trunc(limit)), MAX_PRODUCT_LIMIT);
}

const summaryColumns = {
  slug: products.slug,
  name: products.name,
  categoryName: categories.name,
  priceCents: products.priceCents,
  imageUrl: products.imageUrl,
  badge: products.badge,
  stockQuantity: products.stockQuantity,
};

function toSummary({
  stockQuantity,
  ...row
}: {
  stockQuantity: number;
} & Omit<ProductSummary, "inStock">): ProductSummary {
  return { ...row, inStock: stockQuantity > 0 };
}

export async function getNewArrivals(limit = 8): Promise<ProductSummary[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("catalog");

  const rows = await db
    .select(summaryColumns)
    .from(products)
    .innerJoin(categories, eq(products.categoryId, categories.id))
    .where(eq(products.isActive, true))
    .orderBy(desc(products.createdAt), asc(products.id))
    .limit(clampLimit(limit, 8));

  return rows.map(toSummary);
}

// Products in the category or any of its direct children.
export async function getProductsInCategory(
  slug: string,
  limit?: number,
): Promise<ProductSummary[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("catalog");

  // Subquery keeps this to one round-trip to Neon.
  const target = db
    .select({ id: categories.id })
    .from(categories)
    .where(eq(categories.slug, slug));

  const rows = await db
    .select(summaryColumns)
    .from(products)
    .innerJoin(categories, eq(products.categoryId, categories.id))
    .where(
      and(
        eq(products.isActive, true),
        or(
          inArray(categories.id, target),
          inArray(categories.parentId, target),
        ),
      ),
    )
    .orderBy(desc(products.createdAt), asc(products.id))
    .limit(clampLimit(limit));

  return rows.map(toSummary);
}

// Top-level categories shown as homepage tiles.
export async function getDepartments(): Promise<Department[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("catalog");

  const rows = await db
    .select({
      slug: categories.slug,
      name: categories.name,
      imageUrl: categories.imageUrl,
    })
    .from(categories)
    .where(and(isNull(categories.parentId), isNotNull(categories.imageUrl)))
    .orderBy(asc(categories.position), asc(categories.id));

  return rows.map((row) => ({ ...row, imageUrl: row.imageUrl! }));
}
