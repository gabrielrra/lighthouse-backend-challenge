import { NextFunction, Request, Response } from "express";
import { findAllAndCount, findOne } from '../services/product.service';
import { type ListProductsQuery } from '../validators/product.validator';
import { NotFoundError } from '../utils/httpErrors';

export async function listProducts(req: Request<{}, {}, {}, ListProductsQuery>, res: Response, next: NextFunction) {
  let page = parseInt(req.query.page || '1');
  page = isNaN(page) ? 1 : page;

  let limit = parseInt(req.query.limit || '10');
  limit = isNaN(limit) ? 10 : limit;

  const products = await findAllAndCount(page, limit).catch(next);

  res.json(products);
}

export async function getProduct(req: Request, res: Response, next: NextFunction) {
  const sku = req.params.sku;

  const product = await findOne(sku).catch(next);

  if (!product)
    return next(new NotFoundError("Oops! We couldn't find the product you're looking for. Please check the SKU and try again."));

  return res.json(product);
}
