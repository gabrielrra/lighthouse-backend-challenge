CREATE TABLE `product_discounts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`description` text NOT NULL,
	`source_product_sku` text NOT NULL,
	`target_product_sku` text NOT NULL,
	`source_product_units` integer,
	`discount_percentage` integer,
	`discount_unit` integer,
	`type` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `products` (
	`sku` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`price_cents` integer NOT NULL
);
