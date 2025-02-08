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
    id: 0,
    description: 'Buy 3 Google Homes for the price of 2!',
    source_product_sku: productsToInsert[0].sku,
    target_product_sku: productsToInsert[0].sku,
    product_amount: 3,
    discount_unit: 1
  },
  {
    id: 1,
    description: 'Each sale of a MacBook Pro comes with a free Raspberry Pi',
    source_product_sku: productsToInsert[1].sku,
    target_product_sku: productsToInsert[3].sku,
    product_amount: 1,
  },
  {
    id: 2,
    description: 'Buying more than 3 Alexa Speakers will have a 10% discount on all Alexa speakers',
    source_product_sku: productsToInsert[2].sku,
    target_product_sku: productsToInsert[2].sku,
    product_amount: 4,
    discount_percentage: 10,
  }
];
async function run() {
  await db.insert(products).values(productsToInsert).onConflictDoNothing();
  await db.insert(productDiscounts).values(discountsToInsert).onConflictDoNothing();
}
run();
