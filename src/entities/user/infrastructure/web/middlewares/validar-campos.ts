import { Request, Response } from "express";
import { validationResult } from "express-validator";

export const validarCampos = (
  req: Request,
  res: Response,
  next: () => void
) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      ok: false,
      errors: errors.mapped(),
      //errors: errors.array().map((error) => error.msg),
    });
  }

  next();
};
