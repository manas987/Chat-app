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
    return res.json({ message: "fuck u" });
  } else {
    try {
      let decoded;
      try {
        decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
        req.userId = decoded.userId;
      } catch (err) {
        res.json("fuck uuuuuuuuuu stupid ass nigga");
      }
      next();
    } catch (err) {
      return res.json("fuck u 1000");
    }
  }
}
