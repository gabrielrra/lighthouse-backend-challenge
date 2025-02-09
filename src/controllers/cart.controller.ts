import * as cartService from '../services/cart.service';
import { Request, Response } from "express";


export async function checkout(req: Request, res: Response) {
  const checkoutPrices = await cartService.calculateCartPrice(req.body);

  res.json(checkoutPrices);
}
