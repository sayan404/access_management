import { DataSource } from "typeorm";
import { User } from "../entities/User";
import { Software } from "../entities/Software";
import { Request } from "../entities/Request";
import dotenv from "dotenv";

dotenv.config();
console.log("DATABASE_URL", process.env.DATABASE_URL);

export const AppDataSource = new DataSource({
  type: "postgres",
  url:
    process.env.DATABASE_URL ||
    "postgresql://user_access_management_owner:npg_KZIsTt78bylg@ep-withered-star-a53ed2ni-pooler.us-east-2.aws.neon.tech/user_access_management?sslmode=require",
  ssl: {
    rejectUnauthorized: false,
  },
  entities: [User, Software, Request],
  synchronize: true,
});
