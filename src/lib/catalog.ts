// Read-only catalog queries for the storefront.
import { and, asc, desc, eq, isNotNull, isNull, or } from "drizzle-orm";
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
    .limit(limit);

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

  const category = await db.query.categories.findFirst({
    columns: { id: true },
    where: eq(categories.slug, slug),
  });
  if (!category) return [];

  const query = db
    .select(summaryColumns)
    .from(products)
    .innerJoin(categories, eq(products.categoryId, categories.id))
    .where(
      and(
        eq(products.isActive, true),
        or(
          eq(categories.id, category.id),
          eq(categories.parentId, category.id),
        ),
      ),
    )
    .orderBy(desc(products.createdAt), asc(products.id));

  const rows = limit === undefined ? await query : await query.limit(limit);
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
