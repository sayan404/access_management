declare namespace NodeJS {
  interface ProcessEnv {
    PORT: string;
    JWT_SECRET: string;
    DB_HOST: string;
    DB_PORT: string;
    DB_USERNAME: string;
    DB_PASSWORD: string;
    DB_NAME: string;
    DB_SSL: string;
    DATABASE_URL: string;
    FRONTEND_URL: string;
  }
}

declare namespace Express {
  interface Request {
    user?: import('./entities/User').User;
  }
} 