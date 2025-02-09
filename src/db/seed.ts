import { db } from './database';
import { products, productDiscounts } from './schema';

const productsToInsert: Array<typeof products.$inferInsert> = [
  {
    sku: '120P90',
    name: 'Google Home',
    description: '',
    price_cents: 4999
  },
  {
    sku: '43N23P',
    name: 'Mac Pro',
    description: '',
    price_cents: 539999
  },
  {
    sku: 'A304SD',
    name: 'Alexa Speaker',
    description: '',
    price_cents: 10950
  },
  {
    sku: '344222',
    name: 'Raspberry',
    description: '',
    price_cents: 3000
  }
];

const discountsToInsert: Array<typeof productDiscounts.$inferInsert> = [
  {
    id: 1,
    description: 'Buy 3 Google Homes for the price of 2!',
    source_product_sku: productsToInsert[0].sku,
    target_product_sku: productsToInsert[0].sku,
    source_product_units: 3,
    discount_unit: 1,
    type: "BUY_X_PAY_Y"
  },
  {
    id: 2,
    description: 'Each sale of a MacBook Pro comes with a free Raspberry Pi',
    source_product_sku: productsToInsert[1].sku,
    target_product_sku: productsToInsert[3].sku,
    source_product_units: 1,
    discount_unit: 1,
    type: "BUNDLE"
  },
  {
    id: 3,
    description: 'Buying more than 3 Alexa Speakers will have a 10% discount on all Alexa speakers',
    source_product_sku: productsToInsert[2].sku,
    target_product_sku: productsToInsert[2].sku,
    source_product_units: 4,
    discount_percentage: 10,
    type: "BULK_DISCOUNT"
  }
];
async function run() {
  await db.insert(products).values(productsToInsert).onConflictDoNothing();
  await db.insert(productDiscounts).values(discountsToInsert).onConflictDoNothing();
}
run();
