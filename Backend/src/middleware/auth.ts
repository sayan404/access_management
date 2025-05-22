import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Define the user type we're working with
type JwtUser = {
  id: number;
  role: string;
  username: string;
};

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Authentication token required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtUser;
    // Use type assertion to tell TypeScript what we're doing
    (req as any).user = decoded;
    next();
  } catch (error: any) {
    return res.status(403).json({ message: "Invalid token" });
  }
};

export const checkRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Use type assertion here too
    const user = (req as any).user;
    if (!user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    if (!roles.includes(user.role)) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    next();
  };
};
