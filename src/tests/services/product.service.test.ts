import { describe, beforeEach, it, expect, beforeAll } from 'vitest';
import { testProducts } from '../fixtures/products';
import * as productService from '../../services/product.service';
import { products } from '../../db/schema';
import { db } from '../../db/database';
// import { runMigrations } from '../setup';

describe('Product Service', () => {

  // beforeAll(async () => {
  //   await runMigrations();
  // });

  beforeEach(async () => {
    await db.delete(products);
    await db.insert(products).values(testProducts);
  });

  it('should find all products with pagination', async () => {
    const result = await productService.findAllAndCount(1, 2);

    expect(result.data).toHaveLength(2);
    expect(result.total).toBe(3);
    expect(result.pagesTotal).toBe(2);
  });

  it('should find one product by SKU', async () => {
    const product = await productService.findOne('TSHIRT');

    expect(product).toMatchObject({
      sku: 'TSHIRT',
      name: 'T-Shirt'
    });
  });

  it('should search products by SKUs', async () => {
    const { data: results } = await productService.search({
      filters: { skus: ['TSHIRT', 'MUG'] },
      page: 1,
      limit: 100
    });

    expect(results).toHaveLength(2);
    expect(results.map(p => p.sku)).toContain('TSHIRT');
    expect(results.map(p => p.sku)).toContain('MUG');
  });
});
