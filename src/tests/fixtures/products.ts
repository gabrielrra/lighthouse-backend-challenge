export const testProducts = [
  {
    sku: 'TSHIRT',
    name: 'T-Shirt',
    description: 'Plain white t-shirt',
    price_cents: 2000
  },
  {
    sku: 'MUG',
    name: 'Coffee Mug',
    description: 'Ceramic mug',
    price_cents: 750
  },
  {
    sku: 'HAT',
    name: 'Baseball Cap',
    description: 'One size fits all',
    price_cents: 1500
  }
];

export const testDiscounts = [
  {
    id: 1,
    description: 'Buy 3 T-Shirts, pay for 2',
    source_product_sku: 'TSHIRT',
    target_product_sku: 'TSHIRT',
    source_product_units: 3,
    discount_unit: 1,
    type: 'BUY_X_PAY_Y' as const
  },
  {
    id: 2,
    description: 'Buy a T-Shirt, get a free Mug',
    source_product_sku: 'TSHIRT',
    target_product_sku: 'MUG',
    discount_unit: 1,
    type: 'BUNDLE' as const
  }
];
