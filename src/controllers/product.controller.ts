import { Request, Response } from "express";
import { findAllAndCount, findOne } from '../services/product.service';
import { z } from 'zod';
import { listProductsQuerySchema } from '../validators/product.validator';

export async function listProducts(req: Request<{}, {}, {}, z.infer<typeof listProductsQuerySchema>>, res: Response) {
  let page = parseInt(req.query.page || '1');
  page = isNaN(page) ? 1 : page;

  let limit = parseInt(req.query.limit || '10');
  limit = isNaN(limit) ? 10 : limit;

  const products = await findAllAndCount(page, limit);

  res.json(products);
}

export async function getProduct(req: Request, res: Response) {
  const sku = req.params.sku;

  const product = await findOne(sku);

  if (!product) {
    res.status(404).json({ error: 'Product not found' });
  } else {
    res.json(product);
  }
}
