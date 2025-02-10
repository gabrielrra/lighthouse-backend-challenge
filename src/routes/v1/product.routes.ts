import { Router } from "express";
import validate from '../../middlewares/validate';
import { getProductSchema, listProductsSchema, searchProductsSchema } from '../../validators/product.validator';
import { getProduct, listProducts, searchProducts } from '../../controllers/product.controller';

const router = Router();

router.get('/', validate(listProductsSchema), listProducts);

router.get('/:sku', validate(getProductSchema), getProduct);
router.post('/search', validate(searchProductsSchema), searchProducts);

export default router;
