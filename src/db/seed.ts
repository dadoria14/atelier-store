// Seeds the catalog with the storefront's original sample products.
// Idempotent: every row is upserted by slug, so it is safe to re-run.
// Run with: npm run db:seed
import "dotenv/config";

import { sql } from "drizzle-orm";

import { unsplash } from "../lib/sample-data";
import { db } from "./index";
import { categories, products } from "./schema";

type SeedCategory = {
  slug: string;
  name: string;
  image?: string;
  children?: { slug: string; name: string }[];
};

type SeedProduct = {
  slug: string;
  name: string;
  category: string;
  price: number;
  image: string;
  badge?: string;
  stock: number;
};

const departments: SeedCategory[] = [
  {
    slug: "women",
    name: "Women",
    image: unsplash("1483985988355-763728e1935b", 1200),
    children: [
      { slug: "women-ready-to-wear", name: "Ready-to-wear" },
      { slug: "women-shoes", name: "Shoes" },
    ],
  },
  {
    slug: "men",
    name: "Men",
    image: unsplash("1617137968427-85924c800a22", 1200),
    children: [
      { slug: "men-ready-to-wear", name: "Ready-to-wear" },
      { slug: "men-shoes", name: "Shoes" },
    ],
  },
  {
    slug: "bags",
    name: "Bags",
    image: unsplash("1584917865442-de89df76afd3", 1200),
  },
  {
    slug: "accessories",
    name: "Accessories",
    image: unsplash("1469334031218-e382a71b716b", 1200),
    children: [
      { slug: "jewelry", name: "Jewelry" },
      { slug: "eyewear", name: "Eyewear" },
      { slug: "watches", name: "Watches" },
    ],
  },
];

// Newest first: list order becomes created_at order.
const newArrivals: SeedProduct[] = [
  {
    slug: "floral-wrap-dress",
    name: "Floral Silk Wrap Dress",
    category: "women-ready-to-wear",
    price: 2450,
    image: unsplash("1496747611176-843222e1e57c", 1000),
    badge: "New",
    stock: 6,
  },
  {
    slug: "leather-biker-jacket",
    name: "Leather Biker Jacket",
    category: "women-ready-to-wear",
    price: 3900,
    image: unsplash("1551028719-00167b16eac5", 1000),
    stock: 4,
  },
  {
    slug: "floral-print-pump",
    name: "Floral Print Pump",
    category: "women-shoes",
    price: 890,
    image: unsplash("1543163521-1bf539c55dd2", 1000),
    badge: "New",
    stock: 12,
  },
  {
    slug: "woven-basket-bag",
    name: "Woven Basket Bag",
    category: "bags",
    price: 1980,
    image: unsplash("1590874103328-eac38a683ce7", 1000),
    stock: 8,
  },
  {
    slug: "nylon-bomber-jacket",
    name: "Nylon Bomber Jacket",
    category: "men-ready-to-wear",
    price: 1650,
    image: unsplash("1591047139829-d91aecb6caea", 1000),
    stock: 10,
  },
  {
    slug: "suede-brogue",
    name: "Suede Brogue",
    category: "men-shoes",
    price: 950,
    image: unsplash("1560343090-f0409e92791a", 1000),
    stock: 9,
  },
  {
    slug: "structured-satchel-teal",
    name: "Structured Satchel",
    category: "bags",
    price: 2200,
    image: unsplash("1594223274512-ad4803739b7c", 1000),
    badge: "Exclusive",
    stock: 3,
  },
  {
    slug: "fringed-knit-poncho",
    name: "Fringed Knit Poncho",
    category: "women-ready-to-wear",
    price: 1150,
    image: unsplash("1434389677669-e08b4cac3105", 1000),
    stock: 0,
  },
];

const accessories: SeedProduct[] = [
  {
    slug: "sapphire-drop-earrings",
    name: "Sapphire Drop Earrings",
    category: "jewelry",
    price: 1750,
    image: unsplash("1535632066927-ab7c9ab60908", 1000),
    stock: 5,
  },
  {
    slug: "crescent-pendant-necklace",
    name: "Crescent Pendant Necklace",
    category: "jewelry",
    price: 640,
    image: unsplash("1599643478518-a784e5dc4c8f", 1000),
    stock: 15,
  },
  {
    slug: "halo-diamond-ring",
    name: "Halo Ring",
    category: "jewelry",
    price: 4200,
    image: unsplash("1605100804763-247f67b3557e", 1000),
    stock: 2,
  },
  {
    slug: "round-metal-sunglasses",
    name: "Round Metal Sunglasses",
    category: "eyewear",
    price: 520,
    image: unsplash("1511499767150-a48a237f0083", 1000),
    stock: 20,
  },
  {
    slug: "minimal-leather-watch",
    name: "Leather Strap Watch",
    category: "watches",
    price: 1390,
    image: unsplash("1524592094714-0f0654e20314", 1000),
    stock: 7,
  },
];

const excluded = (column: string) => sql`excluded.${sql.identifier(column)}`;

async function upsertCategories(
  rows: (typeof categories.$inferInsert)[],
): Promise<Map<string, number>> {
  if (rows.length === 0) return new Map();

  const saved = await db
    .insert(categories)
    .values(rows)
    .onConflictDoUpdate({
      target: categories.slug,
      set: {
        parentId: excluded("parent_id"),
        name: excluded("name"),
        imageUrl: excluded("image_url"),
        position: excluded("position"),
        updatedAt: new Date(),
      },
    })
    .returning({ id: categories.id, slug: categories.slug });

  return new Map(saved.map((row) => [row.slug, row.id]));
}

async function main() {
  const departmentIds = await upsertCategories(
    departments.map((department, position) => ({
      slug: department.slug,
      name: department.name,
      imageUrl: department.image ?? null,
      parentId: null,
      position,
    })),
  );

  const childIds = await upsertCategories(
    departments.flatMap((department) =>
      (department.children ?? []).map((child, position) => ({
        slug: child.slug,
        name: child.name,
        imageUrl: null,
        parentId: departmentIds.get(department.slug)!,
        position,
      })),
    ),
  );

  const categoryIds = new Map([...departmentIds, ...childIds]);

  // Accessories get older timestamps so "New This Season" matches the
  // original homepage selection.
  const now = Date.now();
  const minute = 60_000;
  const day = 24 * 60 * minute;
  const productRows = [
    ...newArrivals.map((product, i) => ({ product, at: now - i * minute })),
    ...accessories.map((product, i) => ({ product, at: now - day - i * minute })),
  ].map(({ product, at }) => {
    const categoryId = categoryIds.get(product.category);
    if (!categoryId) throw new Error(`Unknown category: ${product.category}`);
    return {
      categoryId,
      slug: product.slug,
      name: product.name,
      priceCents: product.price * 100,
      imageUrl: product.image,
      badge: product.badge ?? null,
      stockQuantity: product.stock,
      createdAt: new Date(at),
    };
  });

  await db
    .insert(products)
    .values(productRows)
    .onConflictDoUpdate({
      target: products.slug,
      set: {
        categoryId: excluded("category_id"),
        name: excluded("name"),
        priceCents: excluded("price_cents"),
        imageUrl: excluded("image_url"),
        badge: excluded("badge"),
        stockQuantity: excluded("stock_quantity"),
        createdAt: excluded("created_at"),
        updatedAt: new Date(),
      },
    });

  console.log(
    `Seeded ${categoryIds.size} categories and ${productRows.length} products.`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
