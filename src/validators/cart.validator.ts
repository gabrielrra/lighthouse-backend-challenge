import { z } from "zod";

export const cartProductsSchema = z.array(z.object({
  sku: z.string().min(1, "SKU cannot be empty"),
  quantity: z.number().positive("Quantity must be a positive number"),
}));

export const checkoutSchema = z.object({
  body: cartProductsSchema.min(1, "Cart must have at least one product").max(1000, "Cart can only have at most 1000 products"),
});

export type CartProduct = z.infer<typeof cartProductsSchema>[0];
