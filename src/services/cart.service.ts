import { z } from 'zod';
import { type CartProduct } from '../validators/cart.validator';
import * as productService from '../services/product.service';
import * as productDiscountService from '../services/productDiscount.service';
import { formatCurrency } from '../utils/formatCurrency';
import { logger } from '../utils/logger';

function mergeRepeated(products: CartProduct[]) {
  const newProducts: CartProduct[] = [];
  for (const p of products) {
    const existingProduct = newProducts.find(np => np.sku === p.sku);
    if (existingProduct) {
      existingProduct.quantity += p.quantity;
    } else {
      newProducts.push({ ...p });
    }
  }

  return newProducts;

}

export async function calculateCartPrice(products: CartProduct[]) {
  products = mergeRepeated(products);
  let productSkus = products.map(p => p.sku);
  const allDiscounts = await productDiscountService.search({ product_skus: productSkus });
  productSkus = [...allDiscounts.map(d => d.target_product_sku), ...productSkus];
  productSkus = [...new Set(productSkus)];
  const productsInfo = await productService.search({ skus: productSkus });
  let totalPrice = 0;
  let totalDiscount = 0;
  const warns = [];

  for (const p of products) {
    const quantity = p.quantity;
    const product = productsInfo.find(pr => pr.sku === p.sku);

    if (!product) {
      logger.error('Invalid cart product', p);
      continue;
    }

    const price = product.price_cents * quantity;
    totalPrice += price;
    const productDiscounts = allDiscounts.filter(d => d.source_product_sku === product.sku);

    if (productDiscounts.length === 0) continue;

    let highestProductDiscountPrice = 0;
    for (const discount of productDiscounts) {

      switch (discount.type) {
        case 'BUY_X_PAY_Y':
          {
            if (!discount.source_product_units || !discount.discount_unit) {
              logger.warn('Invalid product discount', discount);
              break;
            };

            if (quantity >= discount.source_product_units) {
              const discountUnits = Math.floor(quantity / discount.source_product_units) * discount.discount_unit;
              const discountPrice = discountUnits * product.price_cents;
              if (discountPrice > highestProductDiscountPrice) {
                highestProductDiscountPrice = discountPrice;
              }
            } else {
              warns.push(`Add ${discount.source_product_units - quantity} more units of ${product.name} to your cart for a discount!`);
            }
            break;
          }
        case 'BUNDLE':
          {
            if (!discount.target_product_sku || !discount.discount_unit) {
              logger.warn('Invalid product discount', discount);
              break;
            };

            const targetProduct = productsInfo.find(p => p.sku === discount.target_product_sku)!;
            if (!targetProduct) {
              logger.error('Target product for discount not found', discount);
              break;
            };

            const targetQuantity = products.find(p => p.sku === targetProduct.sku)?.quantity || 0;
            if (targetQuantity === 0) {
              warns.push(`Add ${discount.discount_unit} units of ${targetProduct.name} to your cart for free!`);
              break;
            }
            const discountUnits = Math.min(quantity, targetQuantity);
            const discountPrice = discountUnits * targetProduct.price_cents;
            if (discountPrice > highestProductDiscountPrice) {
              highestProductDiscountPrice = discountPrice;
            }
            break;
          }

        case 'BULK_DISCOUNT':
          {
            if (!discount.source_product_units || !discount.discount_percentage) {
              logger.warn('Invalid product discount', discount);
              break;
            };

            if (quantity < discount.source_product_units) {
              warns.push(`Add ${discount.source_product_units - quantity} more units of ${product.name} to your cart for a ${discount.discount_percentage}% discount!`);
              break;
            }

            const discountPrice = price * (1 - discount.discount_percentage / 100);
            if (discountPrice > highestProductDiscountPrice) {
              highestProductDiscountPrice = discountPrice;
            }
            break;
          }
      }
    }

    totalDiscount += highestProductDiscountPrice;
  }
  return {
    totalPrice: formatCurrency(totalPrice),
    totalDiscount: formatCurrency(totalDiscount),
    finalPrice: formatCurrency(totalPrice - totalDiscount),
    warnings: warns
  };

}

