import { relations, sql } from "drizzle-orm";
import {
  type AnyPgColumn,
  boolean,
  check,
  index,
  integer,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
};

// Departments (parentId = null) and the product types beneath them.
export const categories = pgTable(
  "categories",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    parentId: integer("parent_id").references(
      (): AnyPgColumn => categories.id,
      { onDelete: "restrict" },
    ),
    slug: text("slug").notNull().unique(),
    name: text("name").notNull(),
    imageUrl: text("image_url"),
    position: integer("position").notNull().default(0),
    ...timestamps,
  },
  (t) => [index("categories_parent_id_idx").on(t.parentId)],
);

export const products = pgTable(
  "products",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    categoryId: integer("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "restrict" }),
    slug: text("slug").notNull().unique(),
    name: text("name").notNull(),
    description: text("description"),
    priceCents: integer("price_cents").notNull(),
    imageUrl: text("image_url").notNull(),
    badge: text("badge"),
    stockQuantity: integer("stock_quantity").notNull().default(0),
    isActive: boolean("is_active").notNull().default(true),
    ...timestamps,
  },
  (t) => [
    index("products_category_id_idx").on(t.categoryId),
    index("products_active_created_at_idx").on(t.isActive, t.createdAt.desc()),
    check("products_price_cents_nonnegative", sql`${t.priceCents} >= 0`),
    check("products_stock_quantity_nonnegative", sql`${t.stockQuantity} >= 0`),
  ],
);

export const categoriesRelations = relations(categories, ({ one, many }) => ({
  parent: one(categories, {
    fields: [categories.parentId],
    references: [categories.id],
    relationName: "category_parent",
  }),
  children: many(categories, { relationName: "category_parent" }),
  products: many(products),
}));

export const productsRelations = relations(products, ({ one }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
}));

export type Category = typeof categories.$inferSelect;
export type Product = typeof products.$inferSelect;
