declare namespace Express {
  interface Request {
    user?: {
      id: number;
      role: string;
      username: string;
    };
  }
} 