import { relations } from 'drizzle-orm';
import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export enum productDiscountTypes {
  BUY_X_PAY_Y = "BUY_X_PAY_Y",
  BUNDLE = "BUNDLE",
  BULK_DISCOUNT = "BULK_DISCOUNT",
}

export const products = sqliteTable("products", {
  sku: text().primaryKey(),
  name: text().notNull(),
  description: text(),
  price_cents: int().notNull(),
});
export const productsRelations = relations(products, ({ many }) => ({
  sourceDiscounts: many(productDiscounts, {
    relationName: "source_product",
  }),
  targetDiscounts: many(productDiscounts, {
    relationName: "target_product",
  }),
}));

export const productDiscounts = sqliteTable("product_discounts", {
  id: int().primaryKey({ autoIncrement: true }),
  description: text().notNull(),
  source_product_sku: text().notNull(),
  target_product_sku: text().notNull(),
  source_product_units: int(),
  discount_percentage: int(),
  discount_unit: int(),
  type: text().$type<`${productDiscountTypes}`>().notNull(),
});
export const productDiscountsRelations = relations(productDiscounts, ({ one }) => ({
  source_product: one(products, {
    fields: [productDiscounts.source_product_sku],
    references: [products.sku],
    relationName: "source_product",
  }),
  target_product: one(products, {
    fields: [productDiscounts.target_product_sku],
    references: [products.sku],
    relationName: "target_product",
  }),
}));
