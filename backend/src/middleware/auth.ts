import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  auth: {
    userId: string;
  };
}

export default function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new Error("Authorization header is missing");
    }
    const token = authHeader.split(" ")[1];
    const jwt_secret = process.env.JWT_TOKEN || '';
    const decodedToken = jwt.verify(token, jwt_secret) as {
      userId: string;
    };
    const userId = decodedToken.userId;
    const authRequest = req as AuthRequest;

    authRequest.auth = {
      userId: userId,
    };

    next();
  } catch (error) {
    res.status(401).send("Authentication failed");
  }
}
