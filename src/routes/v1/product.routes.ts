import { Router } from "express";
import validate from '../../middlewares/validate';
import { listProductsSchema } from '../../validators/product.validator';
import { getProduct, listProducts } from '../../controllers/product.controller';

const router = Router();

router.get('/', validate(listProductsSchema), listProducts);

router.get('/:sku', getProduct);

export default router;
