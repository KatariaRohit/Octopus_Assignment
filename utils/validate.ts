import { Response, Request, NextFunction } from "express";
import { check, validationResult } from "express-validator";

import { HttpStatusCode } from "../utils/res-codes-messages";

export const addItemValidation = [
  check("channel").not().isEmpty().withMessage("Channel is required!"),
  check("message").not().isEmpty().withMessage("Message is required!"),
];

export const CheckValidation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors: any = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(HttpStatusCode.BadRequest)
      .json({ errors: errors.errors[0].msg });
  }

  return next();
};
