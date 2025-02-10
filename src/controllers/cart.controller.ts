import * as cartService from '../services/cart.service';
import { NextFunction, Request, Response } from "express";


export async function checkout(req: Request, res: Response, next: NextFunction) {
  const checkoutPrices = await cartService.calculateCartPrice(req.body).catch(next);

  res.json(checkoutPrices);
}
