import { DataSource } from "typeorm";
import { User } from "../entities/User";
import { Software } from "../entities/Software";
import { Request } from "../entities/Request";
import dotenv from "dotenv";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
  entities: [User, Software, Request],
  synchronize: true,
});
