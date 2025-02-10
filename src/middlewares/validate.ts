import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";
import { ValidatedBadRequestError } from "../utils/httpErrors";

const validate =
  (schema: ZodSchema) =>
    (req: Request, res: Response, next: NextFunction) => {
      try {
        schema.parse({
          body: req.body,
          query: req.query,
          params: req.params,
        });
        return next();
      } catch (err: any) {
        return next(new ValidatedBadRequestError(err.errors));
      }
    };

export default validate;
