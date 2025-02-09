import { checkout } from '../../controllers/cart.controller';
import validate from '../../middlewares/validate';
import { checkoutSchema } from '../../validators/cart.validator';
import { Router } from 'express';

const router = Router();

router.post('/checkout', validate(checkoutSchema), checkout);

export default router;
