import { type Request, Response, NextFunction } from "express";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id?: string;
        [key: string]: any;
      };
    }
  }
}

import jwt, { JwtPayload } from "jsonwebtoken";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(403).json({ error: "token is expired or not defined" });
    }

    const decodedInformation = jwt.verify(
      token,
      process.env.JWT_SECRET!,
    ) as JwtPayload;

    if (!decodedInformation) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    req.user = {
        id:decodedInformation.id
    };

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        error: "Token expired",
      });
    }

    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ error: "Invalid token" });
    }

    console.error("authMiddleware error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
