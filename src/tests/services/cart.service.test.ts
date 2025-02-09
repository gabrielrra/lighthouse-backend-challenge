import { describe, beforeEach, it, expect } from 'vitest';
import { testProducts, testDiscounts } from '../fixtures/products';
import * as cartService from '../../services/cart.service';
import { productDiscounts, products } from '../../db/schema';
import { db } from '../../db/database';

describe('Cart Service', () => {

  beforeEach(async () => {
    await db.delete(products);
    await db.delete(productDiscounts);
    await db.insert(products).values(testProducts);
    await db.insert(productDiscounts).values(testDiscounts);
  });

  it('should calculate cart with Buy X Pay Y discount', async () => {
    const result = await cartService.calculateCartPrice([
      { sku: 'TSHIRT', quantity: 3 }
    ]);

    expect(result.totalPrice).toBe('$60.00');
    expect(result.totalDiscount).toBe('$20.00');
    expect(result.finalPrice).toBe('$40.00');
  });

  it('should calculate cart with bundle discount', async () => {
    const result = await cartService.calculateCartPrice([
      { sku: 'TSHIRT', quantity: 1 },
      { sku: 'MUG', quantity: 1 }
    ]);

    expect(result.totalPrice).toBe('$27.50');
    expect(result.totalDiscount).toBe('$7.50');
    expect(result.finalPrice).toBe('$20.00');
  });

  it('should show warning when discount conditions are not met', async () => {
    const result = await cartService.calculateCartPrice([
      { sku: 'TSHIRT', quantity: 2 }
    ]);

    expect(result.warnings).toHaveLength(2);
    expect(result.warnings[0]).toContain('Add 1 more units');
  });
});
