import express from "express";
import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

const JWT_SECRET = process.env.JWT_SECRET!;

export function auth(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.token as string;

  if (!token) {
    return res.status(401).json({ message: "Authentication required. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    req.userId = decoded.userId;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
}
