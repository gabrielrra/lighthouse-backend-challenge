import express from "express";
import productRoutes from "./product.routes";
import cartRoutes from "./cart.routes";

const router = express.Router();

router.use("/product", productRoutes);
router.use("/cart", cartRoutes);

export default router;
