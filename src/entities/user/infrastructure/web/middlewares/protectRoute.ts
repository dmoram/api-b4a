import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

interface CustomRequest extends Request {
  userData?: { id: string };
}

export const protectRoute = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new Error("Token no proporcionado");
    }
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT_SECRET no configurado");
    }
    const token = authHeader.split(" ")[1];
    const decodedToken = jwt.verify(token, secret) as { id: string };
    req.userData = { id: decodedToken.id };
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: "Token inválido" });
  }
};
